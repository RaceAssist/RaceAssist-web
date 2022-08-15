import Link from "next/link";
import { css } from '@emotion/css'

function Footer() {
  return (
    <footer>
      <div className={style}>
        Written in 2022 by
        <Link href="https://github.com/Nlkomaru">
          <a> Nikomaru </a>
        </Link>
        No right reserved
      </div>
    </footer>
  );
}

const style = css({
  fontSize: '15px',
  fontFamily: ['Noto Sans JP', 'sans-serif'],
  transform: 'rotate(0.001deg)',
});

export default Footer;
