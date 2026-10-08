const { getDB } = require("../config/db");

/**
 * Response Model - SQLite implementation
 */
class Response {
  /**
   * Find all responses with optional filters
   */
  static find(query = {}) {
    const db = getDB();
    let sql = `
      SELECT r.*, 
             u.name as user_name, u.email as user_email,
             q.question_text, q.question_type, q.category
      FROM responses r
      LEFT JOIN users u ON r.user_id = u.id
      LEFT JOIN questions q ON r.question_id = q.id
      WHERE 1=1
    `;
    const params = [];

    if (query.userId) {
      sql += " AND r.user_id = ?";
      params.push(query.userId);
    }

    if (query.questionId) {
      sql += " AND r.question_id = ?";
      params.push(query.questionId);
    }

    if (query.sessionId) {
      sql += " AND r.session_id = ?";
      params.push(query.sessionId);
    }

    sql += " ORDER BY r.created_at DESC";

    const stmt = db.prepare(sql);
    const rows = stmt.all(...params);
    return rows.map((row) => this.mapRow(row));
  }

  /**
   * Find response by ID
   */
  static findById(id) {
    const db = getDB();
    const stmt = db.prepare(`
      SELECT r.*, 
             u.name as user_name, u.email as user_email,
             q.question_text, q.question_type, q.category
      FROM responses r
      LEFT JOIN users u ON r.user_id = u.id
      LEFT JOIN questions q ON r.question_id = q.id
      WHERE r.id = ?
    `);
    const response = stmt.get(id);
    return response ? this.mapRow(response) : null;
  }

  /**
   * Find response by user, question, and session
   */
  static findByUserQuestionSession(userId, questionId, sessionId = null) {
    const db = getDB();
    let stmt;
    let response;
    
    if (sessionId === null || sessionId === undefined) {
      stmt = db.prepare(`
        SELECT * FROM responses 
        WHERE user_id = ? AND question_id = ? AND session_id IS NULL
      `);
      response = stmt.get(userId, questionId);
    } else {
      stmt = db.prepare(`
        SELECT * FROM responses 
        WHERE user_id = ? AND question_id = ? AND session_id = ?
      `);
      response = stmt.get(userId, questionId, sessionId);
    }
    
    return response ? this.mapRow(response) : null;
  }

  /**
   * Create a new response
   */
  static create(responseData) {
    const db = getDB();
    const {
      userId,
      questionId,
      responseValue,
      sessionId = null,
      metadata = {},
    } = responseData;

    const stmt = db.prepare(`
      INSERT INTO responses (user_id, question_id, answer, session_id, metadata)
      VALUES (?, ?, ?, ?, ?)
    `);

    const result = stmt.run(
      userId,
      questionId,
      JSON.stringify(responseValue),
      sessionId,
      JSON.stringify(metadata)
    );

    return this.findById(result.lastInsertRowid);
  }

  /**
   * Update response by ID
   */
  static updateById(id, updates) {
    const db = getDB();
    const fields = [];
    const values = [];

    // Build dynamic update query
    Object.keys(updates).forEach((key) => {
      const dbKey = this.camelToSnake(key);
      if (dbKey !== "id" && dbKey !== "created_at") {
        if (key === "responseValue") {
          fields.push("answer = ?");
          values.push(JSON.stringify(updates[key]));
        } else if (key === "metadata") {
          fields.push("metadata = ?");
          values.push(JSON.stringify(updates[key]));
        } else if (key === "sessionId") {
          fields.push("session_id = ?");
          values.push(updates[key]);
        } else {
          fields.push(`${dbKey} = ?`);
          values.push(updates[key]);
        }
      }
    });

    if (fields.length === 0) {
      return this.findById(id);
    }

    // Add updated_at timestamp
    fields.push("updated_at = CURRENT_TIMESTAMP");

    values.push(id);
    const sql = `UPDATE responses SET ${fields.join(", ")} WHERE id = ?`;
    const stmt = db.prepare(sql);
    stmt.run(...values);

    return this.findById(id);
  }

  /**
   * Delete response by ID
   */
  static deleteById(id) {
    const db = getDB();
    const stmt = db.prepare("DELETE FROM responses WHERE id = ?");
    stmt.run(id);
    return true;
  }

  /**
   * Map database row to response object
   */
  static mapRow(row) {
    if (!row) return null;

    // Parse JSON fields
    let responseValue = null;
    let metadata = {};
    try {
      responseValue = JSON.parse(row.answer || "null");
    } catch (e) {
      responseValue = row.answer;
    }
    try {
      metadata = JSON.parse(row.metadata || "{}");
    } catch (e) {
      metadata = {};
    }

    const response = {
      _id: row.id,
      id: row.id,
      userId: row.user_id,
      questionId: row.question_id,
      responseValue: responseValue,
      sessionId: row.session_id,
      metadata: metadata,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };

    // Add populated fields if present
    if (row.user_name) {
      response.userId = {
        _id: row.user_id,
        id: row.user_id,
        name: row.user_name,
        email: row.user_email,
      };
    }

    if (row.question_text) {
      response.questionId = {
        _id: row.question_id,
        id: row.question_id,
        questionText: row.question_text,
        questionType: row.question_type,
        category: row.category,
      };
    }

    return response;
  }

  /**
   * Convert camelCase to snake_case
   */
  static camelToSnake(str) {
    return str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
  }
}

module.exports = Response;
