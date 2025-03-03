import { IUser } from "./user.interface";

export interface CreateUserResponseDto {
    system_message: string;
    data: {
        user: IUser;
        token: string;
    };
    errors: { [key: string]: any } | null;
}