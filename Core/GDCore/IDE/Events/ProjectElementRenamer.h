/*
 * GDevelop Core
 * Copyright 2008-2016 Florian Rival (Florian.Rival@gmail.com). All rights
 * reserved. This project is released under the MIT License.
 */
#pragma once

#include "GDCore/IDE/Events/ArbitraryEventsWorker.h"
#include "GDCore/String.h"
#include <map>
#include <memory>
#include <vector>

namespace gd {
class BaseEvent;
class Platform;
class EventsList;
} // namespace gd

namespace gd {

/**
 * \brief Replace in expressions and in parameters of actions or conditions,
 * references to the name of layout or an external layout.
 *
 * \ingroup IDE
 */
class GD_CORE_API ProjectElementRenamer
    : public ArbitraryEventsWorkerWithContext {
public:
  ProjectElementRenamer(const gd::Platform &platform_,
                        const gd::String &parameterType_,
                        const gd::String &oldName_, const gd::String &newName_)
      : platform(platform_), parameterType(parameterType_), oldName(oldName_),
        newName(newName_){};
  ProjectElementRenamer(const gd::Platform &platform_,
                        const gd::String &parameterType_,
                        const gd::String &objectName_,
                        const gd::String &oldName_, const gd::String &newName_)
      : platform(platform_), parameterType(parameterType_),
        objectName(objectName_), oldName(oldName_), newName(newName_){};
  virtual ~ProjectElementRenamer();

private:
  bool DoVisitInstruction(gd::Instruction &instruction,
                          bool isCondition) override;

  const gd::Platform &platform;
  const gd::String parameterType;
  /// If not empty, parameters will be taken into account only if related to
  /// this object.
  const gd::String objectName;
  const gd::String oldName;
  const gd::String newName;
};

} // namespace gd
