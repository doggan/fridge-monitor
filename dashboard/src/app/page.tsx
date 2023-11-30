'use client';

import {Card, Col, Grid, Metric, Text, Title} from "@tremor/react";
import {DoorEventsPerDay} from "@/components/door-events/door-events-per-day";
import {DoorEventsDurationPerDay} from "@/components/door-events/door-events-duration-per-day";
import {DoorEventsChart} from "@/components/door-events/door-events-chart";
import {DoorEventsDurationPerTime} from "@/components/door-events/door-events-duration-per-time";
import {CurrentTemp} from "@/components/temperature/current-temp";
import {Footer} from "@/components/footer";
import {useDoorEvents} from "@/components/hooks/useDoorEvents";
import {useTemperatureEvents} from "@/components/hooks/useTemperatureEvents";
import {DoorStatus} from "@/components/door-events/door-status";
import {TemperatureChart} from "@/components/temperature/temperature-chart";

export default function Home() {
    // TODO: listing devices
    const deviceId = "123";
    const startDate = "2023-10-";
    // const endDate = undefined;

    const { isLoading: isLoadingDoorEvents, result: doorResult } = useDoorEvents(deviceId, startDate)
    const { isLoading: isLoadingTempEvents, result: temperatureResult } = useTemperatureEvents(deviceId, startDate);

    return (
        <main className={"p-12"}>
            <Metric>Fridge Monitor ❄️</Metric>
            <Text>A dashboard for viewing refrigerator metrics.</Text>

            <Grid numItemsMd={3} className="gap-6 mt-6">
                <Card>
                    <CurrentTemp
                        isLoading={isLoadingDoorEvents}
                        latestEvent={temperatureResult.rawEvents.length > 0 ?
                            temperatureResult.rawEvents[temperatureResult.rawEvents.length - 1] : undefined}/>
                </Card>
                <Card>
                    <DoorStatus
                        isLoading={isLoadingDoorEvents}
                        latestEvent={doorResult.rawEvents.length > 0 ?
                            doorResult.rawEvents[doorResult.rawEvents.length - 1] : undefined}/>
                </Card>
            </Grid>

            <Grid numItemsMd={3} className="mt-6 gap-6">
                <Col numColSpanMd={2}>
                <Card >
                    <TemperatureChart
                        isLoading={isLoadingTempEvents}
                        events={temperatureResult.rawEvents}
                    />
                </Card>
                </Col>
                <Col numColSpanMd={2}>
                    <Card>
                        <DoorEventsChart isLoading={isLoadingDoorEvents} events={doorResult.rawEvents}/>
                    </Card>
                </Col>
                <Card>
                    <Title>Door Open Count Stats</Title>
                    <Text>Door open count avg per day this week: XXX times</Text>
                    <Text>Time opened avg per day this week: XXX minutes</Text>
                    <Text>Door open count this week: XXX times (+20% from previous week)</Text>
                    <Text>Time opened this week: XXX minutes (+20% from previous week)</Text>
                    <Text>Top 5 Longest Open Durations:</Text>
                    <Text> - XXX minutes (11/30)</Text>
                    <Text> - XXX minutes (11/30)</Text>
                    <Text> - XXX minutes (11/30)</Text>
                    <Text> - XXX minutes (11/30)</Text>
                    <Text> - XXX minutes (11/30)</Text>
                </Card>
            </Grid>
            <Grid numItemsMd={3} className="mt-6 gap-6">
                <Card>
                    <DoorEventsPerDay isLoading={isLoadingDoorEvents} events={doorResult.rawEvents} />
                </Card>
                <Card>
                    <DoorEventsDurationPerDay openCloseEvents={doorResult.openEvents} />
                </Card>
                <Card>
                    <DoorEventsDurationPerTime openCloseEvents={doorResult.openEvents} />
                </Card>
            </Grid>

            <Footer/>
        </main>
    );
}