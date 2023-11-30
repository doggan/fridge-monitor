import {BarChart, Card, Subtitle, Title} from "@tremor/react";
import {RawDoorEvent} from "@/utils/models";
import {useMemo} from "react";
import {getDateWithZeroPadding} from "@/utils/time";
import {Spinner} from "@/components/spinner";

interface DoorEventsChartProps {
    isLoading: boolean,
    events: RawDoorEvent[];
}

interface ChartData {
    date: string;
    "Opened count": number;
}

const buildData = (events: RawDoorEvent[]) : ChartData[]  => {
    const countsByDate : {[key: string] : number} = {}

    // Filter and count.
    events
        .filter(e => e.eventType === "open")
        .forEach(e => {
            const key = getDateWithZeroPadding(new Date(e.timestamp));
            let newCount = 1;
            if (key in countsByDate) {
                newCount = countsByDate[key] + 1
            }
            countsByDate[key] = newCount;
        });

    const countsArray = [];
    for (let key in countsByDate) {
        countsArray.push({
            date: key
                // Remove year: 2023-10-11 => 10-11
                .substring(key.indexOf("-") + 1)
                // Change month/day formatting: 10-11 => 10/11
                .replace("-", "/"),
            "Opened count": countsByDate[key]
        })
    }

    // Sort by date.
    countsArray.sort((a, b) => {
        return a.date.localeCompare(b.date);
    });

    return countsArray
}

export function DoorEventsChart({ isLoading, events } : DoorEventsChartProps) {
    const data = useMemo(() => {
        return buildData(events);
    }, [events]);

    if (isLoading) {
        return (
            <Spinner />
        );
    }

    return (
        <>
            <Title>Door Open Counts (30 days)</Title>
            <Subtitle>
                # of times the refrigerator door has been opened over the last 30 days.
            </Subtitle>
            <BarChart
                showAnimation={true}
                className="mt-6"
                data={data}
                index="date"
                categories={["Opened count"]}
                colors={["blue"]}
                yAxisWidth={48}
            />
        </>
    );
}