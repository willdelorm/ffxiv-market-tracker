import { query } from "./connections";
import { ServerModel } from "./models/server";
import { ItemModel } from "./models/item";
import { MarketPriceModel } from "./models/marketprice";

async function testDatabase() {
  try {
    console.log("Testing database connection...");

    // Test basic connection
    const timeResult = await query("SELECT NOW()");
    console.log("✓ Database connected at:", timeResult.rows[0].now);

    // Test Server model
    const servers = await ServerModel.findAll();
    console.log(`✓ Found ${servers.length} servers`);

    // Test Item model
    const items = await ItemModel.findAll();
    console.log(`✓ Found ${items.length} items`);

    // Test MarketPrice model
    if (servers.length > 0 && items.length > 0) {
      const prices = await MarketPriceModel.findByItemAcrossServers(
        items[0].id
      );
      console.log(`✓ Found ${prices.length} prices for ${items[0].name}`);
    }

    console.log("🎉 All database tests passed!");
  } catch (error) {
    console.error("❌ Database test failed:", error);
  }
}

testDatabase();
