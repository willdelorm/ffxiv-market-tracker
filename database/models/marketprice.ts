import { pool } from "../connections";
import {
  MarketPrice,
  MarketPriceWithDetails,
  ProfitableItem,
  CreateMarketPriceData,
} from "../types/database";

export class MarketPriceModel {
  static async findLatestByServerAndItem(
    serverId: number,
    itemId: number
  ): Promise<MarketPrice | null> {
    const result = await pool.query(
      "SELECT * FROM market_prices WHERE server_id = $1 AND item_id = $2 ORDER BY timestamp DESC LIMIT 1",
      [serverId, itemId]
    );
    return result.rows[0] || null;
  }

  static async findByItemAcrossServers(
    itemId: number,
    limit: number = 50
  ): Promise<MarketPriceWithDetails[]> {
    const result = await pool.query(
      `
      SELECT mp.*, s.name as server_name, s.datacenter, i.name as item_name
      FROM latest_market_prices mp
      JOIN servers s ON mp.server_id = s.id
      JOIN items i ON mp.item_id = i.id
      WHERE mp.item_id = $1
      ORDER BY mp.price ASC
      LIMIT $2
    `,
      [itemId, limit]
    );
    return result.rows;
  }

  static async findPriceHistory(
    serverId: number,
    itemId: number,
    hours: number = 24
  ): Promise<MarketPrice[]> {
    const result = await pool.query(
      `
      SELECT price, quantity, timestamp
      FROM market_prices
      WHERE server_id = $1 AND item_id = $2 AND timestamp > NOW() - INTERVAL '${hours} hours'
      ORDER BY timestamp DESC
    `,
      [serverId, itemId]
    );
    return result.rows;
  }

  static async create(
    serverId: number,
    itemId: number,
    price: number,
    quantity: number = 1
  ): Promise<MarketPrice> {
    const result = await pool.query(
      "INSERT INTO market_prices (server_id, item_id, price, quantity) VALUES ($1, $2, $3, $4) RETURNING *",
      [serverId, itemId, price, quantity]
    );
    return result.rows[0];
  }

  static async bulkCreate(
    priceData: CreateMarketPriceData[]
  ): Promise<MarketPrice[]> {
    const values = priceData
      .map(
        (price, index) =>
          `($${index * 4 + 1}, $${index * 4 + 2}, $${index * 4 + 3}, $${
            index * 4 + 4
          })`
      )
      .join(",");

    const params = priceData.flatMap((price) => [
      price.server_id,
      price.item_id,
      price.price,
      price.quantity,
    ]);

    const query = `
      INSERT INTO market_prices (server_id, item_id, price, quantity) 
      VALUES ${values}
      ON CONFLICT (server_id, item_id, timestamp) DO NOTHING
      RETURNING *
    `;

    const result = await pool.query(query, params);
    return result.rows;
  }

  static async getTopProfitableItems(
    serverId: number,
    limit: number = 10
  ): Promise<ProfitableItem[]> {
    const result = await pool.query(
      `
      WITH price_stats AS (
        SELECT 
          item_id,
          AVG(price) as avg_price,
          MIN(price) as min_price,
          MAX(price) as max_price,
          COUNT(*) as price_count
        FROM market_prices 
        WHERE server_id = $1 
          AND timestamp > NOW() - INTERVAL '7 days'
        GROUP BY item_id
        HAVING COUNT(*) > 5
      )
      SELECT 
        ps.*,
        i.name as item_name,
        i.icon_url,
        (ps.max_price - ps.min_price) as price_spread,
        ROUND(((ps.max_price - ps.min_price)::numeric / ps.avg_price * 100), 2) as profit_percentage
      FROM price_stats ps
      JOIN items i ON ps.item_id = i.id
      WHERE ps.max_price > ps.min_price
      ORDER BY profit_percentage DESC
      LIMIT $2
    `,
      [serverId, limit]
    );
    return result.rows;
  }
}
