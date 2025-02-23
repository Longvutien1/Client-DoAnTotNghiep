import { IUser } from "../models/type";
// import { instance } from "./config";
import { API_NodeJS } from "./config";
export const signup = (user: IUser) => {
    return API_NodeJS.post(`users/register`, user)
}
export const signin = (user: IUser) => {
    return API_NodeJS.post(`users/login`, user)
}
export const signinwithnextauth = (user: any) => {
    return API_NodeJS.post(`signinwithnextauth`, user)
}

export const changepassword = (user: any) => {
    return API_NodeJS.put(`changepass`, user)
}

export const changeprofile = (user: any) => {
    return API_NodeJS.put(`users/changeprofile`, user)
}