export interface CartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export interface Cart {
  id: string;
  items: CartItem[];
  total: number;
}

export interface AddItemRequest {
  productId: string;
  quantity: number;
}

export interface UpdateItemRequest {
  quantity: number;
}
