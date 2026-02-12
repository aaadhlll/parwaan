"use client";

import { Button, Card, Column, Heading, Row, Text } from "@once-ui-system/core";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const redirectDelayMs = 5000;

export default function DonateSuccessPage() {
  const router = useRouter();
  const [secondsLeft, setSecondsLeft] = useState(5);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      router.push("/");
    }, redirectDelayMs);

    return () => window.clearTimeout(timer);
  }, [router]);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setSecondsLeft((prev) => (prev > 1 ? prev - 1 : 1));
    }, 1000);

    return () => window.clearInterval(interval);
  }, []);

  return (
    <Column maxWidth="s" gap="xl" paddingY="12" horizontal="center">
      <Card
        padding="xl"
        radius="l"
        background="surface"
        border="neutral-alpha-weak"
        shadow="l"
        fillWidth
      >
        <Column gap="m" align="center" horizontal="center">
          <Heading variant="display-strong-m">Donation received. Chaos fueled.</Heading>
          <Text variant="heading-default-m" onBackground="neutral-weak" align="center">
            Thank you for the boost! Redirecting you home in {secondsLeft} seconds.
          </Text>
          <Row gap="12" wrap horizontal="center">
            <Button href="/" variant="secondary">
              Go to home now
            </Button>
            <Button href="/donate" variant="primary">
              Donate again
            </Button>
          </Row>
        </Column>
      </Card>
    </Column>
  );
}
