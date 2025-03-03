import { IJob } from "./job.interface";

export interface CreateJobResponseDto {
    system_message: string;
    data: {
        job: IJob;
    };
    errors: { [key: string]: any } | null;
}