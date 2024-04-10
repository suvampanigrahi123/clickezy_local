import { createSlice } from "@reduxjs/toolkit";

const studioSlice = createSlice({
    name: "studio",
    initialState: {
        selectedIndex:0
    },
    reducers:  {
        setSelectedIndex: (state, { payload }) => {
            state.selectedIndex = payload;
        }
    }
})

export default studioSlice.reducer;
export const { setSelectedIndex} = studioSlice.actions;