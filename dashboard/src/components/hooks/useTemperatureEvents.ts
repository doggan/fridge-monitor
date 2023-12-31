import useSWR from "swr";
import {GetTemperatureEventsResponse} from "@/utils/requests";
import {fetcher} from "@/utils/fetcher";
import {useMemo} from "react";
import {TemperatureEventsResult} from "@/utils/models";

export const useTemperatureEvents = (isLoggedIn: boolean, deviceId: string, startDate: string, endDate: string) => {
    const { data, isLoading } =
        useSWR<GetTemperatureEventsResponse>(
            isLoggedIn ?
                `/temperature-events?${new URLSearchParams({
                    deviceId,
                    startDate,
                    endDate,
                })}` :
                null,
            fetcher,
        );

    const result = useMemo<TemperatureEventsResult>(() => {
        if (!data) {
            return {
                rawEvents: [],
            };
        }

        // TODO: we're currently showing timestamps in user local time (server timestamps are UTC).
        // it might be better to show timestamps in local time of the source refrigerator, regardless
        // of the viewing user's local time.

        // Sort events by time.
        let sortedEvents = [...data.events].sort((a, b) => {
            return a.timestamp.localeCompare(b.timestamp);
        });

        sortedEvents = sortedEvents.map(e => {
            return {
                ...e,
                // API values may be returned as strings, so force casting here.
                value: Number(e.value),
            }
        });

        return {
            rawEvents: sortedEvents,
        }
    }, [data]);

    return {
        isLoading,
        result,
    }
}
