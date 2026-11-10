import { Request, Response } from 'express';
import { handleError } from '../../utils/httpError';
import * as productService from './product.service';

export const getAll = async (_req: Request, res: Response) => {
  try {
    const products = await productService.getAllProducts();
    res.status(200).json(products);
  } catch (error) {
    handleError(res, error);
  }
};

export const getById = async (req: Request, res: Response) => {
  try {
    const product = await productService.getProductById(req.params.id);
    res.status(200).json(product);
  } catch (error) {
    handleError(res, error);
  }
};

export const create = async (req: Request, res: Response) => {
  try {
    const product = await productService.createProduct(req.body);
    res.status(201).json(product);
  } catch (error) {
    handleError(res, error);
  }
};

export const update = async (req: Request, res: Response) => {
  try {
    const product = await productService.updateProduct(req.params.id, req.body);
    res.status(200).json(product);
  } catch (error) {
    handleError(res, error);
  }
};

export const remove = async (req: Request, res: Response) => {
  try {
    await productService.deleteProduct(req.params.id);
    res.status(200).json({ message: 'Producto eliminado correctamente' });
  } catch (error) {
    handleError(res, error);
  }
};
