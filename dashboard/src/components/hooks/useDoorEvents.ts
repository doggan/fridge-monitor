import {GetDoorEventsResponse} from "@/utils/requests";
import {fetcher} from "@/utils/fetcher";
import {useEffect, useMemo, useState} from "react";
import {DoorEventsResult, DoorEventType, DoorOpenEvent, RawDoorEvent} from "@/utils/models";

const DEFAULT_LIMIT = 1000;

/**
 * Build open events from the raw event data to match open/close pairs.
 * @param events The events sorted by increasing timestamp.
 */
const buildOpenEvents = (events: RawDoorEvent[]) => {
    const results : DoorOpenEvent[] = [];

    const findNextOpenEventFromIndex = (startIndex: number) => {
        for (let i = startIndex; i < events.length; i++) {
            if (events[i].eventType === DoorEventType.Open) {
                return i;
            }
        }

        return -1;
    }

    let i = 0;
    while (i < events.length) {
        let openEventIndex = findNextOpenEventFromIndex(i);

        // No more open events.
        if (openEventIndex === -1) {
            break;
        }

        // Corresponding 'close' event should be the next event in the list.
        // If it's not, we have a data error where two 'open' events were potentially
        // received in succession, or an 'open' event is the last event in the list.
        let closeEventIndex = openEventIndex + 1;
        if (closeEventIndex < events.length &&
            events[closeEventIndex].eventType === DoorEventType.Close) {

            const startTime = new Date(events[openEventIndex].timestamp);
            const endTime = new Date(events[closeEventIndex].timestamp);
            results.push({
                startTime,
                endTime,
                durationInMs: endTime.getTime() - startTime.getTime(),
            });

            i = closeEventIndex + 1;
        } else {
            i = openEventIndex + 1;
        }
    }

    return results;
}

export const useDoorEvents = (isLoggedIn: boolean, deviceId: string, startDate: string, endDate: string) => {
    const [doorEvents, setDoorEvents] = useState<RawDoorEvent[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        let isMounted = true;

        const fetchDoorEvents = async (lastEvaluatedKey : string | null = null) => {
            setIsLoading(true);

            const params = new URLSearchParams({
                deviceId,
                startDate,
                endDate,
                limit: DEFAULT_LIMIT.toString(),
            });

            // Add cursor parameter for pagination.
            if (lastEvaluatedKey) {
                params.append('lastEvaluatedKey', lastEvaluatedKey);
            }

            try {
                const response = await fetcher(`/door-events?${params.toString()}`) as GetDoorEventsResponse;
                if (isMounted) {
                    setDoorEvents(prevEvents => [...prevEvents, ...response.events]);

                    // If there's more data, fetch next page.
                    if (response.responseMetadata && response.responseMetadata.lastEvaluatedKey) {
                        const cursor = response.responseMetadata.lastEvaluatedKey;
                        await fetchDoorEvents(cursor);
                    }
                }
            } catch (error) {
                console.error('Error fetching door events:', error);
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        };

        if (isLoggedIn) {
            fetchDoorEvents()
                .catch(console.error);
        }

        return () => {
            isMounted = false;
        };
    }, [isLoggedIn, deviceId, startDate, endDate]);

    const result = useMemo<DoorEventsResult>(() => {
        // TODO: we're currently showing timestamps in user local time (server timestamps are UTC).
        // it might be better to show timestamps in local time of the source refrigerator, regardless
        // of the viewing user's local time.

        // Sort events by time.
        const sortedEvents = [...doorEvents].sort((a, b) => {
            return a.timestamp.localeCompare(b.timestamp);
        });

        return {
            rawEvents: sortedEvents,
            openEvents: buildOpenEvents(sortedEvents),
        }
    }, [doorEvents]);

    return {
        isLoading,
        result,
    }
}
