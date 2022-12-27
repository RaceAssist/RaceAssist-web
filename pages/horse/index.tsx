import { GetStaticProps, NextPage } from "next";
import styles from "../../styles/Home.module.css";
import Head from "next/head";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { HorseData } from "../../src/v1/raceResult";
import React, { useEffect, useState } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { CardActionArea } from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import Slider from "@mui/material/Slider";
import { atom, selector, useRecoilState, useRecoilValue } from "recoil";
import Box from "@mui/material/Box";
import { css } from "@emotion/css";
import Image from "next/image";

const color = ["BLACK", "BROWN", "CHESTNUT", "CREAMY", "DARK_BROWN", "GRAY", "WHITE"];
const style = ["BLACK_DOTS", "NONE", "WHITE", "WHITE_DOTS", "WHITEFIELD"];
const minDistance = 0.1;
const speed = atom({
    key: "speed",
    default: {
        min: 8.0,
        max: 15.0,
    },
});

const speedSelector = selector({
    key: "speedSelector",
    get: ({ get }) => {
        return get(speed);
    },
    set: ({ set }, newValue) => {
        set(speed, newValue);
    },
});

const jump = atom({
    key: "jump",
    default: {
        min: 2.0,
        max: 5.5,
    },
});

const jumpSelector = selector({
    key: "jumpSelector",
    get: ({ get }) => {
        return get(jump);
    },
    set: ({ set }, newValue) => {
        set(jump, newValue);
    },
});

function LimitHorseSpeed() {
    const [speedValue, setSpeedValue] = useRecoilState(speedSelector);
    const handleChange1 = (event: Event, newValue: number | number[], activeThumb: number) => {
        if (!Array.isArray(newValue)) {
            return;
        }
        if (activeThumb === 0) {
            setSpeedValue({
                min: Math.min(newValue[0], speedValue.max - minDistance),
                max: speedValue.max,
            });
        } else {
            setSpeedValue({
                min: speedValue.min,
                max: Math.max(newValue[1], speedValue.min + minDistance),
            });
        }
    };
    return (
        <Slider
            getAriaLabel={() => "Minimum distance"}
            value={[speedValue.min, speedValue.max]}
            onChange={handleChange1}
            valueLabelDisplay="auto"
            step={0.1}
            min={8.0}
            max={14.6}
        />
    );
}

function LimitHorseJump() {
    const [jumpValue, setJumpValue] = useRecoilState(jumpSelector);
    const handleChange1 = (event: Event, newValue: number | number[], activeThumb: number) => {
        if (!Array.isArray(newValue)) {
            return;
        }
        if (activeThumb === 0) {
            setJumpValue({
                min: Math.min(newValue[0], jumpValue.max - minDistance),
                max: jumpValue.max,
            });
        } else {
            setJumpValue({
                min: jumpValue.min,
                max: Math.max(newValue[1], jumpValue.min + minDistance),
            });
        }
    };
    return (
        <Slider
            getAriaLabel={() => "Minimum distance"}
            value={[jumpValue.min, jumpValue.max]}
            onChange={handleChange1}
            valueLabelDisplay="auto"
            step={0.1}
            min={2.0}
            max={5.5}
        />
    );
}

const Home: NextPage<PageProps> = (props: PageProps) => {
    const [selectedColor, setSelectedColor] = useState<string[]>([]);
    const [selectedStyle, setSelectedStyle] = useState<string[]>([]);
    return (
        <div className={styles.container}>
            <Head>
                <title>/ RaceAssist</title>
                <meta name="description" content="RaceAssist-web" />
                <link rel="icon" href="/favicon.png" />
            </Head>
            <Navbar />
            最終更新日時 : {props.props.lastUpdate}
            <Box sx={{ width: 600 }} className={selectHorseStatusStyle}>
                <SelectHorseColorOption selector={setSelectedColor} />
                <SelectHorseStyleOption selector={setSelectedStyle} />
                <LimitHorseSpeed />
                <LimitHorseJump />
            </Box>
            <HorseList
                list={props.props.data}
                selectedColor={selectedColor}
                selectedStyle={selectedStyle}
            />
            <Footer />
        </div>
    );
};

function SelectHorseColorOption(props: { selector: (value: string[]) => void }) {
    return (
        <Autocomplete
            className={skinStyle}
            multiple
            id="Color"
            options={color}
            getOptionLabel={(option) => option}
            defaultValue={[]}
            onChange={(e, v) => props.selector(v)}
            renderInput={(params) => (
                <TextField
                    {...params}
                    variant="standard"
                    label="カラー"
                    placeholder="カラーを選択"
                />
            )}
        />
    );
}

function SelectHorseStyleOption(props: { selector: (value: string[]) => void }) {
    return (
        <Autocomplete
            className={skinStyle}
            multiple
            id="Style"
            options={style}
            getOptionLabel={(option) => option}
            defaultValue={[]}
            onChange={(e, v) => props.selector(v)}
            renderInput={(params) => (
                <TextField
                    {...params}
                    variant="standard"
                    label="スタイル"
                    placeholder="スタイルを選択"
                />
            )}
        />
    );
}

function HorseList(props: { list: HorseData[]; selectedColor: string[]; selectedStyle: string[] }) {
    const list = props.list;
    const speedLimit = useRecoilValue(speed);
    const jumpLimit = useRecoilValue(jump);
    return (
        <div className={listStyle}>
            {list
                .filter(
                    (data) =>
                        props.selectedColor.includes(data.color) ||
                        props.selectedColor.length === 0,
                )
                .filter(
                    (data) =>
                        props.selectedStyle.includes(data.style) ||
                        props.selectedStyle.length === 0,
                )
                .filter((data) => data.speed >= speedLimit.min && data.speed <= speedLimit.max)
                .filter((data) => data.jump >= jumpLimit.min && data.jump <= jumpLimit.max)
                .map((data) => {
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
                    maxWidth: "300", // circle around the edge
                    borderRadius: "10%",
                }}
            >
                <CardActionArea href={"/horse/" + data.horse}>
                    <CardContent>
                        <Image
                            src={imageUrl}
                            alt={data.horse}
                            className={mediaStyle}
                            width={200}
                            height={200 * (100 / 90)}
                        />

                        <Typography sx={{ fontSize: 14 }} variant="body1" color="text.secondary">
                            <ul className={playerTypography}>
                                <li>馬主 : {ownerName}</li>
                                <li>生産者 : {breederName}</li>
                                <li>馬名 : {data.name ?? "なし"}</li>
                            </ul>
                            <ul className={horseTypography}>
                                <li>ランク : {calculateRank(data)}</li>
                                <li>スピード : {data.speed.toRound(2).toString()}</li>
                                <li>ジャンプ : {data.jump.toRound(2).toString()}</li>
                                <li>ステータス : {data.deathData == null ? "生存" : "死亡"}</li>
                            </ul>
                        </Typography>
                    </CardContent>
                </CardActionArea>
            </Card>
        </div>
    );
}

type PageProps = {
    props: {
        data: HorseData[];
        lastUpdate: string;
    };
};
const listStyle = css({
    display: "flex",
    flexWrap: "wrap",
    textAlign: "center",
});

const selectHorseStatusStyle = css({});

const skinStyle = css({});

const playerTypography = css({
    textAlign: "left",
    marginBottom: "0px",
});

const horseTypography = css({
    marginTop: "0px",
    columnCount: 2,
    textAlign: "left",
});

const mediaStyle = css({
    padding: "20px",
});

const boxStyle = css({
    padding: "10px",
    flexBasis: "20%",
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
            props: {
                data: horseData,
                lastUpdate: new Date().toLocaleString(),
            },
        },
        revalidate: 60,
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

function calculateRank(data: HorseData): String {
    const speed = data.speed.valueOf() / 42.162962963;
    const jump = data.jump.valueOf();
    const jumpRate = Math.floor(jump * 2.0) / (2.0 * 5.0);
    const valMax = 0.3375 * 10 + 1.0;
    const value = speed * 10 + jumpRate;
    const rankString: String[] = [
        "G",
        "G",
        "G",
        "F",
        "F",
        "F",
        "E",
        "E",
        "E",
        "D",
        "D",
        "D",
        "C",
        "C+",
        "C++",
        "B",
        "B+",
        "B++",
        "A",
        "A+",
        "A++",
        "S",
        "S+",
        "S++",
        "LEGEND",
    ];
    const rate = (value / valMax) * 2.0 - 1.0;
    const pt = Math.floor(rate * rankString.length);
    if (pt >= rankString.length) {
        return rankString[rankString.length - 1];
    }
    if (pt < 0) {
        return rankString[0];
    }

    return rankString[pt];
}

export default Home;
