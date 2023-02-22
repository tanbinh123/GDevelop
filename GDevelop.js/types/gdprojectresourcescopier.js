// Automatically generated by GDevelop.js/scripts/generate-types.js
declare class gdProjectResourcesCopier {
  static copyAllResourcesTo(project: gdProject, fs: gdAbstractFileSystem, destinationDirectory: string, updateOriginalProject: boolean, preserveAbsoluteFilenames: boolean, preserveDirectoryStructure: boolean): boolean;
  static copyObjectResourcesTo(project: gdProject, originalObject: gdObject, fs: gdAbstractFileSystem, destinationDirectory: string, objectFullName: string): boolean;
  delete(): void;
  ptr: number;
};