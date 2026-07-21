const fs = require('fs');

const sql = fs.readFileSync('full_backup_may07_utf8.sql', 'utf8');
const lines = sql.split('\n');

let out = '';
let currentTable = null;
let columns = [];

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];

  if (line.startsWith('\\restrict') || line.startsWith('\\unrestrict')) {
    continue;
  }

  if (line.startsWith('COPY ')) {
    // e.g. COPY public.profiles (id, employee_id, ...) FROM stdin;
    const match = line.match(/COPY\s+(public\.[a-zA-Z_]+)\s+\((.+?)\)\s+FROM\s+stdin;/);
    if (match) {
      currentTable = match[1];
      // Split and remove existing quotes if any, then wrap in quotes
      columns = match[2].split(',').map(c => {
        let col = c.trim();
        if (col.startsWith('"') && col.endsWith('"')) {
          col = col.substring(1, col.length - 1);
        }
        return `"${col}"`;
      });
      continue;
    }
  }

  if (currentTable) {
    if (line.trim() === '\\.') {
      currentTable = null;
      continue;
    }
    // Parse tab-separated values
    const values = line.split('\t').map(val => {
      if (val === '\\N') return 'NULL';
      return "'" + val.replace(/'/g, "''") + "'";
    });
    
    // Create INSERT statement
    out += `INSERT INTO ${currentTable} (${columns.join(', ')}) VALUES (${values.join(', ')});\n`;
  } else {
    out += line + '\n';
  }
}

fs.writeFileSync('railway_dump.sql', out);
console.log('Successfully created railway_dump.sql');
