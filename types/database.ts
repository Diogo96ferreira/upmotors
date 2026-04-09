export type CarCategory = "Performance" | "Classicos" | "SUV" | "Executive";

export type CarRow = {
  id: string;
  brand: string;
  model: string;
  version: string | null;
  price: number;
  year: number;
  mileage_km: number;
  fuel: string;
  transmission: string;
  power_hp: number | null;
  image: string;
  category: CarCategory;
  description: string;
  shortDescription: string | null;
  gallery: string[] | null;
  highlight: string | null;
  monthlyLabel: string | null;
  featured: boolean | null;
  specs: {
    engine?: string;
    drivetrain?: string;
    acceleration?: string;
    exterior?: string;
    interior?: string;
    location?: string;
  } | null;
  created_at: string;
};
