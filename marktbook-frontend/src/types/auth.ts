export interface User {
  _id: string;
  name: string;
  email: string;
  mobileNumber: string | null;
  role: 'Owner' | 'Manager' | 'Staff';
  status: 'active' | 'inactive';
  address: string;
  username: string;
  associatedBusinessesId: string;
  lastLogin: string;
  languagePreference: string;
  isVerified: boolean;
  profilePicture: string;
  notificationPreferences: {
      emailNotifications: boolean;
      smsNotifications: boolean;
  };
}

export interface LoginData {
  email: string;
  password: string;
  username: string;
}

export interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
  userToken: string | null;
  registered: boolean | null;
  reset: boolean;
  updated: boolean | null;
}

export enum BusinessType {
  Retail = 'Retail',
  Service = 'Service',
  Manufacturing = 'Manufacturing',
  Wholesale = 'Wholesale',
  Distribution = 'Distribution',
  ImportExport = 'Import/Export',
  FoodAndBeverage = 'Food&Beverage',
  Other = 'Other',
}

export enum BusinessCategory {
  Electronics = 'Electronics',
  Restaurant = 'Restaurant',
  Fashion = 'Fashion',
  Grocery = 'Grocery',
  Pharmacy = 'Pharmacy',
  Technology = 'Technology',
  Beauty = 'Beauty',
  Auto = 'Automobile',
  Construction = 'Construction',
  Other = 'Other',
}

export interface RegisterData {
  email: string;
  adminFullName: string;
  username: string;
  password: string;
  businessName: string;
  businessAddress?: string;
  businessType: BusinessType;
  businessCategory: BusinessCategory;
  businessLogo?: string;
}

export interface passwordData {
  password: string,
  confirmPassword: string
}