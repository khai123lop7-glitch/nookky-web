import assert from "node:assert/strict";
import test from "node:test";
import { quotePromotion } from "../promotions.ts";

test("normalizes codes and caps percentage discounts", () => {
  const quote = quotePromotion(2_000_000, " nookky10 ");
  assert.equal(quote.promotion?.code, "NOOKKY10");
  assert.equal(quote.discountAmount, 150_000);
  assert.equal(quote.shippingFee, 0);
  assert.equal(quote.total, 1_850_000);
});

test("rejects promotions below their minimum order", () => {
  const quote = quotePromotion(400_000, "NOOKKY10");
  assert.equal(quote.promotion, null);
  assert.equal(quote.discountAmount, 0);
  assert.equal(quote.shippingFee, 30_000);
  assert.match(quote.error || "", /500\.000/);
});

test("applies fixed and free-shipping promotions", () => {
  const fixed = quotePromotion(899_000, "KYUC50K");
  assert.equal(fixed.discountAmount, 50_000);
  assert.equal(fixed.total, 879_000);

  const freeShipping = quotePromotion(899_000, "FREESHIP");
  assert.equal(freeShipping.discountAmount, 0);
  assert.equal(freeShipping.shippingFee, 0);
  assert.equal(freeShipping.total, 899_000);
});

test("does not grant shipping or discounts to an empty cart or unknown code", () => {
  assert.equal(quotePromotion(0, "FREESHIP").isFreeShipping, false);
  assert.equal(quotePromotion(899_000, "FAKE").total, 929_000);
});
