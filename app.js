const fs = require('fs');
const path = require('path');
const argFolderName = process.argv[2];
const defaultPath = '/Users/jinbaek/Desktop/ellie-node/';
const targetPath = defaultPath + argFolderName;
const folderTpyes = {
  '.mp4': 'video',
  '.mov': 'video',
  '.png': 'captured',
  '.aae': 'captured',
  '.jpg': 'duplicated',
};
const seperatefiles = async function () {
  const fileNames = await fs.promises.readdir(targetPath);
  for (let fileName of fileNames) {
    if (fileName === '.DS_Store') {
      continue;
    }

    const ext = path.extname(fileName);
    const folderTpye = folderTpyes[ext];
    const folderPath = path.join(targetPath, folderTpye);
    let currentPath = path.join(targetPath, fileName);
    let newPath = path.join(folderPath, fileName);

    if (folderTpye === 'duplicated') {
      if (!fileName.startsWith('IMG_E')) {
        continue;
      }

      const originFileName = 'IMG_' + fileName.slice(5);
      currentPath = path.join(targetPath, originFileName);
      newPath = path.join(folderPath, originFileName);
    }

    try {
      if (!fs.existsSync(folderPath)) {
        await fs.promises
          .mkdir(folderPath)
          .then(() => fs.promises.rename(currentPath, newPath))
          .catch(console.error);

        continue;
      }

      fs.promises.rename(currentPath, newPath);
    } catch (err) {
      console.error(err);
    }
  }
};

seperatefiles();
