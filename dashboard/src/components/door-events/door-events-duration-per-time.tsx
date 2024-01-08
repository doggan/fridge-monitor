import {DonutChart, Legend, Text, Title} from "@tremor/react";
import {useMemo} from "react";
import {formatDayPercentage, formatMsToMinutes} from "@/components/door-events/util";
import {DoorOpenEvent} from "@/utils/models";
import {Spinner} from "@/components/spinner";

interface DoorEventsDurationPerTimeProps {
    isLoading: boolean;
    openCloseEvents: DoorOpenEvent[];
}

interface ChartData {
    name: string;
    time: number;
}

const buildData = (events: DoorOpenEvent[]) : ChartData[]  => {
    if (events.length === 0) {
        return [];
    }

    const valuesByTime = [0, 0, 0, 0];
    let totalTime = 0;

    // Count.
    events
        .forEach(e => {
            // Bucket by time of day.
            const hours = e.startTime.getHours() + 1;
            if (hours < 6) {
                valuesByTime[3] += e.durationInMs;
            } else if (hours < 12) {
                valuesByTime[0] += e.durationInMs;
            } else if (hours < 18) {
                valuesByTime[1] += e.durationInMs;
            } else {
                valuesByTime[2] += e.durationInMs;
            }

            totalTime += e.durationInMs;
        });

    return [
        { name: formatDayPercentage("Morning (6am - 12pm)", valuesByTime[0], totalTime), time: formatMsToMinutes(valuesByTime[0]) },
        { name: formatDayPercentage("Afternoon (12pm - 6pm)", valuesByTime[1], totalTime), time: formatMsToMinutes(valuesByTime[1]) },
        { name: formatDayPercentage("Evening (6pm - 12am)", valuesByTime[2], totalTime), time: formatMsToMinutes(valuesByTime[2]) },
        { name: formatDayPercentage("Night (12am - 6am)", valuesByTime[3], totalTime), time: formatMsToMinutes(valuesByTime[3]) },
    ];
}

export function DoorEventsDurationPerTime({ isLoading, openCloseEvents } : DoorEventsDurationPerTimeProps) {
    const data = useMemo(() => {
        return buildData(openCloseEvents);
    }, [openCloseEvents]);

    const valueFormatter = (number: number) => `${number.toLocaleString()} minutes`;

    return (
        <div>
            <Title>Door Open Duration Per Time of Day</Title>
            {isLoading && <Spinner className={"pt-4"} />}
            {!isLoading && data.length === 0 && (
                <Text className={"pt-4"}>No data</Text>
            )}
            {!isLoading && data.length > 0 && (<>
                <Legend
                    className="mt-6"
                    categories={data.map((v) => v.name.slice(0, v.name.indexOf(')') + 1))}
                    colors={["violet", "rose", "cyan", "amber"]}
                />

                <DonutChart
                    className="mt-6"
                    variant={"pie"}
                    showAnimation={true}
                    data={data}
                    category="time"
                    index="name"
                    valueFormatter={valueFormatter}
                    colors={["violet", "rose", "cyan", "amber"]}
                />
            </>)}
        </div>
    )
}