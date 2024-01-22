import { api } from "../utils/trpc";

export default async function Home() {
  const bar = await api.admin.account.foo.query();

  return (
    <div>
      {bar}
      Hello world!
    </div>
  );
}
