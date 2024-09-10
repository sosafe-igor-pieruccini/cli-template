import terminalKit from 'terminal-kit';
import { getFilesFromDir, getPackageNames, getFileContent, getPackage } from './utils.js';
import { GROUP_INDEX } from './csv-setup.js';

const terminal = terminalKit.terminal;

const selectFilesInDirectory = () => {
  return new Promise((resolve, reject) => {
    const filesInDirectory = getFilesFromDir('./');
    terminal.magenta("Select a file from the list: ");
    terminal.singleColumnMenu(filesInDirectory, function(error, response) {
      if (error) {
        terminal.red("\nAn error occurred: %s\n", error);
        reject();
        process.exit();
      }
      terminal.green("You selected: %s\n", response.selectedText);
      resolve(response.selectedText);
    });
  });
}

const selectPackage = () => {
  return new Promise((resolve, reject) => {
    const packages = getPackageNames();
    terminal.magenta("Select a package from the list: ");
    terminal.singleColumnMenu(packages, function(error, response) {
      if (error) {
        terminal.red("\nAn error occurred: %s\n", error);
        reject();
        process.exit();
      }
      terminal.green("You selected: %s\n", response.selectedText);
      resolve(response.selectedText);
    });
  });
}

const showContent = (selectedFile, selectedPackage) => {
  return new Promise(async (resolve, reject) => {
    const content = getFileContent(selectedFile);

    //get every row of the file as an element in an array
    const rows = content.split('\n');

    const result = rows.reduce((acc, row) => {
      const columns = row.split(';');

      const packageColumn = getPackage(selectedPackage);
      if (!packageColumn) {
        reject(`Package not found on csv: looking for ${selectedPackage}`);
        process.exit();
      }


      const enabled = columns[packageColumn.enabled];

      if (enabled === '0') {
        return acc
      }

      const group = columns[GROUP_INDEX];
      if (!group || group === 'group') {
        return acc;
      }


      const mandatoryValue = columns[packageColumn.mandatory];
      const mandatory = parseInt(mandatoryValue) === 1 ? true : false;

      return [...acc, { group, mandatory }];
    }, []);

    terminal('export default [ \n')
    result.forEach(element => {
      terminal(`  {group: ${element.group}, mandatory: ${element.mandatory}},\n`);
    });
    terminal('];\n');
    resolve(result);
  });
}



const init = async () => {
  const selectedFile = await selectFilesInDirectory();
  terminal.clear();
  const selectedPackage = await selectPackage();
  terminal.clear();
  const content = await showContent(selectedFile, selectedPackage);

  process.exit();
}

init();
