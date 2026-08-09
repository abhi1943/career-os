import {
  GraduationCap,
  Mail,
  Heart,
} from "lucide-react";
import { Link } from "react-router-dom";
import { FaGithub, FaLinkedin } from "react-icons/fa";

function Footer() {
  return (
    <footer className="bg-slate-900 text-white mt-20">

      <div className="max-w-7xl mx-auto px-6 py-14 grid md:grid-cols-2 lg:grid-cols-4 gap-10">

        {/* Logo */}

        <div>
          <div className="flex items-center gap-3">

            <GraduationCap className="w-10 h-10 text-blue-400" />

            <h2 className="text-3xl font-bold">
              CareerOS
            </h2>

          </div>

          <p className="mt-5 text-slate-400 leading-7">
            Helping students choose the right career through
            personalized guidance, colleges, companies,
            entrance exams and AI-powered mentoring.
          </p>

        </div>

        {/* Quick Links */}

        <div>

          <h3 className="text-xl font-semibold mb-5">
            Quick Links
          </h3>

          <ul className="space-y-3 text-slate-400">

            <li>
              <Link to="/" className="hover:text-white">
                Home
              </Link>
            </li>

            <li>
              <Link to="/careers" className="hover:text-white">
                Careers
              </Link>
            </li>

            <li>
              <Link to="/colleges" className="hover:text-white">
                Colleges
              </Link>
            </li>

            <li>
              <Link to="/companies" className="hover:text-white">
                Companies
              </Link>
            </li>

            <li>
              <Link to="/exams" className="hover:text-white">
                Exams
              </Link>
            </li>

          </ul>

        </div>

        {/* Dashboard */}

        <div>

          <h3 className="text-xl font-semibold mb-5">
            Student
          </h3>

          <ul className="space-y-3 text-slate-400">

            <li>
              <Link to="/dashboard" className="hover:text-white">
                Dashboard
              </Link>
            </li>

            <li>
              <Link to="/search" className="hover:text-white">
                Search
              </Link>
            </li>

            <li>
              <Link to="/chatbot" className="hover:text-white">
                AI Mentor
              </Link>
            </li>

          </ul>

        </div>

        {/* Contact */}

        <div>

          <h3 className="text-xl font-semibold mb-5">
            Connect
          </h3>

          <div className="space-y-4">

            <a
              href="https://github.com/abhi1943"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-3 text-slate-400 hover:text-white"
            >
              <FaGithub size={20} />
              GitHub
            </a>

            <a
              href="https://linkedin.com/in/abhishekreddy1943"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-3 text-slate-400 hover:text-white"
            >
              <FaLinkedin size={20} />
              LinkedIn
            </a>

            <a
              href="mailto:abhishekreddycar@gmail.com"
              className="flex items-center gap-3 text-slate-400 hover:text-white"
            >
              <Mail size={20} />
              Email
            </a>

          </div>

        </div>

      </div>

      {/* Bottom */}

      <div className="border-t border-slate-700">

        <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col md:flex-row justify-between items-center gap-4">

          <p className="text-slate-400 text-center">
            © 2026 CareerOS. All Rights Reserved.
          </p>

          <p className="flex items-center gap-2 text-slate-400">
            Made with
            <Heart className="text-red-500" size={18} fill="currentColor" />
            by Abhishek Reddy
          </p>

        </div>

      </div>

    </footer>
  );
}

export default Footer;