"use client";

import { Button, Card, Column, Heading, Row, Text } from "@once-ui-system/core";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const redirectDelayMs = 5000;

export default function DonateFailurePage() {
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
          <Heading variant="display-strong-m">Payment failed. Sad trombone.</Heading>
          <Text variant="heading-default-m" onBackground="neutral-weak" align="center">
            It happens! Redirecting you home in {secondsLeft} seconds.
          </Text>
          <Row gap="12" wrap horizontal="center">
            <Button href="/donate" variant="secondary">
              Try again
            </Button>
            <Button href="/" variant="primary">
              Go to home now
            </Button>
          </Row>
        </Column>
      </Card>
    </Column>
  );
}
