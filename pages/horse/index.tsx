import { GetStaticProps, NextPage } from "next";
import styles from "../../styles/Home.module.css";
import Head from "next/head";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { HorseData } from "../../src/raceResult";
import { css } from "@emotion/css";
import { useEffect, useState } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { CardActionArea } from "@mui/material";

const Home: NextPage<PageProps> = (props: PageProps) => {
    return (
        <div className={styles.container}>
            <Head>
                <title>/ RaceAssist</title>
                <meta name="description" content="RaceAssist-web" />
                <link rel="icon" href="/favicon.png" />
            </Head>
            <Navbar />
            <HorseList list={props.props.data} />
            <Footer />
        </div>
    );
};

function HorseList(props: { list: HorseData[] }) {
    return (
        <div className={listStyle}>
            {props.list.map((data) => {
                return <HorseCard key={data.horse} data={data} />;
            })}
        </div>
    );
}

function HorseCard(props: { data: HorseData }) {
    const data = props.data;
    const [ownerName, setOwnerName] = useState("");
    const [breederName, setBreederName] = useState("");
    useEffect(() => {
        const fetchName = async () => {
            const result = await getUsername(data.owner);
            setOwnerName(result);
            const result2 = await getUsername(data.breeder);
            setBreederName(result2);
        };
        fetchName().then((r) => r);
    }, [data.breeder, data.owner]);

    let imageUrl = "/horse/" + data.color + "-" + data.style + ".webp";
    return (
        <div className={boxStyle}>
            <Card
                sx={{
                    maxWidth: 400, // circle around the edge
                    borderRadius: "10%",
                }}
            >
                <CardActionArea href={"/horse/" + data.horse}>
                    <CardMedia
                        className={mediaStyle}
                        component="img"
                        height="400"
                        image={imageUrl}
                        alt={data.horse}
                    />
                    <CardContent>
                        <Typography variant="body1" color="text.primary">
                            所有者 : {ownerName} <br />
                            スピード : {data.speed.toRound(2).toString()} <br />
                            ジャンプ : {data.jump.toRound(2).toString()} <br />
                        </Typography>
                    </CardContent>
                </CardActionArea>
            </Card>
        </div>
    );
}

type PageProps = {
    props: { data: HorseData[] };
};
const listStyle = css({
    display: "flex",
    flexWrap: "wrap",
    textAlign: "center",
});

const mediaStyle = css({
    padding: "40px",
});

const boxStyle = css({
    marginTop: "50px",
    flexBasis: "25%",
});

declare global {
    interface Number {
        toRound(base: Number): Number;
    }
}

Number.prototype.toRound = function (base: Number) {
    return Math.floor(this.valueOf() * Math.pow(10, base.valueOf())) / Math.pow(10, base.valueOf());
};

export const getStaticProps: GetStaticProps = async (context) => {
    // ファイル名が [id].tsx なので id パラメーターを取り出すことができる
    const res = await fetch(process.env.RACEASSIST_API_WEBHOOK_URL + "/v1/horse/listAll");
    let horseData = (await res.json()) as HorseData[];

    return {
        props: {
            props: { data: horseData },
        },
        revalidate: 1800,
    };
};

async function getUsername(uuid: string | null): Promise<string> {
    if (uuid == null) {
        return "なし";
    }
    const res = await fetch("https://playerdb.co/api/player/minecraft/" + uuid);
    const data = await res.json();
    return data.data.player.username;
}

export default Home;
