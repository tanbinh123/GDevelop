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
#include "GDCore/Extensions/Metadata/MetadataProvider.h"
#include "GDCore/Extensions/Metadata/ParameterMetadataTools.h"
#include "GDCore/Project/Layout.h"
#include "GDCore/Project/Project.h"
#include "GDCore/String.h"
#include "GDCore/Tools/Log.h"

namespace gd {

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
        if (parameterMetadata.GetType() == parameterType) {
          if (parameterValue.GetPlainString() == "\"" + oldName + "\"") {
            instruction.SetParameter(parameterIndex,
                                     gd::Expression("\"" + newName + "\""));
          }
        }
      });

  return false;
}

ProjectElementRenamer::~ProjectElementRenamer() {}

} // namespace gd
