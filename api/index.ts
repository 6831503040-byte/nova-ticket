import app from '../server';

export default async (req: any, res: any) => {
  return app(req, res);
};
