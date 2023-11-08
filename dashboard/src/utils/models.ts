export enum DoorEventType {
    Open = "open",
    Close = "close",
};

export type DoorEvent = {
    timestamp: string;
    eventType: DoorEventType;
};
