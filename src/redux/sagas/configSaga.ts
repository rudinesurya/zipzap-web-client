import { call, put, takeLatest } from 'redux-saga/effects';
import {
    fetchConfigRequest,
    fetchConfigSuccess,
    fetchConfigFailure,
} from '../slices/configSlice';

function* fetchConfigSaga() {
    try {
        // In a real-world scenario you might fetch this from an endpoint.
        // Here we simply read the value from the environment.
        const apiBaseUri: string = import.meta.env.VITE_API_BASE_URI;
        yield put(fetchConfigSuccess({ apiBaseUri }));
    } catch (error: any) {
        yield put(fetchConfigFailure({ error: error.message }));
    }
}

export function* configSaga() {
    yield takeLatest(fetchConfigRequest.type, fetchConfigSaga);
}
