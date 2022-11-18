import { configureStore, combineReducers } from "@reduxjs/toolkit";
import uiReducer from "./features/uiSlice";
import alertMessageReducer from "./features/alertMessageSlice";

const reducers = combineReducers({
  ui: uiReducer,
  alert: alertMessageReducer,
});

const store = configureStore({
  reducer: reducers,
  devTools: true,
});

export default store;
