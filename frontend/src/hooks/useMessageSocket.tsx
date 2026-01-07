import { useEffect, useRef, useState } from "react";

interface MessageChunkMessage {
  type: "message_chunk";
  chunk: string;
  is_complete: boolean;
}

interface MessageErrorMessage {
  type: "message_error";
  error: string;
}

type SocketMessage = MessageChunkMessage | MessageErrorMessage;

interface UseMessageSocketOptions {
  messageId: string | null;
  onTitleChunk?: (chunk: string) => void;
  onTitleComplete?: (fullTitle: string) => void;
  onError?: (error: string) => void;
}

interface UseMessageSocketReturn {
  isConnected: boolean;
  streamingTitle: string;
  isStreaming: boolean;
}

export function useMessageSocket({
  messageId,
  onTitleChunk,
  onTitleComplete,
  onError,
}: UseMessageSocketOptions): UseMessageSocketReturn {
  const wsRef = useRef<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [streamingTitle, setStreamingTitle] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const fullTitleRef = useRef("");

  // Store callbacks in refs to avoid reconnection loops
  const onTitleChunkRef = useRef(onTitleChunk);
  const onTitleCompleteRef = useRef(onTitleComplete);
  const onErrorRef = useRef(onError);

  // Update refs when callbacks change
  useEffect(() => {
    onTitleChunkRef.current = onTitleChunk;
    onTitleCompleteRef.current = onTitleComplete;
    onErrorRef.current = onError;
  }, [onTitleChunk, onTitleComplete, onError]);

  // Single effect to manage WebSocket connection
  useEffect(() => {
    if (!messageId) return;

    // Determine WebSocket URL based on current location
    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const host = window.location.host;

    // In development, the API might be on a different port
    const apiHost = import.meta.env.VITE_API_URL
      ? new URL(import.meta.env.VITE_API_URL).host
      : host;

    const url = `${protocol}//${apiHost}/api/v1/ws/message/${messageId}`;

    // Reset state
    setStreamingTitle("");
    fullTitleRef.current = "";
    setIsStreaming(false);

    const ws = new WebSocket(url);

    ws.onopen = () => {
      setIsConnected(true);
    };

    ws.onmessage = (event) => {
      try {
        const message: SocketMessage = JSON.parse(event.data);

        if (message.type === "message_chunk") {
          // Only set isStreaming when we actually receive content
          if (!message.is_complete) {
            setIsStreaming(true);
          }
          fullTitleRef.current += message.chunk;
          setStreamingTitle(fullTitleRef.current);
          onTitleChunkRef.current?.(message.chunk);

          if (message.is_complete) {
            setIsStreaming(false);
            onTitleCompleteRef.current?.(fullTitleRef.current.trim());
          }
        } else if (message.type === "message_error") {
          setIsStreaming(false);
          onErrorRef.current?.(message.error);
        }
      } catch (e) {
        console.error("Failed to parse WebSocket message:", e);
      }
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
      onErrorRef.current?.("WebSocket connection error");
    };

    ws.onclose = () => {
      setIsConnected(false);
      setIsStreaming(false);
    };

    wsRef.current = ws;

    // Cleanup on unmount or messageId change
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
      setIsConnected(false);
      setIsStreaming(false);
    };
  }, [messageId]); // Only depend on messageId

  return {
    isConnected,
    streamingTitle,
    isStreaming,
  };
}

export default useMessageSocket;
