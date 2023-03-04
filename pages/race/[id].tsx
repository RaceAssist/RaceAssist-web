import {NextPage} from "next";
import styles from "../../styles/Home.module.css";
import Head from "next/head";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

const Home: NextPage = () => {
    return (<div className={styles.container}>
                <Head>
                    <title>RaceAssist-web</title>
                    <meta name="description" content="Generated by create next app"/>
                    <link rel="icon" href="/favicon.png"/>
                </Head>
                <Navbar/>
                <Footer/>
            </div>);
};


// component
// type interface
// extend function
// function
// recoil
// selector
// style
// ssr ssg isr 
// global function
export default Home;