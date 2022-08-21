/**
 * Doom soundtrack: https://music.youtube.com/watch?v=cixW6rogZ48
 * Bitmask - why, how and when: https://alemil.com/bitmask
 * BigInt: arbitrary-precision integers in JavaScript https://v8.dev/features/bigint
 * Bit, Byte, and Binary: https://www.cs.cmu.edu/~fgandon/documents/lecture/uk1999/binary/HandOut.pdf
 */

/**
 * Add bit(s) to the bitmask.
 *
 *
 *
 * @param bitmasks
 * @param bit
 */
export function addBit(bitmasks: bigint, bit: bigint): bigint {
    bitmasks |= bit;
    return bitmasks;
}

/**
 * Toggle **existing** or **non-existing** bit(s) from the bitmask.
 *
 * Bitwise XOR (^)
 * The bitwise XOR operator (^) returns a 1 in each bit position for which the corresponding bits
 * of either but not both operands are 1s.
 * @see: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Bitwise_XOR
 *
 * @param bitmasks
 * @param bit
 */
export function toggleBit(bitmasks: bigint, bit: bigint): bigint {
    bitmasks ^= bit;
    return bitmasks;
}

/**
 * Remove **existing** or **non-existing** bit(s) from the bitmask.
 *
 * Bitwise AND (&)
 * The bitwise AND operator (&) returns a 1 in each bit position for which the corresponding bits
 * of both operands are 1s.
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Bitwise_AND
 *
 * @param bitmasks
 * @param bit
 */
export function removeBit(bitmasks: bigint, bit: bigint): bigint {
    bitmasks &= ~bit;
    return bitmasks;
}

// https://github.com/microsoft/TypeScript/issues/42125

type Bitmask = number | bigint;

export function toggleAllBits(bitmask: any): Bitmask {
    const oneBit = (typeof bitmask === "bigint" ? 1n : 1) as typeof bitmask;
    let start = oneBit;
    while(start <= bitmask) {
        bitmask ^= start;
        start = start << oneBit;
    }
    return bitmask;
}