import {Metric, Text, Title} from "@tremor/react";
import {DoorEventType, RawDoorEvent} from "@/utils/models";
import {timeAgo} from "@/utils/time";

interface DoorLastOpenedProps {
    isLoading: boolean;
    latestEvent?: RawDoorEvent;
}

export function DoorLastOpened({ isLoading, latestEvent }: DoorLastOpenedProps) {
    const lastOpened = () => {
        if (!latestEvent) {
            return null;
        }

        // The door is already open...
        if (latestEvent.eventType === DoorEventType.Open) {
            return <>-</>;
        }

        return (
            <>
                <Metric>{timeAgo(new Date(latestEvent.timestamp))}</Metric>
                <Text>{new Date(latestEvent.timestamp).toLocaleString()}</Text>
            </>
        )
    }

    return (
        <>
            <Title>Door Last Opened</Title>
            {isLoading && (
                <Text>Loading...</Text>
            )}
            {!isLoading && (latestEvent ?
                lastOpened() : <Text>No data</Text>
            )}
        </>
    )
}