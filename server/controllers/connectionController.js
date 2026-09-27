import { sendConnectionRequest, updateConnectionStatus, fetchUserConnections } from "../services/connectionService.js";

export const requestConnection = async (req, res) => {
  try {
    const requesterId = req.user.id;
    const receiverId = req.params.userId;

    const connection = await sendConnectionRequest(requesterId, receiverId);

    res.status(201).json({
      message: "Connection request sent successfully",
      connection
    });
  } catch (error) {
    console.error("Error sending connection request:", error);
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({ message: error.message || "Internal server error" });
  }
};

export const updateStatus = async (req, res) => {
  try {
    const connectionId = req.params.connectionId;
    const { status } = req.body;

    const connection = await updateConnectionStatus(connectionId, status);

    res.status(200).json({
      message: `Connection ${status} successfully`,
      connection
    });
  } catch (error) {
    console.error("Error updating connection status:", error);
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({ message: error.message || "Internal server error" });
  }
};

export const getConnections = async (req, res) => {
  try {
    const userId = req.user.id;
    const connections = await fetchUserConnections(userId);

    res.status(200).json(connections);
  } catch (error) {
    console.error("Error fetching connections:", error);
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({ message: error.message || "Internal server error" });
  }
};
