import fs from 'fs';
import path from 'path';

function walkDir(dir: string, callback: (filepath: string) => void) {
  fs.readdirSync(dir).forEach(f => {
    const dirPath = path.join(dir, f);
    const isDirectory = fs.statSync(dirPath).isDirectory();
    if (isDirectory) {
      if (!dirPath.includes('node_modules') && !dirPath.includes('.next')) {
        walkDir(dirPath, callback);
      }
    } else {
      callback(dirPath);
    }
  });
}

function replaceText() {
  const dirs = ['./src', './prisma'];
  
  dirs.forEach(dir => {
    walkDir(dir, (filepath) => {
      try {
        let content = fs.readFileSync(filepath, 'utf8');
        let modified = false;

        // Replace synovainfotech.com with synovainfo.com
        if (content.includes('synovainfotech.com')) {
          content = content.replace(/synovainfotech\.com/g, 'synovainfo.com');
          modified = true;
        }

        // Replace synovainfotech with synovainfo
        if (content.includes('synovainfotech')) {
          content = content.replace(/synovainfotech/g, 'synovainfo');
          modified = true;
        }

        if (modified) {
          fs.writeFileSync(filepath, content, 'utf8');
          console.log(`Updated ${filepath}`);
        }
      } catch (e) {
        // ignore binary files or read errors
      }
    });
  });
}

replaceText();
