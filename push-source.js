const { execSync } = require('child_process');

const now = new Date();
const formattedDate = now.toLocaleString('en-GB', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
}).replace(',', '');

try {
  execSync('git checkout source-code');
  execSync('git add .');
  execSync(`git commit -m "Add source code ${formattedDate}"`);
  execSync('git push origin source-code');
  console.log('✅ Source code committed and pushed to source-code branch.');
} catch (err) {
  console.error('❌ Error committing source code:', err.message);
}
