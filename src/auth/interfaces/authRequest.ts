interface AuthRequest extends Request {
  user: {
    id: string;
    email: string;
    accessToken: string;
  };
}

export default AuthRequest;
