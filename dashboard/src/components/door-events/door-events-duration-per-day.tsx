import {DoorEvent} from "@/utils/models";
import {BarList, Bold, Flex, Text, Title} from "@tremor/react";
import {useMemo} from "react";
import {OpenCloseEvent} from "@/components/door-events/door-events-section";

interface DoorEventsDurationPerDayProps {
    openCloseEvents: OpenCloseEvent[];
}

interface ChartData {
    name: string;
    value: number;
}

const buildData = (openCloseEvents: OpenCloseEvent[]) : ChartData[]  => {
    const timesByDay = [0, 0, 0, 0, 0, 0, 0];
    let totalTime = 0;

    // Filter and count.
    openCloseEvents
        .forEach(e => {
            const key = new Date(e.startTime).getDay();
            timesByDay[key] += e.durationInMs;
            totalTime += e.durationInMs;
        });

    const formatDay = (day: string, time: number) => {
        return `${day} - %${Math.trunc(time / totalTime * 100)}`
    }
    const formatTime = (time: number) => {
        return Math.trunc(time / 1000 / 60);
    }

    const data = [
        { name: formatDay("Sunday", timesByDay[0]), value: formatTime(timesByDay[0]) },
        { name: formatDay("Monday", timesByDay[1]), value: formatTime(timesByDay[1]) },
        { name: formatDay("Tuesday", timesByDay[2]), value: formatTime(timesByDay[2]) },
        { name: formatDay("Wednesday", timesByDay[3]), value: formatTime(timesByDay[3]) },
        { name: formatDay("Thursday", timesByDay[4]), value: formatTime(timesByDay[4]) },
        { name: formatDay("Friday", timesByDay[5]), value: formatTime(timesByDay[5]) },
        { name: formatDay("Saturday", timesByDay[6]), value: formatTime(timesByDay[6]) },
    ];

    // Sort by frequency.
    data.sort((a, b) => {
        return b.value - a.value;
    });

    return data;
}

export function DoorEventsDurationPerDay({ openCloseEvents } : DoorEventsDurationPerDayProps) {
    const data = useMemo(() => {
        return buildData(openCloseEvents);
    }, [openCloseEvents]);

    const valueFormatter = (number: number) => `${number.toLocaleString()}`;

    return (
        <>
            <Title>Open Duration Per Day</Title>
            <Text>Door open time durations per day of week.</Text>
            <Flex className="mt-4">
                <Text>
                    <Bold>Day</Bold>
                </Text>
                <Text>
                    <Bold>Minutes</Bold>
                </Text>
            </Flex>
            <BarList
                showAnimation={true}
                data={data}
                valueFormatter={valueFormatter}
                className="mt-2"
            />
        </>
    )
}