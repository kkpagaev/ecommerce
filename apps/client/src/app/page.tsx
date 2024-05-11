import { trpc } from "../utils/trpc";

export default async function Home() {
  const res = await trpc.admin.admin.listAdmins.query({ })
  return (
    <div>
    {res.map((a)=> {
      return <div key={a.id}>{a.name}</div>
    })}
    </div>
  );
}
