import { combineReducers } from "@reduxjs/toolkit";
// import commentSlice from "../features/comment/comment.slice";
// import productReducer from "../features/products/products.slice";
import userSlice from "../features/user/user.slice";
import authReducer from "../features/auth/auth.slice";
// import favoriteReducer from "../features/favorite/favorite.slice"

const rootReducer = combineReducers({
    // product: productReducer,
    user: userSlice,
    auth: authReducer,
    // favorite: favoriteReducer,
    // comment: commentSlice
});

export default rootReducer;