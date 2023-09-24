import { Request, Response, NextFunction } from 'express';
import { createNamespace, Namespace } from 'cls-hooked';
import { nanoid } from 'nanoid';
const ns: Namespace = createNamespace('context');

const cls = {
  createRequestContext: (req: Request, res: Response, next: NextFunction) => {
    ns.bindEmitter(req);
    ns.bindEmitter(res);

    ns.run(() => {
      // If we generate 100,000 ids per second, ~2 years needed, in order to have a 1% probability of at least one collision.
      ns.set('correlationId', nanoid(15));
      next();
    });
  },

  get: ({ key }: { key: string }) => {
    if (ns && ns.active) {
      return ns.get(key);
    }
    return null;
  },

  set: ({ key, value }: { key: string; value: any }) => {
    if (ns && ns.active) {
      return ns.set(key, value);
    }
    return null;
  },
};

export default cls;
