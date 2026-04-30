const fs = require('fs');
const path = require('path');

function isTextFile(filePath) {
  const textExts = [
    '.txt',
    '.md',
    '.json',
    '.js',
    '.jsx',
    '.ts',
    '.tsx',
    '.py',
    '.rb',
    '.go',
    '.rs',
    '.java',
    '.c',
    '.cpp',
    '.h',
    '.css',
    '.html',
    '.xml',
    '.yaml',
    '.yml',
    '.toml',
    '.ini',
    '.cfg',
    '.sh',
    '.bash',
    '.zsh',
    '.fish',
    '.ps1',
    '.bat',
  ];
  return textExts.includes(path.extname(filePath).toLowerCase());
}

function readFileContent(filePath) {
  if (isTextFile(filePath)) {
    return fs.readFileSync(filePath, 'utf8');
  }
  return null;
}

module.exports = { isTextFile, readFileContent };
