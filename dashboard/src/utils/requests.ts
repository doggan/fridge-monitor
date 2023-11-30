import {RawDoorEvent, RawTempEvent} from "@/utils/models";

export type GetDoorEventsResponse = {
    events: RawDoorEvent[];
    // totalResultsCount: number;
};

export type GetTemperatureEventsResponse = {
    events: RawTempEvent[];
    // totalResultsCount: number;
};