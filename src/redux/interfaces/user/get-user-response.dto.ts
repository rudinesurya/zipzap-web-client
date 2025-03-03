import { IUser } from "./user.interface";

export interface GetUserResponseDto {
    system_message: string;
    data: {
        user: IUser;
    };
    errors: { [key: string]: any } | null;
}