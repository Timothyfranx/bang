export interface JupiterPriceV3Response {
  [key: string]: {
    id: string;
    type: string;
    price: string;
  };
}

export interface PriceData {
  id: string;
  price: number;
}
