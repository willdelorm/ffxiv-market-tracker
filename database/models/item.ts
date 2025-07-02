import { pool } from "../connections";
import { Item, CreateItemData } from "../types/database";

export class ItemModel {
  static async findAll(limit: number = 100): Promise<Item[]> {
    const result = await pool.query(
      "SELECT * FROM items WHERE market_allowed = true ORDER BY name LIMIT $1",
      [limit]
    );
    return result.rows;
  }

  static async findById(id: number): Promise<Item | null> {
    const result = await pool.query("SELECT * FROM items WHERE id = $1", [id]);
    return result.rows[0] || null;
  }

  static async findByName(name: string): Promise<Item[]> {
    const result = await pool.query(
      "SELECT * FROM items WHERE name ILIKE $1 AND market_allowed = true",
      [`%${name}%`]
    );
    return result.rows;
  }

  static async create(
    id: number,
    name: string,
    iconUrl: string | null,
    marketAllowed: boolean = true
  ): Promise<Item> {
    const result = await pool.query(
      "INSERT INTO items (id, name, icon_url, market_allowed) VALUES ($1, $2, $3, $4) ON CONFLICT (id) DO UPDATE SET name = $2, icon_url = $3, market_allowed = $4 RETURNING *",
      [id, name, iconUrl, marketAllowed]
    );
    return result.rows[0];
  }

  static async bulkCreate(items: CreateItemData[]): Promise<Item[]> {
    const values = items
      .map(
        (item, index) =>
          `($${index * 4 + 1}, $${index * 4 + 2}, $${index * 4 + 3}, $${
            index * 4 + 4
          })`
      )
      .join(",");

    const params = items.flatMap((item) => [
      item.id,
      item.name,
      item.icon_url,
      item.market_allowed,
    ]);

    const query = `
      INSERT INTO items (id, name, icon_url, market_allowed) 
      VALUES ${values}
      ON CONFLICT (id) DO UPDATE SET 
        name = EXCLUDED.name,
        icon_url = EXCLUDED.icon_url,
        market_allowed = EXCLUDED.market_allowed
      RETURNING *
    `;

    const result = await pool.query(query, params);
    return result.rows;
  }
}
