interface BlogErrorData {
  status?: number;
  message?: string;
}

export default class BlogError
    extends Error {
  public status: number;
  public message: string;

  constructor({
    status,
    message
  }: BlogErrorData) {
    super(message);

    this.status = status;
    this.message = message;
  }
}
