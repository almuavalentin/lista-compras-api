import { Product } from './product.model';
import { ProductInput } from './product.service';

export const findAll = (): Promise<Product[]> => Product.findAll({ order: [['id', 'ASC']] });

export const findById = (id: number): Promise<Product | null> => Product.findByPk(id);

export const create = (data: ProductInput): Promise<Product> => Product.create(data);

export const update = (product: Product, data: ProductInput): Promise<Product> =>
  product.update(data);

export const remove = (product: Product): Promise<void> => product.destroy();
