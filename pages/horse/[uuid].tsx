import styles from "../../styles/Home.module.css";
import Head from "next/head";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { HorseData } from "../../src/v1/HorseData";
import { GetServerSideProps, GetStaticPaths, GetStaticProps } from "next";
import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import { css } from "@emotion/css";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Image from "next/image";
import { calculateRank, getUsername } from "./index";
import { Table, TableBody, TableCell, TableRow } from "@mui/material";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import Link from "next/link";
import { useRouter } from "next/router";

type row = {
    name: string; value: string;
};

const Home: React.FC<PageProps> = ({ props }: PageProps) => {
    const router = useRouter();
    if (router.isFallback) {
        return <div>loading...</div>;
    }
    const data = props.data;
    const fatherData = props.fatherData;
    const motherData = props.motherData;
    let name = data.name ?? data.horse.toString();

    return (<div className={styles.container}>
        <Head>
            <title>{name}/ RaceAssist</title>
            <meta name="description" content="RaceAssist-web" />
            <link rel="icon" href="/favicon.png" />
        </Head>
        <Navbar />
        <div>
            {/*TODO: 前のページに戻る */}
            <ReturnPreviousPage />
            <div className={horseDataStyle}>
                <HorseCard data={data} />
                <MotherHorseCard data={fatherData} />
                <FatherHorseCard data={motherData} />
            </div>
            {/*TODO 過去の実績*/}

        </div>
        <Footer />
    </div>);
};

function ReturnPreviousPage() {
    return (
        <Link href={"/horse"} >
            <div className={returnPreviousPageStyle}>
                <ArrowBackIosIcon fontSize="medium" />
                <p>前のページに戻る</p>
            </div>
        </Link>
    );
}

const returnPreviousPageStyle = css({
    marginBottom: "20px", display: "flex", alignItems: "center", width: "160px",
});

function MotherHorseCard(props: { data: HorseData | null }) {
    const data = props.data;
    if (!data) {
        return <HorseNotFound type={"mother"} />;
    }
    return (<div className={miniHorseCardStyle}>
        <ParentsHorseCard data={data} type={"mother"} />
    </div>);
}

function FatherHorseCard(props: { data: HorseData | null }) {
    const data = props.data;
    if (!data) {
        return <HorseNotFound type={"father"} />;
    }
    return (<div className={miniHorseCardStyle}>
        <ParentsHorseCard data={data} type={"father"} />
    </div>);
}

function ParentsHorseCard(props: { data: HorseData, type: "mother" | "father" }) {
    const data = props.data;
    const color = props.type == "mother" ? "#ffbcff30" : "#bcddff30";
    const type = props.type == "mother" ? "母" : "父";
    const [ownerName, setOwnerName] = useState("");
    const [breederName, setBreederName] = useState("");

    useEffect(() => {
        const fetchName = async () => {
            const result = await getUsername(data.owner);
            setOwnerName(result);
            const result2 = await getUsername(data.breeder);
            setBreederName(result2);
        };
        fetchName()
            .then((r) => r);
    }, [data.breeder, data.owner]);

    const rows: row[] = [{
        name: "馬主", value: ownerName,
    }, {
        name: "生産者", value: breederName,
    }, {
        name: "スピード", value: data.speed.toRound(2)
            .toString(),
    }, {
        name: "ジャンプ", value: data.jump.toRound(2)
            .toString(),
    }, {
        name: "ステータス", value: data.deathDate == null ? "生存" : "死亡",
    }, {
        name: "ランク", value: calculateRank(data)
            .toString(),
    }];

    let imageUrl = "/horse/" + data.color + "-" + data.style + ".webp";

    return (
        <Link href={"/horse/" + data.horse}>
            <a className={horseCardStyle}>
                <Card
                    sx={{
                        maxWidth: 600, // circle around the edge
                        borderRadius: "20px", textAlign: "center",
                    }}
                >
                    {type}
                    <div className={horseNameStyle}>名前 : {data.name ?? "不明"}</div>
                    <CardContent
                        sx={{
                            textAlign: "center", justifyContent: "center", backgroundColor: color,
                        }}
                    >
                        <Image
                            src={imageUrl}
                            alt={data.horse.toString()}
                            className={mediaStyle}
                            width={300}
                            height={300 * (100 / 90)}
                        />
                        <div>
                            <Table
                                sx={{
                                    width: 400, margin: "auto", marginTop: "50px", marginBottom: "30px",
                                }}
                                size="small"
                                aria-label="a dense table"
                            >
                                <TableBody>
                                    {rows.map((row) => (<TableRow key={row.name}>
                                        <TableCell
                                            sx={{ fontFamily: "Noto Sans JP" }}
                                            component="th"
                                            scope="row"
                                        >
                                            {row.name}
                                        </TableCell>
                                        <TableCell
                                            sx={{ fontFamily: "Noto Sans JP" }}
                                            align="right">
                                            {row.value}
                                        </TableCell>
                                    </TableRow>))}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>
            </a>
        </Link>
    );

}

function HorseNotFound(props: { type: "mother" | "father" }) {
    const color = props.type == "mother" ? "rgba(255,188,255,0.5)" : "rgba(85,160,236,0.5)";
    const type = props.type == "mother" ? "母" : "父";
    const rows: row[] = [{
        name: "馬主", value: "存在しません",
    }, {
        name: "生産者", value: "存在しません",
    }, {
        name: "スピード", value: "存在しません",
    }, {
        name: "ジャンプ", value: "存在しません",
    }, {
        name: "ステータス", value: "存在しません",
    }, {
        name: "ランク", value: "存在しません",
    }];
    return <div className={miniHorseCardStyle}>
        <Card
            sx={{
                maxWidth: 600, // circle around the edge
                borderRadius: "20px", textAlign: "center", backgroundColor: color,
            }}
        >
            {type}
            <div className={horseNameStyle}>名前 : {"存在しない"}</div>
            <CardContent
                sx={{
                    textAlign: "center", justifyContent: "center",
                }}
            >
                <Image
                    src={"/horse/NO-INFO.webp"}
                    alt={"NotFound"}
                    className={mediaStyle}
                    width={300}
                    height={300 * (100 / 90)}
                />
                <div>
                    <Table
                        sx={{
                            width: 400, margin: "auto", marginTop: "50px", marginBottom: "30px",
                        }}
                        size="small"
                        aria-label="a dense table"
                    >
                        <TableBody>
                            {rows.map((row) => (<TableRow key={row.name}>
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
                            </TableRow>))}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
        </Card>
    </div>;
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
        fetchName()
            .then((r) => r);
    }, [data.breeder, data.owner]);

    const rows: row[] = [{
        name: "馬主", value: ownerName,
    }, {
        name: "生産者", value: breederName,
    }, {
        name: "生年月日", value: formatDate(data.birthDate),
    }, {
        name: "死亡日", value: formatDate(data.deathDate),
    }, {
        name: "スピード", value: data.speed.toRound(2)
            .toString(),
    }, {
        name: "ジャンプ", value: data.jump.toRound(2)
            .toString(),
    }, {
        name: "ステータス", value: data.deathDate == null ? "生存" : "死亡",
    }, {
        name: "ランク", value: calculateRank(data)
            .toString(),
    }];

    let imageUrl = "/horse/" + data.color + "-" + data.style + ".webp";
    return (<div className={horseCardStyle}>
        <Card
            sx={{
                maxWidth: 800, // circle around the edge
                borderRadius: "20px", textAlign: "center",
            }}
        >
            <div className={horseNameStyle}>名前 : {data.name ?? "不明"}</div>
            <CardContent
                sx={{
                    textAlign: "center", justifyContent: "center",
                }}
            >
                <Image
                    src={imageUrl}
                    alt={data.horse.toString()}
                    className={mediaStyle}
                    width={500}
                    height={500 * (100 / 90)}
                />
                <div>
                    <Table
                        sx={{
                            width: 700, margin: "auto", marginTop: "50px", marginBottom: "30px",
                        }}
                        size="small"
                        aria-label="a dense table"
                    >
                        <TableBody>
                            {rows.map((row) => (<TableRow key={row.name}>
                                <TableCell
                                    sx={{ fontFamily: "Noto Sans JP" }}
                                    component="th"
                                    scope="row"
                                >
                                    {row.name}
                                </TableCell>
                                <TableCell
                                    sx={{ fontFamily: "Noto Sans JP" }}align="right">
                                    {row.value}
                                </TableCell>
                            </TableRow>))}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
        </Card>
    </div>);
}

function formatDate(date: Date | null) {
    return date == null ? "不明" : dayjs(Date.parse(date.toString()
        .split("[")[0]))
        .format("YYYY/MM/DD HH:mm:ss");
}

const horseNameStyle = css({
    fontSize: "24px", margin: "20px", marginLeft: "50px", textAlign: "left",
});

const mediaStyle = css({
    //中央寄せ
});
const horseDataStyle = css({
    display: "flex",
});

const horseCardStyle = css({});
const miniHorseCardStyle = css({
    marginLeft: "40px", flexBasis: "30%",
});

type PathParams = {
    uuid: string;
};

type PageProps = {
    props: {
        data: HorseData; motherData: HorseData | null; fatherData: HorseData | null; lastUpdate: string;
    };
};

// export const getStaticPaths: GetStaticPaths = async () => {
//     const listRes = await fetch(process.env.RACEASSIST_API_WEBHOOK_URL + "/v1/horse/list");
//     const list = (await listRes.json()) as string[];
//     const paths: { params: { uuid: string } }[] = [];
//
//     list.forEach((uuid) => {
//         let replacedUniqueId = uuid.replace(".json", "");
//         paths.push({
//             params: { uuid: replacedUniqueId },
//         });
//     });
//
//     return {
//         paths, fallback: true,
//     };
// };

export const getServerSideProps: GetServerSideProps<PageProps> = async (context) => {
    const { uuid } = context.params as PathParams;

    const res = await fetch(process.env.RACEASSIST_API_WEBHOOK_URL + "/v1/horse/record/" + uuid + ".json");

    if (res.status != 200) {
        console.log("not found uuid:" + uuid);
        return {
            notFound: true,
        };
    }

    let horseData: HorseData = (await res.json()) as HorseData;

    let motherData: HorseData | null = null;

    const motherRes = await fetch(process.env.RACEASSIST_API_WEBHOOK_URL + "/v1/horse/record/" + horseData.mother + ".json");
    if (motherRes.status == 200) {
        motherData = (await motherRes.json()) as HorseData;
    }

    let fatherData: HorseData | null = null;
    const fatherRes = await fetch(process.env.RACEASSIST_API_WEBHOOK_URL + "/v1/horse/record/" + horseData.father + ".json");
    if (fatherRes.status == 200) {
        fatherData = (await fatherRes.json()) as HorseData;
    }

    // ページコンポーネントに渡す PageProps オブジェクトを
    // props プロパティに設定したオブジェクトを返す
    return {
        props: {
            props: {
                data: horseData, motherData: motherData, fatherData: fatherData, lastUpdate: new Date().toString(),
            },
        }
    };
};

export default Home;
