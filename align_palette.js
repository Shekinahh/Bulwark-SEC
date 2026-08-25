const fs = require('fs');
const path = require('path');

const portalPath = path.join(__dirname, 'portal.html');
let content = fs.readFileSync(portalPath, 'utf8');

// Replace all non-brand colors in portal.html with the strict 5-color palette:
// #0B171E, #072832, #486A6E, #7CB0AB, #CAD4D4

// 1. Eradicate purple, amber, bright blues from KPI cards and sub-tabs
content = content.replace(/text-blue-600/g, 'text-[#072832] dark:text-[#7CB0AB]');
content = content.replace(/text-blue-400/g, 'text-[#7CB0AB]');
content = content.replace(/bg-blue-100/g, 'bg-[#CAD4D4]/30');
content = content.replace(/text-blue-800/g, 'text-[#072832]');

content = content.replace(/text-purple-600/g, 'text-[#486A6E] dark:text-[#7CB0AB]');
content = content.replace(/text-purple-400/g, 'text-[#7CB0AB]');
content = content.replace(/bg-purple-100/g, 'bg-[#CAD4D4]/30');
content = content.replace(/text-purple-800/g, 'text-[#072832]');

content = content.replace(/text-amber-600/g, 'text-[#072832] dark:text-[#7CB0AB]');
content = content.replace(/text-amber-400/g, 'text-[#7CB0AB]');
content = content.replace(/bg-amber-100/g, 'bg-[#CAD4D4]/30');
content = content.replace(/text-amber-800/g, 'text-[#072832]');

content = content.replace(/text-emerald-600/g, 'text-[#072832] dark:text-[#7CB0AB]');
content = content.replace(/text-emerald-400/g, 'text-[#7CB0AB]');
content = content.replace(/bg-emerald-100/g, 'bg-[#CAD4D4]/30');
content = content.replace(/bg-emerald-50\b/g, 'bg-[#CAD4D4]/20');
content = content.replace(/text-emerald-800/g, 'text-[#072832]');
content = content.replace(/text-emerald-700/g, 'text-[#072832]');

// 2. Buttons: Use #072832 with #7CB0AB text/borders
content = content.replace(/bg-emerald-600 hover:bg-emerald-700/g, 'bg-[#072832] hover:bg-[#0B171E] text-white border border-[#486A6E]');
content = content.replace(/bg-emerald-600/g, 'bg-[#072832] hover:bg-[#0B171E] text-white border border-[#486A6E]');

// 3. Status badges: Use #072832 and #CAD4D4 / #7CB0AB
content = content.replace(/border-emerald-300/g, 'border-[#486A6E]/50');
content = content.replace(/border-emerald-500\/40/g, 'border-[#7CB0AB]/50');
content = content.replace(/bg-emerald-500\/20/g, 'bg-[#072832]/60');

// 4. Incident badges: Muted tactical dark slate/crimson instead of neon
content = content.replace(/bg-red-100 text-red-800/g, 'bg-[#CAD4D4]/30 text-[#072832]');
content = content.replace(/bg-red-600 hover:bg-red-700/g, 'bg-[#072832] hover:bg-[#0B171E] text-[#CAD4D4] border border-[#486A6E]');

// 5. Active tab borders
content = content.replace(/border-b-2 border-\[#072832\] dark:border-\[#7CB0AB\]/g, 'border-b-2 border-[#072832] dark:border-[#7CB0AB]');

fs.writeFileSync(portalPath, content, 'utf8');
console.log('Successfully aligned portal.html with the exact 5-color palette!');
