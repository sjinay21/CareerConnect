import pool from "../config/db.js";

export async function getAllFeatures() {
  const query = `
    SELECT *
    FROM features
    ORDER BY id ASC;
  `;
  const result = await pool.query(query);
  return result.rows;
}

export async function getFeatureById(id) {
  const query = `
    SELECT *
    FROM features
    WHERE id = $1;
  `;
  const result = await pool.query(query, [id]);
  return result.rows[0] || null;
}

export async function getFeatureByName(name) {
  const query = `
    SELECT *
    FROM features
    WHERE name = $1;
  `;
  const result = await pool.query(query, [name]);
  return result.rows[0] || null;
}

export async function createFeature({ name, description, is_active }) {
  const activeValue = is_active !== undefined ? Boolean(is_active) : true;
  const query = `
    INSERT INTO features (name, description, is_active)
    VALUES ($1, $2, $3)
    RETURNING *;
  `;
  const result = await pool.query(query, [name, description || null, activeValue]);
  return result.rows[0];
}

export async function countPlanFeaturesByFeatureId(featureId) {
  const query = `
    SELECT COUNT(*) AS count
    FROM plan_features
    WHERE feature_id = $1;
  `;
  const result = await pool.query(query, [featureId]);
  return parseInt(result.rows[0]?.count || 0, 10);
}

export async function deleteFeature(id) {
  const query = `
    DELETE FROM features
    WHERE id = $1
    RETURNING *;
  `;
  const result = await pool.query(query, [id]);
  return result.rows[0] || null;
}
