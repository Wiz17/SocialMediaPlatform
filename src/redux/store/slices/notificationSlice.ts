import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { createClient } from "@supabase/supabase-js";

// Use environment variables
const SUPABASE_URL = "https://arxkebsmrbstwstaxbig.supabase.co";
const API_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFyeGtlYnNtcmJzdHdzdGF4YmlnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczMzEyNDkwNiwiZXhwIjoyMDQ4NzAwOTA2fQ.B5q-bi3Rz33jzgkz8QgGNQyKso3g2clpNxxc5Uu-_vk";

const supabase = createClient(SUPABASE_URL, API_KEY);

// Types
interface Actor {
  username: string;
  profile_picture: string;
}

interface Post {
  content: string;
  image: string;
}

interface Notification {
  id: string;
  user_id: string;
  actor_id: string;
  post_id: string;
  message: string;
  type: string;
  is_read: boolean;
  created_at: string;
  actor?: Actor;
  post?: Post;
}

interface NotificationsState {
  data: Notification[];
  loading: boolean;
  error: string | null;
  markingAsRead: boolean; // Add loading state for marking as read
}

// Initial state
const initialState: NotificationsState = {
  data: [],
  loading: false,
  error: null,
  markingAsRead: false,
};

export const fetchNotifications = createAsyncThunk<Notification[], string>(
  "notifications/fetchNotifications",
  async (currentUserId) => {
    const { data, error } = await supabase
      .from("notifications")
      .select(
        `
        *,
        actor:actor_id(username, profile_picture),
        post:post_id(content, image)
      `,
      )
      .eq("user_id", currentUserId)
      .order("created_at", { ascending: false })
      .limit(10);

    if (error) throw error;

    return data || [];
  },
);

// Async thunk for marking notification as read
export const markAsRead = createAsyncThunk<string, string>(
  "notifications/markAsRead",
  async (notificationId) => {
    const { error } = await supabase
      .from("notifications")
      .update({ is_read: true })
      .eq("id", notificationId);

    if (error) throw error;

    return notificationId;
  },
);

// Create slice
const notificationsSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    // You can also add a synchronous action if needed for optimistic updates
    markAsReadOptimistic: (state, action: PayloadAction<string>) => {
      const notification = state.data.find((n) => n.id === action.payload);
      if (notification) {
        notification.is_read = true;
      }
    },
    addNotification: (state, action: PayloadAction<Notification>) => {
      state.data = [action.payload, ...state.data];
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch notifications cases
      .addCase(fetchNotifications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch notifications";
      })
      // Mark as read cases
      .addCase(markAsRead.pending, (state) => {
        state.markingAsRead = true;
        state.error = null;
      })
      .addCase(markAsRead.fulfilled, (state, action) => {
        state.markingAsRead = false;
        const notification = state.data.find((n) => n.id === action.payload);
        if (notification) {
          notification.is_read = true;
        }
      })
      .addCase(markAsRead.rejected, (state, action) => {
        state.markingAsRead = false;
        state.error =
          action.error.message || "Failed to mark notification as read";
      });
  },
});

export const { markAsReadOptimistic, addNotification } =
  notificationsSlice.actions;
export default notificationsSlice.reducer;
