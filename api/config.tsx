import axios from "axios";

export const instance = axios.create({
    // baseURL: process.env.NEXT_PUBLIC_API_MOVIE,
});

export const API_NodeJS = axios.create({
    // baseURL: process.env.NEXT_PUBLIC_API_BACKEND,
});


