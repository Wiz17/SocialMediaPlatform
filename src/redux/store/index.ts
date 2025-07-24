import { configureStore } from "@reduxjs/toolkit";
import notificationsReducer from "./slices/notificationSlice.ts";

export const store = configureStore({
  reducer: {
    notifications: notificationsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
