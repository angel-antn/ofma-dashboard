export interface AuthResponse {
  'admin-user': AdminUser;
  token: string;
}

export interface AdminUser {
  id: string;
  email: string;
}
