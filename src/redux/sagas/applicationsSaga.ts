import { call, put, takeLatest, select } from 'redux-saga/effects';
import {
    fetchApplicationRequest,
    fetchApplicationSuccess,
    fetchApplicationFailure,
    createApplicationRequest,
    createApplicationSuccess,
    createApplicationFailure,
} from '../slices/applicationsSlice';
import { RootState } from '../store';
import { GetApplicationResponseDto, CreateApplicationResponseDto } from '@rudinesurya/api-gateway-interfaces';

// Selector to get API base URL from config slice
const selectApiBaseUri = (state: RootState) => state.config.apiBaseUri;

const fetchApplicationApi = async (apiBaseUri: string, id: string) => {
    const response = await fetch(`${apiBaseUri}/api/applications/${id}`);
    const responseData: GetApplicationResponseDto = await response.json();

    if (!response.ok) {
        throw new Error(responseData.system_message || 'Failed to fetch application');
    }

    return responseData;
}

function* fetchApplicationSaga(action: { payload: string; type: string }) {
    try {
        const apiBaseUri: string = yield select(selectApiBaseUri);
        const response: GetApplicationResponseDto = yield call(fetchApplicationApi, apiBaseUri, action.payload);
        yield put(fetchApplicationSuccess(response.data.application));
    } catch (error: any) {
        yield put(fetchApplicationFailure(error.message));
    }
}

const createApplicationApi = async (apiBaseUri: string, payload: any, token: string) => {
    const response = await fetch(`${apiBaseUri}/api/applications`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
    });
    const responseData: CreateApplicationResponseDto = await response.json();

    if (!response.ok) {
        throw new Error(responseData.system_message || 'Failed to create application');
    }

    return responseData;
}

function* createApplicationSaga(action: { payload: { data: any; token: string }; type: string }) {
    try {
        const apiBaseUri: string = yield select(selectApiBaseUri);
        const response: CreateApplicationResponseDto = yield call(createApplicationApi, apiBaseUri, action.payload.data, action.payload.token);
        yield put(createApplicationSuccess(response.data.application));
    } catch (error: any) {
        yield put(createApplicationFailure(error.message));
    }
}

export function* applicationsSaga() {
    yield takeLatest(fetchApplicationRequest.type, fetchApplicationSaga);
    yield takeLatest(createApplicationRequest.type, createApplicationSaga);
}
