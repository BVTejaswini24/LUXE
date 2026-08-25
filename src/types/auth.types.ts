export type User = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  createdAt: string;
};

export type EditableUserProfile = Pick<User, "firstName" | "lastName" | "phone">;

export type AuthState = {
  user: User | null;
  isAuthenticated: boolean;
  registeredUsers: Array<User & { passwordHash: string }>;
};
