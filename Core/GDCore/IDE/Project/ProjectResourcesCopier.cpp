/*
 * GDevelop Core
 * Copyright 2008-present Florian Rival (Florian.Rival@gmail.com). All rights
 * reserved. This project is released under the MIT License.
 */
#include "ProjectResourcesCopier.h"
#include <map>
#include "GDCore/CommonTools.h"
#include "GDCore/IDE/AbstractFileSystem.h"
#include "GDCore/IDE/Project/ResourcesAbsolutePathChecker.h"
#include "GDCore/IDE/Project/ResourcesMergingHelper.h"
#include "GDCore/Project/Project.h"
#include "GDCore/Project/Object.h"
#include "GDCore/Tools/Localization.h"
#include "GDCore/Tools/Log.h"

using namespace std;

namespace gd {

bool ProjectResourcesCopier::CopyAllResourcesTo(
    gd::Project& originalProject,
    AbstractFileSystem& fs,
    gd::String destinationDirectory,
    bool updateOriginalProject,
    bool preserveAbsoluteFilenames,
    bool preserveDirectoryStructure) {
  auto projectDirectory = fs.DirNameFrom(originalProject.GetProjectFile());
  std::cout << "Copying all resources from " << projectDirectory << " to "
            << destinationDirectory << "..." << std::endl;

  // Get the resources to be copied
  gd::ResourcesMergingHelper resourcesMergingHelper(fs);
  resourcesMergingHelper.SetBaseDirectory(projectDirectory);
  resourcesMergingHelper.PreserveDirectoriesStructure(
      preserveDirectoryStructure);
  resourcesMergingHelper.PreserveAbsoluteFilenames(
      preserveAbsoluteFilenames);

  if (updateOriginalProject) {
    originalProject.ExposeResources(resourcesMergingHelper);
  } else {
    std::shared_ptr<gd::Project> project(new gd::Project(originalProject));
    project->ExposeResources(resourcesMergingHelper);
  }

  // Copy resources
  CopyResourcesTo(resourcesMergingHelper.GetAllResourcesOldAndNewFilename(), fs, destinationDirectory);

  return true;
}

bool ProjectResourcesCopier::CopyObjectResourcesTo(
    gd::Project& project,
    gd::Object& originalObject,
    AbstractFileSystem& fs,
    gd::String destinationDirectory,
    bool updateOriginalObject,
    bool preserveDirectoryStructure) {
  auto projectDirectory = fs.DirNameFrom(project.GetProjectFile());
  std::cout << "Copying some resources from " << projectDirectory << " to "
            << destinationDirectory << "..." << std::endl;

  // Get the resources to be copied
  gd::ResourcesMergingHelper resourcesMergingHelper(fs);
  resourcesMergingHelper.SetBaseDirectory(projectDirectory);
  resourcesMergingHelper.PreserveDirectoriesStructure(
      preserveDirectoryStructure);
  resourcesMergingHelper.PreserveAbsoluteFilenames(false);

  if (updateOriginalObject) {
    originalObject.GetConfiguration().ExposeResources(resourcesMergingHelper);
  } else {
    std::shared_ptr<gd::Object> object = originalObject.Clone();
    object->GetConfiguration().ExposeResources(resourcesMergingHelper);
  }

  // Copy resources
  CopyResourcesTo(resourcesMergingHelper.GetAllResourcesOldAndNewFilename(), fs, destinationDirectory);

  return true;
}

void ProjectResourcesCopier::CopyResourcesTo(
    map<gd::String, gd::String>& resourcesNewFileNames,
    AbstractFileSystem& fs,
    gd::String destinationDirectory) {
  unsigned int i = 0;
  for (map<gd::String, gd::String>::const_iterator it =
           resourcesNewFileNames.begin();
       it != resourcesNewFileNames.end();
       ++it) {
    if (!it->first.empty()) {
      // Create the destination filename
      gd::String destinationFile = it->second;
      fs.MakeAbsolute(destinationFile, destinationDirectory);

      // Be sure the directory exists
      gd::String dir = fs.DirNameFrom(destinationFile);
      if (!fs.DirExists(dir)) fs.MkDir(dir);

      // We can now copy the file
      if (!fs.CopyFile(it->first, destinationFile)) {
        gd::LogWarning(_("Unable to copy \"") + it->first + _("\" to \"") +
                       destinationFile + _("\"."));
      }
    }

    ++i;
  }
}

}  // namespace gd
