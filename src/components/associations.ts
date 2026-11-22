import { Product } from './product/product.model';
import { User } from './user/user.model';

// Un usuario agrega muchos productos; cada producto guarda quién lo agregó
User.hasMany(Product, { foreignKey: 'userId', onDelete: 'SET NULL' });
Product.belongsTo(User, { foreignKey: 'userId', as: 'addedBy' });
