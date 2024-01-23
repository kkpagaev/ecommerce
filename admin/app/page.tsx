import { api } from "../utils/trpc";

export default async function Home() {
  const categories = await api.admin.catalog.category.validator.createCategory.mutate({
    name: "bar",
    email: "bar"
  });
      // {categories && categories.map((c) => <div key={c.id}>{c.slug}</div>)}
  return (
    <div>
      {JSON.stringify(categories)}
      Hello world!
    </div>
  );
}
