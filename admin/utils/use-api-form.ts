import { useForm } from "react-hook-form";
import { apiResolver } from "./resolver";

export function useApiForm<
  F extends { mutate: (data: any) => any },
  T extends F extends { mutate: (data: infer K) => any } ? K : never,
>(r: F) {
  return useForm<T>({
    resolver: apiResolver(r),
  });
}
