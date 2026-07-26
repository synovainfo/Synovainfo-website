const fs = require('fs');
const path = require('path');

const brainDir = 'C:\\Users\\Dinesh Nikam\\.gemini\\antigravity-ide\\brain\\4c2d9798-58bb-498c-bbd3-53268621b2a4';

const copies = [
  {
    src: path.join(brainDir, 'about_preview_1785072348854.png'),
    dest: path.join(__dirname, '..', 'public', 'images', 'home', 'about-preview.webp')
  },
  {
    src: path.join(brainDir, 'team_photo_1785072365918.png'),
    dest: path.join(__dirname, '..', 'public', 'images', 'about', 'team-photo.webp')
  },
  {
    src: path.join(brainDir, 'case_study_dashboard_1785072383149.png'),
    dest: path.join(__dirname, '..', 'public', 'images', 'case-studies', 'case-study-dashboard.webp')
  }
];

copies.forEach(({ src, dest }) => {
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, dest);
    console.log(`Successfully placed AI image: ${dest}`);
  }
});
