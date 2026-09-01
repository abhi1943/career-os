import companies from "../data/companies/companies";

export function getAllCompanies() {
    return Array.isArray(companies)
        ? companies
        : [];
}

export function getCompanyById(id) {
    if (!id) {
        return null;
    }

    const companyId = String(id).trim();

    return companies.find(
        (company) =>
            String(company.id).trim() === companyId
    ) || null;
}