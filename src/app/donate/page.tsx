import { Badge, Column, Heading, Line, Meta, RevealFx, Row, Schema, Text } from "@once-ui-system/core";
import { baseURL, person } from "@/resources";
import DonateForm from "./DonateForm";
import styles from "./page.module.scss";

const donateMeta = {
  title: "Donate | Fuel the Chaos",
  description: "A playful, shamelessly fun donation page for friendly humans and generous robots.",
  path: "/donate",
};

export async function generateMetadata() {
  return Meta.generate({
    title: donateMeta.title,
    description: donateMeta.description,
    baseURL: baseURL,
    path: donateMeta.path,
    image: `/api/og/generate?title=${encodeURIComponent(donateMeta.title)}`,
  });
}

export default function DonatePage() {
  const donationLink = process.env.NEXT_PUBLIC_STRIPE_DONATION_LINK ?? "";
  const checkoutEndpoint = process.env.NEXT_PUBLIC_STRIPE_CHECKOUT_ENDPOINT ?? undefined;
  const currency = process.env.NEXT_PUBLIC_DONATION_CURRENCY ?? "inr";

  return (
    <Column maxWidth="m" gap="xl" paddingY="12" className={styles.page}>
      <Schema
        as="webPage"
        baseURL={baseURL}
        path={donateMeta.path}
        title={donateMeta.title}
        description={donateMeta.description}
        image={`/api/og/generate?title=${encodeURIComponent(donateMeta.title)}`}
        author={{
          name: person.name,
          url: `${baseURL}${donateMeta.path}`,
          image: `${baseURL}${person.avatar}`,
        }}
      />
      <RevealFx translateY="6px">
        <Column
          fillWidth
          padding="xl"
          radius="l"
          background="surface"
          border="neutral-alpha-weak"
          className={styles.hero}
        >
          <Row className={styles.heroGrid} gap="xl" s={{ direction: "column" }}>
            <Column gap="m" maxWidth="s">
              <Row gap="8" wrap>
                <Badge background="brand-alpha-weak" onBackground="neutral-strong">
                  Operation: Keep The Lights On
                </Badge>
                <Badge background="accent-alpha-weak" onBackground="neutral-strong">
                  100% goof-powered
                </Badge>
              </Row>
              <Heading variant="display-strong-l">Fuel the chaos. Save a dev from instant noodles.</Heading>
              <Text variant="heading-default-l" onBackground="neutral-weak">
                Your donation powers late-night experiments, suspiciously optimistic roadmaps, and
                a steady supply of keyboard snacks. No capes, just caffeine.
              </Text>
              <Row gap="12" vertical="center" className={styles.heroStatRow}>
                <div className={styles.heroStat}>
                  <Text variant="heading-strong-xl">$</Text>
                  <Text variant="body-default-s" onBackground="neutral-weak">
                    Funds tiny victories
                  </Text>
                </div>
                <Line background="neutral-alpha-weak" vert height="48" />
                <div className={styles.heroStat}>
                  <Text variant="heading-strong-xl">24/7</Text>
                  <Text variant="body-default-s" onBackground="neutral-weak">
                    Bug-whispering hours
                  </Text>
                </div>
              </Row>
              <Text variant="body-default-s" onBackground="neutral-weak" className={styles.heroNote}>
                Donate once, brag forever. Mild bragging encouraged.
              </Text>
            </Column>
            <Column className={styles.jarWrap} vertical="center">
              <div className={styles.jarStage}>
                <div className={styles.coinRain}>
                  <span className={styles.dropCoin} />
                  <span className={styles.dropCoin} />
                  <span className={styles.dropCoin} />
                  <span className={styles.dropCoin} />
                  <span className={styles.dropCoin} />
                  <span className={styles.dropCoin} />
                  <span className={styles.dropCoin} />
                  <span className={styles.dropCoin} />
                </div>
                <div className={styles.jar}>
                <span className={`${styles.coin} ${styles.coinOne}`} />
                <span className={`${styles.coin} ${styles.coinTwo}`} />
                <span className={`${styles.coin} ${styles.coinThree}`} />
                <span className={`${styles.coin} ${styles.coinFour}`} />
                </div>
              </div>
              <Text variant="body-default-s" onBackground="neutral-weak" className={styles.jarCaption}>
                The official jar of questionable ideas.
              </Text>
            </Column>
          </Row>
        </Column>
      </RevealFx>

      <DonateForm
        donationLink={donationLink}
        checkoutEndpoint={checkoutEndpoint}
        currency={currency}
      />
    </Column>
  );
}
