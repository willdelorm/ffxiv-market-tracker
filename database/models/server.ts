import { pool } from "../connections";
import { Server } from "../types/database";

export class ServerModel {
  static async findAll(): Promise<Server[]> {
    const result = await pool.query(
      "SELECT * FROM servers ORDER BY region, datacenter, name"
    );
    return result.rows;
  }

  static async findById(id: number): Promise<Server | null> {
    const result = await pool.query("SELECT * FROM servers WHERE id = $1", [
      id,
    ]);
    return result.rows[0] || null;
  }

  static async findByName(name: string): Promise<Server | null> {
    const result = await pool.query("SELECT * FROM servers WHERE name = $1", [
      name,
    ]);
    return result.rows[0] || null;
  }

  static async findByDatacenter(datacenter: string): Promise<Server[]> {
    const result = await pool.query(
      "SELECT * FROM servers WHERE datacenter = $1 ORDER BY name",
      [datacenter]
    );
    return result.rows;
  }

  static async create(
    name: string,
    datacenter: string,
    region: string
  ): Promise<Server> {
    const result = await pool.query(
      "INSERT INTO servers (name, datacenter, region) VALUES ($1, $2, $3) RETURNING *",
      [name, datacenter, region]
    );
    return result.rows[0];
  }
}
