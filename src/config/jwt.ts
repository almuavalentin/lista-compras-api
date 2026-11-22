import 'dotenv/config';

// Lee la clave secreta del .env. Si falta, corta con un error claro.
export const getJwtSecret = (): string => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('Falta la variable JWT_SECRET en el archivo .env');
  }
  return secret;
};
