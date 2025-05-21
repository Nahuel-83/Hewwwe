// Response DTOs
export interface AddressResponseDTO {
  addressId: number;
  street: string;
  number: string;
  city: string;
  country: string;
  postalCode: string;
  userId: number;
}

export interface CartResponseDTO {
  cartId: number;
  cartDate: string;
  status: string;
  userId: number;
  productIds: number[];
}

export interface CategoryResponseDTO {
  categoryId: number;
  name: string;
  description: string;
}

export interface ProductResponseDTO {
  productId: number;
  name: string;
  description: string;
  price: number;
  image: string;
  size: string;
  status: string;
  publicationDate: string;
  userId: number;
  userName: string;
  userEmail?: string;
  categoryId: number;
  categoryName: string;
}

export interface ExchangeResponseDTO {
  exchangeId: number;
  status: string;
  requestDate: string;
  owner: {
    userId: number;
    name: string;
  };
  requester: {
    userId: number;
    name: string;
  };
  products: ProductResponseDTO[];
}

export interface InvoiceResponseDTO {
  invoiceId: number;
  invoiceDate: string;
  total: number;
  userId: number;
  addressId: number;
  productIds: number[];
}

export interface UserResponseDTO {
  userId: number;
  name: string;
  email: string;
  phone: string;
  role: string;
  registrationDate: string;
}

// Create DTOs
export interface AddressCreateDTO {
  street: string;
  number: string;
  city: string;
  country: string;
  postalCode: string;
  userId: number;
}

export interface CartCreateDTO {
  cartDate: string;
  status: string;
  userId: number;
  productIds: number[];
}

export interface CategoryCreateDTO {
  name: string;
  description: string;
}

export interface ExchangeCreateDTO {
  status: string;
  requestDate: string;
  ownerId: number;
  requesterId: number;
  productIds: number[];
}

export interface ProductCreateDTO {
  name: string;
  description: string;
  price: number;
  image: string;
  size: string;
  status: string;
  publicationDate: string;
  userId: number;
  categoryId: number;
  cartId?: number;
  exchangeId?: number;
}

export interface UserCreateDTO {
  name: string;
  email: string;
  phone: string;
  password: string;
  role: string;
  registrationDate: string;
}
