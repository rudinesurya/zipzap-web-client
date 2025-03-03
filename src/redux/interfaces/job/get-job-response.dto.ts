import { IJob } from "./job.interface";

export interface GetJobResponseDto {
    system_message: string;
    data: {
        job: IJob;
    };
    errors: { [key: string]: any } | null;
}