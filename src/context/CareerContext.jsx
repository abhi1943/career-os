import { createContext, useState } from "react";

export const CareerContext = createContext();

function CareerProvider({ children }) {
  const [student, setStudent] = useState({
    name: "",
    age: "",
    education: "",
    specialization: "",
    interest: "",
    dreamCareer: "",
    skills: [],
  });

  return (
    <CareerContext.Provider value={{ student, setStudent }}>
      {children}
    </CareerContext.Provider>
  );
}

export default CareerProvider;