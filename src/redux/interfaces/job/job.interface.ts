import { ILocation } from "./location.interface";

export interface IJob {
    _id: string;
    title: string;
    description: string;
    location: ILocation;
    salary: number;
    posted_by: string;
}