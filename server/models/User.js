import pool from "../config/db.js";

async function findByEmail(email) {
  const result = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
  return result.rows[0];
}

async function findById(id) {
  const result = await pool.query("SELECT * FROM users WHERE id = $1", [id]);
  return result.rows[0];
}

async function create(userData) {
  const { name, email, password, about } = userData;
  const result = await pool.query(
    "INSERT INTO users (name, email, password, about) VALUES ($1, $2, $3, $4) RETURNING *",
    [name, email, password, about || null]
  );
  return result.rows[0];
}

async function updateProfile(id, profileData) {
  const { name, about, summary, location, skills } = profileData;
  const result = await pool.query(
    "UPDATE users SET name = $1, about = $2, summary = $3, location = $4, skills = $5 WHERE id = $6 RETURNING id, name, email, about, summary, location, skills",
    [name, about || null, summary || null, location || null, skills || null, id]
  );
  return result.rows[0];
}

export { findByEmail, findById, create, updateProfile };
