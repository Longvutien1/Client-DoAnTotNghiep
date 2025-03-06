import { combineReducers } from "@reduxjs/toolkit";
// import commentSlice from "../features/comment/comment.slice";
// import productReducer from "../features/products/products.slice";
// import userSlice from "../features/user/user.slice";
import authReducer from "../features/auth/auth.slice";
import fieldSlice from "../features/field/field.slice";
import timeSlot from "../features/timeSlot/timeSlot.slice";


const rootReducer = combineReducers({
    // product: productReducer,
    // user: userSlice,
    auth: authReducer,
    field: fieldSlice,
    timeSlot: timeSlot
    // favorite: favoriteReducer,
    // comment: commentSlice
});

export default rootReducer;