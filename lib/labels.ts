import { CarCategory, CarStatus, LeadStatus } from "@/types/database";

export function getCarCategoryLabel(category: CarCategory) {
  switch (category) {
    case "Performance":
      return "Performance";
    case "Classicos":
      return "Classicos e Heritage";
    case "SUV":
      return "SUV";
    case "Executive":
      return "Executivo";
    default:
      return category;
  }
}

export function getCarStatusLabel(status: CarStatus) {
  switch (status) {
    case "draft":
      return "Rascunho";
    case "available":
      return "Disponivel";
    case "reserved":
      return "Reservado";
    case "sold":
      return "Vendido";
    default:
      return status;
  }
}

export function getLeadStatusLabel(status: LeadStatus) {
  switch (status) {
    case "new":
      return "Novo";
    case "contacted":
      return "Contactado";
    case "closed":
      return "Fechado";
    default:
      return status;
  }
}
