// eslint-disable-next-line no-unused-vars
import { sql, TaggedQuery } from "@pgtyped/runtime";
import { tx } from "@repo/pool";

/**
 * @type {TaggedQuery<
 *   import("./queries/orders.types").IOrderCreateQueryQuery
 * >}
 */
export const orderCreateQuery = sql`
  INSERT INTO orders
    (price)
  VALUES
    ($price)
  RETURNING *
`;

/**
 * @type {TaggedQuery<
 *   import("./queries/orders.types").IOrderItemsInsertQueryQuery
 * >}
 */
export const orderItemsInsertQuery = sql`
  INSERT INTO order_items
    (order_id, product_id, option_id, price, quantity)
  VALUES
    $$values(order_id!, product_id!, option_id!, price!, quantity!)
  RETURNING *
`;

/**
 * @type {TaggedQuery<
 *   import("./queries/orders.types").IOrderHistoryInsertQueryQuery
 * >}
 */
export const orderHistoryInsertQuery = sql`
  INSERT INTO order_history
    (order_id, status)
  VALUES
    ($order_id, $status)
`;

export class Orders {
  /** @param {{ pool: import("pg").Pool }} f */
  constructor(f) {
    this.pool = f.pool;
  }

  /**
   * @param {{
   *   products: {
   *     productId: number;
   *     optionId: number;
   *     price: number;
   *     quantity: number;
   *   }[];
   * }} params
   */
  async createOrder(params) {
    return await tx(this.pool, async (client) => {
      const totalPrice = params.products.reduce(
        (acc, p) => p.price * p.quantity + acc,
        0,
      );

      const order = await orderCreateQuery
        .run(
          {
            price: totalPrice,
          },
          client,
        )
        .then((r) => r[0]);
      if (!order) throw new Error("Order not created");

      await orderItemsInsertQuery.run(
        {
          values: params.products.map((p) => ({
            price: p.price,
            quantity: p.quantity,
            order_id: order.id,
            option_id: p.optionId,
            product_id: p.productId,
          })),
        },
        client,
      );

      await orderHistoryInsertQuery.run(
        {
          status: "created",
          order_id: order.id,
        },
        client,
      );

      return {
        id: order.id,
        createdAt: order.created_at,
        price: totalPrice,
      };
    });
  }
}
