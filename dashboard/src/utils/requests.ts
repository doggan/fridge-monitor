import {RawDoorEvent, RawTempEvent} from "@/utils/models";

export type ResponseMetadata = {
    // Used for cursor-based pagination. Will be empty if there are no more pages.
    lastEvaluatedKey: string;
}

export type GetDoorEventsResponse = {
    events: RawDoorEvent[];
    responseMetadata: ResponseMetadata;
};

export type GetTemperatureEventsResponse = {
    events: RawTempEvent[];
    // totalResultsCount: number;
};