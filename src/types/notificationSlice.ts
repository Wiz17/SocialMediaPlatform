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

export { Actor, Post, Notification, NotificationsState };
