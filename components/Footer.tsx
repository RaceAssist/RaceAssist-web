import Link from "next/link";
import { css } from "@emotion/css";

function Footer() {
    return (
        <footer>
            <div>
                Written in 2022 by
                <Link href="https://github.com/Nlkomaru">
                    <a> Nikomaru </a>
                </Link>
                No right reserved
            </div>
        </footer>
    );
}

export default Footer;
