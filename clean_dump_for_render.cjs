const fs = require('fs');

const sql = fs.readFileSync('full_backup_may07_utf8.sql', 'utf8');
const lines = sql.split('\n');

let out = '';

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];

  // Remove lines that cause permission errors on Render
  if (line.includes('OWNER TO postgres')) continue;
  if (line.includes('\\restrict')) continue;
  if (line.includes('\\unrestrict')) continue;

  out += line + '\n';
}

fs.writeFileSync('render_clean_dump.sql', out);
console.log('Successfully created render_clean_dump.sql');
