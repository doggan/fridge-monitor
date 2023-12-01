import Link from 'next/link'
import {Button, Metric, Subtitle} from "@tremor/react";

export default function Page() {
    return (
        <section className={"grid h-screen place-items-center"}>
            <div className={"flex flex-col text-center"}>
                <div className={"pb-4"}>
                    <Metric>Access Denied</Metric>
                    <Subtitle>Your email must be whitelisted to use this application.</Subtitle>
                </div>
                <Link href="/">
                    <Button size="md">Go Home</Button>
                </Link>
            </div>
        </section>
    )
}