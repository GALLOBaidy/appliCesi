export type User = {
  userId: number;
  firstName: string;
  lastName: string;
  email: string;
  login: string;
  gender?: string;
  birthDay?: string;
  streetNumber?: string;
  streetName?: string;
  city?: string;
  postalCode?: string;
  country?: string;
  addressComplement?: string;
  role: string;
  isActive: boolean;
};

export type RegisterResponse = {
  user: User;
  token: string;
};

export type ProfileForm = {
  firstName: string;
  lastName: string;
  email: string;
  login: string;
  gender: string;
  birthDay: string;
  streetNumber: string;
  streetName: string;
  city: string;
  postalCode: string;
  country: string;
  addressComplement: string;
};
