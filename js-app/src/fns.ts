import {NextApiRequest, NextApiResponse} from "next";

class HttpStatusError extends Error {
  public readonly status: number;

  constructor(status: number, ...args: any[]) {
    super(...args);
    this.status = status;
  }
}

export const statusHandler = <T>(fn: Function) => (req: NextApiRequest, res: NextApiResponse<T>) => {
  try {
    return fn(req, res);
  } catch (error: any|HttpStatusError) {
    const status = error?.status ?? 500;
    if (status > 200 && status < 500) {
      return res.status(status).end();
    } else {
      console.log({
        message: "unexpected error occurred",
        error
      });
      return res.status(status).end()
    }
  }
}
