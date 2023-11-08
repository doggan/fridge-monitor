import {BarChart, Card, Subtitle, Title} from "@tremor/react";
import {DoorEvent} from "@/utils/models";
import {useMemo} from "react";
import {getDateWithZeroPadding} from "@/utils/time";

interface DoorEventsChartProps {
    isLoading: boolean,
    events: DoorEvent[];
}

interface ChartData {
    name: string;
    "Opened count": number;
}

const buildData = (events: DoorEvent[]) : ChartData[]  => {
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
        countsArray.push({ name: key, "Opened count": countsByDate[key] })
    }

    // Sort by date.
    countsArray.sort((a, b) => {
        return a.name.localeCompare(b.name);
    });

    return countsArray
}

export function DoorEventsChart({ isLoading, events } : DoorEventsChartProps) {
    const data = useMemo(() => {
        return buildData(events);
    }, [events]);

    // if (isLoading) {
    //     return (
    //         <Card>
    //             <Spinner />
    //         </Card>
    //     );
    // }

    return (
        <>
            <Title>Open Counts (30 days)</Title>
            <Subtitle>
                # of times the refrigerator door has been opened over the last 30 days.
            </Subtitle>
            <BarChart
                showAnimation={true}
                className="mt-6"
                data={data}
                index="name"
                categories={["Opened count"]}
                colors={["blue"]}
                yAxisWidth={48}
            />
        </>
    );
}