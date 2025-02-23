import { call, put, takeLatest, select } from 'redux-saga/effects';
import {
    fetchUserProfileRequest,
    fetchUserProfileSuccess,
    fetchUserProfileFailure,
} from '../slices/usersSlice';
import { RootState } from '../store';

// Selector to get the API base URL from the config slice.
const selectApiBaseUrl = (state: RootState) => state.config.apiBaseUrl;
// Selector to get the auth token from the auth slice.
const selectAuthToken = (state: RootState) => state.auth.token;

const fetchUserProfileApi = async (apiBaseUrl: string, token: string) => {
    const response = await fetch(`${apiBaseUrl}/api/users/profile`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to fetch user profile');
    }

    return response.json();
}

function* fetchUserProfileSaga() {
    try {
        const token: string = yield select(selectAuthToken);
        if (!token) {
            throw new Error('No auth token found');
        }
        const apiBaseUrl: string = yield select(selectApiBaseUrl);
        const profile = yield call(fetchUserProfileApi, apiBaseUrl, token);
        yield put(fetchUserProfileSuccess(profile));
    } catch (error: any) {
        yield put(fetchUserProfileFailure(error.message));
    }
}

export function* usersSaga() {
    yield takeLatest(fetchUserProfileRequest.type, fetchUserProfileSaga);
}
