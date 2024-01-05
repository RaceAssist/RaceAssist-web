import Link from "next/link";
import { css } from "@emotion/css";


function Footer() {
    return (
        <footer className={footerStyle}>
            <div className={authorStyle}>
                Written in 2022 by
                <Link href="https://github.com/Nlkomaru">
                    Nikomaru
                </Link>
                No right reserved.
            </div>
        </footer>
    );
}


const footerStyle = css({
    height: 100,
    margin: "0 calc(50% - 50vw)",
    width: "100vw",
    backgroundColor: "var(--mui-palette-custom-footer)",
    color: "#ffffff",
    marginTop: "30px",
});

const authorStyle = css({
    padding: "38px", whiteSpace: "nowrap",
});

export default Footer;
