import { t } from "./core/trpc";
import { AnyTRPCRouter } from "@trpc/server";
import { ZodSchema } from "zod";

export function withValidation<T extends AnyTRPCRouter>(router: T) {
  const methods = Object.keys(router).filter(
    (key) => !["_def", "createCaller"].includes(key),
  );

  const validator = t.router(
    methods.reduce((acc, key) => {
      const method = router[key];
      const inputs = method._def.inputs;

      const resolver = (req: any) => {
        const body = req.ctx.req.body;
        console.log(body);

        let json = JSON.parse(body);
        json = 0 in json ? json[0] : json;

        const res = inputs.map((i: ZodSchema) => i.safeParse(json));
        return res;
      };
      resolver._def = method._def;

      acc[key] = resolver;
      return acc;
    }, {} as any),
  );

  return t.mergeRouters(
    t.router({
      validator: validator as T,
    }),
    router,
  );
}
