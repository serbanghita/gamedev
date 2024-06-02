"use strict";
(() => {
  // src/bitmask.ts
  function addBit(bitmasks, bit) {
    bitmasks |= bit;
    return bitmasks;
  }
  function toggleBit(bitmasks, bit) {
    bitmasks ^= bit;
    return bitmasks;
  }
  function removeBit(bitmasks, bit) {
    bitmasks &= ~bit;
    return bitmasks;
  }
  function hasBit(bitmasks, bit) {
    return (bitmasks & bit) === bit;
  }
  function hasAnyOfBits(bitmask, bits) {
    return (bitmask & bits) !== 0n;
  }
  function toggleAllBits(bitmask) {
    const oneBit = typeof bitmask === "bigint" ? 1n : 1;
    let start = oneBit;
    while (start <= bitmask) {
      bitmask ^= start;
      start = start << oneBit;
    }
    return bitmask;
  }
})();
