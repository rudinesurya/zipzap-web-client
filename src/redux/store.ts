import { configureStore } from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';
import configReducer from './slices/configSlice';
import authReducer from './slices/authSlice';
import jobsReducer from './slices/jobsSlice';
import usersReducer from './slices/usersSlice';
import applicationsReducer from './slices/applicationsSlice';
import { configSaga } from './sagas/configSaga';
import { authSaga } from './sagas/authSaga';
import { jobsSaga } from './sagas/jobsSaga';
import { usersSaga } from './sagas/usersSaga';
import { applicationsSaga } from './sagas/applicationsSaga';

const sagaMiddleware = createSagaMiddleware();

export const store = configureStore({
    reducer: {
        auth: authReducer,
        config: configReducer,
        jobs: jobsReducer,
        users: usersReducer,
        applications: applicationsReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(sagaMiddleware),
});

sagaMiddleware.run(authSaga);
sagaMiddleware.run(configSaga);
sagaMiddleware.run(jobsSaga);
sagaMiddleware.run(usersSaga);
sagaMiddleware.run(applicationsSaga);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

