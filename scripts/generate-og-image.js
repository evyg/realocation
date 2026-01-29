const sharp = require('sharp');
const path = require('path');

const publicDir = path.join(__dirname, '..', 'public');

// Create OG image with gradient background
async function generateOGImage() {
  console.log('Generating OG image...');
  
  // Create SVG with gradient background and text
  const ogSvg = `<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="bg-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:#F0FDF9;stop-opacity:1" />
        <stop offset="50%" style="stop-color:#FAFAFA;stop-opacity:1" />
        <stop offset="100%" style="stop-color:#FEF3C7;stop-opacity:1" />
      </linearGradient>
      <linearGradient id="text-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" style="stop-color:#0F766E" />
        <stop offset="100%" style="stop-color:#6366F1" />
      </linearGradient>
      <linearGradient id="icon-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:#14B8A6" />
        <stop offset="100%" style="stop-color:#0F766E" />
      </linearGradient>
    </defs>
    
    <!-- Background -->
    <rect width="1200" height="630" fill="url(#bg-gradient)"/>
    
    <!-- Decorative circles -->
    <circle cx="1100" cy="100" r="200" fill="#14B8A6" opacity="0.1"/>
    <circle cx="100" cy="530" r="250" fill="#F59E0B" opacity="0.1"/>
    
    <!-- Logo icon -->
    <g transform="translate(100, 200)">
      <path d="M50 6C27.909 6 10 23.909 10 46C10 72 50 96 50 96C50 96 90 72 90 46C90 23.909 72.091 6 50 6Z" fill="url(#icon-gradient)"/>
      <circle cx="50" cy="42" r="16" fill="white"/>
      <path d="M44 48L50 36L56 48" stroke="#0F766E" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M50 36V52" stroke="#0F766E" stroke-width="5" stroke-linecap="round"/>
    </g>
    
    <!-- Text -->
    <text x="100" y="370" font-family="Inter, -apple-system, BlinkMacSystemFont, sans-serif" font-size="72" font-weight="700" fill="#18181B">
      Where would your money
    </text>
    <text x="100" y="450" font-family="Inter, -apple-system, BlinkMacSystemFont, sans-serif" font-size="72" font-weight="700" fill="url(#text-gradient)">
      go further?
    </text>
    
    <!-- Subtext -->
    <text x="100" y="520" font-family="Inter, -apple-system, BlinkMacSystemFont, sans-serif" font-size="28" fill="#71717A">
      Compare cost of living across cities worldwide • realocation.app
    </text>
    
    <!-- URL badge -->
    <rect x="100" y="550" width="220" height="40" rx="20" fill="#0F766E" opacity="0.1"/>
    <text x="130" y="578" font-family="Inter, -apple-system, BlinkMacSystemFont, sans-serif" font-size="20" font-weight="600" fill="#0F766E">
      realocation.app
    </text>
  </svg>`;
  
  await sharp(Buffer.from(ogSvg))
    .png()
    .toFile(path.join(publicDir, 'og-image.png'));
  
  console.log('✓ Generated og-image.png (1200x630)');
  
  // Also create a Twitter card version (slightly different ratio)
  await sharp(Buffer.from(ogSvg))
    .resize(1200, 600, { fit: 'cover', position: 'center' })
    .png()
    .toFile(path.join(publicDir, 'twitter-image.png'));
  
  console.log('✓ Generated twitter-image.png (1200x600)');
  
  console.log('\nOG images generated successfully!');
}

generateOGImage().catch(console.error);
