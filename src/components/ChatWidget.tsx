"use client";

import React, { useEffect, useRef, useState } from "react";
import { Button, Card, Column, Input, Row, Text } from "@once-ui-system/core";
import styles from "./ChatWidget.module.scss";

type Message = {
  role: "assistant" | "user";
  text: string;
};

const initialMessages: Message[] = [
  {
    role: "assistant",
    text: "Hi! Ask me about the site or the blog, and I will help.",
  },
];

type ChatWidgetProps = {
  isAuthenticated: boolean;
};

export const ChatWidget: React.FC<ChatWidgetProps> = ({ isAuthenticated }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [sessionId] = useState<string>(() =>
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `session-${Date.now()}`
  );
  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, isOpen]);

  const sendMessage = async () => {
    const trimmed = input.trim();
    if (!trimmed) return;

    setMessages((prev) => [...prev, { role: "user", text: trimmed }]);
    setInput("");
    setIsSending(true);

    try {
      const res = await fetch("http://localhost:8080/api/chat/query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: trimmed, sessionId }),
      });

      if (!res.ok) {
        throw new Error("Request failed");
      }

      const raw = await res.text();
      let data: any = null;

      try {
        data = JSON.parse(raw);
      } catch (err) {
        data = null;
      }

      const reply =
        data?.answer ||
        data?.response ||
        data?.message ||
        data?.reply ||
        data?.content ||
        data?.data ||
        (typeof raw === "string" && raw.trim().length > 0 ? raw : "") ||
        "Sorry, I could not read the response.";

      setMessages((prev) => [...prev, { role: "assistant", text: reply }]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: "Sorry, I could not reach the chat service. Please try again.",
        },
      ]);
    } finally {
      setIsSending(false);
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <Column className={styles.chatWidget} data-open={isOpen}>
      {isOpen ? (
        <Card
          padding="16"
          radius="l"
          background="surface"
          border="neutral-alpha-weak"
          shadow="l"
          className={styles.panel}
        >
          <Row
            fillWidth
            vertical="center"
            horizontal="start"
            marginBottom="12"
            className={styles.header}
          >
            <Column gap="4">
              <Text variant="label-strong-m">Chat with me</Text>
              <Text variant="body-default-xs" onBackground="neutral-weak">
                Ask anything. We respond fast.
              </Text>
            </Column>
            <Button
              variant="tertiary"
              size="s"
              onClick={() => setIsOpen(false)}
              className={styles.minimizeButton}
            >
              Close
            </Button>
          </Row>
          <Column ref={scrollRef} gap="8" className={styles.messages}>
            {messages.map((message, index) => (
              <Row
                key={`${message.role}-${index}`}
                className={styles.messageRow}
                data-role={message.role}
              >
                <Text
                  variant="body-default-s"
                  onBackground={message.role === "user" ? "brand-weak" : "neutral-weak"}
                  className={styles.message}
                  data-role={message.role}
                >
                  {message.text}
                </Text>
              </Row>
            ))}
            {isSending && (
              <Row className={styles.messageRow} data-role="assistant">
                <Text
                  variant="body-default-s"
                  onBackground="neutral-weak"
                  className={styles.message}
                  data-role="assistant"
                >
                  <span className={styles.typingDot} />
                  <span className={styles.typingDot} />
                  <span className={styles.typingDot} />
                </Text>
              </Row>
            )}
          </Column>
          <Row
            as="form"
            marginTop="12"
            gap="8"
            onSubmit={(e) => e.preventDefault()}
            className={styles.composer}
          >
            <Input
              className={styles.input}
              placeholder="Type a message"
              value={input}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInput(e.target.value)}
              onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  if (!isSending) {
                    sendMessage();
                  }
                }
              }}
              disabled={isSending}
            />
            <Button variant="primary" size="s" onClick={sendMessage} loading={isSending}>
              {isSending ? "Sending" : "Send"}
            </Button>
          </Row>
        </Card>
      ) : (
        <Button
          variant="primary"
          size="s"
          onClick={() => setIsOpen(true)}
          className={styles.minimizedButton}
        >
          Chat
        </Button>
      )}
    </Column>
  );
};
