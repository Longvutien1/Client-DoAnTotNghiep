import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { AnyARecord } from 'dns'
import { detailUsers, editUsers, listUsers, removeUser } from '../../api/user'
import { User } from '../../models/user'


export const getListUser = createAsyncThunk(
    "users/getListUsers",
    async () => {
        const { data } = await listUsers()
        return data
    }
)

export const getDetailUser = createAsyncThunk(
    "users/getDetailUser",
    async (id: string) => {
        const { data } = await detailUsers(id)
        return data
    }
)

export const editUser = createAsyncThunk(
    "users/editUser",
    async (arr: any) => {
        const { data } = await editUsers(arr)
        return data
    }
)

export const editRoleUser = createAsyncThunk(
    "users/editRoleUser",
    async (arr: any) => {
        if (Array.isArray(arr)) {
            let dataEdit: User[] = []
            for (let i = 0; i < arr.length; i++) {
                // const { data } = await removeQuiz(arr[i].id)
                const { data } = await detailUsers(arr[i].id)
                data.role = arr[i].role
                const { data: data2 } = await editUsers(data)
                console.log("data2", data2);
                dataEdit.push(data2)
            }

            return dataEdit
        } else {
            const { data } = await detailUsers(arr.id)
            data.role = arr.role
            const { data: dataEdit } = await editUsers(data)
            return dataEdit
        }
    }
)

export const removeUserr = createAsyncThunk(
    'users/removeUser',
    async (id: any) => {
        const { data } = await removeUser(id)
        return data
    }
)

const userSlide = createSlice({
    name: "users",
    initialState: {
        value: [],
        detail: {},
        breadcrumb: ""
    },
    reducers: {
        changeBreadcrumb(state: any, action: any) {
            state.breadcrumb = action.payload
        }
    },
    extraReducers(builder) {
        builder.addCase(getListUser.fulfilled, (state, action) => {
            state.value = action.payload
        })
        builder.addCase(getDetailUser.fulfilled, (state, action) => {
            state.detail = action.payload
        })
        builder.addCase(editUser.fulfilled, (state: any, action) => {
            state.value = state.value.map((item: User) => item._id === action.payload._id ? action.payload : item)
        })
        builder.addCase(editRoleUser.fulfilled, (state: any, action) => {
            if (Array.isArray(action.payload)) {
                state.value = state.value.map((item: any) => {
                    const found = action.payload.find((item2: any) => item2._id === item._id);
                    return found ? found : item;
                });
                console.log("state.value", state.value);

            } else {
                state.value = state.value.map((item: any) => item.id === action.payload.id ? action.payload : item)
            }
        })
        builder.addCase(removeUserr.fulfilled, (state: any, action: any) => {
            state.value = state.value.filter((item: any) => item.id !== action.payload.id)

        })
    },
})

export const { changeBreadcrumb } = userSlide.actions

export default userSlide.reducer

