module.exports = () => {
    const { faker } = require("@faker-js/faker");
    const _ = require("lodash");

    // TODO: consider handling startDate/endDate query params when generating data

    return {
        "door-events": {
            "events": _.times(500, (n) => {
                return {
                    timestamp: faker.date.recent({days: 30}),
                    eventType: n % 2 === 0 ? "open" : "close",
                }
            }),
        },
        "temperatures": {
            "events": _.times(100, (n) => {
                return {
                    timestamp: faker.date.recent({days: 30}),
                    value: faker.number.float({min: 1.5, max: 7.2, precision: 0.001}),
                }
            }),
        }
    }
}