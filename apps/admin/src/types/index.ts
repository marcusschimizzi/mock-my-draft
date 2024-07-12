export type Entity = {
  id: string;
  createdAt: string;
};

export type AuthUser = Entity & {
  email: string;
  username: string;
  token: string;
};

export type LoginData = {
  username: string;
  password: string;
};
