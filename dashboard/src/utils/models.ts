export enum DoorEventType {
    Open = "open",
    Close = "close",
}

export type RawDoorEvent = {
    timestamp: string;
    eventType: DoorEventType;
};

export type DoorOpenEvent = {
    // The time at which the door was initially opened.
    startTime: Date;
    // The time at which the door was finally closed.
    endTime: Date;
    // The length of time the door was open for.
    durationInMs: number;
}

export type DoorEventsResult = {
    // Raw door open/close events with timestamps (sorted).
    rawEvents: RawDoorEvent[];
    // Events describing the door open occurrences, built from the raw event data.
    openEvents: DoorOpenEvent[];
}

export type RawTempEvent = {
    timestamp: string;
    value: number;
};

export type TemperatureEventsResult = {
    // Raw temperature events with timestamps (sorted).
    rawEvents: RawTempEvent[];
}
