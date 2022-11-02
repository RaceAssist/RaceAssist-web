import { v4 as UUID } from "uuid";

interface PlayerRaceData {
    blockX: number | null;
    blockY: number | null;
    distance: number | null;
    finish: boolean;
    uuid: UUID;
}

interface CurrentRaceData {
    playerRaceData: PlayerRaceData[];
    time: number;
}

interface Pair<A, B> {
    first: A;
    second: B;
}

interface RectangleData {
    x1: number;
    x2: number;
    y1: number;
    y2: number;
}

interface RaceResultData {
    administrator: string;
    currentRaceData: CurrentRaceData[];
    distance: number;
    finish: Date;
    horse: { [key: UUID]: UUID };
    image: string | null;
    insidePolygon: Pair<number, number>[];
    lap: number;
    outsidePolygon: Pair<number, number>[];
    raceId: string;
    raceUniqueId: string;
    rectangleData: RectangleData;
    replacement: { [key: UUID]: string };
    result: { [key: number]: UUID };
    start: Date;
    suspend: boolean;
    uuidToName: { [key: UUID]: string };
    ver: string;
}
