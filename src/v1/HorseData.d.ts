import { v4 as UUID } from "uuid";

interface HorseData {
    horse: UUID;
    breeder: UUID | null;
    owner: UUID | null;
    mother: UUID | null;
    father: UUID | null;
    history: History[];
    color: string;
    style: string;
    speed: Number;
    jump: Number;
    health: Number;
    name: string | null;
    birthDate: Date | null;
    lastRecordDate: Date;
    deathDate: Date | null;
}

interface RowHorseData {
    id: number;
    rank: string;
    horse: UUID;
    breeder: string | null;
    owner: string | null;
    color: string;
    style: string;
    speed: Number;
    jump: Number;
    name: string | null;
    deathDate: Date | null;
}