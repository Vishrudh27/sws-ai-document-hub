const WS_URL = import.meta.env.VITE_WS_URL || "ws://localhost:8080/ws/notifications";

export function createNotificationSocket(onMessage, onOpen, onError, onClose) {
  const socket = new WebSocket(WS_URL);

  socket.onopen = () => {
    if (onOpen) {
      onOpen();
    }
  };

  socket.onmessage = (event) => {
    try {
      const payload = JSON.parse(event.data);
      onMessage(payload);
    } catch (error) {
      console.error("Invalid notification payload", error);
    }
  };

  socket.onerror = (event) => {
    if (onError) {
      onError(event);
    }
  };

  socket.onclose = () => {
    if (onClose) {
      onClose();
    }
  };

  return socket;
}
