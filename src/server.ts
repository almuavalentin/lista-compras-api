import 'dotenv/config';
import app from './app';
import { sequelize } from './config/database';
import './components/product/product.model';

const PORT = process.env.PORT || 3000;

const start = async () => {
  try {
    await sequelize.authenticate();
    console.log('Conexión a PostgreSQL establecida');
    // alter: true actualiza las tablas existentes si cambia el modelo (solo para desarrollo)
    await sequelize.sync({ alter: true });
    app.listen(PORT, () => console.log(`Servidor escuchando en http://localhost:${PORT}`));
  } catch (error) {
    console.error('No se pudo iniciar el servidor:', error);
    process.exit(1);
  }
};

start();
