const Database = require('better-sqlite3');
const path = require('path');
const { app } = require('electron');

class AppDatabase {
  constructor(dbPath) {
    const defaultPath = path.join(app.getPath('userData'), 'offlinechat.db');
    this.db = new Database(dbPath || defaultPath);
    this.db.pragma('journal_mode = WAL');
    this.db.pragma('foreign_keys = ON');
    this.initSchema();
  }

  initSchema() {
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS chats (
        id TEXT PRIMARY KEY,
        title TEXT DEFAULT 'New Chat',
        model TEXT,
        created_at TEXT DEFAULT (datetime('now')),
        updated_at TEXT DEFAULT (datetime('now'))
      );
      CREATE TABLE IF NOT EXISTS messages (
        id TEXT PRIMARY KEY,
        chat_id TEXT NOT NULL REFERENCES chats(id) ON DELETE CASCADE,
        role TEXT NOT NULL CHECK(role IN ('user','assistant','system')),
        content TEXT NOT NULL,
        attachments TEXT,
        created_at TEXT DEFAULT (datetime('now'))
      );
      CREATE TABLE IF NOT EXISTS settings (
        key TEXT PRIMARY KEY,
        value TEXT
      );
    `);
  }

  createChat(id, title, model) {
    this.db.prepare('INSERT INTO chats (id, title, model) VALUES (?, ?, ?)').run(id, title, model);
  }
  getChats() {
    return this.db.prepare('SELECT * FROM chats ORDER BY updated_at DESC').all();
  }
  getChat(id) {
    return this.db.prepare('SELECT * FROM chats WHERE id = ?').get(id);
  }
  deleteChat(id) {
    this.db.prepare('DELETE FROM chats WHERE id = ?').run(id);
  }
  updateChatTitle(id, title) {
    this.db
      .prepare("UPDATE chats SET title = ?, updated_at = datetime('now') WHERE id = ?")
      .run(title, id);
  }
  addMessage(id, chatId, role, content, attachments = null) {
    // Always store attachments as a JSON string or null
    const attachmentsStr = attachments
      ? typeof attachments === 'string'
        ? attachments
        : JSON.stringify(attachments)
      : null;

    this.db
      .prepare(
        'INSERT INTO messages (id, chat_id, role, content, attachments) VALUES (?, ?, ?, ?, ?)',
      )
      .run(id, chatId, role, content, attachmentsStr);

    this.db.prepare("UPDATE chats SET updated_at = datetime('now') WHERE id = ?").run(chatId);
  }

  getMessages(chatId) {
    const messages = this.db
      .prepare('SELECT * FROM messages WHERE chat_id = ? ORDER BY created_at ASC')
      .all(chatId);

    // Parse attachments for each message
    return messages.map((msg) => {
      if (msg.attachments && typeof msg.attachments === 'string') {
        try {
          msg.attachments = JSON.parse(msg.attachments);
        } catch (e) {
          msg.attachments = [];
        }
      }
      if (!msg.attachments) {
        msg.attachments = [];
      }
      return msg;
    });
  }
  getSetting(key) {
    const row = this.db.prepare('SELECT value FROM settings WHERE key = ?').get(key);
    return row ? JSON.parse(row.value) : null;
  }
  setSetting(key, value) {
    this.db
      .prepare('INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)')
      .run(key, JSON.stringify(value));
  }
  close() {
    this.db.close();
  }
}

module.exports = AppDatabase;
