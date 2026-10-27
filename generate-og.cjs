const sharp = require('sharp');
const fs = require('fs');

async function createOgImage() {
  // Load hero couple image and resize/crop to fit the right frame
  const coupleImage = await sharp('public/assets/hero-couple.jpg')
    .resize(510, 566, { fit: 'cover', position: 'top' })
    .toBuffer();

  const coupleImageBase64 = coupleImage.toString('base64');

  const svgOverlay = Buffer.from(`
    <svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bgGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#fffdf8"/>
          <stop offset="45%" stop-color="#fdf4e4"/>
          <stop offset="100%" stop-color="#f5e1c2"/>
        </linearGradient>

        <linearGradient id="goldGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stop-color="#8b5516"/>
          <stop offset="50%" stop-color="#d89e44"/>
          <stop offset="100%" stop-color="#8b5516"/>
        </linearGradient>

        <filter id="shadow" x="-10%" y="-10%" width="130%" height="130%">
          <feDropShadow dx="0" dy="14" stdDeviation="16" flood-color="#42210a" flood-opacity="0.18"/>
        </filter>

        <clipPath id="archClip">
          <rect x="640" y="32" width="510" height="566" rx="24" ry="24" />
        </clipPath>
      </defs>

      <!-- Background -->
      <rect width="1200" height="630" fill="url(#bgGrad)"/>

      <!-- Outer Gold Border -->
      <rect x="18" y="18" width="1164" height="594" rx="16" fill="none" stroke="url(#goldGrad)" stroke-width="2.5" opacity="0.6"/>
      <rect x="26" y="26" width="1148" height="578" rx="12" fill="none" stroke="#b87b22" stroke-width="1" stroke-dasharray="6,4" opacity="0.4"/>

      <!-- Corner Ornaments -->
      <g fill="#b87b22" opacity="0.75">
        <circle cx="36" cy="36" r="4"/>
        <circle cx="1164" cy="36" r="4"/>
        <circle cx="36" cy="594" r="4"/>
        <circle cx="1164" cy="594" r="4"/>
      </g>

      <!-- Right Side: Framed Couple Image with drop shadow -->
      <rect x="638" y="30" width="514" height="570" rx="26" fill="none" stroke="url(#goldGrad)" stroke-width="4" filter="url(#shadow)"/>

      <image href="data:image/jpeg;base64,${coupleImageBase64}" x="640" y="32" width="510" height="566" preserveAspectRatio="xMidYMid slice" clip-path="url(#archClip)"/>

      <!-- Gold Inner Border on image -->
      <rect x="640" y="32" width="510" height="566" rx="24" fill="none" stroke="url(#goldGrad)" stroke-width="2.5" opacity="0.7"/>

      <!-- Left Side Card Content -->
      <g transform="translate(70, 75)">
        <!-- Lotus Icon -->
        <text x="245" y="36" font-size="36" text-anchor="middle">🪷</text>

        <!-- Families Blessing -->
        <text x="245" y="78" font-family="Georgia, serif" font-size="14" letter-spacing="5" fill="#6d421e" font-weight="bold" text-anchor="middle">TOGETHER WITH OUR FAMILIES</text>

        <!-- Decorative Divider -->
        <line x1="145" y1="100" x2="345" y2="100" stroke="url(#goldGrad)" stroke-width="1.5"/>
        <text x="245" y="104" font-family="serif" font-size="14" fill="#b87b22" text-anchor="middle">✦ ✦ ✦</text>

        <!-- Couple Names -->
        <text x="245" y="182" font-family="Georgia, serif" font-size="58" fill="#331706" font-weight="bold" text-anchor="middle" letter-spacing="1">Tanya &amp; Abhishek</text>

        <!-- Invitation Script -->
        <text x="245" y="226" font-family="'Brush Script MT', cursive, Georgia, serif" font-size="26" font-style="italic" fill="#854d1f" text-anchor="middle">invite you to celebrate their wedding</text>

        <!-- Date Pill Badge -->
        <rect x="55" y="260" width="380" height="50" rx="25" fill="#ffffff" stroke="#b87b22" stroke-width="1.5" filter="url(#shadow)"/>
        <text x="245" y="292" font-family="Georgia, serif" font-size="16" font-weight="bold" letter-spacing="3" fill="#3a1d0a" text-anchor="middle">19 – 20 NOVEMBER 2026</text>

        <!-- Venue & Destination -->
        <text x="245" y="350" font-family="Georgia, serif" font-size="18" font-weight="bold" fill="#4a2911" text-anchor="middle">Pebbles Resort · Rishikesh</text>
        <text x="245" y="376" font-family="Georgia, serif" font-size="13" letter-spacing="2" fill="#794c25" text-anchor="middle">UTTARAKHAND, INDIA</text>

        <!-- Open Invitation CTA Tag -->
        <rect x="120" y=\"412\" width="250" height="36" rx="18" fill="#4f5722"/>
        <text x="245" y="435" font-family="Georgia, serif" font-size="12" font-weight="bold" letter-spacing="2" fill="#ffffff" text-anchor="middle">VIEW INVITATION →</text>
      </g>
    </svg>
  `);

  // Generate lossless PNG with max compression
  await sharp(svgOverlay)
    .png({
      compressionLevel: 9, // maximum lossless compression
      adaptiveFiltering: true
    })
    .toFile('public/assets/og-tanya-abhishek.png');

  const info = await sharp('public/assets/og-tanya-abhishek.png').metadata();
  console.log('OG image created successfully:', info.width, 'x', info.height, info.format, info.size, 'bytes');
}

createOgImage().catch(console.error);
