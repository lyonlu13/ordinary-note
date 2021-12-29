const { readdirSync, writeFileSync } = require('fs');
var path = require('path');

// some helpful functions
const isSVG = file => /.svg$/.test(file);
const removeExtension = file => file.split('.')[0];
const toPascalCase = string =>
    string
        .match(/[a-z]+/gi)
        .map(word => word.charAt(0).toUpperCase() + word.substr(1).toLowerCase())
        .join('');

// getting all the icons
const icons = readdirSync(path.resolve(__dirname, "../src/assets/icons"))
    .filter(isSVG)
    .map(removeExtension);

const indexContent = [
    "import React from 'react';",
    icons
        .map(
            icon =>
                `import {ReactComponent as ${toPascalCase(
                    icon,
                )} } from 'assets/icons/${icon}.svg';`,
        )
        .join('\n'),
    '',
    "const iconList = {",
    icons.map(
        icon =>
            `${icon}:${toPascalCase(icon)} ,`,
    ).join('\n'),
    "};",
    "export default iconList;"
].join('\n');

writeFileSync(path.resolve(__dirname, `../src/components/Icon/list.js`), indexContent);
console.log('Icon component file created! ✅');