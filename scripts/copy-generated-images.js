const fs = require('fs');
const path = require('path');

const brainDir = 'C:\\Users\\Dinesh Nikam\\.gemini\\antigravity-ide\\brain\\4c2d9798-58bb-498c-bbd3-53268621b2a4';

const copies = [
  {
    src: path.join(brainDir, 'og_default_1785071703856.png'),
    dest: path.join(__dirname, '..', 'public', 'images', 'global', 'og-default.webp')
  },
  {
    src: path.join(brainDir, 'hero_datacenter_1785071729944.png'),
    dest: path.join(__dirname, '..', 'public', 'images', 'home', 'hero-global-datacenter.webp')
  },
  {
    src: path.join(brainDir, 'about_headquarters_1785071750682.png'),
    dest: path.join(__dirname, '..', 'public', 'images', 'about', 'about-headquarters.webp')
  }
];

copies.forEach(({ src, dest }) => {
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, dest);
    console.log(`Copied ${src} -> ${dest}`);
  }
});
