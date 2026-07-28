import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "../pages/Home/Home";

import Careers from "../pages/Careers/Careers";
import CareerDetails from "../pages/Careers/CareerDetails";

import Colleges from "../pages/Colleges/Colleges";

import Companies from "../pages/Companies/Companies";

import Exams from "../pages/Exams/Exams";
import Chatbot from "../pages/Chatbot/Chatbot";
import NotFound from "../pages/NotFound/NotFound";
function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
  <Route path="/" element={<Home />} />

  <Route path="/careers" element={<Careers />} />
  <Route path="/career/:careerId" element={<CareerDetails />} />

  <Route path="/colleges" element={<Colleges />} />

  <Route path="/companies" element={<Companies />} />

  <Route path="/exams" element={<Exams />} />

  <Route path="/chatbot" element={<Chatbot />} />

  <Route path="*" element={<NotFound />} />
</Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;