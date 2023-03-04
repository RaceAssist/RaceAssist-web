import Link from "next/link";
import {css} from "@emotion/css";
import {useTheme} from "@mui/material";


function Footer() {
    return (<footer className={footerStyle}>
        <div className={authorStyle}>
            Written in 2022 by
            <Link href="https://github.com/Nlkomaru">
                <a> Nikomaru </a>
            </Link>
            No right reserved.
        </div>
    </footer>);
}


const footerStyle = css({
    height: 100, margin: "0 calc(50% - 50vw)", width: "100vw" , backgroundColor : "var(--mui-palette-custom-footer)" , color : "#ffffff"
})
const authorStyle = css({
    padding: "38px"
})

export default Footer;
