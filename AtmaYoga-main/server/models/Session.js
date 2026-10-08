const { getDB } = require("../config/db");

/**
 * Session Model - SQLite implementation
 * For storing mood and session goals
 */
class Session {
  /**
   * Create a new session
   */
  static create(sessionData) {
    const db = getDB();
    const { userId, mood, sessionGoal } = sessionData;

    const stmt = db.prepare(`
      INSERT INTO sessions (user_id, mood, session_goal)
      VALUES (?, ?, ?)
    `);

    const result = stmt.run(userId, mood, sessionGoal);
    return this.findById(result.lastInsertRowid);
  }

  /**
   * Find session by ID
   */
  static findById(id) {
    const db = getDB();
    const stmt = db.prepare("SELECT * FROM sessions WHERE id = ?");
    const session = stmt.get(id);
    return session ? this.mapRow(session) : null;
  }

  /**
   * Find sessions by user ID
   */
  static findByUserId(userId) {
    const db = getDB();
    const stmt = db.prepare(
      "SELECT * FROM sessions WHERE user_id = ? ORDER BY date DESC"
    );
    const sessions = stmt.all(userId);
    return sessions.map((row) => this.mapRow(row));
  }

  /**
   * Map database row to session object
   */
  static mapRow(row) {
    if (!row) return null;
    return {
      _id: row.id,
      id: row.id,
      userId: row.user_id,
      mood: row.mood,
      sessionGoal: row.session_goal,
      date: row.date,
    };
  }
}

module.exports = Session;




