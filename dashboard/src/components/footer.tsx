import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faGithub} from '@fortawesome/free-brands-svg-icons';

export function Footer() {
    return (
        // TODO: styling, giant icon on load, etc.
        <section className="mt-6">
            <hr className=""/>
            <div className="text-center">
                Built by <a href="https://shy.am/" target="_blank">Shyam Guthikonda</a> in 2023
            </div>
            <div>
                <a
                    className="hover:text-sky-600 text-zinc-800 text-3xl px-2"
                    href="https://github.com/doggan/fridge-monitor"
                    target="_blank"
                >
                    <FontAwesomeIcon icon={faGithub}/>
                </a>
            </div>
        </section>
    )
}
