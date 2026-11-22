import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { getJwtSecret } from '../../config/jwt';
import { HttpError } from '../../utils/httpError';
import { ROLES, User } from './user.model';
import * as userRepository from './user.repository';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PASSWORD_LENGTH = 6;

// Datos del usuario que se pueden mostrar (sin la contraseña)
const toPublicUser = (user: User) => ({
  id: user.id,
  name: user.name,
  email: user.email,
  role: user.role,
});

export const register = async (body: any) => {
  const { name, email, password, role = 'member' } = body ?? {};

  if (typeof name !== 'string' || name.trim() === '') {
    throw new HttpError(400, 'El nombre es obligatorio');
  }
  if (typeof email !== 'string' || !EMAIL_REGEX.test(email.trim())) {
    throw new HttpError(400, 'El email no es válido');
  }
  if (typeof password !== 'string' || password.length < MIN_PASSWORD_LENGTH) {
    throw new HttpError(400, `La contraseña debe tener al menos ${MIN_PASSWORD_LENGTH} caracteres`);
  }
  if (!ROLES.includes(role)) {
    throw new HttpError(400, `El rol debe ser uno de: ${ROLES.join(', ')}`);
  }

  const normalizedEmail = email.trim().toLowerCase();

  const existing = await userRepository.findByEmail(normalizedEmail);
  if (existing) {
    throw new HttpError(409, 'Ya existe un usuario con ese email');
  }

  // Bcrypt convierte la contraseña en un hash que no se puede revertir
  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await userRepository.create({
    name: name.trim(),
    email: normalizedEmail,
    password: hashedPassword,
    role,
  });

  return toPublicUser(user);
};

export const login = async (body: any) => {
  const { email, password } = body ?? {};

  if (typeof email !== 'string' || typeof password !== 'string' || !email || !password) {
    throw new HttpError(400, 'El email y la contraseña son obligatorios');
  }

  const user = await userRepository.findByEmail(email.trim().toLowerCase());
  const passwordIsValid = user ? await bcrypt.compare(password, user.password) : false;

  // Mismo mensaje en los dos casos, para no revelar si el email existe
  if (!user || !passwordIsValid) {
    throw new HttpError(401, 'Email o contraseña incorrectos');
  }

  // El token lleva solo el id y el rol: nada sensible (ni contraseña ni email)
  const token = jwt.sign({ id: user.id, role: user.role }, getJwtSecret(), { expiresIn: '1h' });

  return { token, user: toPublicUser(user) };
};
