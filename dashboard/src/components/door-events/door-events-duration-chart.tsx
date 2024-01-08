import {BarChart, Subtitle, Title} from "@tremor/react";
import {DoorOpenEvent} from "@/utils/models";
import {useMemo} from "react";
import {getDateWithZeroPadding} from "@/utils/time";
import {Spinner} from "@/components/spinner";
import {formatMsToMinutes} from "@/components/door-events/util";

interface DoorEventsDurationChartProps {
    isLoading: boolean,
    events: DoorOpenEvent[];
    dayRange: number;
}

interface ChartData {
    date: string;
    "Minutes": number;
}

const buildData = (events: DoorOpenEvent[]) : ChartData[]  => {
    const durationByDate : {[key: string] : number} = {}

    // Count.
    events
        .forEach(e => {
            const key = getDateWithZeroPadding(new Date(e.startTime));
            let newDuration = e.durationInMs;
            if (key in durationByDate) {
                newDuration = durationByDate[key] + e.durationInMs;
            }
            durationByDate[key] = newDuration;
        });

    const durationsArray = [];
    for (let key in durationByDate) {
        durationsArray.push({
            date: key,
            "Minutes": formatMsToMinutes(durationByDate[key]),
        })
    }

    // Sort by date.
    durationsArray.sort((a, b) => {
        return a.date.localeCompare(b.date);
    });

    return durationsArray.map(v => {
        return {
            ...v,
            date: v.date
                // Remove year: 2023-10-11 => 10-11
                .substring(v.date.indexOf("-") + 1)
                // Change month/day formatting: 10-11 => 10/11
                .replace("-", "/"),
        }
    });
}

export function DoorEventsDurationChart({ isLoading, events, dayRange } : DoorEventsDurationChartProps) {
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
            <Title>Door Open Duration ({dayRange} days)</Title>
            <Subtitle>
                Total minutes the refrigerator door has been open over the last {dayRange} days.
            </Subtitle>
            <BarChart
                showAnimation={true}
                className="mt-6"
                data={data}
                index="date"
                categories={["Minutes"]}
                colors={["blue"]}
                yAxisWidth={48}
            />
        </>
    );
}