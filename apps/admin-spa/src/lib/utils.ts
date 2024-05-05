// import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export type ClassNameValue = string | null | undefined | 0 | false;

export function cn(...inputs: ClassNameValue[]) {
  return twMerge(inputs);
}
