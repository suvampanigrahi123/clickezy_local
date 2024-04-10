import {createSlice} from "@reduxjs/toolkit"

const notificationSlice = createSlice({
    name: "notifications",
    initialState: {
        loading: false,
        notificationToken:""
    },
    reducers: {
        setNotificationToken: (state,{payload}) => {
            state.notificationToken=payload
        }
    }
})

export default notificationSlice.reducer;
export const {setNotificationToken}=notificationSlice.actions