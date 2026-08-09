import companies from "../data/companies/companies";

export function getAllCompanies() {
  return companies;
}

export function getCompanyById(id) {
  return companies.find((company) => company.id === id);
}