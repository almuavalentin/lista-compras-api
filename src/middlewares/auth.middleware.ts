import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { getJwtSecret } from '../config/jwt';

// Verifica el token JWT que viene en el header: Authorization: Bearer <token>
export const authenticate = (req: Request, res: Response, next: NextFunction): void => {
  const header = req.headers.authorization;

  if (!header || !header.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Token no proporcionado' });
    return;
  }

  const token = header.slice(7);

  let secret: string;
  try {
    secret = getJwtSecret();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error interno del servidor' });
    return;
  }

  try {
    const payload = jwt.verify(token, secret) as unknown as { id: number; role: string };
    req.user = { id: payload.id, role: payload.role };
    next();
  } catch {
    res.status(401).json({ error: 'Token inválido o expirado' });
  }
};

// Deja pasar solo a los usuarios con alguno de los roles indicados
export const requireRole =
  (...roles: string[]) =>
  (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ error: 'Token no proporcionado' });
      return;
    }
    if (!roles.includes(req.user.role)) {
      res.status(403).json({ error: 'No tenés permisos para realizar esta acción' });
      return;
    }
    next();
  };
