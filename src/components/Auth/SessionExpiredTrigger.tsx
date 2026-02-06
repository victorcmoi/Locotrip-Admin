'use client';

import { useEffect } from "react";
import { useAuth } from "./AuthHandler";

export default function SessionExpiredTrigger() {
  const { showSessionExpired } = useAuth();

  useEffect(() => {
    showSessionExpired();
  }, [showSessionExpired]);

  return null;
}
