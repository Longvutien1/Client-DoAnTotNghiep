import { combineReducers } from "@reduxjs/toolkit";
// import commentSlice from "../features/comment/comment.slice";
// import productReducer from "../features/products/products.slice";
// import userSlice from "../features/user/user.slice";
import authReducer from "../features/auth/auth.slice";
import fieldSlice from "../features/field/field.slice";
import timeSlot from "../features/timeSlot/timeSlot.slice";
import footballFieldSlice from "../features/footballField/footballField.slice";
import notificationSlice from "../features/notification/notification.slice";


const rootReducer = combineReducers({
    auth: authReducer,
    field: fieldSlice,
    timeSlot: timeSlot,
    footballField: footballFieldSlice,
    notification: notificationSlice
});

export default rootReducer;