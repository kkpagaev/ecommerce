import { EventEmitter } from "events";
import { observable } from "@trpc/server/observable";
import { z } from "zod";
import { FastifyInstance } from "fastify";

const ee = new EventEmitter();

type Post = {
  title: string;
};

export default async ({ t }: FastifyInstance) => ({
  onAdd: t.procedure.subscription(() => {
    return observable<Post>((emit) => {
      const onAdd = (data: Post) => {
        emit.next(data);
      };

      ee.on("add", onAdd);

      return () => {
        ee.off("add", onAdd);
      };
    });
  }),
  add: t.procedure
    .input(
      z.object({
        title: z.string(),
      }),
    )
    .mutation(async (opts) => {
      const post = { ...opts.input }; /* [..] add to db */

      ee.emit("add", post);

      return post;
    }),
});
