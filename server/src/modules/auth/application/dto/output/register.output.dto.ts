export interface RegisterOutputDTO {
  user: {
    id: string;
    email: string;
    role: string;
    createdAt: Date;
    updatedAt: Date;
  },
  tokens: {
    accessToken: string;
    refreshToken: string;
  }
}