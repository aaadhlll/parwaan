"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Column, Row, Input, Button, Text } from "@once-ui-system/core";

type LoginFormProps = {
  onSuccess?: () => void;
  layout?: "row" | "column";
};

export default function LoginForm({ onSuccess, layout = "row" }: LoginFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const isColumn = layout === "column";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/authenticate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (res.ok) {
        // refresh the server component to render full content
        router.refresh();
        onSuccess?.();
      } else {
        const body = await res.json();
        setError(body?.message || "Authentication failed");
      }
    } catch (err) {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} style={isColumn ? { width: "100%" } : undefined}>
      {isColumn ? (
        <Column gap="8">
          <Input
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setEmail(e.target.value)
            }
            required
            style={{ width: "100%" }}
          />
          <Input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setPassword(e.target.value)
            }
            required
            style={{ width: "100%" }}
          />
          <Button type="submit" loading={loading} variant="primary" fillWidth>
            Sign in
          </Button>
        </Column>
      ) : (
        <Row gap="8" vertical="center">
          <Input
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setEmail(e.target.value)
            }
            required
          />
          <Input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setPassword(e.target.value)
            }
            required
          />
          <Button type="submit" loading={loading} variant="primary">
            Sign in
          </Button>
        </Row>
      )}
      {error && (
        <Row marginTop="8">
          <Text onBackground="neutral-weak">{error}</Text>
        </Row>
      )}
    </form>
  );
}
