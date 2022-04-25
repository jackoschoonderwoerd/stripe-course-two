import { Musician } from "./musician";
import { Track } from "./track";

export interface CdInfo {
    imageUrl: string;
    title: string;
    bandName: string;
    recordingStudio: string;
    recordingEngineer: string;
    mixer: string;
    producer: string;
    publisher: string;
    recordingDate: number;
    price: number;
    id?: string;
}




export interface Cd {
    id?: string,
    cdInfo: CdInfo;
    tracks: Track[]
    musicians: Musician[]
    queryStrings?: string[]
}

// export interface Cd {
//     title: string;
//     price:number;
//     id?: string;
// }
