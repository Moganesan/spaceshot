import { createSlice } from "@reduxjs/toolkit";

const gameState = {
  startGame: false,
  currentMultiplier: 0,
};

export const gameSlice = createSlice({
  name: "game",
  initialState: gameState,
  reducers: {
    setMultiplier: (state, actions) => {
      state.currentMultiplier = actions.payload;
    },
    resetMultiplier: (state, actions) => {
      state.currentMultiplier = 0;
    },
    startGame: (state, action) => {
      state.startGame = true;
    },
    stopGame: (state, actions) => {
      state.startGame = false;
    },
  },
});

const { reducer } = gameSlice;

export const { startGame, stopGame, setMultiplier, resetMultiplier } =
  gameSlice.actions;

export default reducer;
