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
  const { name, email, password, about, role } = userData;
  const result = await pool.query(
    "INSERT INTO users (name, email, password, about, role) VALUES ($1, $2, $3, $4, $5) RETURNING *",
    [name, email, password, about || null, role || 'user']
  );
  return result.rows[0];
}

async function updateProfile(id, profileData) {
  const keys = Object.keys(profileData);
  if (keys.length === 0) {
    return await findById(id);
  }

  const setClauses = keys.map((key, index) => `${key} = $${index + 1}`);
  const values = keys.map((key) => profileData[key]);

  values.push(id);
  const idIndex = values.length;

  const query = `
    UPDATE users 
    SET ${setClauses.join(", ")} 
    WHERE id = $${idIndex} 
    RETURNING id, name, email, about, summary, location, skills, profile_picture_url, banner_url, role
  `;

  const result = await pool.query(query, values);
  return result.rows[0];
}

async function searchUsers(search, limit, offset) {
  let whereClause = "";
  let params = [limit, offset];
  let countParams = [];

  if (search) {
      whereClause = `WHERE name ILIKE $3`; 
      params.push(`%${search}%`);
      countParams.push(`%${search}%`);
  }

  const usersQuery = `
      SELECT id, name, summary, profile_picture_url, banner_url
      FROM users
      ${whereClause}
      ORDER BY name ASC
      LIMIT $1 OFFSET $2
  `;

  const countQuery = `
      SELECT COUNT(*)
      FROM users
      ${search ? 'WHERE name ILIKE $1' : ''}
  `;

  const usersResult = await pool.query(usersQuery, params);
  const countResult = await pool.query(countQuery, countParams);
  
  const total = parseInt(countResult.rows[0].count, 10);

  return { users: usersResult.rows, total };
}

async function getAllUsersList() {
  const result = await pool.query(`
    SELECT id, name, about, summary, location, skills, profile_picture_url, banner_url
    FROM users
    ORDER BY name ASC
  `);
  return result.rows;
}

export { findByEmail, findById, create, updateProfile, searchUsers, getAllUsersList };
