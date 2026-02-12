"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Column, Input, Row, Text } from "@once-ui-system/core";
import styles from "./AuthPanel.module.scss";

type AuthView = "login" | "signup" | "forgot" | "reset";

type AuthPanelProps = {
  onAuthenticated?: () => void;
  onClose?: () => void;
};

export default function AuthPanel({ onAuthenticated, onClose }: AuthPanelProps) {
  const router = useRouter();
  const [view, setView] = useState<AuthView>("login");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const resetFeedback = () => {
    setMessage("");
    setError("");
  };

  const switchView = (next: AuthView) => {
    resetFeedback();
    setView(next);
  };

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    resetFeedback();
    setLoading(true);

    try {
      const response = await fetch("/api/authenticate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        throw new Error(data?.message || "Authentication failed.");
      }

      router.refresh();
      onAuthenticated?.();
      onClose?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Network error.");
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (event: React.FormEvent) => {
    event.preventDefault();
    resetFeedback();
    setLoading(true);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        throw new Error(data?.message || "Registration failed.");
      }

      setMessage("Account created. Please sign in.");
      setView("login");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Network error.");
    } finally {
      setLoading(false);
    }
  };

  const handleForgot = async (event: React.FormEvent) => {
    event.preventDefault();
    resetFeedback();
    setLoading(true);

    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        throw new Error(data?.message || "Request failed.");
      }

      const data = await response.json().catch(() => ({}));
      if (data?.resetToken) {
        setResetToken(data.resetToken);
        setMessage("Token generated. Paste it below to reset.");
        setView("reset");
      } else {
        setMessage("If that email exists, a reset token was generated.");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Network error.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async (event: React.FormEvent) => {
    event.preventDefault();
    resetFeedback();
    setLoading(true);

    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: resetToken, newPassword }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        throw new Error(data?.message || "Reset failed.");
      }

      setMessage("Password reset. Please sign in.");
      setView("login");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Network error.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Column gap="12" className={styles.panel}>
      <Row gap="8" className={styles.tabs}>
        <Button
          size="s"
          variant="secondary"
          className={view === "login" ? styles.tabActive : styles.tabButton}
          onClick={() => switchView("login")}
        >
          Login
        </Button>
        <Button
          size="s"
          variant="secondary"
          className={view === "signup" ? styles.tabActive : styles.tabButton}
          onClick={() => switchView("signup")}
        >
          Sign up
        </Button>
      </Row>

      {view === "login" && (
        <form onSubmit={handleLogin} className={styles.form}>
          <Column gap="8">
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
            <Button type="submit" loading={loading} variant="primary" fillWidth>
              Sign in
            </Button>
          </Column>
        </form>
      )}

      {view === "signup" && (
        <form onSubmit={handleSignup} className={styles.form}>
          <Column gap="8">
            <Input
              type="text"
              placeholder="Full name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              required
            />
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
            <Button type="submit" loading={loading} variant="primary" fillWidth>
              Create account
            </Button>
          </Column>
        </form>
      )}

      {view === "forgot" && (
        <form onSubmit={handleForgot} className={styles.form}>
          <Column gap="8">
            <Input
              type="email"
              placeholder="Email for reset"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
            <Button type="submit" loading={loading} variant="primary" fillWidth>
              Send reset token
            </Button>
            <Button
              type="button"
              variant="secondary"
              size="s"
              className={styles.linkButton}
              onClick={() => switchView("reset")}
            >
              I already have a token
            </Button>
          </Column>
        </form>
      )}

      {view === "reset" && (
        <form onSubmit={handleReset} className={styles.form}>
          <Column gap="8">
            <Input
              type="text"
              placeholder="Reset token"
              value={resetToken}
              onChange={(event) => setResetToken(event.target.value)}
              required
            />
            <Input
              type="password"
              placeholder="New password"
              value={newPassword}
              onChange={(event) => setNewPassword(event.target.value)}
              required
            />
            <Button type="submit" loading={loading} variant="primary" fillWidth>
              Reset password
            </Button>
          </Column>
        </form>
      )}

      {(view === "login" || view === "signup") && (
        <Row horizontal="between" className={styles.footerRow}>
          <Button
            size="s"
            variant="secondary"
            className={styles.linkButton}
            onClick={() => switchView("forgot")}
          >
            Forgot password?
          </Button>
          <Button size="s" variant="secondary" className={styles.linkButton} onClick={onClose}>
            Close
          </Button>
        </Row>
      )}

      {(view === "forgot" || view === "reset") && (
        <Row horizontal="between" className={styles.footerRow}>
          <Button
            size="s"
            variant="secondary"
            className={styles.linkButton}
            onClick={() => switchView("login")}
          >
            Back to login
          </Button>
          <Button size="s" variant="secondary" className={styles.linkButton} onClick={onClose}>
            Close
          </Button>
        </Row>
      )}

      {message && (
        <Text variant="body-default-s" onBackground="neutral-weak">
          {message}
        </Text>
      )}
      {error && (
        <Text variant="body-default-s" onBackground="accent-weak">
          {error}
        </Text>
      )}
    </Column>
  );
}
