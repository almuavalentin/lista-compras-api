import { NextFunction, Request, Response } from 'express';

// Muestra en consola el método y la URL de cada petición
export const logger = (req: Request, _res: Response, next: NextFunction): void => {
  console.log(`${req.method} ${req.originalUrl}`);
  next();
};
