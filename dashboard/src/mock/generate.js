module.exports = () => {
    const { faker } = require("@faker-js/faker");
    const _ = require("lodash");

    return {
        "door-events": {
            "events": _.times(500, (n) => {
                return {
                    timestamp: faker.date.recent({days: 30}),
                    eventType: n % 2 === 0 ? "open" : "close",
                }
            }),
        },
        "temperatures": _.times(100, (n) => {
            return {
                timestamp: faker.date.recent({ days: 30 }),
                value: faker.number.float({ min: -20, max: 70, precision: 0.001 }),
            }
        }),
    }
}