import {Metric, Text, Title} from "@tremor/react";
import {cToF, round} from "@/utils/numbers";
import {timeAgo} from "@/utils/time";
import {RawTempEvent} from "@/utils/models";

interface CurrentTempProps {
    isLoading: boolean;
    latestEvent?: RawTempEvent;
}

export function CurrentTemp({isLoading, latestEvent}: CurrentTempProps) {
    const degreesInC = latestEvent ? latestEvent.value : 0;
    const timestamp = latestEvent ? new Date(latestEvent.timestamp) : new Date();

    return (
        <>
            <Title>Current Temperature</Title>
            {isLoading && (
                <Text>Loading...</Text>
            )}
            {!isLoading && (latestEvent ?
                    <>
                        <Metric>
                            <span className={"text-blue-500"}>
                                <span>{round(cToF(degreesInC), 1)}&deg;F </span><span className={"text-lg"}>({round(degreesInC, 1)}&deg;C)</span>
                            </span>
                        </Metric>
                        <Text>Last updated: {timeAgo(timestamp)}</Text>
                        <Text>{timestamp.toLocaleString()}</Text>
                    </> :
                    <Text className={"pt-4"}>No data</Text>
            )}
        </>
    );
}