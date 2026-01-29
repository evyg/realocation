const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const publicDir = path.join(__dirname, '..', 'public');

// SVG content for the favicon
const svgContent = `<svg width="512" height="512" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M16 2C9.925 2 5 6.925 5 13C5 21.5 16 30 16 30C16 30 27 21.5 27 13C27 6.925 22.075 2 16 2Z" fill="url(#favicon-gradient)"/>
  <circle cx="16" cy="13" r="5" fill="white"/>
  <path d="M14 15L16 11L18 15" stroke="#0F766E" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M16 11V16" stroke="#0F766E" stroke-width="2" stroke-linecap="round"/>
  <defs>
    <linearGradient id="favicon-gradient" x1="5" y1="2" x2="27" y2="30" gradientUnits="userSpaceOnUse">
      <stop stop-color="#14B8A6"/>
      <stop offset="1" stop-color="#0F766E"/>
    </linearGradient>
  </defs>
</svg>`;

const sizes = [
  { name: 'favicon-16x16.png', size: 16 },
  { name: 'favicon-32x32.png', size: 32 },
  { name: 'apple-touch-icon.png', size: 180 },
  { name: 'icon-192.png', size: 192 },
  { name: 'icon-512.png', size: 512 },
];

async function generateFavicons() {
  console.log('Generating favicons...');
  
  const svgBuffer = Buffer.from(svgContent);
  
  for (const { name, size } of sizes) {
    const outputPath = path.join(publicDir, name);
    
    await sharp(svgBuffer)
      .resize(size, size)
      .png()
      .toFile(outputPath);
    
    console.log(`✓ Generated ${name} (${size}x${size})`);
  }
  
  // Generate favicon.ico (multi-size ICO)
  // For simplicity, we'll just use the 32x32 as favicon.ico
  const ico32 = await sharp(svgBuffer)
    .resize(32, 32)
    .png()
    .toBuffer();
  
  fs.writeFileSync(path.join(publicDir, 'favicon.ico'), ico32);
  console.log('✓ Generated favicon.ico');
  
  console.log('\nAll favicons generated successfully!');
}

generateFavicons().catch(console.error);
