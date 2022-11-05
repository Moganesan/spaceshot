import { configureStore, combineReducers } from "@reduxjs/toolkit";
import uiReducer from "./features/uiSlice";

const reducers = combineReducers({
  ui: uiReducer,
});

const store = configureStore({
  reducer: reducers,
  devTools: true,
});

export default store;
