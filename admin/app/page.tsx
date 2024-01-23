import { api } from "../utils/trpc";

export default async function Home() {
  const categories = await api.admin.catalog.category.validator.foo.query();
      // {categories && categories.map((c) => <div key={c.id}>{c.slug}</div>)}
  return (
    <div>
      {categories}
      Hello world!
    </div>
  );
}
