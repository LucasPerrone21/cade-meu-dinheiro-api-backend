interface RefreshRequest extends Request {
  user: {
    id: string;
    email: string;
    refreshToken: string;
  };
}

export default RefreshRequest;
