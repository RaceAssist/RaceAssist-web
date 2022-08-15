interface PlayerRaceData {
    blockX: number | null;
    blockY: number | null;
    distance: number | null;
    finish: boolean;
    uuid: String;
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
    finish: string;
    horse: { [key: string]: string };
    insidePolygon: Pair<number, number>[];
    lap: number;
    outsidePolygon: Pair<number, number>[];
    raceId: string;
    raceUniqueId: string;
    rectangleData: RectangleData;
    replacement: { [key: string]: string };
    result: { [key: number]: string };
    start: string;
    suspend: boolean;
    uuidToName: { [key: string]: string };
    ver: string;
}

