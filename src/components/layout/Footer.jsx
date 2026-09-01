
import {
  GraduationCap,
  Mail,
  Heart,
} from "lucide-react";
import { Link } from "react-router-dom";
import { FaGithub, FaLinkedin } from "react-icons/fa";

function Footer() {
  const footerLinkClass =
    "text-slate-400 hover:text-white focus-visible:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 rounded transition";

  return (
    <footer className="bg-slate-900 text-white mt-20">

      <div className="max-w-7xl mx-auto px-6 py-14 grid md:grid-cols-2 lg:grid-cols-4 gap-10">

        {/* Logo / About */}

        <div>
          <div className="flex items-center gap-3">

            <GraduationCap
              className="w-10 h-10 text-blue-400"
              aria-hidden="true"
            />

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
              <Link
                to="/"
                className={footerLinkClass}
              >
                Home
              </Link>
            </li>

            <li>
              <Link
                to="/careers"
                className={footerLinkClass}
              >
                Careers
              </Link>
            </li>

            <li>
              <Link
                to="/colleges"
                className={footerLinkClass}
              >
                Colleges
              </Link>
            </li>

            <li>
              <Link
                to="/companies"
                className={footerLinkClass}
              >
                Companies
              </Link>
            </li>

            <li>
              <Link
                to="/exams"
                className={footerLinkClass}
              >
                Exams
              </Link>
            </li>

          </ul>
        </div>

        {/* Student */}

        <div>
          <h3 className="text-xl font-semibold mb-5">
            Student
          </h3>

          <ul className="space-y-3 text-slate-400">

            <li>
              <Link
                to="/dashboard"
                className={footerLinkClass}
              >
                Dashboard
              </Link>
            </li>

            <li>
              <Link
                to="/search"
                className={footerLinkClass}
              >
                Search
              </Link>
            </li>

            <li>
              <Link
                to="/chatbot"
                className={footerLinkClass}
              >
                AI Mentor
              </Link>
            </li>

          </ul>
        </div>

        {/* Connect */}

        <div>
          <h3 className="text-xl font-semibold mb-5">
            Connect
          </h3>

          <div
            className="space-y-4"
            aria-label="Social and contact links"
          >

            <a
              href="https://github.com/abhi1943"
              target="_blank"
              rel="noreferrer"
              aria-label="CareerOS GitHub profile (opens in a new tab)"
              className={`flex items-center gap-3 ${footerLinkClass}`}
            >
              <FaGithub
                size={20}
                aria-hidden="true"
              />
              GitHub
            </a>

            <a
              href="https://linkedin.com/in/abhishekreddy1943"
              target="_blank"
              rel="noreferrer"
              aria-label="CareerOS LinkedIn profile (opens in a new tab)"
              className={`flex items-center gap-3 ${footerLinkClass}`}
            >
              <FaLinkedin
                size={20}
                aria-hidden="true"
              />
              LinkedIn
            </a>

            <a
              href="mailto:abhishekreddycar@gmail.com"
              aria-label="Send an email to CareerOS"
              className={`flex items-center gap-3 ${footerLinkClass}`}
            >
              <Mail
                size={20}
                aria-hidden="true"
              />
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

            <span>Made with</span>

            <Heart
              className="text-red-500"
              size={18}
              fill="currentColor"
              aria-hidden="true"
            />

            <span>by Abhishek Reddy</span>

          </p>

        </div>

      </div>

    </footer>
  );
}

export default Footer;