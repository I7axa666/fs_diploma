import { combineReducers } from '@reduxjs/toolkit';
import authReducer from './authReducer';
import filesReducer from './filesReducer';

const rootReducer = combineReducers({
     auth: authReducer,
     files: filesReducer,
});

export default rootReducer;