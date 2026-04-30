export interface Organization {
  id: string;
  name: string;
  country: string;
  city: string;
  organizationType: string;
  address?: string;
  phoneNumber?: string;
  ownerId: string;
  ownerEmail: string;
  createdAt: string;
}
