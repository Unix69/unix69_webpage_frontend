const fs = require('fs');
const path = require('path');

function buildTree(dirPath) {
  const name = path.basename(dirPath);
  const stats = fs.statSync(dirPath);

  if (stats.isFile()) {
    return {
      name: name,
      type: 'file',
      // Manteniamo il percorso web pulito
      path: '/' + path.relative(path.join(__dirname, 'public'), dirPath).replace(/\\/g, '/'),
      // Aggiungiamo la dimensione in bytes per i calcoli nella dashboard
      size: stats.size 
    };
  }

  // Se è una cartella, leggiamo i figli
  return {
    name: name,
    type: 'folder',
    children: fs
      .readdirSync(dirPath)
      // Filtriamo eventuali file di sistema (come .DS_Store o simili)
      .filter(child => !child.startsWith('.'))
      .map(child => buildTree(path.join(dirPath, child))),
  };
}

// Percorso base
const rootDir = path.join(__dirname, 'public', 'resources');

try {
  const tree = buildTree(rootDir);

  fs.writeFileSync(
    path.join(__dirname, 'public', 'resources-tree.json'),
    JSON.stringify(tree, null, 2)
  );
  
  console.log('✅ File resources-tree.json correctly generated!');
} catch (err) {
  console.error('❌ Error during the tree generation:', err.message);
}