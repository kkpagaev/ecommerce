import { FastifyInstance, FastifyRequest } from "fastify";
import fp from "fastify-plugin";
import { getAuth, User, clerkPlugin, createClerkClient, ClerkClient } from "@clerk/fastify";

declare module "fastify" {
  export interface FastifyInstance {
    clerkClient: ClerkClient;
  }

  export interface FastifyRequest {
    getUser: () => Promise<User | null>;
  }
}

export default fp(async function (f: FastifyInstance) {
  f.register(clerkPlugin, {
    publishableKey: "pk_test_Zm9uZC1tdWxlLTg3LmNsZXJrLmFjY291bnRzLmRldiQ",
    secretKey: "sk_test_k6WKaNRhMa8rmYR9LENDdVjQ2WtKokvOhUgM5rG8UG",
  });

  const clerkClient = createClerkClient({
    secretKey: "sk_test_k6WKaNRhMa8rmYR9LENDdVjQ2WtKokvOhUgM5rG8UG",
    publishableKey: "pk_test_Zm9uZC1tdWxlLTg3LmNsZXJrLmFjY291bnRzLmRldiQ",
  });

  async function getUser(req: FastifyRequest): Promise<User | null> {
    const auth = getAuth(req);

    const userId = auth.userId;
    const user = userId ? await clerkClient.users.getUser(auth.userId) : null;

    return user;
  }

  f.decorate("clerkClient", clerkClient);

  f.get("/clerk", async (req, reply) => {
    const user = await getUser(req);
    console.log(user);

    reply.send({ user });
  });
}, {
  name: "clerk",
});
