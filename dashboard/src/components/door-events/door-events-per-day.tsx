import {DoorEvent} from "@/utils/models";
import {BarList, Bold, Flex, Text, Title} from "@tremor/react";
import {useMemo} from "react";
import {Spinner} from "@/components/spinner";

interface DoorEventsPerDayProps {
    isLoading: boolean;
    events: DoorEvent[];
}

interface ChartData {
    name: string;
    value: number;
}

const buildData = (events: DoorEvent[]) : ChartData[]  => {
    const countsByDay = [0, 0, 0, 0, 0, 0, 0];

    let totalOpenCount = 0;

    // Filter and count.
    events
        .filter(e => e.eventType === "open")
        .forEach(e => {
            const key = new Date(e.timestamp).getDay();
            countsByDay[key] += 1;
            totalOpenCount += 1;
        });

    const formatDay = (day: string, count: number) => {
        return `${day} - %${Math.trunc(count / totalOpenCount * 100)}`
    }

    const data = [
        { name: formatDay("Sunday", countsByDay[0]), value: countsByDay[0] },
        { name: formatDay("Monday", countsByDay[1]), value: countsByDay[1] },
        { name: formatDay("Tuesday", countsByDay[2]), value: countsByDay[2] },
        { name: formatDay("Wednesday", countsByDay[3]), value: countsByDay[3] },
        { name: formatDay("Thursday", countsByDay[4]), value: countsByDay[4] },
        { name: formatDay("Friday", countsByDay[5]), value: countsByDay[5] },
        { name: formatDay("Saturday", countsByDay[6]), value: countsByDay[6] },
    ];

    // Sort by frequency.
    data.sort((a, b) => {
        return b.value - a.value;
    });

    return data;
}

export function DoorEventsPerDay({ isLoading, events } : DoorEventsPerDayProps) {
    const data = useMemo(() => {
        return buildData(events);
    }, [events]);

    if (isLoading) {
        return <Spinner/>;
    }

    return (
        <>
            <Title>Open Counts Per Day</Title>
            <Text>Door open counts per day of week.</Text>
            <Flex className="mt-4">
                <Text>
                    <Bold>Day</Bold>
                </Text>
                <Text>
                    <Bold>Count</Bold>
                </Text>
            </Flex>
            <BarList data={data} className="mt-2" />
        </>
    )
}