// Database table types
export interface User {
  id: string;
  email: string;
  full_name: string;
  profession?: string;
  bio?: string;
  avatar_url?: string;
  phone_number?: string;
  qualification?: string;
  is_admin?: boolean;
  created_at: string;
  updated_at: string;
}

export interface UserFollow {
  id: string;
  follower_id: string;
  following_id: string;
  created_at: string;
  
  // Relations
  follower?: User;
  following?: User;
}

export interface UserStats {
  followers_count: number;
  following_count: number;
  articles_count: number;
  total_views: number;
  total_likes: number;
}

export interface Article {
  id: string;
  title: string;
  content: string;
  description: string;
  image_url?: string;
  category: 'Architecture' | 'Engineering' | 'Construction';
  tags: string[];
  author_id: string;
  views: number;
  likes_count: number;
  comments_count: number;
  is_published: boolean;
  is_featured?: boolean;
  published_at?: string;
  created_at: string;
  updated_at: string;
  
  // Relations
  author?: User;
  likes?: Like[];
  comments?: Comment[];
}

export interface Comment {
  id: string;
  content: string;
  author_id: string;
  article_id: string;
  parent_id?: string; // For replies
  likes_count: number;
  created_at: string;
  updated_at: string;
  
  // Relations
  author?: User;
  replies?: Comment[];
  likes?: CommentLike[];
}

export interface Like {
  id: string;
  user_id: string;
  article_id: string;
  created_at: string;
  
  // Relations
  user?: User;
  article?: Article;
}

export interface CommentLike {
  id: string;
  user_id: string;
  comment_id: string;
  created_at: string;
  
  // Relations
  user?: User;
  comment?: Comment;
}

export interface Bookmark {
  id: string;
  user_id: string;
  article_id: string;
  created_at: string;
  
  // Relations
  user?: User;
  article?: Article;
}

export interface UserSettings {
  id: string;
  user_id: string;
  email_notifications: boolean;
  push_notifications: boolean;
  marketing_emails: boolean;
  weekly_digest: boolean;
  profile_visibility: 'public' | 'private';
  show_email: boolean;
  created_at: string;
  updated_at: string;
}

export interface Notification {
  id: string;
  user_id: string;
  actor_id?: string;
  type: 'like' | 'comment' | 'follow' | 'share' | 'article_published';
  entity_type: 'article' | 'comment' | 'user';
  entity_id: string;
  message: string;
  is_read: boolean;
  created_at: string;
  updated_at: string;
  
  // Relations
  actor?: User;
  recipient?: User;
  article?: Article;
  comment?: Comment;
}

export interface NotificationWithDetails extends Notification {
  actor_name?: string;
  actor_avatar?: string;
  entity_title?: string;
  time_ago?: string;
}

// API Response types
export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  loading: boolean;
}

// Form types
export interface SignupForm {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  profession: string;
}

export interface LoginForm {
  email: string;
  password: string;
}

export interface ArticleForm {
  title: string;
  content: string;
  description: string;
  category: 'Architecture' | 'Engineering' | 'Construction';
  tags: string[];
  imageFile?: File;
}

export interface CommentForm {
  content: string;
  articleId: string;
  parentId?: string;
}

// Auth context types
export interface AuthState {
  user: User | null;
  session: any | null;
  loading: boolean;
}

export interface AuthContextType extends AuthState {
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signUp: (data: SignupForm) => Promise<{ error: string | null }>;
  signOut: () => Promise<{ error: string | null }>;
  resetPassword: (email: string) => Promise<{ error: string | null }>;
  updatePassword: (password: string) => Promise<{ error: string | null }>;
  updateProfile: (data: Partial<User>) => Promise<{ error: string | null }>;
}

// Filter and pagination types
export interface ArticleFilters {
  category?: string;
  tags?: string[];
  author?: string;
  sortBy?: 'latest' | 'popular' | 'most_liked' | 'most_viewed';
  limit?: number;
  offset?: number;
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ArticlesResponse {
  articles: Article[];
  meta: PaginationMeta;
} 