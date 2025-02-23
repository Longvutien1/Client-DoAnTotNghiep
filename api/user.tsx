// import { User } from "../models/user"
import { API_NodeJS } from "./config"


export const listUsers = ()=>{
    const url = `users`
    return API_NodeJS.get(url)
}

export const detailUsers = (id: string) => {
    const url = `/users/${id}`
    return API_NodeJS.get(url)
}

export const editUsers = (data: any) => {
    const url = `/users/${data.id}`
    return API_NodeJS.put(url,data)
}

export const editRoleUsers = (id: string) => {
    const url = `/users/${id}`
    return API_NodeJS.put(url)
}

export const removeUser = (id: string) => {
    const url = `/users/${id}`
    return API_NodeJS.delete(url)
}