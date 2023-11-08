'use client';

import {Card, Grid, Text, Title} from "@tremor/react";
import useSWR from "swr";
import {GetDoorEventsResponse} from "@/utils/requests";
import {fetcher} from "@/utils/fetcher";
import {DoorEventsPerDay} from "@/components/door-events/door-events-per-day";
import {DoorEventsDurationPerDay} from "@/components/door-events/door-events-duration-per-day";
import {DoorEventsChart} from "@/components/door-events/door-events-chart";
import {useMemo} from "react";
import {DoorEvent, DoorEventType} from "@/utils/models";
import {DoorEventsDurationPerTime} from "@/components/door-events/door-events-duration-per-time";
import {CurrentTemp} from "@/components/temperature/current-temp";

export type OpenCloseEvent = {
    startTime: Date;
    endTime: Date;
    durationInMs: number;
}

type EventsStats = {
    events: DoorEvent[];
    openCloseEvents: OpenCloseEvent[];
}

/**
 * Build open/close events from the raw event data to match open/close pairs.
 * @param events The events sorted by increasing timestamp.
 */
const buildOpenCloseEvents = (events: DoorEvent[]) => {
    const results : OpenCloseEvent[] = [];

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

export default function Home() {
    const { data: eventsData, isLoading: isLoadingEvents } =
        useSWR<GetDoorEventsResponse>(
            `/door-events?${new URLSearchParams({
                deviceId: "123",
                startDate: "2023-10-",
            })}`,
            fetcher,
        );

    const eventsStats = useMemo<EventsStats>(() => {
        if (!eventsData) {
            return {
                events: [],
                openCloseEvents: [],
            };
        }

        // TODO: we're currently showing timestamps in user local time (server timestamps are UTC).
        // it might be better to show timestamps in local time of the source refrigerator, regardless
        // of the viewing user's local time.

        // Sort events by time.
        const sortedEvents = [...eventsData.events].sort((a, b) => {
            return a.timestamp.localeCompare(b.timestamp);
        });

        return {
            events: sortedEvents,
            openCloseEvents: buildOpenCloseEvents(sortedEvents),
        }
    }, [eventsData]);

    return (
        <main className={"p-12"}>
            <Title>Refrigerator Door Open / Close Events</Title>
            <Text>Data about the opening and closing of the fridge door.</Text>

            {/*<Card className="mt-6">*/}
            {/*    <div className="h-96" />*/}
            {/*</Card>*/}

            {/*/!* KPI section *!/*/}

            <Grid numItemsMd={2} numItemsLg={3} className="gap-6 mt-6">
                <Card>
                    {/* Placeholder to set height */}
                    {/*<div className="h-28" />*/}
                    <CurrentTemp />
                </Card>
                <Card>
                    {/* Placeholder to set height */}
                    <div className="h-28" />
                </Card>
                <Card>
                    {/* Placeholder to set height */}
                    <div className="h-28" />
                </Card>
            </Grid>


            <Card className={"mt-6"}>
                <DoorEventsChart isLoading={isLoadingEvents} events={eventsStats.events}/>
            </Card>
            <Grid numItemsMd={3} className="mt-6 gap-6">
                <Card>
                    {/* Placeholder to set height */}
                    {/*<div className="h-28" />*/}
                    <DoorEventsPerDay isLoading={isLoadingEvents} events={eventsStats.events} />
                </Card>
                <Card>
                    {/* Placeholder to set height */}
                    {/*<div className="h-28" />*/}
                    <DoorEventsDurationPerDay openCloseEvents={eventsStats.openCloseEvents} />
                </Card>
                <Card>
                    {/* Placeholder to set height */}
                    {/*<div className="h-28" />*/}
                    <DoorEventsDurationPerTime openCloseEvents={eventsStats.openCloseEvents} />
                </Card>
            </Grid>
        </main>
    );
}