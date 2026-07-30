import { io } from "socket.io-client";

// Single shared socket instance for the whole app.
// DealRoom.jsx currently creates its own `io(...)` at module scope too -
// consider switching it to import this shared instance instead, so there's
// only ever one active socket connection per browser tab.
const socket = io(import.meta.env.VITE_API_URL, {
  auth: {
    token: localStorage.getItem("token"),
  },
});

export default socket;