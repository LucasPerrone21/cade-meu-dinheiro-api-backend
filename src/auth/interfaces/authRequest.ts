interface AuthRequest extends Request {
  user: {
    id: string;
    email: string;
  };
}

export default AuthRequest;
