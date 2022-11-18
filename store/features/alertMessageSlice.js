import { createSlice } from "@reduxjs/toolkit";

const state = {
  status: false,
  mode: "",
  code: "",
  message: "",
};

export const alertMessageSlice = createSlice({
  name: "alertMessage",
  initialState: state,
  reducers: {
    setErrorMessage: (state, actions) => {
      state.status = true;
      state.mode = "error";
      state.code = actions.payload.code;
      state.message = actions.payload.message;
    },
    setWarningMessage: (state, actions) => {
      state.status = true;
      state.mode = "warning";
      state.code = actions.payload.code;
      state.message = actions.payload.message;
    },
    setInfoMessage: (state, actions) => {
      state.status = true;
      state.mode = "info";
      state.code = actions.payload.code;
      state.message = actions.payload.message;
    },

    setSuccessMessage: (state, actions) => {
      state.status = true;
      state.mode = "success";
      state.code = actions.payload.code;
      state.message = actions.payload.message;
    },
  },
});

const { reducer } = alertMessageSlice;

export const {
  setErrorMessage,
  setWarningMessage,
  setInfoMessage,
  setSuccessMessage,
} = alertMessageSlice.actions;

export default reducer;
