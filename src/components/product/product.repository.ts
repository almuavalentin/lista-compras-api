import { User } from '../user/user.model';
import { Product } from './product.model';
import { ProductFilters, ProductInput } from './product.service';

// Cada producto trae también el nombre de quien lo agregó
const includeUser = [{ model: User, as: 'addedBy', attributes: ['id', 'name'] }];

export const findAll = (filters: ProductFilters): Promise<Product[]> =>
  Product.findAll({ where: filters, include: includeUser, order: [['id', 'ASC']] });

export const findById = (id: number): Promise<Product | null> =>
  Product.findByPk(id, { include: includeUser });

export const create = async (data: ProductInput & { userId: number }): Promise<Product> => {
  const product = await Product.create(data);
  return (await findById(product.id)) as Product;
};

export const update = async (product: Product, data: ProductInput): Promise<Product> => {
  await product.update(data);
  return product;
};

export const remove = (product: Product): Promise<void> => product.destroy();
