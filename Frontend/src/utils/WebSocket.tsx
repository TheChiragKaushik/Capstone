import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client/dist/sockjs";
import { API_NOTIFICATION } from "../api/api";

const NOTIFICATIONS_URL = `${API_NOTIFICATION}/ws`;

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
    userStompClient.deactivate();
    userStompClient = null;
  }

  try {
    const socket = new SockJS(`${NOTIFICATIONS_URL}`);
    userStompClient = new Client({
      webSocketFactory: () => socket,
      debug: (str) => console.log(str),
      reconnectDelay: 2500,

      onConnect: () => {
        console.log(`Connected to WebSocket as user: ${userId}`);

        userStompClient?.subscribe(
          `/user/${userId}/${userType}/notifications`,
          (message) => {
            const body = JSON.parse(message.body);
            console.log(`Received private notification for ${userId}:`, body);
            listeners.forEach((listener) => listener(body, "private"));
            return body;
          }
        );
      },
      onStompError: (frame) => {
        console.error(
          "Broker error (user-specific): ",
          frame.headers["message"]
        );
        console.error("Details (user-specific): ", frame.body);
      },
      onDisconnect: () => {
        console.log("Disconnected from WebSocket (user-specific).");
      },
    });

    userStompClient.activate();
  } catch (error) {
    console.error(error);
  }
};

const disconnectUserQueue = () => {
  if (userStompClient) userStompClient.deactivate();
};

function addListener(listener: NotificationListener) {
  listeners.add(listener);
}

function removeListener(listener: NotificationListener) {
  listeners.delete(listener);
}

export { connectUserQueue, disconnectUserQueue, addListener, removeListener };
