import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "./storage"; // Import storage đã kiểm tra SSR
import rootReducer from "./root";

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth", "field", "timeSlot","footballField, notification"], // Chỉ lưu các state này
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"], // Bỏ qua kiểm tra serialize
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const persistor = persistStore(store); // Thêm persistor
