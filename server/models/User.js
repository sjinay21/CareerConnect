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
  const { name, about, summary, location, skills, profile_picture_url, banner_url } = profileData;
  
  let setClauses = ["name = $1", "about = $2", "summary = $3", "location = $4", "skills = $5"];
  let params = [name, about || null, summary || null, location || null, skills || null];

  if (profile_picture_url) {
    params.push(profile_picture_url);
    setClauses.push(`profile_picture_url = $${params.length}`);
  }

  if (banner_url) {
    params.push(banner_url);
    setClauses.push(`banner_url = $${params.length}`);
  }

  params.push(id);
  const idParamIndex = params.length;

  const query = `UPDATE users SET ${setClauses.join(", ")} 
    WHERE id = $${idParamIndex} 
    RETURNING id, name, email, about, summary, location, skills, profile_picture_url, banner_url
  `;

  const result = await pool.query(query, params);
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
