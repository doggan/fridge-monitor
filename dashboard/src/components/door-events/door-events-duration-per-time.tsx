import {DonutChart, Legend, Text, Title} from "@tremor/react";
import {useMemo} from "react";
import {formatDayPercentage, formatMsToMinutes} from "@/components/door-events/util";
import {DoorOpenEvent} from "@/utils/models";

interface DoorEventsDurationPerTimeProps {
    openCloseEvents: DoorOpenEvent[];
}

interface ChartData {
    name: string;
    time: number;
}

const buildData = (openCloseEvents: DoorOpenEvent[]) : ChartData[]  => {
    const valuesByTime = [0, 0, 0, 0];
    let totalTime = 0;

    // Filter and count.
    openCloseEvents
        .forEach(e => {
            // Bucket by time of day.
            const hours = e.startTime.getHours() + 1;
            if (hours < 5 || hours >= 21) {
                valuesByTime[3] += e.durationInMs;
            } else if (hours < 10) {
                valuesByTime[0] += e.durationInMs;
            } else if (hours < 16) {
                valuesByTime[1] += e.durationInMs;
            } else if (hours < 21) {
                valuesByTime[2] += e.durationInMs;
            } else {
                console.error("Unhandled time range: ", hours);
            }

            totalTime += e.durationInMs;
        });

    return [
        { name: formatDayPercentage("Morning (5am - 10am)", valuesByTime[0], totalTime), time: formatMsToMinutes(valuesByTime[0]) },
        { name: formatDayPercentage("Afternoon (10am - 4pm)", valuesByTime[1], totalTime), time: formatMsToMinutes(valuesByTime[1]) },
        { name: formatDayPercentage("Evening (4pm - 9pm)", valuesByTime[2], totalTime), time: formatMsToMinutes(valuesByTime[2]) },
        { name: formatDayPercentage("Night (9pm - 5am)", valuesByTime[3], totalTime), time: formatMsToMinutes(valuesByTime[3]) },
    ];
}

export function DoorEventsDurationPerTime({ openCloseEvents } : DoorEventsDurationPerTimeProps) {
    const data = useMemo(() => {
        return buildData(openCloseEvents);
    }, [openCloseEvents]);

    const valueFormatter = (number: number) => `${number.toLocaleString()} minutes`;

    return (
        <>
            <Title>Door Open Duration Per Time of Day</Title>

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
        </>
    )
}