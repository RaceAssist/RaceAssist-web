import { GetStaticProps, NextPage } from "next";
import styles from "../../styles/Home.module.css";
import Head from "next/head";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { HorseData, RowHorseData } from "../../src/v1/HorseData";
import dayjs from "dayjs";
import { DataGrid, GridColDef, GridValueGetterParams, jaJP } from "@mui/x-data-grid";
import { calculateRank, getUsername } from "./index";
import { useEffect, useState } from "react";
import Link from "next/link";


const Home: NextPage<PageProps> = (props: PageProps) => {
    return (<div className={styles.container}>
        <Head>
            <title>RaceAssist-web</title>
            <meta name="description" content="Generated by create next app" />
            <link rel="icon" href="/favicon.png" />
        </Head>
        <Navbar />
        <DataTable list={props.props.data} />
        <Footer />
    </div>);
};


// component
function DataTable(props: { list: HorseData[] }) {
    const row: RowHorseData[] = [];

    props.list.forEach((value, index, arr) => {

        // eslint-disable-next-line react-hooks/rules-of-hooks
        const [ownerName, setOwnerName] = useState("");
        // eslint-disable-next-line react-hooks/rules-of-hooks
        const [breederName, setBreederName] = useState("");
        // eslint-disable-next-line react-hooks/rules-of-hooks
        useEffect(() => {
            const fetchName = async () => {
                const result = await getUsername(value.owner);
                setOwnerName(result);
                const result2 = await getUsername(value.breeder);
                setBreederName(result2);
            };
            fetchName().then((r) => r);
        }, [value.breeder, value.owner]);

        row.push({
            id: index,
            breeder: breederName,
            color: value.color,
            deathDate: value.deathDate,
            horse: value.horse,
            speed: value.speed.toRound(2),
            jump: value.jump.toRound(2),
            name: value.name,
            owner: ownerName,
            rank: calculateRankWithScore(value).toString(),
            style: value.style,
        });
    });

    const columns: GridColDef[] = [{
        field: "id",
        headerName: "名前",
        width: 130,
        valueGetter: (params: GridValueGetterParams) => `${params.row.name != null ? params.row.name : "不明"} `,
    }, { field: "rank", headerName: "スコア", width: 130 }, {
        field: "breeder", headerName: "繫殖者", width: 200,
    }, { field: "owner", headerName: "所有者", width: 200 }, {
        field: "color", headerName: "カラー", width: 150,
    }, { field: "style", headerName: "スタイル", width: 150 }, {
        field: "speed", headerName: "スピード", width: 130,
    }, { field: "jump", headerName: "ジャンプ", width: 130 }, {
        field: "live",
        headerName: "生存",
        width: 130,
        renderCell: (params) => (<>{params.row.deathDate == null ? <div color={"green"}>生存</div> : <div color={"red"}>死亡</div> }</>),
        valueGetter: (params: GridValueGetterParams) => `${params.row.deathDate == null ? "生存" : "死亡"} `,
    }, {
        field: "link",
        headerName: "リンク",
        width: 300,
        renderCell: (params) => (<Link href={`/horse/${params.row.horse}`}>{params.row.horse}</Link>),
    }];

    return (<div style={{ height: 631, width: "100%", marginBottom: "50px" }}>
        <DataGrid
            rows={row}
            columns={columns}
            initialState={{
                pagination: { paginationModel: { pageSize: 10 } },
            }}
            pageSizeOptions={[10]}
            localeText={jaJP.components.MuiDataGrid.defaultProps.localeText}
        />
    </div>);
}

// type interface
type PageProps = {
    props: {
        data: HorseData[]; lastUpdate: string;
    };
};


// extend function
// function
function calculateRankWithScore(data: HorseData): String {
    const speed = data.speed.valueOf() / 42.162962963;
    const jump = data.jump.valueOf();
    const jumpRate = Math.floor(jump * 2.0) / (2.0 * 5.0);
    const valMax = 0.3375 * 10 + 1.0;
    const value = speed * 10 + jumpRate;
    const rankString: String[] = ["G", "G", "G", "F", "F", "F", "E", "E", "E", "D", "D", "D", "C", "C+", "C++", "B", "B+", "B++", "A", "A+", "A++", "S", "S+", "S++", "LEGEND"];
    const rate = (value / valMax) * 2.0 - 1.0;
    const pt = Math.floor(rate * rankString.length);
    if (pt >= rankString.length) {
        return rankString[rankString.length - 1];
    }
    if (pt < 0) {
        return rankString[0];
    }

    return `${value.toRound(2)} (${rankString[pt]})`;
}

// recoil
// selector
// style
// ssr ssg isr
export const getStaticProps: GetStaticProps = async (context) => {
    // ファイル名が [id].tsx なので id パラメーターを取り出すことができる
    const res = await fetch(process.env.RACEASSIST_API_WEBHOOK_URL + "/v1/horse/listAll");
    let horseData = (await res.json()) as HorseData[];

    return {
        props: {
            props: {
                data: horseData, lastUpdate: `${dayjs().tz("Asia/Tokyo").format("YYYY/MM/DD HH:mm:ss")} JST`,
            },
        }, revalidate: 60,
    };
};
// global function
export default Home;