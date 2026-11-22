// Le avisa a TypeScript que req.user existe (lo completa el middleware authenticate)
export {};

declare global {
  namespace Express {
    interface Request {
      user?: { id: number; role: string };
    }
  }
}
