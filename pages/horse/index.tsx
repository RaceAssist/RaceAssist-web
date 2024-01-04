import { GetStaticProps, NextPage } from "next";
import styles from "../../styles/Home.module.css";
import Head from "next/head";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { HorseData } from "../../src/v1/HorseData";
import React, { useEffect, useState } from "react";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { CardActionArea, Collapse, FormControlLabel, IconButton, IconButtonProps, Switch } from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import Slider from "@mui/material/Slider";
import { css } from "@emotion/css";
import Image from "next/image";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { styled } from "@mui/material/styles";
import Card from "@mui/material/Card";
import { useAtom } from "jotai";
import { colorAtom, expandAtom, horseAliveAtom, jumpLimitAtom, speedLimitAtom, styleAtom } from "../../src/atoms";

dayjs.extend(timezone);
dayjs.extend(utc);

const colorList = ["BLACK", "BROWN", "CHESTNUT", "CREAMY", "DARK_BROWN", "GRAY", "WHITE"];
const styleList = ["BLACK_DOTS", "NONE", "WHITE", "WHITE_DOTS", "WHITEFIELD"];
const minDistance = 0.1;

interface ExpandMoreProps extends IconButtonProps {
    expand: boolean;
}

const ExpandMore = styled((props: ExpandMoreProps) => {
    const { expand, ...other } = props;
    return <IconButton {...other} />;
})(({ theme, expand }) => ({
    transform: !expand ? "rotate(0deg)" : "rotate(180deg)",
    marginLeft: "auto",
    transition: theme.transitions.create("transform", {
        duration: theme.transitions.duration.standard,
    }),
}));

const Home: NextPage<PageProps> = (props: PageProps) => {
    return (<div className={styles.container}>
        <Head>
            <title>horse / RaceAssist</title>
            <meta name="description" content="RaceAssist-web" />
            <link rel="icon" href="/favicon.png" />
        </Head>
        <Navbar />
        <div className={horseStatusDisplayStyle}>
            <FilterComponent />
            <div className={lastUpdateDateStyle}>最終更新日時 : {props.props.lastUpdate}</div>
        </div>
        <HorseList list={props.props.data} />
        <Footer />
    </div>);
};

// component
function FilterComponent() {
    const [expandValue, setExpandValue] = useAtom(expandAtom);
    const handleExpandClick = () => {
        setExpandValue(!expandValue);
    };
    return (<div className={filterStyle}>
            <ExpandMore
                expand={expandValue}
                onClick={handleExpandClick}
                aria-expanded={expandValue}
                aria-label="show more"
            >
                <ExpandMoreIcon />
            </ExpandMore>
            詳細なフィルター
            <Card
                sx={{
                    width: 700,
                    display: "flex",
                    alignItems: "center",
                }}
                className={selectHorseStatusStyle}
            >
                <Collapse
                    sx={{
                        paddingLeft: "50px",
                        paddingRight: "50px",
                        paddingTop: "10px",
                        paddingBottom: "30px", //中央に配置
                    }}
                    in={expandValue}
                    timeout="auto"
                    unmountOnExit
                >
                    <SelectHorseColorOption />
                    <SelectHorseStyleOption />
                    <div className={limiterStyle}>
                        <LimitHorseSpeed />
                        <LimitHorseJump />
                    </div>
                    <HorseAliveButton />
                </Collapse>
            </Card>
        </div>
    );
}

function LimitHorseSpeed() {
    const [speedValue, setSpeedValue] = useAtom(speedLimitAtom);
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
        <div>
            速度
            <Slider
                sx={{
                    marginLeft: "10px",
                    marginTop: "10px",
                    width: "580px",
                }}
                getAriaLabel={() => "Minimum distance"}
                value={[speedValue.min, speedValue.max]}
                onChange={handleChange1}
                getAriaValueText={speedValueText}
                valueLabelFormat={speedValueText}
                valueLabelDisplay="auto"
                step={0.1}
                min={8.0}
                max={14.6}
            />
        </div>
    );
}

function LimitHorseJump() {
    const [jumpValue, setJumpValue] = useAtom(jumpLimitAtom);
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
        <div>
            ジャンプ力
            <Slider
                sx={{
                    marginLeft: "10px",
                    marginTop: "10px",
                    width: "580px",
                }}
                value={[jumpValue.min, jumpValue.max]}
                onChange={handleChange1}
                getAriaValueText={jumpValueText}
                valueLabelFormat={jumpValueText}
                valueLabelDisplay="auto"
                step={0.1}
                min={2.0}
                max={5.5}
            />
        </div>
    );
}

function HorseAliveButton() {
    const [alive, setAlive] = useAtom(horseAliveAtom);
    return (
        <div>
            <FormControlLabel
                sx={{
                    display: "block",
                    marginTop: "10px",
                }}
                control={
                    <Switch
                        sx={{
                            marginLeft: "3px",
                        }}
                        checked={alive}
                        onChange={() => setAlive(!alive)}
                        name="loading"
                        color="primary"
                    />
                }
                label="生存中のみ表示"
            />
        </div>
    );
}

function SelectHorseColorOption() {
    const [, setSelectedColor] = useAtom(colorAtom);
    return (
        <Autocomplete
            className={skinStyle}
            multiple
            id="Color"
            options={colorList}
            getOptionLabel={(option) => option}
            defaultValue={[]}
            onChange={(e, v) => setSelectedColor(v)}
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

function SelectHorseStyleOption() {
    const [, setSelectedStyle] = useAtom(styleAtom);
    return (
        <Autocomplete
            className={skinStyle}
            multiple
            id="Style"
            options={styleList}
            getOptionLabel={(option) => option}
            defaultValue={[]}
            onChange={(e, v) => setSelectedStyle(v)}
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

function HorseList(props: { list: HorseData[] }) {
    const list = props.list;
    const [speedLimit, setSpeedValue] = useAtom(speedLimitAtom);
    const [jumpLimit, setJumpValue] = useAtom(jumpLimitAtom);
    const [selectedColor, setSelectedColor] = useAtom(colorAtom);
    const [selectedStyle, setSelectedStyle] = useAtom(styleAtom);
    const [alive, setAlive] = useAtom(horseAliveAtom);
    return (
        <div className={listStyle}>
            {list
                .filter((data) => selectedColor.includes(data.color) || selectedColor.length === 0)
                .filter((data) => selectedStyle.includes(data.style) || selectedStyle.length === 0)
                .filter((data) => data.speed.valueOf() >= speedLimit.min && data.speed.valueOf() <= speedLimit.max)
                .filter((data) => data.jump.valueOf() >= jumpLimit.min && data.jump.valueOf() <= jumpLimit.max)
                .filter((data) => !alive || data.deathDate == null)
                .map((data) => {
                    return <HorseCard key={data.horse.toString()} data={data} />;
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
                    borderRadius: "20px",
                }}
            >
                <CardActionArea href={"/horse/" + data.horse}>
                    <CardContent>
                        <Image
                            src={imageUrl}
                            alt={data.horse.toString()}
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
                                <li>スピード : {data.speed.toRound(2)
                                    .toString()}</li>
                                <li>ジャンプ : {data.jump.toRound(2)
                                    .toString()}</li>
                                <li>ステータス : {data.deathDate == null ? "生存" : "死亡"}</li>
                            </ul>
                        </Typography>
                    </CardContent>
                </CardActionArea>
            </Card>
        </div>);
}

//type interface
type PageProps = {
    props: {
        data: HorseData[]; lastUpdate: string;
    };
};

//extend function
declare global {
    interface Number {
        toRound(base: Number): Number;
    }
}

Number.prototype.toRound = function(base: Number) {
    return Math.round(this.valueOf() * Math.pow(10, base.valueOf())) / Math.pow(10, base.valueOf());
};

// function
function speedValueText(value: number) {
    return `${value} m/s`;
}

function jumpValueText(value: number) {
    return `${value} m`;
}


// style
const horseStatusDisplayStyle = css({
    display: "flex", justifyContent: "space-between",
});
const filterStyle = css({});

const lastUpdateDateStyle = css({
    textAlign: "right",
});

const limiterStyle = css({
    marginTop: "10px",
});

const listStyle = css({
    display: "flex", flexWrap: "wrap", textAlign: "center",
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

//ssr ssg isr
export const getStaticProps: GetStaticProps = async (context) => {
    // ファイル名が [id].tsx なので id パラメーターを取り出すことができる
    const res = await fetch(process.env.RACEASSIST_API_WEBHOOK_URL + "/v1/horse/listAll");
    let horseData = (await res.json()) as HorseData[];

    return {
        props: {
            props: {
                data: horseData,
                lastUpdate: `${dayjs().tz("Asia/Tokyo").format("YYYY/MM/DD HH:mm:ss")} JST`,
            },
        },
        revalidate: 60,
    };
};

//global function
export async function getUsername(uuid: UUID | null): Promise<string> {
    if (uuid == null) {
        return "不明";
    }
    const cache = await caches.open("username");
    const requestUrl = `https://playerdb.co/api/player/minecraft/${uuid.toString()}`;
    let cacheData = await cache.match(requestUrl);
    if (!cacheData?.status) {
        await cache.add(requestUrl);
        cacheData = await cache.match(requestUrl);
    }
    const data = await cacheData!!.json();
    return data.data.player.username;

    //const res = await fetch("https://playerdb.co/api/player/minecraft/" + uuid);
    //     const data = await res.json();
    //     return data.data.player.username;
}

export function calculateRank(data: HorseData): String {
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
