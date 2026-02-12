"use client";

import { Badge, Button, Card, Column, Heading, Input, Row, Text } from "@once-ui-system/core";
import { useMemo, useState } from "react";
import styles from "./page.module.scss";
import DonationLeaderboard from "./DonationLeaderboard";

const tiers = [
  {
    amount: 3,
    title: "Adopt a pixel",
    description: "Keeps one pixel hydrated for a whole day.",
    badge: "Tiny hero",
  },
  {
    amount: 7,
    title: "Refill the caffeine",
    description: "Turns bug reports into bug apologies.",
    badge: "Caffeinated",
  },
  {
    amount: 12,
    title: "Boost the chaos",
    description: "Unlocks one extra feature and two extra tangents.",
    badge: "Plot twist",
  },
  {
    amount: 25,
    title: "Launch the rocket",
    description: "Funds a full sprint of shipping and celebration.",
    badge: "Main character",
  },
];

const perks = [
  {
    title: "The Hall of Mild Fame",
    description: "Your name appears in my heart. Also maybe in the code comments.",
  },
  {
    title: "Bug squashing morale",
    description: "Each donation scares one bug into behaving.",
  },
  {
    title: "Positive chaos energy",
    description: "A small spark that keeps experiments playful.",
  },
];

type DonateFormProps = {
  checkoutEndpoint?: string;
  donationLink?: string;
  currency?: string;
};

const defaultEndpoint = "/api/donations/checkout";

export default function DonateForm({
  checkoutEndpoint = defaultEndpoint,
  donationLink = "",
  currency = "inr",
}: DonateFormProps) {
  const [customAmount, setCustomAmount] = useState("15");
  const [email, setEmail] = useState("");
  const [pendingAmount, setPendingAmount] = useState<number | null>(null);
  const [error, setError] = useState("");

  const donationUrl = useMemo(() => donationLink.trim(), [donationLink]);

  const isEmailValid = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

  const startCheckout = async (amount: number) => {
    if (!Number.isFinite(amount) || amount <= 0) {
      setError("Pick a positive amount so the pixels can breathe.");
      return;
    }
    if (!email || !isEmailValid(email)) {
      setError("Add a valid email so the receipt knows where to land.");
      return;
    }

    setError("");
    setPendingAmount(amount);

    try {
      if (donationUrl) {
        const url = new URL(donationUrl, window.location.origin);
        const amountInPaise = Math.round(amount * 100);
        url.searchParams.set("amount", amountInPaise.toString());
        url.searchParams.set("email", email);
        url.searchParams.set("source", "donate");
        window.location.assign(url.toString());
        return;
      }

      const amountInPaise = Math.round(amount * 100);
      const response = await fetch(checkoutEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: amountInPaise, currency, email }),
      });

      if (!response.ok) {
        throw new Error("Checkout request failed.");
      }

      const data = await response.json();
      if (!data?.checkoutUrl) {
        throw new Error("Checkout link missing.");
      }

      window.location.assign(data.checkoutUrl);
    } catch (err) {
      setError("Checkout refused to cooperate. Please try again.");
    } finally {
      setPendingAmount(null);
    }
  };

  return (
    <Column gap="xl" fillWidth>
      <Column gap="m">
        <Row gap="12" vertical="center" wrap>
          <Heading variant="display-strong-s">Pick your mischief level</Heading>
          <Badge background="neutral-alpha-weak" onBackground="neutral-strong">
            Stripe ready
          </Badge>
        </Row>
        <Row className={styles.tierGrid} gap="16" s={{ direction: "column" }}>
          {tiers.map((tier) => (
            <Card
              key={tier.amount}
              padding="l"
              radius="l"
              background="surface"
              border="neutral-alpha-weak"
              className={styles.tierCard}
            >
              <Column gap="8">
                <Row horizontal="between" vertical="center">
                  <Heading variant="heading-strong-l">${tier.amount}</Heading>
                  <Badge background="accent-alpha-weak" onBackground="neutral-strong">
                    {tier.badge}
                  </Badge>
                </Row>
                <Text variant="heading-default-m">{tier.title}</Text>
                <Text variant="body-default-s" onBackground="neutral-weak">
                  {tier.description}
                </Text>
                <Button
                  size="m"
                  variant="secondary"
                  onClick={() => startCheckout(tier.amount)}
                  disabled={pendingAmount !== null}
                  className={styles.tierButton}
                >
                  {pendingAmount === tier.amount ? "Launching..." : "Donate"}
                </Button>
              </Column>
            </Card>
          ))}
        </Row>
      </Column>

      <Card
        padding="l"
        radius="l"
        background="surface"
        border="neutral-alpha-weak"
        className={styles.customCard}
        fillWidth
      >
        <Column gap="m">
          <Heading variant="heading-strong-l">Donation details</Heading>
          <Text variant="body-default-s" onBackground="neutral-weak">
            Email is required for the receipt and to show up on the leaderboard.
          </Text>
          <Row gap="12" className={styles.detailsRow} s={{ direction: "column" }} vertical="center">
            <Input
              type="number"
              min="1"
              value={customAmount}
              onChange={(event) => setCustomAmount(event.target.value)}
              placeholder="Amount in INR"
              aria-label="Custom donation amount"
            />
            <Input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              aria-label="Receipt email"
            />
            <Button
              size="m"
              onClick={() => startCheckout(Number(customAmount))}
              disabled={pendingAmount !== null}
              className={styles.customButton}
            >
              {pendingAmount ? "Preparing checkout..." : "Donate this amount"}
            </Button>
          </Row>
          {error && (
            <Text variant="body-default-s" onBackground="accent-weak">
              {error}
            </Text>
          )}
        </Column>
      </Card>

      <DonationLeaderboard />

      <Column gap="m">
        <Heading variant="display-strong-s">Perks of generosity</Heading>
        <Row className={styles.perkGrid} gap="16" s={{ direction: "column" }}>
          {perks.map((perk) => (
            <Card
              key={perk.title}
              padding="l"
              radius="l"
              background="surface"
              border="neutral-alpha-weak"
              className={styles.perkCard}
            >
              <Heading variant="heading-strong-m">{perk.title}</Heading>
              <Text variant="body-default-s" onBackground="neutral-weak">
                {perk.description}
              </Text>
            </Card>
          ))}
        </Row>
      </Column>
    </Column>
  );
}
