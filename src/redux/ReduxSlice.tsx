import { createSlice } from "@reduxjs/toolkit";

export const reduxSlice = createSlice({
  name: "globlestate",
  initialState: {
    Agent: {
      username:'',
      Id:null
    },
    openNotification:false,
    openHeader: false,
    updateCredit: null,
    AllNotification: [],
    betId: null,
  },
  reducers: {
    UpdateName: (state, action) => {
      state.Agent=action.payload
    },
    UpdateNotification: (state, action) => {
      state.openNotification=action.payload
    },
    UpdateHeader: (state, action) => {
      state.openHeader=action.payload
    },
    UpdateCredit: (state,action) => {
      state.updateCredit=action.payload
    },
    NewNotification: (state, action) => {
      state.AllNotification=action.payload
    },
    setBetId: (state, action) => {
      state.betId=action.payload
    }
  },
});

export const {
  UpdateName,
  UpdateNotification,
  UpdateHeader,
  UpdateCredit,
  NewNotification,
  setBetId,
} = reduxSlice.actions;
export default reduxSlice.reducer;