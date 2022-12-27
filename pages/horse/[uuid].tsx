import styles from "../../styles/Home.module.css";
import Head from "next/head";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { HorseData } from "../../src/v1/raceResult";
import { GetStaticPaths, GetStaticProps } from "next";
import React, { useEffect, useState } from "react";
import { v4 as UUID } from "uuid";
import dayjs from "dayjs";
import { css } from "@emotion/css";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { CardActionArea } from "@mui/material";
import Image from "next/image";

const Home: React.FC<PageProps> = ({ props }: PageProps) => {
    const [ownerName, setOwnerName] = useState("");
    const [breederName, setBreederName] = useState("");
    const data = props.data;
    let name = data.name ?? data.horse.toString();

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
        <div className={styles.container}>
            <Head>
                <title>{name}/ RaceAssist</title>
                <meta name="description" content="RaceAssist-web" />
                <link rel="icon" href="/favicon.png" />
            </Head>
            <Navbar />
            <Card
                sx={{
                    maxWidth: 800, // circle around the edge
                    borderRadius: "10%",
                }}
            >
                <CardActionArea>
                    <Image
                        src={"/horse/" + data.color + "-" + data.style + ".webp"}
                        alt={data.horse.toString()}
                        width={500}
                        height={500}
                    />
                    <CardContent>
                        <Typography gutterBottom variant="h5" component="div">
                            Lizard
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Lizards are a widespread group of squamate reptiles, with over 6,000
                            species, ranging across all continents except Antarctica
                        </Typography>
                    </CardContent>
                </CardActionArea>
            </Card>
            color: {data.color} <br />
            breeder: {breederName} <br />
            owner: {ownerName} <br />
            date : {props.createdData} <br />
            <Footer />
        </div>
    );
};
const nameStyle = css({
    textAlign: "center",
});

const mainBoxStyle = css({});

const horseImage = css({
    textAlign: "center",
});

type PathParams = {
    uuid: string;
};

type PageProps = {
    props: { data: HorseData; createdData: string };
};

async function getUsername(uuid: typeof UUID | null): Promise<string> {
    if (uuid == null) {
        return "";
    }
    const res = await fetch(
        "https://minecraft-name-api.nikomaru.workers.dev/mojang/v2/user/" + uuid,
    );
    const data = await res.json();
    return data.username;
}

export const getStaticPaths: GetStaticPaths = async () => {
    const listRes = await fetch(process.env.RACEASSIST_API_WEBHOOK_URL + "/v1/horse/list");
    const list = (await listRes.json()) as string[];
    const paths: { params: { uuid: string } }[] = [];

    list.forEach((uuid) => {
        let replacedUniqueId = uuid.replace(".json", "");
        paths.push({
            params: { uuid: replacedUniqueId },
        });
    });

    return {
        paths,
        fallback: "blocking",
    };
};

export const getStaticProps: GetStaticProps<PageProps> = async (context) => {
    const { uuid } = context.params as PathParams;

    const res = await fetch(
        process.env.RACEASSIST_API_WEBHOOK_URL + "/v1/horse/record/" + uuid + ".json",
    );
    let horseData: HorseData = (await res.json()) as HorseData;
    const now = dayjs(); // 現在の日付情報を取得
    const date = now.format(); // 2020-10-24T09:48:19+09:00

    // ページコンポーネントに渡す PageProps オブジェクトを
    // props プロパティに設定したオブジェクトを返す
    return {
        props: {
            props: {
                data: horseData,
                createdData: date,
            },
        },
        revalidate: 60 * 60,
    };
};

export default Home;
