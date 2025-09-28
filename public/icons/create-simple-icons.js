// Simple script to create base64 encoded icons
// Run this in Node.js to generate the icons

const fs = require('fs');
const path = require('path');

// Simple SVG icon as base64
const svgIcon = `
<svg width="192" height="192" viewBox="0 0 192 192" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#2563eb;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#1d4ed8;stop-opacity:1" />
    </linearGradient>
  </defs>
  
  <!-- Background with rounded corners -->
  <rect width="192" height="192" rx="19" ry="19" fill="url(#bg)"/>
  
  <!-- Truck icon -->
  <g transform="translate(48, 48)">
    <!-- Truck body -->
    <rect x="0" y="30" width="75" height="30" rx="3" fill="white"/>
    
    <!-- Truck cab -->
    <rect x="75" y="37" width="30" height="23" rx="3" fill="white"/>
    
    <!-- Wheels -->
    <circle cx="19" cy="75" r="9" fill="#374151"/>
    <circle cx="75" cy="75" r="9" fill="#374151"/>
    
    <!-- Wheel centers -->
    <circle cx="19" cy="75" r="6" fill="#6b7280"/>
    <circle cx="75" cy="75" r="6" fill="#6b7280"/>
    
    <!-- DSG text -->
    <text x="48" y="19" font-family="Arial, sans-serif" font-size="12" font-weight="bold" text-anchor="middle" fill="white">DSG</text>
    
    <!-- Routing text -->
    <text x="48" y="105" font-family="Arial, sans-serif" font-size="6" text-anchor="middle" fill="white">ROUTING</text>
  </g>
</svg>
`;

// Create the icon file
fs.writeFileSync(path.join(__dirname, 'icon-192x192.svg'), svgIcon);

console.log('Created icon-192x192.svg');
console.log('You can convert this to PNG using online tools or ImageMagick:');
console.log('convert icon-192x192.svg -resize 192x192 icon-192x192.png');
console.log('convert icon-192x192.svg -resize 512x512 icon-512x512.png');
console.log('convert icon-192x192.svg -resize 72x72 icon-72x72.png');
console.log('convert icon-192x192.svg -resize 96x96 icon-96x96.png');
console.log('convert icon-192x192.svg -resize 128x128 icon-128x128.png');
console.log('convert icon-192x192.svg -resize 144x144 icon-144x144.png');
console.log('convert icon-192x192.svg -resize 152x152 icon-152x152.png');
console.log('convert icon-192x192.svg -resize 384x384 icon-384x384.png');
