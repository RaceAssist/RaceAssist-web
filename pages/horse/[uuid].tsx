import styles from "../../styles/Home.module.css";
import Head from "next/head";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { HorseData } from "../../src/v1/HorseData";
import { GetStaticPaths, GetStaticProps } from "next";
import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import { css } from "@emotion/css";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Image from "next/image";
import { calculateRank, getUsername } from "./index";
import { Table, TableBody, TableCell, TableRow } from "@mui/material";

type row = {
    name: string;
    value: string;
};

const Home: React.FC<PageProps> = ({ props }: PageProps) => {
    const data = props.data;
    let name = data.name ?? data.horse.toString();

    return (
        <div className={styles.container}>
            <Head>
                <title>{name}/ RaceAssist</title>
                <meta name="description" content="RaceAssist-web" />
                <link rel="icon" href="/favicon.png" />
            </Head>
            <Navbar />
            <div>
                <HorseCard data={data} />
            </div>
            <Footer />
        </div>
    );
};

function MotherHorseCard(props: { uuid: string }) {
    return <div></div>;
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

    const rows: row[] = [
        {
            name: "馬主",
            value: ownerName,
        },
        {
            name: "生産者",
            value: breederName,
        },
        {
            name: "生年月日",
            value:
                data.birthDate == null
                    ? "不明"
                    : dayjs(Date.parse(data.birthDate.toString().split("[")[0])).format(
                          "YYYY/MM/DD HH:mm:ss",
                      ),
        },
        {
            name: "死亡日",
            value:
                data.deathData == null
                    ? "不明"
                    : dayjs(Date.parse(data.deathData.toString().split("[")[0])).format(
                          "YYYY/MM/DD HH:mm:ss",
                      ),
        },
        {
            name: "スピード",
            value: data.speed.toRound(2).toString(),
        },
        {
            name: "ジャンプ",
            value: data.jump.toRound(2).toString(),
        },

        {
            name: "ステータス",
            value: data.deathData == null ? "生存" : "死亡",
        },
        {
            name: "ランク",
            value: calculateRank(data).toString(),
        },
    ];
    let imageUrl = "/horse/" + data.color + "-" + data.style + ".webp";
    return (
        <Card
            sx={{
                maxWidth: 800, // circle around the edge
                borderRadius: "5%",
                textAlign: "center",
            }}
        >
            <div className={horseNameStyle}>名前 : {data.name ?? "不明"}</div>
            <CardContent
                sx={{
                    textAlign: "center",
                    justifyContent: "center",
                }}
            >
                <Image
                    src={imageUrl}
                    alt={data.horse}
                    className={mediaStyle}
                    width={500}
                    height={500 * (100 / 90)}
                />
                <div>
                    <Table
                        sx={{
                            width: 700,
                            margin: "auto",
                            marginTop: "50px",
                            marginBottom: "30px",
                        }}
                        size="small"
                        aria-label="a dense table"
                    >
                        <TableBody>
                            {rows.map((row) => (
                                <TableRow key={row.name}>
                                    <TableCell
                                        sx={{ fontFamily: "Noto Sans JP" }}
                                        component="th"
                                        scope="row"
                                    >
                                        {row.name}
                                    </TableCell>
                                    <TableCell sx={{ fontFamily: "Noto Sans JP" }} align="right">
                                        {row.value}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
        </Card>
    );
}

const horseNameStyle = css({
    fontSize: "24px",
    margin: "20px",
    marginLeft: "50px",
    textAlign: "left",
});

const mediaStyle = css({
    //中央寄せ
});

type PathParams = {
    uuid: string;
};

type PageProps = {
    props: {
        data: HorseData;
        createdData: string;
    };
};

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
