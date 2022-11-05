import { createSlice } from "@reduxjs/toolkit";

const gameState = {
  startGame: false,
};

export const gameSlice = createSlice({
  name: "game",
  initialState: gameState,
  reducers: {
    startGame: (state, action) => {
      state.startGame = true;
    },
    stopGame: (state, actions) => {
      state.startGame = false;
    },
  },
});

const { reducer } = gameSlice;

export const { startGame, stopGame } = gameSlice.actions;

export default reducer;
