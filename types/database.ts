export type CarCategory = "Performance" | "Classicos" | "SUV" | "Executive";
export type CarStatus = "draft" | "available" | "reserved" | "sold";
export type LeadStatus = "new" | "contacted" | "closed";

export type CarImageRow = {
  id: string;
  url: string;
  storage_path?: string | null;
  is_feature: boolean | null;
  position: number | null;
  alt_text: string | null;
};

export type CarRow = {
  id: string;
  slug: string;
  brand: string;
  model: string;
  version: string | null;
  price: number;
  year: number;
  mileage_km: number;
  fuel: string;
  transmission: string;
  power_hp: number | null;
  image: string | null;
  category: CarCategory;
  description: string;
  shortDescription: string | null;
  gallery: string[] | null;
  highlight: string | null;
  monthlyLabel: string | null;
  featured: boolean | null;
  status: CarStatus;
  specs: {
    engine?: string;
    drivetrain?: string;
    acceleration?: string;
    exterior?: string;
    interior?: string;
    location?: string;
    equipment?: string;
    history?: string;
    commercialNotes?: string;
  } | null;
  created_at: string;
  car_images?: CarImageRow[] | null;
};

export type LeadSubmissionRow = {
  id: string;
  form_type: "contact" | "sell" | "import";
  name: string;
  email: string;
  phone: string | null;
  brand: string | null;
  model: string | null;
  year: number | null;
  mileage_km: number | null;
  message: string;
  status: LeadStatus;
  created_at: string;
};
