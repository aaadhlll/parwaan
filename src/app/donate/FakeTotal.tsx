"use client";

import { useEffect, useState } from "react";
import { Text } from "@once-ui-system/core";

const formatMoney = (value: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);

export default function FakeTotal() {
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const min = 65000;
    const max = 180000;
    const next = Math.floor(Math.random() * (max - min + 1)) + min;
    setTotal(next);
  }, []);

  return (
    <Text variant="heading-strong-xl" onBackground="neutral-strong">
      {total ? formatMoney(total) : "₹—"}
    </Text>
  );
}
