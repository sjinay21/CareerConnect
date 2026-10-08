import { findConnectionBetween, createRequest, updateStatus, getUserConnections, expireOldRequests, recreateRequest } from "../models/Connection.js";

async function sendConnectionRequest(requesterId, receiverId) {
  if (requesterId == receiverId) {
    const error = new Error("You cannot send a connection request to yourself");
    error.statusCode = 400;
    throw error;
  }

  const existingConnection = await findConnectionBetween(requesterId, receiverId);
  if (existingConnection) {
    if (existingConnection.status == 'expired' || existingConnection.status == 'rejected') {
      if (existingConnection.cooldown_until && new Date(existingConnection.cooldown_until) > new Date()) {
        const error = new Error("You must wait before sending another request to this user.");
        error.statusCode = 400;
        throw error;
      }
      return await recreateRequest(existingConnection.id, requesterId, receiverId);
    }

    const error = new Error("A connection or pending request already exists between these users");
    error.statusCode = 400;
    throw error;
  }

  const connection = await createRequest(requesterId, receiverId);
  return connection;
}

async function updateConnectionStatus(connectionId, status) {
  if (status != "accepted" && status != "rejected") {
    const error = new Error("Invalid status. Only 'accepted' or 'rejected' are allowed.");
    error.statusCode = 400;
    throw error;
  }

  let cooldownUntil = null;
  if (status =='rejected') {
    const cooldownHours = parseInt(process.env.FRIEND_REQUEST_COOLDOWN_HOURS) || 5;
    cooldownUntil = new Date(Date.now() + cooldownHours * 60 * 60 * 1000);
  }

  const updatedConnection = await updateStatus(connectionId, status, cooldownUntil);
  return updatedConnection;
}

async function fetchUserConnections(userId) {
  return await getUserConnections(userId);
}

async function processExpiredRequests() {
  const expiryMins = parseInt(process.env.FRIEND_REQUEST_EXPIRY_MINUTES) || 1;
  const expiryDate = new Date(Date.now() - expiryMins * 60 * 1000);
  const cooldownHours = parseInt(process.env.FRIEND_REQUEST_COOLDOWN_HOURS) || 5;

const cooldownUntil = new Date(Date.now() + cooldownHours * 60 * 60 * 1000);
  try {
    const expiredCount = await expireOldRequests(expiryDate, cooldownUntil);
    if (expiredCount > 0) {
      console.log(`Successfully expired ${expiredCount} pending friend request(s).`);
    }
    return expiredCount;
  } catch (error) {
    console.error("Error processing expired friend requests:", error);
    throw error;
  }
}

export { sendConnectionRequest, updateConnectionStatus, fetchUserConnections, processExpiredRequests };
