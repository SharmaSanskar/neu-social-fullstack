import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface UserState {
  userId: string;
  userObj: any;
}

const initialState: UserState = {
  userId: "",
  userObj: {} as any,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserId: (state, action: PayloadAction<string>) => {
      state.userId = action.payload;
    },

    setUserObj: (state, action: PayloadAction<any>) => {
      state.userObj = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setUserId, setUserObj } = userSlice.actions;

export default userSlice.reducer;
