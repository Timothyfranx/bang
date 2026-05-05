export interface JupiterPriceResponse {
  data: {
    [key: string]: {
      id: string;
      type: string;
      price: string;
    }
  };
  timeTaken: number;
}

export interface PriceData {
  id: string;
  price: number;
}
