import { findConnectionBetween, createRequest, updateStatus, getUserConnections } from "../models/Connection.js";

async function sendConnectionRequest(requesterId, receiverId) {
  if (requesterId == receiverId) {
    const error = new Error("You cannot send a connection request to yourself");
    error.statusCode = 400;
    throw error;
  }

  const existingConnection = await findConnectionBetween(requesterId, receiverId);
  if (existingConnection) {
    const error = new Error("A connection or pending request already exists between these users");
    error.statusCode = 400;
    throw error;
  }

  const connection = await createRequest(requesterId, receiverId);
  return connection;
}

async function updateConnectionStatus(connectionId, status) {
  if (status !== "accepted" && status !== "rejected") {
    const error = new Error("Invalid status. Only 'accepted' or 'rejected' are allowed.");
    error.statusCode = 400;
    throw error;
  }

  const updatedConnection = await updateStatus(connectionId, status);
  return updatedConnection;
}

async function fetchUserConnections(userId) {
  return await getUserConnections(userId);
}

export { sendConnectionRequest, updateConnectionStatus, fetchUserConnections };
