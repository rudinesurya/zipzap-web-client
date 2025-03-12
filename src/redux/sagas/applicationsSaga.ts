import { call, put, takeLatest, select } from 'redux-saga/effects';
import {
    fetchApplicationRequest,
    fetchApplicationSuccess,
    fetchApplicationFailure,
    fetchApplicationsByJobIdRequest,
    fetchApplicationsByJobIdSuccess,
    fetchApplicationsByJobIdFailure,
    createApplicationRequest,
    createApplicationSuccess,
    createApplicationFailure,
} from '../slices/applicationsSlice';
import { RootState } from '../store';
import { GetApplicationResponseDto, CreateApplicationResponseDto, GetApplicationsResponseDto } from '@rudinesurya/api-gateway-interfaces';

// Selector to get API base URL from config slice
const selectApiBaseUri = (state: RootState) => state.config.apiBaseUri;
const selectAuthToken = (state: RootState) => state.auth.token;

const fetchApplicationApi = async (apiBaseUri: string, id: string) => {
    const response = await fetch(`${apiBaseUri}/api/applications/${id}`);
    const responseData: GetApplicationResponseDto = await response.json();

    if (!response.ok) {
        throw new Error(responseData.system_message || 'Failed to fetch application');
    }

    return responseData;
}

function* fetchApplicationSaga(action: { payload: { id: string; }; type: string }) {
    try {
        const apiBaseUri: string = yield select(selectApiBaseUri);
        const response: GetApplicationResponseDto = yield call(fetchApplicationApi, apiBaseUri, action.payload.id);
        yield put(fetchApplicationSuccess({ application: response.data.application }));
    } catch (error: any) {
        yield put(fetchApplicationFailure({ error: error.message }));
    }
}

const fetchApplicationsByJobIdApi = async (apiBaseUri: string, id: string, token: string) => {
    const response = await fetch(`${apiBaseUri}/api/applications/job/${id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
    });
    const responseData: GetApplicationsResponseDto = await response.json();

    if (!response.ok) {
        throw new Error(responseData.system_message || 'Failed to fetch applications');
    }

    return responseData;
}

function* fetchApplicationsByJobIdSaga(action: { payload: { id: string; }; type: string }) {
    try {
        const apiBaseUri: string = yield select(selectApiBaseUri);
        const token: string = yield select(selectAuthToken);
        const response: GetApplicationsResponseDto = yield call(fetchApplicationsByJobIdApi, apiBaseUri, action.payload.id, token);
        yield put(fetchApplicationsByJobIdSuccess({ applications: response.data.applications }));
    } catch (error: any) {
        yield put(fetchApplicationsByJobIdFailure({ error: error.message }));
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

function* createApplicationSaga(action: { payload: { data: any; }; type: string }) {
    try {
        const apiBaseUri: string = yield select(selectApiBaseUri);
        const token: string = yield select(selectAuthToken);
        const response: CreateApplicationResponseDto = yield call(createApplicationApi, apiBaseUri, action.payload.data, token);
        yield put(createApplicationSuccess({ application: response.data.application }));
    } catch (error: any) {
        yield put(createApplicationFailure({ error: error.message }));
    }
}

export function* applicationsSaga() {
    yield takeLatest(fetchApplicationRequest.type, fetchApplicationSaga);
    yield takeLatest(fetchApplicationsByJobIdRequest.type, fetchApplicationsByJobIdSaga);
    yield takeLatest(createApplicationRequest.type, createApplicationSaga);
}
