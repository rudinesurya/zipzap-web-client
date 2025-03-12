import { call, put, takeLatest, select } from 'redux-saga/effects';
import { createUserRatingRequest, updateUserRatingRequest, deleteUserRatingRequest, updateUserRatingSuccess, createUserRatingFailure, createUserRatingSuccess, deleteUserRatingFailure, deleteUserRatingSuccess, updateUserRatingFailure, fetchUserRatingsByRatedUserIdFailure, fetchUserRatingsByRatedUserIdSuccess, fetchUserRatingsByRatedUserIdRequest } from '../slices/userRatingsSlice';
import { RootState } from '../store';
import { CreateUserRatingResponseDto, UpdateUserRatingResponseDto, DeleteUserRatingResponseDto, GetUserRatingsByRatedUserIdResponseDto } from '@rudinesurya/api-gateway-interfaces';

const selectApiBaseUri = (state: RootState) => state.config.apiBaseUri;
const selectAuthToken = (state: RootState) => state.auth.token;

const fetchUserRatingsByRatedUserIdApi = async (apiBaseUri: string, id: string, token: string) => {
    const response = await fetch(`${apiBaseUri}/api/user_ratings/user/${id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
    });

    const responseData: GetUserRatingsByRatedUserIdResponseDto = await response.json();

    if (!response.ok) {
        throw new Error(responseData.system_message || 'Failed to fetch user ratings');
    }

    return responseData;
}

function* fetchUserRatingsByRatedUserIdSaga(action: { payload: { id: string; }; type: string }) {
    try {
        const apiBaseUri: string = yield select(selectApiBaseUri);
        const token: string = yield select(selectAuthToken);
        const response: GetUserRatingsByRatedUserIdResponseDto = yield call(fetchUserRatingsByRatedUserIdApi, apiBaseUri, action.payload.id, token);
        yield put(fetchUserRatingsByRatedUserIdSuccess({ userRatings: response.data.user_ratings }));
    } catch (error: any) {
        yield put(fetchUserRatingsByRatedUserIdFailure({ error: error.message }));
    }
}

const createUserRatingApi = async (apiBaseUri: string, payload: any, token: string) => {
    const response = await fetch(`${apiBaseUri}/api/user_ratings`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
    });
    const responseData: CreateUserRatingResponseDto = await response.json();

    if (!response.ok) {
        throw new Error(responseData.system_message || 'Failed to create user rating');
    }

    return responseData;
}

function* createUserRatingSaga(action: { payload: { data: any; }; type: string }) {
    try {
        const apiBaseUri: string = yield select(selectApiBaseUri);
        const token: string = yield select(selectAuthToken);
        const response: CreateUserRatingResponseDto = yield call(createUserRatingApi, apiBaseUri, action.payload.data, token);
        yield put(createUserRatingSuccess({ userRating: response.data.user_rating }));
    } catch (error: any) {
        yield put(createUserRatingFailure({ error: error.message }));
    }
}

const updateUserRatingApi = async (apiBaseUri: string, id: string, payload: any, token: string) => {
    const response = await fetch(`${apiBaseUri}/api/user_ratings/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
    });
    const responseData: UpdateUserRatingResponseDto = await response.json();

    if (!response.ok) {
        throw new Error(responseData.system_message || 'Failed to update user rating');
    }

    return responseData;
}

function* updateUserRatingSaga(action: { payload: { id: string; data: any; }; type: string }) {
    try {
        const apiBaseUri: string = yield select(selectApiBaseUri);
        const token: string = yield select(selectAuthToken);
        const response: UpdateUserRatingResponseDto = yield call(updateUserRatingApi, apiBaseUri, action.payload.id, action.payload.data, token);
        yield put(updateUserRatingSuccess({ userRating: response.data.user_rating }));
    } catch (error: any) {
        yield put(updateUserRatingFailure({ error: error.message }));
    }
}

const deleteUserRatingApi = async (apiBaseUri: string, id: string, token: string) => {
    const response = await fetch(`${apiBaseUri}/api/user_ratings/${id}`, {
        method: 'DELETE',
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    const responseData: DeleteUserRatingResponseDto = await response.json();

    if (!response.ok) {
        throw new Error(responseData.system_message || 'Failed to delete user rating');
    }

    return responseData;
}

function* deleteUserRatingSaga(action: { payload: { id: string; }; type: string }) {
    try {
        const apiBaseUri: string = yield select(selectApiBaseUri);
        const token: string = yield select(selectAuthToken);
        yield call(deleteUserRatingApi, apiBaseUri, action.payload.id, token);
        yield put(deleteUserRatingSuccess({ id: action.payload.id }));
    } catch (error: any) {
        yield put(deleteUserRatingFailure({ error: error.message }));
    }
}

export function* userRatingsSaga() {
    yield takeLatest(fetchUserRatingsByRatedUserIdRequest.type, fetchUserRatingsByRatedUserIdSaga);
    yield takeLatest(createUserRatingRequest.type, createUserRatingSaga);
    yield takeLatest(updateUserRatingRequest.type, updateUserRatingSaga);
    yield takeLatest(deleteUserRatingRequest.type, deleteUserRatingSaga);
}
