const fs = require('fs');
const path = require('path');

const mappings = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'phase3_phase4_mapping_table.json'), 'utf8'));

const redirectEntries = [];

mappings.forEach(m => {
  if (m.oldSlug !== m.newSlug) {
    const encodedOld = encodeURI(m.oldSlug);
    const encodedNew = encodeURI(m.newSlug);
    
    // Redirect with locale prefix
    redirectEntries.push(
      `      { source: '/:locale(ar|en)/${m.section}/${m.oldSlug}', destination: '/:locale/${m.section}/${m.newSlug}', permanent: true },`
    );
  }
});

console.log(redirectEntries.join('\n'));
