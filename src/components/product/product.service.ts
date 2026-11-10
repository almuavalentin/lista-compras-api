import { HttpError } from '../../utils/httpError';
import { CATEGORIES, Category, Product } from './product.model';
import * as productRepository from './product.repository';

const MAX_NOTES_LENGTH = 200;

export interface ProductInput {
  name: string;
  quantity: number;
  category: Category;
  notes: string | null;
  purchased: boolean;
}

// Valida el body y devuelve los datos limpios, con valores por defecto
const validateProductData = (body: any): ProductInput => {
  const { name, quantity = 1, category, notes = null, purchased = false } = body ?? {};

  if (typeof name !== 'string' || name.trim() === '') {
    throw new HttpError(400, 'El nombre es obligatorio');
  }
  if (!CATEGORIES.includes(category)) {
    throw new HttpError(400, `La categoría debe ser una de: ${CATEGORIES.join(', ')}`);
  }
  // Validaciones de negocio
  if (!Number.isInteger(quantity) || quantity <= 0) {
    throw new HttpError(400, 'La cantidad debe ser un número entero mayor a 0');
  }
  if (notes !== null && typeof notes !== 'string') {
    throw new HttpError(400, 'El comentario debe ser un texto');
  }
  if (typeof notes === 'string' && notes.trim().length > MAX_NOTES_LENGTH) {
    throw new HttpError(400, `El comentario no puede superar los ${MAX_NOTES_LENGTH} caracteres`);
  }
  if (typeof purchased !== 'boolean') {
    throw new HttpError(400, 'El campo purchased debe ser true o false');
  }

  const cleanNotes = typeof notes === 'string' && notes.trim() !== '' ? notes.trim() : null;

  return { name: name.trim(), quantity, category, notes: cleanNotes, purchased };
};

const parseId = (rawId: string): number => {
  const id = Number(rawId);
  if (!Number.isInteger(id) || id <= 0) {
    throw new HttpError(400, 'El id debe ser un número entero positivo');
  }
  return id;
};

const getExistingProduct = async (rawId: string): Promise<Product> => {
  const product = await productRepository.findById(parseId(rawId));
  if (!product) {
    throw new HttpError(404, 'Producto no encontrado');
  }
  return product;
};

export const getAllProducts = (): Promise<Product[]> => productRepository.findAll();

export const getProductById = (rawId: string): Promise<Product> => getExistingProduct(rawId);

export const createProduct = (body: unknown): Promise<Product> =>
  productRepository.create(validateProductData(body));

export const updateProduct = async (rawId: string, body: unknown): Promise<Product> => {
  const product = await getExistingProduct(rawId);
  return productRepository.update(product, validateProductData(body));
};

export const deleteProduct = async (rawId: string): Promise<void> => {
  const product = await getExistingProduct(rawId);
  await productRepository.remove(product);
};
