import { IJob } from "./job.interface";

export interface GetJobsResponseDto {
    system_message: string;
    data: {
        jobs: IJob[];
    };
    errors: { [key: string]: any } | null;
}