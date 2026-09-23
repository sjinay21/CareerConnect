import pool from "../config/db.js";

async function createPost(post) {
  const query = `INSERT INTO posts (author_id, content, media_url) VALUES ($1, $2, $3) RETURNING *`;

  const result = await pool.query(query, [post.authorId, post.content, post.mediaUrl]);
  return result.rows[0];
}
async function getallPosts(userId) {
  const result = await pool.query(`
    SELECT 
      posts.id, posts.author_id, posts.content, posts.media_url, posts.created_at, 
      users.name, users.summary,
      (SELECT COUNT(*) FROM likes WHERE likes.post_id = posts.id) as likes_count,
      EXISTS(SELECT 1 FROM likes WHERE likes.post_id = posts.id AND likes.user_id = $1) as is_liked_by_user
    FROM posts
    JOIN users ON posts.author_id = users.id
    ORDER BY posts.created_at DESC
  `, [userId]);
  return result.rows;
}
async function updatePost(postId, authorId, content, mediaUrl) {
    const query = `UPDATE posts SET content = $1, media_url = COALESCE($2, media_url) WHERE id = $3 AND author_id = $4 RETURNING *`;
    const result = await pool.query(query, [content, mediaUrl, postId, authorId]);
    return result.rows[0];
}
async function deletePost(postId, authorId) {
    const query = `DELETE FROM posts WHERE id = $1 AND author_id = $2 RETURNING *`;
    const result = await pool.query(query, [postId, authorId]);
    return result.rows[0];
}
export { createPost, getallPosts,updatePost,deletePost };