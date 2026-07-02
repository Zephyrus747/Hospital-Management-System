const fs = require('fs');
const path = require('path');

const SOURCE = path.join(__dirname, '..', 'db.json');
const TEST_DB = path.join(__dirname, 'db.test.json');

function resetTestDb() {
  fs.copyFileSync(SOURCE, TEST_DB);
  return TEST_DB;
}

function cleanupTestDb() {
  if (fs.existsSync(TEST_DB)) fs.unlinkSync(TEST_DB);
}

module.exports = { resetTestDb, cleanupTestDb, TEST_DB };
