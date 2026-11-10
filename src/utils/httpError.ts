import { Response } from 'express';

export class HttpError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

// Responde con el código del HttpError, o 500 si es un error inesperado
export const handleError = (res: Response, error: unknown): void => {
  if (error instanceof HttpError) {
    res.status(error.status).json({ error: error.message });
    return;
  }
  console.error(error);
  res.status(500).json({ error: 'Error interno del servidor' });
};
