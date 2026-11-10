import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from 'sequelize';
import { sequelize } from '../../config/database';

export const CATEGORIES = [
  'frutas_verduras',
  'carnes',
  'lacteos',
  'panaderia',
  'bebidas',
  'limpieza',
  'almacen',
  'otros',
] as const;

export type Category = (typeof CATEGORIES)[number];

export class Product extends Model<InferAttributes<Product>, InferCreationAttributes<Product>> {
  declare id: CreationOptional<number>;
  declare name: string;
  declare quantity: CreationOptional<number>;
  declare category: Category;
  declare notes: CreationOptional<string | null>;
  declare purchased: CreationOptional<boolean>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

Product.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: false },
    quantity: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 1 },
    category: { type: DataTypes.STRING, allowNull: false },
    notes: { type: DataTypes.STRING(200), allowNull: true },
    purchased: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  { sequelize, tableName: 'products' }
);
