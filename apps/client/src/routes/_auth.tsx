import { createFileRoute, Link, redirect } from '@tanstack/react-router'
import { auth } from '../utils/auth'

export const Route = createFileRoute('/_auth')({
  beforeLoad: ({ context, location }) => {
    if (context.auth.status === 'loggedOut') {
      throw redirect({
        to: '/',
        search: {
          redirect: location.href,
        },
      })
    }

    return {
      username: auth.username,
    }
  },
})
