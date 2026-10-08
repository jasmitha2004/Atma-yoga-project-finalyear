const { getDB } = require("../config/db");

/**
 * Question Model - SQLite implementation
 */
class Question {
  /**
   * Find all questions with optional filters
   */
  static find(query = {}) {
    const db = getDB();
    let sql = "SELECT * FROM questions WHERE 1=1";
    const params = [];

    if (query.category) {
      sql += " AND category = ?";
      params.push(query.category);
    }

    if (query.isActive !== undefined) {
      sql += " AND is_active = ?";
      params.push(query.isActive ? 1 : 0);
    }

    sql += " ORDER BY question_order ASC, created_at ASC";

    const stmt = db.prepare(sql);
    const rows = stmt.all(...params);
    return rows.map((row) => this.mapRow(row));
  }

  /**
   * Find question by ID
   */
  static findById(id) {
    const db = getDB();
    const stmt = db.prepare("SELECT * FROM questions WHERE id = ?");
    const question = stmt.get(id);
    return question ? this.mapRow(question) : null;
  }

  /**
   * Create a new question
   */
  static create(questionData) {
    const db = getDB();
    const {
      questionText,
      questionType = "text",
      category = "general",
      options = [],
      isRequired = true,
      order = 0,
      isActive = true,
      metadata = {},
    } = questionData;

    const stmt = db.prepare(`
      INSERT INTO questions (
        question_text, question_type, category, options,
        is_required, question_order, is_active, metadata
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const result = stmt.run(
      questionText,
      questionType,
      category,
      JSON.stringify(options),
      isRequired ? 1 : 0,
      order,
      isActive ? 1 : 0,
      JSON.stringify(metadata)
    );

    return this.findById(result.lastInsertRowid);
  }

  /**
   * Update question by ID
   */
  static updateById(id, updates) {
    const db = getDB();
    const fields = [];
    const values = [];

    // Build dynamic update query
    Object.keys(updates).forEach((key) => {
      const dbKey = this.camelToSnake(key);
      if (dbKey !== "id" && dbKey !== "created_at") {
        if (key === "options" || key === "metadata") {
          fields.push(`${dbKey} = ?`);
          values.push(JSON.stringify(updates[key]));
        } else if (key === "isRequired" || key === "isActive") {
          fields.push(`${dbKey} = ?`);
          values.push(updates[key] ? 1 : 0);
        } else if (key === "questionText") {
          fields.push(`question_text = ?`);
          values.push(updates[key]);
        } else if (key === "order") {
          fields.push(`question_order = ?`);
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

    values.push(id);
    const sql = `UPDATE questions SET ${fields.join(", ")} WHERE id = ?`;
    const stmt = db.prepare(sql);
    stmt.run(...values);

    return this.findById(id);
  }

  /**
   * Soft delete question (set isActive to false)
   */
  static deleteById(id) {
    return this.updateById(id, { isActive: false });
  }

  /**
   * Map database row to question object
   */
  static mapRow(row) {
    if (!row) return null;

    // Parse JSON fields
    let options = [];
    let metadata = {};
    try {
      options = JSON.parse(row.options || "[]");
    } catch (e) {
      options = [];
    }
    try {
      metadata = JSON.parse(row.metadata || "{}");
    } catch (e) {
      metadata = {};
    }

    return {
      _id: row.id,
      id: row.id,
      questionText: row.question_text,
      questionType: row.question_type,
      category: row.category,
      options: options,
      isRequired: Boolean(row.is_required),
      order: row.question_order,
      isActive: Boolean(row.is_active),
      metadata: metadata,
      createdAt: row.created_at,
      updatedAt: row.created_at, // SQLite doesn't have updated_at trigger by default
    };
  }

  /**
   * Convert camelCase to snake_case
   */
  static camelToSnake(str) {
    return str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
  }
}

module.exports = Question;
