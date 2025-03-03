import { IJob } from "./job.interface";

export interface UpdateJobResponseDto {
    system_message: string;
    data: {
        job: IJob;
    };
    errors: { [key: string]: any } | null;
}