import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { trpcClient } from '../utils/trpc'

export const Route = createFileRoute('/')({
  component: IndexComponent,
  loader: async () => {
    const res = await trpcClient.admin.admin.listAdmins.query({})

    return res
  }
})

function Counter() {
  const [count, setCount] = useState(0)

  return (
    <div>
      <button
        onClick={() => {
          setCount(count + 1)
        }}
      >
        plus one
        {count}
      </button>
    </div>
  )
}


function IndexComponent() {
  const data = Route.useLoaderData()
  
  return (
    <div className="p-2">
      <h3>Welcome Home!</h3>
      <Counter />
      {data?.map((admin) => {
        return (
          <div key={admin.id}>
            {admin.name}
          </div>
      )})}
    </div>
  )
}
