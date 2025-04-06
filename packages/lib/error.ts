interface BlogErrorData {
  status?: number;
  message?: string;
}

export default class BlogError
    extends Error {
  constructor({
    status,
    message
  }: BlogErrorData) {
    super(message);
  }
}
