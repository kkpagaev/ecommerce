import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import type {} from "@redux-devtools/extension"; // required for devtools typing

interface CartItem {
  id: number;
  image: string;
  name: string;
  quantity: number;
}

interface Cart {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (itemId: number) => void;
  updateItemQuantity: (itemId: number, quantity: number) => void;
  clearCart: () => void;
}

const useCartStore = create<Cart>()(
  devtools(
    persist(
      (set) => ({
        items: [],
        addItem: (item) =>
          set((state) => {
            if (state.items.some((i) => i.id === item.id)) {
              return state;
            }
            return { items: [...state.items, item] };
          }),
        removeItem: (itemId) =>
          set((state) => ({
            items: state.items.filter((item) => item.id !== itemId),
          })),
        updateItemQuantity: (itemId, quantity) =>
          set((state) => ({
            items: state.items.map((item) =>
              item.id === itemId ? { ...item, quantity } : item,
            ),
          })),
        clearCart: () => set(() => ({ items: [] })),
      }),
      {
        name: "cart-storage",
      },
    ),
  ),
);

export default useCartStore;
