import { mkdir, existsSync } from 'fs';

const dirs = [
  'src/components',
  'src/hooks',
  'src/store',
  'src/utils',
  'src/server'
];

dirs.forEach(dir => {
  if (!existsSync(dir)) {
    mkdir(dir, { recursive: true }, (err) => {
      if (err) {
        console.error(`Error creating directory ${dir}:`, err);
      } else {
        console.log(`Created directory: ${dir}`);
      }
    });
  } else {
    console.log(`Directory already exists: ${dir}`);
  }
}); 