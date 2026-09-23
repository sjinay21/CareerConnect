import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { findByEmail, create } from "../models/User.js";

async function register(userData) {
  const { name, email, password } = userData;

  const existingUser = await findByEmail(email);
  if (existingUser) {
    const error = new Error("User already exists with this email");
    error.statusCode = 400;
    throw error;
  }

  const password_hash = bcrypt.hashSync(password, 10);
  
  try {
    const newUser = await create({ name, email, password: password_hash });
    return newUser;
  } catch (err) {
    if (err.code === '23505') { // Postgres unique_violation code
      const error = new Error("User already exists with this email");
      error.statusCode = 400;
      throw error;
    }
    throw err;
  }
}

async function login(email, password) {
  const user = await findByEmail(email);

  if (!user || !bcrypt.compareSync(password, user.password)) {
    const error = new Error("Invalid email or password");
    error.statusCode = 401;
    throw error;
  }

  const payload = { id: user.id, name: user.name };
  const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1d" });

  return token;
}

async function logout(userId) {
  // In this new schema, we do not track active status in the DB.
  // The token is simply removed from the client's cookies in the controller.
  return true;
}

export { register, login, logout };