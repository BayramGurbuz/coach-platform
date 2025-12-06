const fs = require('fs');
const path = require('path');

function walk(dir, exts = ['.js', '.jsx']){
  const files = [];
  for (const name of fs.readdirSync(dir)){
    const full = path.join(dir, name);
    const stat = fs.statSync(full);
    if (stat.isDirectory()){
      files.push(...walk(full, exts));
    } else if (exts.includes(path.extname(name))){
      files.push(full);
    }
  }
  return files;
}

function extractTKeys(content){
  const re = /t\(\s*['\"]([A-Za-z0-9_\.\-]+)['\"]\s*\)/g;
  const keys = new Set();
  let m;
  while ((m = re.exec(content)) !== null){
    keys.add(m[1]);
  }
  return Array.from(keys);
}

function loadTranslations(filePath){
  const content = fs.readFileSync(filePath, 'utf8');
  const marker = 'const translations';
  const idx = content.indexOf(marker);
  if (idx === -1){
    throw new Error('translations object not found in ' + filePath);
  }
  const start = content.indexOf('{', idx);
  if (start === -1) throw new Error('translations object start not found');
  // find matching closing brace
  let i = start;
  let depth = 0;
  for (; i < content.length; i++){
    const ch = content[i];
    if (ch === '{') depth++;
    else if (ch === '}'){
      depth--;
      if (depth === 0) break;
    }
  }
  const objText = content.slice(start, i+1);
  // Build a temp module file to require
  const tmpPath = path.join(__dirname, 'translations.temp.js');
  const moduleText = 'module.exports = ' + objText + ';\n';
  fs.writeFileSync(tmpPath, moduleText, 'utf8');
  const translations = require(tmpPath);
  fs.unlinkSync(tmpPath);
  return translations;
}

function hasKey(translations, key){
  const parts = key.split('.');
  // check in both 'tr' and 'en'
  for (const lang of ['tr','en']){
    let cur = translations[lang];
    let ok = true;
    for (const p of parts){
      if (cur && Object.prototype.hasOwnProperty.call(cur, p)){
        cur = cur[p];
      } else { ok = false; break; }
    }
    if (ok) return true;
  }
  return false;
}

(function main(){
  const projectRoot = path.join(__dirname, '..');
  const clientDir = path.join(projectRoot, 'client', 'src');
  const langFile = path.join(clientDir, 'context', 'LanguageContext.jsx');

  console.log('Scanning files under', clientDir);
  const files = walk(clientDir, ['.js', '.jsx']);
  const usedKeys = new Set();
  for (const f of files){
    const text = fs.readFileSync(f, 'utf8');
    const keys = extractTKeys(text);
    keys.forEach(k => usedKeys.add(k));
  }

  console.log('Found', usedKeys.size, 'unique t(...) keys.');

  const translations = loadTranslations(langFile);

  const missing = [];
  for (const k of Array.from(usedKeys).sort()){
    if (!hasKey(translations, k)) missing.push(k);
  }

  if (missing.length === 0){
    console.log('✅ All keys found in translations.');
  } else {
    console.log('❌ Missing translation keys (present in UI but not in LanguageContext):');
    missing.forEach(x => console.log(' -', x));
    process.exitCode = 2;
  }
})();
