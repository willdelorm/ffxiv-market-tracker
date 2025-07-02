import { ServerModel } from "../models/server";
import { ItemModel } from "../models/item";
import { MarketPriceModel } from "../models/marketprice";

async function seedDatabase() {
  try {
    console.log("🌱 Starting database seeding...");

    // Seed sample market prices for testing
    const servers = await ServerModel.findAll();
    const items = await ItemModel.findAll();

    if (servers.length === 0 || items.length === 0) {
      console.log(
        "No servers or items found. Please run the initial schema first."
      );
      return;
    }

    // Generate some sample price data
    const samplePrices = [];

    for (let i = 0; i < 50; i++) {
      const randomServer = servers[Math.floor(Math.random() * servers.length)];
      const randomItem = items[Math.floor(Math.random() * items.length)];
      const basePrice = Math.floor(Math.random() * 10000) + 100;
      const priceVariation = Math.floor(Math.random() * 2000) - 1000;

      samplePrices.push({
        server_id: randomServer.id,
        item_id: randomItem.id,
        price: Math.max(1, basePrice + priceVariation),
        quantity: Math.floor(Math.random() * 99) + 1,
      });
    }

    await MarketPriceModel.bulkCreate(samplePrices);
    console.log(`✓ Created ${samplePrices.length} sample market prices`);

    console.log("🎉 Database seeding completed successfully!");
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    throw error;
  }
}

if (require.main === module) {
  seedDatabase()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}

module.exports = seedDatabase;
