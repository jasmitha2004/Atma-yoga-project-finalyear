const { getDB } = require("../config/db");
const bcrypt = require("bcryptjs");

/**
 * User Model - SQLite implementation
 */
class User {
  /**
   * Find user by email
   */
  static findByEmail(email) {
    const db = getDB();
    const stmt = db.prepare("SELECT * FROM users WHERE email = ?");
    const user = stmt.get(email);
    return user ? this.mapRow(user) : null;
  }

  /**
   * Find user by ID
   */
  static findById(id) {
    const db = getDB();
    const stmt = db.prepare("SELECT * FROM users WHERE id = ?");
    const user = stmt.get(id);
    return user ? this.mapRow(user) : null;
  }

  /**
   * Create a new user
   */
  static async create(userData) {
    const db = getDB();
    const { name, email, password } = userData;

    // Hash password
  const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const stmt = db.prepare(
      "INSERT INTO users (name, email, password) VALUES (?, ?, ?)"
    );
    const result = stmt.run(name, email, hashedPassword);

    return this.findById(result.lastInsertRowid);
  }

  /**
   * Update user by ID
   */
  static updateById(id, updates) {
    const db = getDB();
    const fields = [];
    const values = [];

    // Build dynamic update query
    Object.keys(updates).forEach((key) => {
      if (key === "id" || key === "_id" || key === "createdAt" || key === "created_at") {
        return; // Skip these fields
      }

      let dbKey = this.camelToSnake(key);
      let value = updates[key];

      // Handle special field mappings
      if (key === "yogaLevel") {
        dbKey = "yoga_level";
      } else if (key === "completedQuestionnaire") {
        dbKey = "completed_questionnaire";
        value = value ? 1 : 0;
      } else if (key === "healthConditions") {
        dbKey = "health_conditions";
        value = JSON.stringify(Array.isArray(value) ? value : []);
      }

      fields.push(`${dbKey} = ?`);
      values.push(value);
    });

    if (fields.length === 0) {
      return this.findById(id);
    }

    values.push(id);
    const sql = `UPDATE users SET ${fields.join(", ")} WHERE id = ?`;
    const stmt = db.prepare(sql);
    stmt.run(...values);

    return this.findById(id);
  }

  /**
   * Compare password
   */
  static async comparePassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }

  /**
   * Map database row to user object
   */
  static mapRow(row) {
    if (!row) return null;

    // Parse JSON fields
    let healthConditions = [];
    try {
      healthConditions = JSON.parse(row.health_conditions || "[]");
    } catch (e) {
      healthConditions = [];
    }

    return {
      _id: row.id,
      id: row.id,
      name: row.name,
      email: row.email,
      password: row.password,
      createdAt: row.created_at,
      age: row.age || "",
      gender: row.gender || "",
      fitness: row.fitness || "",
      yogaLevel: row.yoga_level || "",
      healthConditions: healthConditions,
      completedQuestionnaire: Boolean(row.completed_questionnaire),
    };
  }

  /**
   * Convert camelCase to snake_case
   */
  static camelToSnake(str) {
    return str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
  }
}

module.exports = User;
