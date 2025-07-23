import React, { useEffect, useState } from "react";

const CHANNEL_NAME = "feud-game-state";

export default function ConnectionStatus() {
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const broadcast = new BroadcastChannel(CHANNEL_NAME);
    let timeout: NodeJS.Timeout | null = null;

    const handleMessage = (event: MessageEvent) => {
      if (event.data === "PING") {
        setConnected(true);
        if (timeout) clearTimeout(timeout);
        timeout = setTimeout(() => setConnected(false), 3000);
      }
    };
    broadcast.addEventListener("message", handleMessage);
    // Check initial state: if control page is open, it will ping soon
    setConnected(false);
    return () => {
      broadcast.removeEventListener("message", handleMessage);
      if (timeout) clearTimeout(timeout);
    };
  }, []);

  return (
    <div className={`fixed bottom-2 right-2 px-3 py-1 rounded text-xs font-semibold shadow-lg z-50 transition-all ${connected ? "bg-green-600 text-white" : "bg-gray-400 text-white"}`}>
      {connected ? "Connected" : "Disconnected"}
    </div>
  );
}
