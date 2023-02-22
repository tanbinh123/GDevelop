/*
 * GDevelop Core
 * Copyright 2008-present Florian Rival (Florian.Rival@gmail.com). All rights
 * reserved. This project is released under the MIT License.
 */
#ifndef PROJECTRESOURCESCOPIER_H
#define PROJECTRESOURCESCOPIER_H

#include "GDCore/String.h"
#include <map>

namespace gd {
class Project;
class Object;
class AbstractFileSystem;
}  // namespace gd

namespace gd {

/**
 * \brief Copy all resources files of a project to a directory.
 *
 * \ingroup IDE
 */
class GD_CORE_API ProjectResourcesCopier {
 public:
  /**
   * \brief Copy all resources files of a project to the specified
   * `destinationDirectory`.
   *
   * \param project The project to be used
   * \param fs The abstract file system to be used
   * \param destinationDirectory The directory where resources must be copied to
   * \param updateOriginalProject If set to true, the project will be updated
   * with the new resources filenames.
   *
   * \param preserveAbsoluteFilenames If set to true (default), resources with
   * absolute filenames won't be changed. Otherwise, resources with absolute
   * filenames will be copied into the destination directory and their filenames
   * updated.
   *
   * \param preserveDirectoryStructure If set to true (default), the directories
   * of the resources will be preserved when copying. Otherwise, everything will
   * be send in the destinationDirectory.
   *
   * \return true if no error happened
   */
  static bool CopyAllResourcesTo(gd::Project& project,
                                 gd::AbstractFileSystem& fs,
                                 gd::String destinationDirectory,
                                 bool updateOriginalProject,
                                 bool preserveAbsoluteFilenames = true,
                                 bool preserveDirectoryStructure = true);

  /**
   * \brief Copy all resources files of an object to the specified
   * `destinationDirectory`.
   *
   * \param project The object project
   * \param project The object to be used
   * \param fs The abstract file system to be used
   * \param destinationDirectory The directory where resources must be copied to
   * \param updateOriginalObject If set to true, the object will be updated
   * with the new resources filenames.
   *
   * \param preserveAbsoluteFilenames If set to true (default), resources with
   * absolute filenames won't be changed. Otherwise, resources with absolute
   * filenames will be copied into the destination directory and their filenames
   * updated.
   *
   * \param preserveDirectoryStructure If set to true (default), the directories
   * of the resources will be preserved when copying. Otherwise, everything will
   * be send in the destinationDirectory.
   *
   * \return true if no error happened
   */
  static bool CopyObjectResourcesTo(gd::Project& project,
                                       gd::Object& object,
                                       gd::AbstractFileSystem& fs,
                                       gd::String destinationDirectory,
                                       bool updateOriginalObject,
                                       bool preserveDirectoryStructure = true);

private:
  static void CopyResourcesTo(
    std::map<gd::String, gd::String>& resourcesNewFileNames,
    AbstractFileSystem& fs,
    gd::String destinationDirectory);

  static void NormalizeResourceNames(
      gd::Object &object,
      std::map<gd::String, gd::String> &resourcesNewFileNames);
};

}  // namespace gd

#endif  // PROJECTRESOURCESCOPIER_H
