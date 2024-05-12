import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/$ln')({
  beforeLoad: async ({ params }) => {
    console.log("bb")
    const languages = [{
      id: 1,
      name: 'en'
    }, 
    {
      id: 2,
      name: 'uk'
    }
    ]
    const languageId = languages.find(l => l.name === params.ln)?.id;

    if (!languageId) {
      throw redirect({
        to: '/',
        params: {
          languageCode: "uk"
        }
      })
    }

    return {
      languageId: languageId
    }
  },
})
