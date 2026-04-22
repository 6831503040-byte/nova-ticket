import { serverPromise } from '../server';

export default async (req: any, res: any) => {
  const { app } = await serverPromise;
  return app(req, res);
};
