import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { logout } from './authSlice'; // Import the logout action from your auth slice
import { IUser } from '@rudinesurya/api-gateway-interfaces';

interface UserState {
    user: IUser | null;
    loading: boolean;
    error?: string;
}

const initialState: UserState = {
    user: null,
    loading: false,
    error: undefined,
};

const usersSlice = createSlice({
    name: 'users',
    initialState,
    reducers: {
        fetchUserProfileRequest(state) {
            state.loading = true;
            state.error = undefined;
        },
        fetchUserProfileSuccess(state, action: PayloadAction<IUser>) {
            state.user = action.payload;
            state.loading = false;
        },
        fetchUserProfileFailure(state, action: PayloadAction<string>) {
            state.loading = false;
            state.error = action.payload;
        },
    },
    extraReducers: (builder) => {
        // When the auth logout action is dispatched, also clear the user user
        builder.addCase(logout, (state) => {
            state.user = null;
        });
    },
});

export const { fetchUserProfileRequest, fetchUserProfileSuccess, fetchUserProfileFailure } =
    usersSlice.actions;
export default usersSlice.reducer;
