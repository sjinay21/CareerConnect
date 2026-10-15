import pool from "../config/db.js";
export async function getAllFeatures() {
  const query = `
    SELECT id, name, description, is_active, created_at, updated_at
    FROM features
    ORDER BY id ASC;
  `;
  const result = await pool.query(query);
  return result.rows;
}

export async function getFeatureById(id) {
  const query = `
    SELECT id, name, description, is_active, created_at, updated_at
    FROM features
    WHERE id = $1;
  `;
  const result = await pool.query(query, [id]);
  return result.rows[0] || null;
}

export async function getFeatureByName(name) {
  const query = `
    SELECT id, name, description, is_active, created_at, updated_at
    FROM features
    WHERE LOWER(name) = LOWER($1);
  `;
  const result = await pool.query(query, [name]);
  return result.rows[0] || null;
}

export async function createFeature({ name, description, is_active }) {
  const activeValue = is_active !== undefined ? Boolean(is_active) : true;
  const query = `
    INSERT INTO features (name, description, is_active)
    VALUES ($1, $2, $3)
    RETURNING id, name, description, is_active, created_at, updated_at;
  `;
  const result = await pool.query(query, [name, description || null, activeValue]);
  return result.rows[0];
}

export async function updateFeature(id, updateData) {
  const fields = [];
  const values = [];
  let paramIndex = 1;

  if (updateData.name !== undefined) {
    fields.push(`name = $${paramIndex++}`);
    values.push(updateData.name);
  }

  if (updateData.description !== undefined) {
    fields.push(`description = $${paramIndex++}`);
    values.push(updateData.description);
  }

  if (updateData.is_active !== undefined) {
    fields.push(`is_active = $${paramIndex++}`);
    values.push(Boolean(updateData.is_active));
  }

  fields.push(`updated_at = CURRENT_TIMESTAMP`);

  values.push(id);
  const idIndex = paramIndex;

  const query = `
    UPDATE features
    SET ${fields.join(", ")}
    WHERE id = $${idIndex}
    RETURNING id, name, description, is_active, created_at, updated_at;
  `;

  const result = await pool.query(query, values);
  return result.rows[0] || null;
}

export async function countPlanFeaturesByFeatureId(featureId) {
  const query = `
    SELECT COUNT(*)::int AS count
    FROM plan_features
    WHERE feature_id = $1;
  `;
  const result = await pool.query(query, [featureId]);
  return result.rows[0]?.count || 0;
}
export async function deleteFeature(id) {
  const query = `
    DELETE FROM features
    WHERE id = $1
    RETURNING id, name, description, is_active, created_at, updated_at;
  `;
  const result = await pool.query(query, [id]);
  return result.rows[0] || null;
}
