import { useEffect, useRef, useState } from "react";

interface TitleChunkMessage {
  type: "title_chunk";
  chunk: string;
  is_complete: boolean;
}

interface TitleErrorMessage {
  type: "title_error";
  error: string;
}

type SocketMessage = TitleChunkMessage | TitleErrorMessage;

interface UseCanvasSocketOptions {
  canvasId: string | null;
  onTitleChunk?: (chunk: string) => void;
  onTitleComplete?: (fullTitle: string) => void;
  onError?: (error: string) => void;
}

interface UseCanvasSocketReturn {
  isConnected: boolean;
  streamingTitle: string;
  isStreaming: boolean;
}

export function useCanvasSocket({
  canvasId,
  onTitleChunk,
  onTitleComplete,
  onError,
}: UseCanvasSocketOptions): UseCanvasSocketReturn {
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
    if (!canvasId) return;

    // Determine WebSocket URL based on current location
    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const host = window.location.host;

    // In development, the API might be on a different port
    const apiHost = import.meta.env.VITE_API_URL
      ? new URL(import.meta.env.VITE_API_URL).host
      : host;

    const url = `${protocol}//${apiHost}/api/v1/ws/canvas/${canvasId}`;

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

        if (message.type === "title_chunk") {
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
        } else if (message.type === "title_error") {
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

    // Cleanup on unmount or canvasId change
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
      setIsConnected(false);
      setIsStreaming(false);
    };
  }, [canvasId]); // Only depend on canvasId

  return {
    isConnected,
    streamingTitle,
    isStreaming,
  };
}

export default useCanvasSocket;
