'use client';

import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { getSession } from "next-auth/react";
import { useMe } from "@/services/users/getMe";

export const useAppGatewaySubscription = () => {
  const [token, setToken] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  const { data: me } = useMe();

  const socket = useRef<Socket | null>(null);

  useEffect(() => {
    (async () => {
      const session = await getSession();

      if (session) {
        setToken(session.accessToken);
      }
    })();
  }, []);

  useEffect(() => {
    if (token && !socket.current) {
      socket.current = io(process.env.NEXT_PUBLIC_APP_GATEWAY ?? '', {
        auth: {
          token: `Bearer ${token}`,
        },
      });

      socket.current.on('connect', () => {
        console.log('Socket connected');
        setIsConnected(true);
      });

      socket.current.on('disconnect', () => {
        console.log('Socket disconnected');
        setIsConnected(false);
      });
    }
  }, [me?.id, token]);

  return {
    isConnected,
  };
};
