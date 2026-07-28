import { createContext, useState } from "react";

export const CareerContext = createContext();

function CareerProvider({ children }) {
  const [student, setStudent] = useState(null);

  return (
    <CareerContext.Provider value={{ student, setStudent }}>
      {children}
    </CareerContext.Provider>
  );
}

export default CareerProvider;