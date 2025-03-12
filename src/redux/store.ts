import { configureStore } from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';
import configReducer from './slices/configSlice';
import authReducer from './slices/authSlice';
import jobsReducer from './slices/jobsSlice';
import usersReducer from './slices/usersSlice';
import userRatingsReducer from './slices/userRatingsSlice';
import applicationsReducer from './slices/applicationsSlice';
import messagesReducer from './slices/messagesSlice';
import { configSaga } from './sagas/configSaga';
import { authSaga } from './sagas/authSaga';
import { jobsSaga } from './sagas/jobsSaga';
import { usersSaga } from './sagas/usersSaga';
import { userRatingsSaga } from './sagas/userRatingsSaga';
import { applicationsSaga } from './sagas/applicationsSaga';
import { messagesSaga } from './sagas/messagesSaga';

const sagaMiddleware = createSagaMiddleware();

export const store = configureStore({
    reducer: {
        auth: authReducer,
        config: configReducer,
        jobs: jobsReducer,
        users: usersReducer,
        userRatings: userRatingsReducer,
        applications: applicationsReducer,
        messages: messagesReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(sagaMiddleware),
});

sagaMiddleware.run(authSaga);
sagaMiddleware.run(configSaga);
sagaMiddleware.run(jobsSaga);
sagaMiddleware.run(usersSaga);
sagaMiddleware.run(userRatingsSaga);
sagaMiddleware.run(applicationsSaga);
sagaMiddleware.run(messagesSaga);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

