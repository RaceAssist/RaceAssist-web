import type { NextPage } from "next";
import Head from "next/head";
import styles from "../styles/Home.module.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useEffect, useState } from "react";
import { css } from "@emotion/css";
import Image from "next/image";
import placeImage from "../public/place.png";
import raceImage from "../public/race.png";
import Link from "next/link";


const Home: NextPage = () => {
    return (<div className={styles.container}>
        <Head>
            <title>RaceAssist-web</title>
            <meta name="description" content="Generated by create next app" />
            <link rel="icon" href="/favicon.png" />
        </Head>
        <Navbar />
        レース一覧
        <RaceBoard />
        競技場一覧
        <PlaceBoard />
        <HorseBoard />
        <ResultBoard />
        <ArticleBoard />
        <Footer />
    </div>);
};


// component
function RaceBoard() {
    const [raceIdList, setRaceIdList] = useState<string []>([]);
    useEffect(() => {
        const setList = async (setData: (arg0: string[]) => void) => {
            const response = await fetch("/server-api/race/list");
            const res: RaceList = await response.json();
            setData(res.data.list);
        };

        setList(setRaceIdList).then(r => r);
    }, []);

    const [raceConfig, setRaceConfig] = useState<Map<string, RaceConfig>>();

    useEffect(() => {
        const setRaceConfigMap = async (setData: (arg0: Map<string, RaceConfig>) => void) => {
            const map = new Map<string, RaceConfig>();
            for (const raceId of raceIdList) {
                const config = await getRaceConfig(raceId);
                map.set(raceId, config);
            }
            setData(map);
        };
        setRaceConfigMap(setRaceConfig).then(r => r);
    }, [raceIdList]);


    let count = 0;

    return (<div className={cardListStyle}>
            {
                raceIdList.map((raceId) => {
                        count++;
                        if (count < 5) {
                            return < Link key={raceId} href={"/race/" + raceId} className={cardStyle}>
                                    <Image alt={raceId} src={raceConfig?.get(raceId)?.raceImageUrl ?? raceImage}
                                           className={imageSize} placeholder="blur" />
                                    {raceConfig?.get(raceId)?.raceName ?? raceId}
                            </Link>;
                        } else if (count === 5) {
                            return <Link href={"/race"} key={"raceLink"}>
                                    一覧ページへ
                            </Link>;
                        }
                    },
                )
            }
        </div>
    );
}


function PlaceBoard() {
    const [placeIdList, setPlaceIdList] = useState<string []>([]);
    useEffect(() => {
        const setList = async (setData: (arg0: string[]) => void) => {
            const response = await fetch("/server-api/place/list");
            const res: PlaceList = await response.json();
            setData(res.data.list);
        };

        setList(setPlaceIdList).then(r => r);
    }, []);

    const [placeConfig, setPlaceConfig] = useState<Map<string, PlaceConfig>>();

    useEffect(() => {
        const setPlaceConfigMap = async (setData: (arg0: Map<string, PlaceConfig>) => void) => {
            const map = new Map<string, PlaceConfig>();
            for (const placeId of placeIdList) {
                const config = await getPlaceConfig(placeId);
                if (config) {
                    map.set(placeId, config);
                }
            }
            setData(map);
        };
        setPlaceConfigMap(setPlaceConfig).then(r => r);
    }, [placeIdList]);

    let count = 0;

    return (<div className={cardListStyle}>
            {
                placeIdList.map((placeId) => {
                        count++;
                        if (count < 5) {
                            return <Link key={placeId} href={"/place/" + placeId} className={cardStyle}>
                                    <Image alt={placeId} src={placeConfig?.get(placeId)?.placeImageUrl ?? placeImage}
                                           className={imageSize}  placeholder="blur"/>
                                    {placeConfig?.get(placeId)?.placeName ?? placeId}
                            </Link>;
                        } else if (count === 5) {
                            return <Link key={"placeLink"} href={"/place/"}>
                                    もっとみる
                            </Link>;
                        }
                    },
                )
            }
        </div>
    );
}


function HorseBoard() {
    const [horseIdList, setHorseIdList] = useState<string []>([]);
    return (<div>
    </div>);
}

function ResultBoard() {
    return (<div></div>);
}

function ArticleBoard() {
    return (<div></div>);
}

// type interface
// extend function.
// function
async function getRaceConfig(name: string): Promise<RaceConfig> {
    const response = await fetch("/server-api/race/config/" + name);
    return (await response!!.json()).data;
}

async function getPlaceConfig(name: string): Promise<PlaceConfig | null> {
    const response = await fetch("/server-api/place/config/" + name);
    return (await response!!.json()).data;
}

// recoil
// selector
// style
const imageSize = css({
    width: "384px",
    height: "216px",
    marginBottom: "3px",
});

const cardListStyle = css({
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "left",
    alignItems: "center",
    alignContent: "center",
    width: "100%",
    marginTop: "10px",
    marginBottom: "20px",
});

const cardStyle = css({
    //backgroundColorが横に広がるのを防ぐ
    //テキストを中央に寄せる
    textAlign: "center",
    width: "404px",
    height: "265px",
    border: "1px solid var(--mui-palette-custom-card)",
    borderRadius: "20px",
    padding: "10px",
    marginRight: "10px",
    display: "flex",
    flexDirection: "column",
    backgroundColor: "var(--mui-palette-custom-card)",

});
// ssr ssg isr
// global function

export default Home;
