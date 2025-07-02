export interface Server {
  id: number;
  name: string;
  datacenter: string;
  region: string;
  created_at: Date;
  updated_at: Date;
}

export interface Item {
  id: number;
  name: string;
  icon_url: string | null;
  market_allowed: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface MarketPrice {
  id: number;
  server_id: number;
  item_id: number;
  price: number;
  quantity: number;
  timestamp: Date;
}

export interface MarketPriceWithDetails extends MarketPrice {
  server_name: string;
  datacenter: string;
  item_name: string;
}

export interface ProfitableItem {
  item_id: number;
  avg_price: number;
  min_price: number;
  max_price: number;
  price_count: number;
  item_name: string;
  icon_url: string | null;
  price_spread: number;
  profit_percentage: number;
}

export interface CreateMarketPriceData {
  server_id: number;
  item_id: number;
  price: number;
  quantity: number;
}

export interface CreateItemData {
  id: number;
  name: string;
  icon_url: string | null;
  market_allowed: boolean;
}
