'use client';

import {Card, Col, Grid} from "@tremor/react";
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
import {DoorLastOpened} from "@/components/door-events/door-last-opened";
import {Header} from "@/components/header";
import {useUser} from "@auth0/nextjs-auth0/client";
import {getLocalTimeUTC} from "@/utils/time";
import {DoorEventsDurationChart} from "@/components/door-events/door-events-duration-chart";

const DAY_RANGE = 14;

export default function Home() {
    // TODO: support querying of a list of devices (e.g. for multiple refrigerators)
    // and allow selection via dropdown instead of relying on a constant.
    if (!process.env.NEXT_PUBLIC_REFRIGERATOR_DEVICE_ID) {
        throw Error("REFRIGERATOR_DEVICE_ID not defined.")
    }
    const deviceId = process.env.NEXT_PUBLIC_REFRIGERATOR_DEVICE_ID;

    // Server APIs use UTC time.
    const todayDate = getLocalTimeUTC();
    const startDate = todayDate.subtract(DAY_RANGE - 1, 'day');
    const startDateStr = startDate.format("YYYY-MM-DD");
    // API is exclusive of end date, so we add one.
    const endDate = todayDate.add(1, 'day');
    const endDateStr = endDate.format("YYYY-MM-DD");

    const { user } = useUser();
    const isLoggedIn = !!user;

    const { isLoading: isLoadingDoorEvents, result: doorResult } =
        useDoorEvents(isLoggedIn, deviceId, startDateStr, endDateStr)
    const { isLoading: isLoadingTempEvents, result: temperatureResult } =
        useTemperatureEvents(isLoggedIn, deviceId, startDateStr, endDateStr);

    return (
        <main className={"p-12"}>
            <Header />

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
                <Card>
                    <DoorLastOpened
                        isLoading={isLoadingDoorEvents}
                        latestEvent={doorResult.rawEvents.length > 0 ?
                            doorResult.rawEvents[doorResult.rawEvents.length - 1] : undefined}/>
                </Card>
            </Grid>

            <Grid numItemsMd={4} className="mt-6 gap-6">
                <Col numColSpanMd={4}>
                    <Card>
                        <TemperatureChart
                            isLoading={isLoadingTempEvents}
                            events={temperatureResult.rawEvents}
                            dayRange={DAY_RANGE}
                        />
                    </Card>
                </Col>
                <Col numColSpanMd={2}>
                    <Card>
                        <DoorEventsChart isLoading={isLoadingDoorEvents} events={doorResult.rawEvents} dayRange={DAY_RANGE}/>
                    </Card>
                </Col>
                <Col numColSpanMd={2}>
                    <Card>
                        <DoorEventsDurationChart isLoading={isLoadingDoorEvents} events={doorResult.openEvents} dayRange={DAY_RANGE}/>
                    </Card>
                </Col>

                {/* TODO: for later implementation */}
                {/*<Card>*/}
                {/*    <Title>Door Open Count Stats</Title>*/}
                {/*    <Text>Door open count avg per day this week: XXX times</Text>*/}
                {/*    <Text>Time opened avg per day this week: XXX minutes</Text>*/}
                {/*    <Text>Door open count this week: XXX times (+20% from previous week)</Text>*/}
                {/*    <Text>Time opened this week: XXX minutes (+20% from previous week)</Text>*/}
                {/*    <Text>Top 5 Longest Open Durations:</Text>*/}
                {/*    <Text> - XXX minutes (11/30)</Text>*/}
                {/*    <Text> - XXX minutes (11/30)</Text>*/}
                {/*    <Text> - XXX minutes (11/30)</Text>*/}
                {/*    <Text> - XXX minutes (11/30)</Text>*/}
                {/*    <Text> - XXX minutes (11/30)</Text>*/}
                {/*</Card>*/}
            </Grid>
            <Grid numItemsMd={3} className="mt-6 gap-6">
                <Card>
                    <DoorEventsPerDay isLoading={isLoadingDoorEvents} events={doorResult.rawEvents} />
                </Card>
                <Card>
                    <DoorEventsDurationPerDay isLoading={isLoadingDoorEvents} openCloseEvents={doorResult.openEvents} />
                </Card>
                <Card>
                    <DoorEventsDurationPerTime isLoading={isLoadingDoorEvents} openCloseEvents={doorResult.openEvents} />
                </Card>
            </Grid>

            <Footer/>
        </main>
    );
}