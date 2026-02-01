"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Row, Text } from "@once-ui-system/core";

type LogoutButtonProps = {
  onSuccess?: () => void;
};

export default function LogoutButton({ onSuccess }: LogoutButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogout = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/logout", { method: "POST" });
      if (!res.ok) {
        setError("Logout failed");
        return;
      }
      router.refresh();
      onSuccess?.();
    } catch {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Row gap="8" vertical="center">
      <Button variant="secondary" size="s" onClick={handleLogout} loading={loading}>
        Logout
      </Button>
      {error && <Text onBackground="neutral-weak">{error}</Text>}
    </Row>
  );
}
