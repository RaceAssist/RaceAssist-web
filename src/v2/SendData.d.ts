interface History {
    raceId: String;
    rank: number;
}

interface BetConfig {
    autoReturn: boolean;
    available: boolean;
    betUnit: number;
    money: number;
    returnPercent: number;
    spreadSheetId: string | null;
}


interface Rectangle {
    x: number;
    y: number;
    width: number;
    height: number;
}

interface Polygon extends Shape {
    npoints: number;
    xpoints: number[];
    ypoints: number[];
    bounds: Rectangle;
}

interface UUID {
}

interface PlaceConfig {
    centralX: number | null;
    centralY: number | null;
    goalDegree: number;
    image: string | null;
    inside: Polygon;
    outside: Polygon;
    owner: UUID;
    placeId: string;
    placeName: string | null;
    placeImageUrl: string | null;
    reverse: boolean;
    staff: UUID[];
}

interface RaceConfig {
    betConfig: BetConfig;
    horse: { [key: UUID]: UUID };
    jockeys: UUID[];
    lap: number;
    owner: UUID;
    placeId: string;
    raceId: string;
    raceName: string;
    raceImageUrl: string | null;
    replacement: { [key: UUID]: string };
    staff: UUID[];
}
