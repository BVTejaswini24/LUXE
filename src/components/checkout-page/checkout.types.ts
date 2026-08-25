export type ContactInfo = {
  email: string;
  phone: string;
};

export type ShippingAddress = {
  firstName: string;
  lastName: string;
  address: string;
  apartment: string;
  city: string;
  state: string;
  pinCode: string;
  country: string;
};

export type DeliveryMethod = "standard" | "express";

export type PaymentMethod = "card" | "upi" | "cod";

export type CardInfo = {
  holderName: string;
  number: string;
  expiry: string;
  cvv: string;
};

export type UpiInfo = {
  upiId: string;
};

export type CheckoutForm = {
  contact: ContactInfo;
  shipping: ShippingAddress;
  delivery: DeliveryMethod;
  paymentMethod: PaymentMethod;
  card: CardInfo;
  upi: UpiInfo;
};

export type CheckoutErrors = {
  contact: Partial<ContactInfo>;
  shipping: Partial<ShippingAddress>;
  card: Partial<CardInfo>;
  upi: Partial<UpiInfo>;
};

export const DELIVERY_OPTIONS = [
  {
    id: "standard" as DeliveryMethod,
    name: "Standard Delivery",
    description: "5-7 business days",
    price: 0,
  },
  {
    id: "express" as DeliveryMethod,
    name: "Express Delivery",
    description: "2-3 business days",
    price: 15,
  },
];

export const COUNTRIES = [
  "India",
  "United States",
  "United Kingdom",
  "Canada",
  "Australia",
  "Germany",
  "France",
  "Japan",
  "Singapore",
  "UAE",
];

export const INDIAN_STATES = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
  "Delhi",
];

export const US_STATES = [
  "Alabama",
  "Alaska",
  "Arizona",
  "Arkansas",
  "California",
  "Colorado",
  "Connecticut",
  "Delaware",
  "Florida",
  "Georgia",
  "Hawaii",
  "Idaho",
  "Illinois",
  "Indiana",
  "Iowa",
  "Kansas",
  "Kentucky",
  "Louisiana",
  "Maine",
  "Maryland",
  "Massachusetts",
  "Michigan",
  "Minnesota",
  "Mississippi",
  "Missouri",
  "Montana",
  "Nebraska",
  "Nevada",
  "New Hampshire",
  "New Jersey",
  "New Mexico",
  "New York",
  "North Carolina",
  "North Dakota",
  "Ohio",
  "Oklahoma",
  "Oregon",
  "Pennsylvania",
  "Rhode Island",
  "South Carolina",
  "South Dakota",
  "Tennessee",
  "Texas",
  "Utah",
  "Vermont",
  "Virginia",
  "Washington",
  "West Virginia",
  "Wisconsin",
  "Wyoming",
];
