export class UnreachableCaseError extends Error {
    constructor(val: never | undefined) {
        super(`Unreachable case: ${JSON.stringify(val)}`);
    }
}
