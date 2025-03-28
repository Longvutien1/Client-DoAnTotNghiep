import { createNotification, getNotificationByActor, updateNotification } from "@/api/notification"
import { Notification } from "@/models/notification"
import { IUser } from "@/models/type"
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"

export const addNotificationSlice = createAsyncThunk(
    "notification/addNotificationSlice",
    async (field: Notification) => {
        const { data } = await createNotification(field)
        return data
    }
)

export const updateNotificationSlice = createAsyncThunk(
    "notification/updateNotificationSlice",
    async (notification: Notification) => {
        const { data } = await updateNotification(notification._id as string, notification)
        return data
    }
)

export const getListNotificationSlice = createAsyncThunk(
    "notification/getListNotificationSlice",
    async (user: IUser) => {
        const { data } = await getNotificationByActor(user._id as string, user.role === 1 ? "manager" : "user")
        return data
    }
)


const notificationSlice = createSlice({
    name: "notification",
    initialState: {
        value: [],
        detail: {},
        breadcrumb: ""
    },
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(getListNotificationSlice.fulfilled, (state: any, action) => {
            state.value = action.payload
        })
        builder.addCase(addNotificationSlice.fulfilled, (state: any, action) => {
            state.value = [...state.value, action.payload]
        })
        builder.addCase(updateNotificationSlice.fulfilled, (state: any, action) => {
            state.value = state.value.map((item: Notification) => item._id === action.payload._id ? action.payload : item)
        })
    }
}
)

export default notificationSlice.reducer