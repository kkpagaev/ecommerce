import { httpLink } from "@trpc/client";
import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { trpc } from "../utils/trpc";
import { useAuth } from "@clerk/clerk-react";

export default function TrpcProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [queryClient] = useState(() => new QueryClient());
  const { getToken, isSignedIn } = useAuth();
  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        httpLink({
          url: "http://localhost:3000/trpc",
          headers: async () => {
            if (!isSignedIn) {
              return {};
            }

            const token = await getToken();

            return {
              authorization: `Bearer ${token}`,
            };
          },
        }),
      ],
    }),
  );

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </trpc.Provider>
  );
}
