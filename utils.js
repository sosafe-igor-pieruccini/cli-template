import fs from 'fs';
import { SETUP } from './csv-setup.js';

/**
  * Get the content from file
  * @param {string} filePath - the path to the file
  * @returns {string} - the content of the
  */
export const getFileContent = (filePath) => {
  try {
    return fs.readFileSync(filePath, 'utf-8');
  } catch (error) {
    throw new Error(`could not read file content from path: ${filePath}`);
  }
}

/**
  * Get all files from a directory
  * @param {string} dirPath - the path to the directory
  * @returns {array} - an array of files in the directory
  */
export const getFilesFromDir = (dirPath) => {
  try {
    const result = fs.readdirSync(dirPath);
    return result;
  } catch (error) {
    throw new Error(`could not read files from directory: ${dirPath}`);
  }
}

/**
  * Get the package names from the setup
  * @param {array} setup - the setup array
  */
export const getPackageNames = () => {
  return SETUP.map((item) => item.name);
}


export const getPackage = (selectedPackage) => {
  return SETUP.find((item) => item.name === selectedPackage);
}
