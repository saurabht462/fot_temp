import { useCallback, useRef, useState } from 'react';

type WebSocketStatus = 'Disconnected' | 'Connecting' | 'Connected' | 'Error';

export function useWebSocket(url: string) {
    const ws = useRef<WebSocket | null>(null);
    const [wsStatus, setWsStatus] = useState<WebSocketStatus>('Disconnected');

    const connect = useCallback(() => {
        if (ws.current?.readyState === WebSocket.OPEN) {
            console.log('WebSocket already connected');
            return;
        }

        console.log('Connecting to WebSocket...');
        setWsStatus('Connecting');

        try {
            ws.current = new WebSocket(url);

            ws.current.onopen = () => {
                console.log('WebSocket connected');
                setWsStatus('Connected');
            };

            ws.current.onclose = () => {
                console.log('WebSocket disconnected');
                setWsStatus('Disconnected');
            };

            ws.current.onerror = (e) => {
                console.log('WebSocket error:', e);
                setWsStatus('Error');
            };

            ws.current.onmessage = (event) => {
                console.log('Message from server:', event.data);
                // Handle incoming messages if needed
            };
        } catch (error) {
            console.error('Failed to connect WebSocket:', error);
            setWsStatus('Error');
        }
    }, [url]);

    const disconnect = useCallback(() => {
        if (ws.current) {
            console.log('Disconnecting WebSocket...');
            ws.current.close();
            ws.current = null;
            setWsStatus('Disconnected');
        }
    }, []);

    const sendMessage = useCallback((data: any) => {
        if (ws.current?.readyState === WebSocket.OPEN) {
            try {
                const message = JSON.stringify(data);
                ws.current.send(message);
                console.log('Sent to WebSocket:', data);
            } catch (error) {
                console.error('Failed to send message:', error);
            }
        } else {
            console.warn('WebSocket not connected. Message not sent.');
        }
    }, []);

    return {
        wsStatus,
        connect,
        disconnect,
        sendMessage,
    };
}