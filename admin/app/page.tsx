import { api } from "../utils/trpc";

export default async function Home() {
  const categories = await api.admin.catalog.category.listCategories.query();

  return (
    <div>
      {categories && categories.map((c) => <div key={c.id}>{c.slug}</div>)}
      Hello world!
    </div>
  );
}
