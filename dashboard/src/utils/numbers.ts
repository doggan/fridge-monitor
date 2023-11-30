export const round = (num: number, fractionDigits: number): number => {
    return Number(num.toFixed(fractionDigits));
}
export const cToF = (degrees: number) => 1.8 * degrees + 32;

export const fToC = (degrees: number) => (degrees - 32) * 5 / 9;

