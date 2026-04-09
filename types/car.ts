import { CarCategory, CarStatus } from "@/types/database";

export type Car = {
  id: string;
  slug: string;
  brand: string;
  model: string;
  version?: string;
  price: number;
  year: number;
  mileage_km: number;
  fuel: string;
  transmission: string;
  power_hp?: number;
  image: string;
  category: CarCategory;
  description: string;
  shortDescription: string;
  gallery: string[];
  highlight: string;
  monthlyLabel?: string;
  featured?: boolean;
  status: CarStatus;
  specs: {
    engine: string;
    drivetrain: string;
    acceleration: string;
    exterior: string;
    interior: string;
    location: string;
  };
};
