import * as authService from "../services/authService.js";
import jwt from "jsonwebtoken";
async function register(req, res) {
  try {
    const userData = { ...req.body, role: "user" };
    await authService.register(userData);
    res.status(201).json({ message: "Registration successful. Please log in." });
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message });
  }
}

async function login(req, res) {
  try {
    const { email, password } = req.body || {};
    const token = await authService.login(email, password);
    const decoded = jwt.decode(token);
    res.cookie("token", token, { httpOnly: true, secure: false, sameSite: "lax", maxAge: 24 * 60 * 60 * 1000 });
    res.json({ message: "Login successful", token });
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message });
  }
}

async function logout(req, res) {
  try {
    const token = req.cookies.token;
    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        await authService.logout(decoded.id);
      } catch (err) {
        res.status(500).json({ message: err.message });
      }
    }
    res.clearCookie("token");
    res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export { register, login, logout };