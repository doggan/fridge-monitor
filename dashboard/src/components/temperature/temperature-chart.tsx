import {useMemo} from "react";
import {LineChart, Subtitle, Title} from "@tremor/react";
import {Spinner} from "@/components/spinner";
import {RawTempEvent} from "@/utils/models";
import {cToF, round} from "@/utils/numbers";
import {getDateWithZeroPadding} from "@/utils/time";

interface TemperatureChartProps {
    isLoading: boolean,
    events: RawTempEvent[];
}

interface ChartData {
    date: string;
    "Temperature (F)": number;
    "Temperature (C)": number;
}

const buildData = (events: RawTempEvent[]) : ChartData[]  => {
    // TODO: would be nice to have time of day (not just the date)
    // when displaying the tooltip on hover. To do this, we can use a custom tooltip.
    // Add a timestamp field to ChartData, then access it from custom tooltip component via:
    //      const rawChartDate = payload[0].payload as ChartData;
    //      rawChartDate.timestamp
    // If we decide to sample the temperature data (e.g. average it out over an hour),
    // we'd need to update the timestamp for this new average time.
    return events.map(e => {
        let key = getDateWithZeroPadding(new Date(e.timestamp));
        key = key
                // Remove year: 2023-10-11 => 10-11
                .substring(key.indexOf("-") + 1)
                // Change month/day formatting: 10-11 => 10/11
                .replace("-", "/");

        return {
            date: key,
            "Temperature (F)": round(cToF(e.value), 1),
            "Temperature (C)": round(e.value, 1),
        }
    });
}

export function TemperatureChart({ isLoading, events } : TemperatureChartProps) {
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
            <Title>Temperature (30 days)</Title>
            <Subtitle>
                Internal temperature reading of the refrigerator over the last 30 days.
            </Subtitle>
            <LineChart
                showAnimation={true}
                className="mt-6"
                data={data}
                index="date"
                categories={["Temperature (F)", "Temperature (C)"]}
                colors={["blue", "green"]}
                yAxisWidth={48}
                autoMinValue={true}
                curveType={"monotone"}
            />
        </>
    );
}