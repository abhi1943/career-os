import database from "../data";
import professions from "../data/professions";
import collegesDatabase from "../data/colleges";
import examsDatabase from "../data/exams";
import companies from "../data/companies/companies";

export function globalSearch(query) {
  if (!query.trim()) return [];

  const search = query.toLowerCase();

  const careers = Object.values(database)
    .flat()
    .map((career) => ({
      ...career,
      type: "Career",
    }));

  const professionList = professions.map((career) => ({
    ...career,
    type: "Profession",
  }));

  const colleges = Object.values(collegesDatabase)
    .flat()
    .map((college) => ({
      ...college,
      type: "College",
    }));

  const exams = Object.values(examsDatabase)
    .flat()
    .map((exam) => ({
      ...exam,
      type: "Exam",
    }));

  const companyList = companies.map((company) => ({
    ...company,
    type: "Company",
  }));

  const allItems = [
    ...careers,
    ...professionList,
    ...colleges,
    ...companyList,
    ...exams,
  ];

  return allItems.filter((item) => {
    return (
      item.name?.toLowerCase().includes(search) ||
      item.description?.toLowerCase().includes(search) ||
      item.shortName?.toLowerCase().includes(search) ||
      item.location?.toLowerCase().includes(search) ||
      item.category?.toLowerCase().includes(search)
    );
  });
}