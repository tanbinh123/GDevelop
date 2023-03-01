/*
 * GDevelop Core
 * Copyright 2008-2016 Florian Rival (Florian.Rival@gmail.com). All rights
 * reserved. This project is released under the MIT License.
 */
#include "ProjectElementRenamer.h"

#include <map>
#include <memory>
#include <vector>

#include "GDCore/Events/Event.h"
#include "GDCore/Events/EventsList.h"
#include "GDCore/Events/Parsers/ExpressionParser2NodePrinter.h"
#include "GDCore/Events/Parsers/ExpressionParser2NodeWorker.h"
#include "GDCore/Extensions/Metadata/MetadataProvider.h"
#include "GDCore/Extensions/Metadata/ParameterMetadataTools.h"
#include "GDCore/IDE/Events/ExpressionValidator.h"
#include "GDCore/Project/Layout.h"
#include "GDCore/Project/Project.h"
#include "GDCore/String.h"
#include "GDCore/Tools/Log.h"

namespace gd {

/**
 * \brief Go through the nodes and change the given object name to a new one.
 *
 * \see gd::ExpressionParser2
 */
class GD_CORE_API ExpressionIdentifierStringFinder
    : public ExpressionParser2NodeWorker {
public:
  ExpressionIdentifierStringFinder(
      const gd::Platform &platform_,
      const gd::ObjectsContainer &globalObjectsContainer_,
      const gd::ObjectsContainer &objectsContainer_,
      const gd::String &expressionPlainString_,
      const gd::String &parameterType_, const gd::String &objectName_,
      const gd::String &oldName_)
      : platform(platform_), globalObjectsContainer(globalObjectsContainer_),
        objectsContainer(objectsContainer_),
        expressionPlainString(expressionPlainString_),
        parameterType(parameterType_), objectName(objectName_),
        oldName(oldName_){};
  virtual ~ExpressionIdentifierStringFinder(){};

  const std::vector<gd::ExpressionParserLocation> GetOccurrences() const {
    return occurrences;
  }

protected:
  void OnVisitSubExpressionNode(SubExpressionNode &node) override {
    node.expression->Visit(*this);
  }
  void OnVisitOperatorNode(OperatorNode &node) override {
    node.leftHandSide->Visit(*this);
    node.rightHandSide->Visit(*this);
  }
  void OnVisitUnaryOperatorNode(UnaryOperatorNode &node) override {
    node.factor->Visit(*this);
  }
  void OnVisitNumberNode(NumberNode &node) override {}
  void OnVisitTextNode(TextNode &node) override {}
  void OnVisitVariableNode(VariableNode &node) override {
    if (node.child)
      node.child->Visit(*this);
  }
  void OnVisitVariableAccessorNode(VariableAccessorNode &node) override {
    if (node.child)
      node.child->Visit(*this);
  }
  void OnVisitVariableBracketAccessorNode(
      VariableBracketAccessorNode &node) override {
    node.expression->Visit(*this);
    if (node.child)
      node.child->Visit(*this);
  }
  void OnVisitIdentifierNode(IdentifierNode &node) override {}
  void OnVisitObjectFunctionNameNode(ObjectFunctionNameNode &node) override {}
  void OnVisitFunctionCallNode(FunctionCallNode &node) override {
    bool considerFunction = objectName.empty() || node.objectName == objectName;

    const bool isObjectFunction = !node.objectName.empty();
    const gd::ExpressionMetadata &metadata =
        isObjectFunction
            ? MetadataProvider::GetObjectAnyExpressionMetadata(
                  platform,
                  GetTypeOfObject(globalObjectsContainer, objectsContainer,
                                  node.objectName),
                  node.functionName)
            : MetadataProvider::GetAnyExpressionMetadata(platform,
                                                         node.functionName);

    if (gd::MetadataProvider::IsBadExpressionMetadata(metadata)) {
      return;
    }

    size_t parameterIndex = 0;
    for (size_t metadataIndex = (isObjectFunction ? 1 : 0);
         metadataIndex < metadata.parameters.size() &&
         parameterIndex < node.parameters.size();
         ++metadataIndex) {
      auto &parameterMetadata = metadata.parameters[metadataIndex];
      if (parameterMetadata.IsCodeOnly()) {
        continue;
      }
      auto &parameterNode = node.parameters[parameterIndex];
      ++parameterIndex;

      if (parameterMetadata.GetType() == parameterType) {
        auto parameterExpressionPlainSting = expressionPlainString.substr(
            parameterNode->location.GetStartPosition(),
            parameterNode->location.GetEndPosition() -
                parameterNode->location.GetStartPosition());
        if (considerFunction &&
            parameterExpressionPlainSting == "\"" + oldName + "\"") {
          occurrences.push_back(parameterNode->location);
        } else {
          parameterNode->Visit(*this);
        }
      }
    }
  }
  void OnVisitEmptyNode(EmptyNode &node) override {}

private:
  const gd::Platform &platform;
  const gd::ObjectsContainer &globalObjectsContainer;
  const gd::ObjectsContainer &objectsContainer;
  const gd::String &expressionPlainString;
  const gd::String &oldName;
  const gd::String parameterType;
  /// If not empty, parameters will be taken into account only if related to
  /// this object.
  const gd::String objectName;
  std::vector<gd::ExpressionParserLocation> occurrences;
};

bool ProjectElementRenamer::DoVisitInstruction(gd::Instruction &instruction,
                                               bool isCondition) {
  const auto &metadata = isCondition
                             ? gd::MetadataProvider::GetConditionMetadata(
                                   platform, instruction.GetType())
                             : gd::MetadataProvider::GetActionMetadata(
                                   platform, instruction.GetType());

  gd::ParameterMetadataTools::IterateOverParametersWithIndex(
      instruction.GetParameters(), metadata.GetParameters(),
      [&](const gd::ParameterMetadata &parameterMetadata,
          const gd::Expression &parameterValue, size_t parameterIndex,
          const gd::String &lastObjectName) {

        if (parameterMetadata.GetType() == parameterType &&
            (objectName.empty() || lastObjectName == objectName)) {
          if (parameterValue.GetPlainString() == "\"" + oldName + "\"") {
            instruction.SetParameter(parameterIndex,
                                     gd::Expression("\"" + newName + "\""));
          }
        }
        auto node = parameterValue.GetRootNode();
        if (node) {
          ExpressionIdentifierStringFinder finder(
              platform, GetGlobalObjectsContainer(), GetObjectsContainer(),
              parameterValue.GetPlainString(), parameterType, objectName,
              oldName);
          node->Visit(finder);

          if (finder.GetOccurrences().size() > 0) {

            gd::String newNameWithQuotes = "\"" + newName + "\"";
            gd::String oldParameterValue = parameterValue.GetPlainString();
            gd::String newParameterValue;
            auto previousEndPosition = 0;
            for (auto &&occurrenceLocation : finder.GetOccurrences()) {
              newParameterValue += oldParameterValue.substr(
                  previousEndPosition,
                  occurrenceLocation.GetStartPosition() - previousEndPosition);
              newParameterValue += newNameWithQuotes;

              previousEndPosition = occurrenceLocation.GetEndPosition();
            }
            if (previousEndPosition < oldParameterValue.size()) {
              newParameterValue += oldParameterValue.substr(
                  previousEndPosition,
                  oldParameterValue.size() - previousEndPosition);
            }

            instruction.SetParameter(parameterIndex,
                                     gd::Expression(newParameterValue));
          }
        }
      });

  return false;
}

ProjectElementRenamer::~ProjectElementRenamer() {}

} // namespace gd
