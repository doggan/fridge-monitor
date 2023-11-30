import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faGithub} from '@fortawesome/free-brands-svg-icons';
import {Divider, Subtitle} from "@tremor/react";

export function Footer() {
    return (
        <section className="mt-6">
            <Divider></Divider>
            <Subtitle className="text-center">
                Built by <a className={"underline"} href="https://shy.am/" target="_blank">Shyam Guthikonda</a> in 2023
            </Subtitle>
            <div className={"text-center pt-2"}>
                <a
                    className="hover:text-sky-600 text-zinc-700 text-3xl px-2"
                    href="https://github.com/doggan/fridge-monitor"
                    target="_blank"
                >
                    <FontAwesomeIcon icon={faGithub}/>
                </a>
            </div>
        </section>
    )
}
