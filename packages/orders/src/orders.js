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
    (price, information)
  VALUES
    ($price!, $information!)
  RETURNING *
`;

/**
 * @type {TaggedQuery<
 *   import("./queries/orders.types").IOrderItemsInsertQueryQuery
 * >}
 */
export const orderItemsInsertQuery = sql`
  INSERT INTO order_items
    (order_id, product_variant_id, price, quantity)
  VALUES
    $$values(order_id!, product_variant_id!, price!, quantity!)
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

/**
 * @type {TaggedQuery<
 *   import("./queries/orders.types").IListProductVariantsQueryQuery
 * >}
 */
export const listProductVariantsQuery = sql`
  SELECT
    *
  FROM
    product_variants
  WHERE
    id IN $$product_variant_ids
`;

export class Orders {
  /** @param {{ pool: import("pg").Pool }} f */
  constructor(f) {
    this.pool = f.pool;
  }

  // details: z.object({
  //   warehouse: model,
  //   city: model,
  //   area: model,
  //   name: z.string(),
  //   surname: z.string(),
  //   email: z.string().email(),
  //   phone: z.string(),
  //   description: z.string(),
  // }),
  // productVariants: z.array(z.object({
  //   id: z.number(),
  //   quantity: z.number(),
  // })),
  /** @typedef {{ ref: string; description: string }} Model */
  /**
   * @typedef {{
   *   warehouse: Model;
   *   city: Model;
   *   area: Model;
   *   name: string;
   *   surname: string;
   *   email: string;
   *   phone: string;
   *   description: string;
   * }} Details
   */

  /**
   * @param {{
   *   details: Details;
   *   productVariants: {
   *     id: number;
   *     quantity: number;
   *   }[];
   * }} params
   */
  async createOrder(params) {
    return await tx(this.pool, async (client) => {
      const productVariants = await listProductVariantsQuery.run(
        {
          product_variant_ids: params.productVariants.map((p) => p.id),
        },
        client,
      );
      const totalPrice = params.productVariants.reduce(
        (acc, { id, quantity }) => {
          const variant = productVariants.find((p) => p.id === id);
          if (!variant) {
            throw new Error("Failed to find product variant");
          }
          return acc + variant.price * quantity;
        },
        0,
      );
      const order = await orderCreateQuery
        .run(
          {
            price: totalPrice,
            information: JSON.stringify(params.details),
          },
          client,
        )
        .then((r) => r[0]);
      if (!order) {
        throw new Error("Failed to create order");
      }
      await orderItemsInsertQuery.run(
        {
          values: params.productVariants.map((p) => ({
            order_id: order.id,
            product_variant_id: p.id,
            price:
              (productVariants.find((v) => v.id === p.id)?.price ?? 0) *
              p.quantity,
            quantity: p.quantity,
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
      };
    });
  }

  async listOrders() {
    /**
     * @type {{
     *   id: number;
     *   price: number;
     *   status: string;
     *   information: Details;
     *   created_at: string;
     * }[]}
     */
    const orders = await this.pool
      .query("SELECT * FROM orders")
      .then((r) => r.rows);

    /**
     * @type {{
     *   order_id: number;
     *   product_variant_id: number;
     *   price: string;
     *   quantity: string;
     *   name: string;
     *   short_description: string;
     * }[]}
     */
    const orderItems = await this.pool
      .query(
        `select 
            order_id, product_variants.images, product_id, order_items.product_variant_id, order_items.price, quantity, name, short_description
          from order_items
          join product_variant_descriptions 
            on
          order_items.product_variant_id = product_variant_descriptions.product_variant_id
          join product_variants
          on
            order_items.product_variant_id = product_variants.id
          where product_variant_descriptions.language_id = $1`,
        [1],
      )
      .then((r) => r.rows);
    console.log(orderItems);

    const res = orders.map((o) => {
      return {
        ...o,
        items: orderItems.filter((i) => +i.order_id === o.id),
      };
    });

    return res;
  }

  /**
   * @param {number} id
   * @param {import("./queries/orders.types").order_status} status
   * @returns
   */
  async changeStatus(id, status) {
    return await tx(this.pool, async (client) => {
      await orderHistoryInsertQuery.run(
        {
          status: status,
          order_id: id,
        },
        client,
      );
      await client.query(
        `
        UPDATE orders
        SET status = $1
        WHERE id = $2
        `,
        [status, id],
      );

      return {
        id: id,
        status: status,
      };
    });
  }

  /**
   * @param {number} id
   * @param {number} languageId
   * @returns
   */
  async findOne(id, languageId) {
    /**
     * @type {{
     *   id: number;
     *   status: string;
     *   price: number;
     *   information: Details;
     *   created_at: string;
     * }}
     */
    const order = await this.pool
      .query(
        `
        SELECT * FROM orders
        WHERE id = $1
        `,
        [id],
      )
      .then((r) => r.rows[0]);
    if (!order) {
      return null;
    }

    /**
     * @type {{
     *   order_id: number;
     *   images: string[];
     *   product_variant_id: number;
     *   price: string;
     *   quantity: string;
     *   name: string;
     *   short_description: string;
     * }[]}
     */
    const items = await this.pool
      .query(
        `select 
            order_id, product_variants.images, product_id, order_items.product_variant_id, order_items.price, quantity, name, short_description
          from order_items
          join product_variant_descriptions 
            on
          order_items.product_variant_id = product_variant_descriptions.product_variant_id
          join product_variants
          on
            order_items.product_variant_id = product_variants.id
          where product_variant_descriptions.language_id = $1 and order_items.order_id = $2`,
        [languageId, id],
      )
      .then((r) => r.rows);

    return {
      ...order,
      items: items,
    };
  }
}
