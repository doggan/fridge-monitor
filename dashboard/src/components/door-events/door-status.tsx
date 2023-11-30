import {Metric, Text, Title} from "@tremor/react";
import {DoorEventType, RawDoorEvent} from "@/utils/models";
import {UnreachableCaseError} from "@/utils/unreachableError";
import {timeAgo} from "@/utils/time";

interface DoorStatusProps {
    isLoading: boolean;
    latestEvent?: RawDoorEvent;
}

const doorEventTypeToString = (eventType: DoorEventType) => {
    switch (eventType) {
        case DoorEventType.Open: return "Open";
        case DoorEventType.Close: return "Closed";
        default:
            throw new UnreachableCaseError(eventType);
    }
}

const getDoorStatusColor = (eventType: DoorEventType) => {
    switch (eventType) {
        case DoorEventType.Open: return "text-red-700";
        case DoorEventType.Close: return "";
        default:
            throw new UnreachableCaseError(eventType);
    }
}

export function DoorStatus({ isLoading, latestEvent }: DoorStatusProps) {
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
            <Title>Door Status</Title>
            {isLoading && (
                <Text>Loading...</Text>
            )}
            {!isLoading && (latestEvent ?
                <Metric>
                    <span className={getDoorStatusColor(latestEvent.eventType)}>
                        {doorEventTypeToString(latestEvent.eventType)}
                    </span>
                </Metric> :
                <Text>No data</Text>
            )}
        </>
    )
}