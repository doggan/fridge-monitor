import {BarList, Bold, Flex, Text, Title} from "@tremor/react";
import {useMemo} from "react";
import {formatDayPercentage, formatMsToMinutes} from "@/components/door-events/util";
import {DoorOpenEvent} from "@/utils/models";
import {Spinner} from "@/components/spinner";

interface DoorEventsDurationPerDayProps {
    isLoading: boolean;
    openCloseEvents: DoorOpenEvent[];
}

interface ChartData {
    name: string;
    value: number;
}

const buildData = (openCloseEvents: DoorOpenEvent[]) : ChartData[]  => {
    const timesByDay = [0, 0, 0, 0, 0, 0, 0];
    let totalTime = 0;

    // Filter and count.
    openCloseEvents
        .forEach(e => {
            const key = new Date(e.startTime).getDay();
            timesByDay[key] += e.durationInMs;
            totalTime += e.durationInMs;
        });

    const data = [
        { name: formatDayPercentage("Sunday", timesByDay[0], totalTime), value: formatMsToMinutes(timesByDay[0]) },
        { name: formatDayPercentage("Monday", timesByDay[1], totalTime), value: formatMsToMinutes(timesByDay[1]) },
        { name: formatDayPercentage("Tuesday", timesByDay[2], totalTime), value: formatMsToMinutes(timesByDay[2]) },
        { name: formatDayPercentage("Wednesday", timesByDay[3], totalTime), value: formatMsToMinutes(timesByDay[3]) },
        { name: formatDayPercentage("Thursday", timesByDay[4], totalTime), value: formatMsToMinutes(timesByDay[4]) },
        { name: formatDayPercentage("Friday", timesByDay[5], totalTime), value: formatMsToMinutes(timesByDay[5]) },
        { name: formatDayPercentage("Saturday", timesByDay[6], totalTime), value: formatMsToMinutes(timesByDay[6]) },
    ];

    // Sort by frequency.
    data.sort((a, b) => {
        return b.value - a.value;
    });

    return data;
}

export function DoorEventsDurationPerDay({ isLoading, openCloseEvents } : DoorEventsDurationPerDayProps) {
    const data = useMemo(() => {
        return buildData(openCloseEvents);
    }, [openCloseEvents]);

    const valueFormatter = (number: number) => `${number.toLocaleString()}`;

    return (
        <>
            <Title>Door Open Duration Per Day</Title>
            {isLoading && <Spinner />}
            {!isLoading && (<>
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
            </>)}
        </>
    )
}