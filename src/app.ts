import express, { NextFunction, Request, Response } from 'express';
import productRoutes from './components/product/product.routes';

const app = express();

app.use(express.json());

app.use('/api/products', productRoutes);

// Ruta inexistente
app.use((_req: Request, res: Response) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

// JSON mal formado en el body y otros errores no capturados
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  if (err instanceof SyntaxError && 'body' in err) {
    res.status(400).json({ error: 'El body de la petición no es un JSON válido' });
    return;
  }
  console.error(err);
  res.status(500).json({ error: 'Error interno del servidor' });
});

export default app;
