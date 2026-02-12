"use client";

import { useEffect, useState } from "react";
import { Badge, Card, Column, Heading, Row, Text } from "@once-ui-system/core";
import styles from "./page.module.scss";

type LeaderboardEntry = {
  email: string | null;
  amount: number;
  currency: string;
  createdAt: string;
};

const colorPool = [
  "#ffd166",
  "#ef476f",
  "#06d6a0",
  "#118ab2",
  "#8338ec",
  "#ff7a00",
];

const hashString = (value: string) => {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash * 31 + value.charCodeAt(i)) % 100000;
  }
  return hash;
};

const formatAmount = (amount: number, currency: string) => {
  const normalized = currency.toLowerCase();
  const displayAmount = amount / 100;
  try {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: normalized.toUpperCase(),
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(displayAmount);
  } catch {
    return `${displayAmount} ${currency.toUpperCase()}`;
  }
};

const maskEmail = (email: string) => {
  const [name, domain] = email.split("@");
  if (!domain) {
    return email;
  }
  if (name.length <= 2) {
    return `${name[0]}*@${domain}`;
  }
  return `${name.slice(0, 2)}***@${domain}`;
};

export default function DonationLeaderboard() {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError("");

      try {
        const response = await fetch("/api/donations/leaderboard?limit=6");
        if (!response.ok) {
          throw new Error("Failed to load leaderboard.");
        }
        const data = await response.json();
        setEntries(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load leaderboard.");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const emptyState = !loading && entries.length === 0 && !error;

  return (
    <Card
      padding="l"
      radius="l"
      background="surface"
      border="neutral-alpha-weak"
      className={styles.leaderboardCard}
      fillWidth
    >
      <Column gap="m">
        <Row horizontal="between" vertical="center" wrap>
          <Heading variant="display-strong-s">Leaderboard of legends</Heading>
          <Badge background="accent-alpha-weak" onBackground="neutral-strong">
            Top 6 donors
          </Badge>
        </Row>
        {loading && (
          <Text variant="body-default-s" onBackground="neutral-weak">
            Loading heroic donors...
          </Text>
        )}
        {error && (
          <Text variant="body-default-s" onBackground="accent-weak">
            {error}
          </Text>
        )}
        {emptyState && (
          <Text variant="body-default-s" onBackground="neutral-weak">
            No donations yet. Be the first legend.
          </Text>
        )}
        {entries.length > 0 && (
          <Column gap="12">
            {entries.map((entry) => {
              const label = entry.email ?? "Anonymous donor";
              const displayEmail = entry.email ? maskEmail(entry.email) : "mystery human";
              const colorKey = entry.email ?? "anonymous";
              const color = colorPool[hashString(colorKey) % colorPool.length];
              const initials = entry.email ? entry.email[0]?.toUpperCase() : "A";

              return (
                <Row
                  key={`${entry.createdAt}-${label}`}
                  className={styles.leaderboardRow}
                  vertical="center"
                  horizontal="between"
                >
                  <Row gap="12" vertical="center">
                    <div className={styles.leaderboardAvatar} style={{ backgroundColor: color }}>
                      {initials}
                    </div>
                    <Column gap="2">
                      <Text variant="heading-default-m">{label}</Text>
                      <Text variant="body-default-xs" onBackground="neutral-weak">
                        {displayEmail}
                      </Text>
                    </Column>
                  </Row>
                  <Row gap="8" vertical="center">
                    <Text variant="heading-strong-m">
                      {formatAmount(entry.amount, entry.currency)}
                    </Text>
                  </Row>
                </Row>
              );
            })}
          </Column>
        )}
      </Column>
    </Card>
  );
}
