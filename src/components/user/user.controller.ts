import { Request, Response } from 'express';
import { handleError } from '../../utils/httpError';
import * as userService from './user.service';

export const register = async (req: Request, res: Response) => {
  try {
    const user = await userService.register(req.body);
    res.status(201).json(user);
  } catch (error) {
    handleError(res, error);
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const result = await userService.login(req.body);
    res.status(200).json(result);
  } catch (error) {
    handleError(res, error);
  }
};
