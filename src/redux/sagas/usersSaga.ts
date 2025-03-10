import { call, put, takeLatest, select } from 'redux-saga/effects';
import {
    fetchUserProfileRequest,
    fetchUserProfileSuccess,
    fetchUserProfileFailure,
} from '../slices/usersSlice';
import { RootState } from '../store';
import { GetUserResponseDto } from '@rudinesurya/api-gateway-interfaces';

const selectApiBaseUri = (state: RootState) => state.config.apiBaseUri;
const selectAuthToken = (state: RootState) => state.auth.token;

const fetchUserProfileApi = async (apiBaseUri: string, token: string) => {
    const response = await fetch(`${apiBaseUri}/api/users`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
    });

    const responseData: GetUserResponseDto = await response.json();

    if (!response.ok) {
        throw new Error(responseData.system_message || 'Failed to fetch user profile');
    }

    return responseData;
}

function* fetchUserProfileSaga() {
    try {
        const token: string = yield select(selectAuthToken);
        if (!token) {
            throw new Error('No auth token found');
        }
        const apiBaseUri: string = yield select(selectApiBaseUri);
        const response: GetUserResponseDto = yield call(fetchUserProfileApi, apiBaseUri, token);
        yield put(fetchUserProfileSuccess(response.data.user));
    } catch (error: any) {
        yield put(fetchUserProfileFailure(error.message));
    }
}

export function* usersSaga() {
    yield takeLatest(fetchUserProfileRequest.type, fetchUserProfileSaga);
}
