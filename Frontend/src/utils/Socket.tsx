import { Client, type IFrame, type IMessage } from "@stomp/stompjs";
import { API_NOTIFICATION } from "../api/api";

const NOTIFICATIONS_URL = `${API_NOTIFICATION}/capstone`;

let userStompClient: Client | null;

type NotificationListener = (body: any, type: "general" | "private") => void;

const listeners = new Set<NotificationListener>();

const connectUserQueue = (userType: string, userId: string) => {
  if (!userId) {
    console.error(
      "User ID is required to connect to WebSocket for user-specific notifications."
    );
    return;
  }

  if (userStompClient && userStompClient.connected) {
    console.log(
      "Existing WebSocket client found and connected. Deactivating..."
    );
    userStompClient.deactivate();
    userStompClient = null;
  }

  try {
    userStompClient = new Client({
      brokerURL: NOTIFICATIONS_URL,
      debug: (str: string) => {
        console.log("STOMP Debug:", str);
      },
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,

      onConnect: (frame: IFrame) => {
        console.log(`Connected to WebSocket as user: ${userId}`, frame);

        userStompClient?.subscribe(
          `/user/${userId}/${userType}/notifications`,
          (message: IMessage) => {
            try {
              const body = JSON.parse(message.body);
              console.log(`Received private notification for ${userId}:`, body);
              listeners.forEach((listener) => listener(body, "private"));
            } catch (error) {
              console.error(
                "Error parsing private notification message body:",
                error,
                message.body
              );
            }
          },
          {}
        );

        userStompClient?.subscribe(
          `/topic/general-notifications`,
          (message: IMessage) => {
            try {
              const body = JSON.parse(message.body);
              console.log(`Received general notification:`, body);
              listeners.forEach((listener) => listener(body, "general"));
            } catch (error) {
              console.error(
                "Error parsing general notification message body:",
                error,
                message.body
              );
            }
          }
        );
      },

      onWebSocketError: (error: Event) => {
        console.error("WebSocket Error:", error);
      },

      onStompError: (frame: IFrame) => {
        console.error("STOMP Broker Error:", frame.headers["message"]);
        console.error("STOMP Details:", frame.body);
        if (frame.headers["message"]?.includes("Unauthorized")) {
          console.warn(
            "STOMP authentication failed. You might need to re-login."
          );
        }
      },

      onDisconnect: (frame: IFrame) => {
        console.log("Disconnected from WebSocket (user-specific).", frame);
      },
    });

    userStompClient.activate();
  } catch (error) {
    console.error("WebSocket connection setup error:", error);
  }
};

const disconnectUserQueue = () => {
  if (userStompClient) {
    console.log("Deactivating WebSocket client...");
    userStompClient.deactivate();
    userStompClient = null;
    listeners.clear();
    console.log("Disconnected from WebSocket.");
  }
};

function addListener(listener: NotificationListener) {
  listeners.add(listener);
  console.log("Listener added. Total listeners:", listeners.size);
}

function removeListener(listener: NotificationListener) {
  listeners.delete(listener);
  console.log("Listener removed. Total listeners:", listeners.size);
}

export { connectUserQueue, disconnectUserQueue, addListener, removeListener };
