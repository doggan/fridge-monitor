import {Metric, Text, Title} from "@tremor/react";
import {cToF, round} from "@/utils/numbers";
import {timeAgo} from "@/utils/time";

interface CurrentTempProps {
    // Temperature value in celsius.
    degreesInC: number;
    // Timestamp of the last temperature update.
    timestamp: Date;
}

export function CurrentTemp({ degreesInC, timestamp } : CurrentTempProps) {
    return (
        <>
            <Metric>
                <span className={"text-blue-500"}>
                    {round(cToF(degreesInC), 1)}&deg;F ({round(degreesInC, 1)}&deg;C)
                </span>
            </Metric>
            <Text>Last updated: {timeAgo(timestamp)}</Text>
            <Text>({timestamp.toLocaleString()})</Text>
        </>
    )
}