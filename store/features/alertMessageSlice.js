import { createSlice } from "@reduxjs/toolkit";

const state = {
  status: true,
  mode: "success",
  code: "200",
  message: "hi",
};

export const alertMessageSlice = createSlice({
  name: "alertMessage",
  initialState: state,
  reducers: {
    setErrorMessage: (state, actions) => {
      state = {
        ...state,
        status: true,
        mode: "error",
        code: actions.payload.code,
        message: actions.payload.message,
      };
    },
    setWarningMessage: (state, action) => {
      state = {
        ...state,
        status: true,
        mode: "warning",
        code: action.payload.code,
        message: action.payload.message,
      };
    },
    setInfoMessage: (state, action) => {
      state = {
        ...state,
        status: true,
        mode: "info",
        code: action.payload.code,
        message: actions.payload.message,
      };
    },

    setSuccessMessage: (state, action) => {
      state = {
        ...state,
        status: true,
        mode: "success",
        code: action.payload.code,
        message: action.payload.message,
      };
    },
  },
});

const { reducer } = alertMessageSlice;

export const {
  setErrorMessage,
  setWarningMessage,
  setInfoMessage,
  setSuccessMessage,
} = alertMessageSlice.reducer;

export default reducer;
