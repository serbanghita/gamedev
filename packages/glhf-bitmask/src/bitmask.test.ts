import {addBit, removeBit, toggleAllBits, toggleBit} from "./bitmask";

const FIRST = 1n << 0n;
const SECOND = 1n << 1n;
const THIRD = 1n << 2n;
const FOURTH = 1n << 4n;
const FIFTH = 1n << 6n;
const FIFTY_TWO = 1n << 52n; // 53 bits - the limit of the number in JS
const FIFTY_THREE = 1n << 53n;

function getBinStr(n: number | bigint) {
    return n.toString(2);
}

test('addBit', () => {
    expect(getBinStr(addBit(0n, FIRST))).toEqual(getBinStr(0b1));
    expect(getBinStr(addBit(0n, SECOND))).toEqual(getBinStr(0b10));
    expect(getBinStr(addBit(1n, FIFTY_TWO))).toEqual(getBinStr(0b10000000000000000000000000000000000000000000000000001));
    expect(getBinStr(addBit(1n, FIFTY_THREE))).not.toEqual(0b100000000000000000000000000000000000000000000000000001);
    expect(getBinStr(addBit(1n, FIFTY_THREE))).toEqual('100000000000000000000000000000000000000000000000000001');
});

test('toggleBit', () => {
    expect(toggleBit(0n, 0n)).toEqual(0n);
    expect(toggleBit(0n, 1n)).toEqual(1n);
    expect(toggleBit(1n, 1n)).toEqual(0n);
    expect(toggleBit(100n, 100n)).toEqual(0n);
    expect(toggleBit(100n, 1n)).toEqual(101n);
    expect(toggleBit(100n, 10n)).toEqual(110n);
    expect(toggleBit(111n, 1n)).toEqual(110n);
    expect(toggleBit(111n, 10n)).toEqual(101n);
    expect(toggleBit(111n, 100n)).toEqual(11n);
    expect(toggleBit((1n << 32n), 100n)).toEqual((1n << 32n) | 100n);
    expect(toggleBit((1n << 32n)  | 100n, 100n)).toEqual(1n << 32n);
});

test('removeBit', () => {
    expect(removeBit(0n, 0n)).toEqual(0n);
    expect(removeBit(0n, 1n)).toEqual(0n);
    expect(removeBit(1n, 1n)).toEqual(0n);
    expect(removeBit(100n, 100n)).toEqual(0n);
    expect(removeBit(100n, 1n)).toEqual(100n);
    expect(removeBit(100n, 10n)).toEqual(100n);
    expect(removeBit(111n, 1n)).toEqual(110n);
    expect(removeBit(111n, 10n)).toEqual(101n);
    expect(removeBit(111n, 100n)).toEqual(11n);
    // '100000000000000000000000000000000' +
    // '000000000000000000000000000001010' =
    // '100000000000000000000000000001010'
    // removeBit('100000000000000000000000000001010', '1010') =
    // '100000000000000000000000000000000'
    expect(removeBit((1n << 32n) | 100n, 100n)).toEqual((1n << 32n));
    expect(removeBit((1n << 32n), 100n)).toEqual((1n << 32n));
});

test('toggleAllBits', () => {
    // '111101' (61) --> '10' (2)
    expect(toggleAllBits(0b111101)).toEqual(0b10);
    // '1100101' (101n) --> '11010' (26n)
    expect(toggleAllBits(101n)).toEqual(26n);
});