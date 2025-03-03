export interface LoginUserResponseDto {
    system_message: string;
    data: {
        token: string;
    };
    errors: { [key: string]: any } | null;
}