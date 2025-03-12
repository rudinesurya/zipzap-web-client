import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IUserRating } from '@rudinesurya/api-gateway-interfaces';

interface UserRatingsState {
    userRatings: IUserRating[];
    userRating: IUserRating | null;
    loading: boolean;
    error?: string;
}

const initialState: UserRatingsState = {
    userRatings: [],
    userRating: null,
    loading: false,
    error: undefined,
};

const userRatingsSlice = createSlice({
    name: 'user ratings',
    initialState,
    reducers: {
        fetchUserRatingsByRatedUserIdRequest(state, action: PayloadAction<{ id: string }>) {
            state.loading = true;
            state.error = undefined;
        },
        fetchUserRatingsByRatedUserIdSuccess(state, action: PayloadAction<{ userRatings: IUserRating[] }>) {
            state.userRatings = action.payload.userRatings;
            state.loading = false;
        },
        fetchUserRatingsByRatedUserIdFailure(state, action: PayloadAction<{ error: string }>) {
            state.loading = false;
            state.error = action.payload.error;
        },

        createUserRatingRequest(state, action: PayloadAction<{ data: any; }>) {
            state.loading = true;
            state.error = undefined;
        },
        createUserRatingSuccess(state, action: PayloadAction<{ userRating: IUserRating }>) {
            state.userRatings.push(action.payload.userRating);
            state.loading = false;
        },
        createUserRatingFailure(state, action: PayloadAction<{ error: string }>) {
            state.loading = false;
            state.error = action.payload.error;
        },

        updateUserRatingRequest(state, action: PayloadAction<{ id: string; data: any; }>) {
            state.loading = true;
            state.error = undefined;
        },
        updateUserRatingSuccess(state, action: PayloadAction<{ userRating: IUserRating }>) {
            const index = state.userRatings.findIndex((x) => x._id === action.payload.userRating._id);
            if (index !== -1) {
                state.userRatings[index] = action.payload.userRating;
            }
            if (state.userRating && state.userRating._id === action.payload.userRating._id) {
                state.userRating = action.payload.userRating;
            }
            state.loading = false;
        },
        updateUserRatingFailure(state, action: PayloadAction<{ error: string }>) {
            state.loading = false;
            state.error = action.payload.error;
        },

        deleteUserRatingRequest(state, action: PayloadAction<{ id: string; }>) {
            state.loading = true;
            state.error = undefined;
        },
        deleteUserRatingSuccess(state, action: PayloadAction<{ id: string }>) {
            state.userRatings = state.userRatings.filter((x) => x._id !== action.payload.id);
            state.loading = false;
        },
        deleteUserRatingFailure(state, action: PayloadAction<{ error: string }>) {
            state.loading = false;
            state.error = action.payload.error;
        },
    },
});

export const {
    fetchUserRatingsByRatedUserIdRequest,
    fetchUserRatingsByRatedUserIdSuccess,
    fetchUserRatingsByRatedUserIdFailure,
    createUserRatingRequest,
    createUserRatingSuccess,
    createUserRatingFailure,
    updateUserRatingRequest,
    updateUserRatingSuccess,
    updateUserRatingFailure,
    deleteUserRatingRequest,
    deleteUserRatingSuccess,
    deleteUserRatingFailure
} = userRatingsSlice.actions;
export default userRatingsSlice.reducer;
