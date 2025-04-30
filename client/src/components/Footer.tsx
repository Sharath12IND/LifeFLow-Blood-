import React from 'react';
import { Link } from 'wouter';
import BloodDropLogo from './BloodDropLogo';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8">
        <div className="xl:grid xl:grid-cols-3 xl:gap-8">
          <div className="space-y-8 xl:col-span-1">
            <Link href="/">
              <a className="flex items-center">
                <BloodDropLogo withText size="md" className="bg-primary-600" />
              </a>
            </Link>
            <p className="text-gray-300 text-base">
              Connecting blood donors with those in need, saving lives one donation at a time.
            </p>
            <div className="flex space-x-6">
              <a href="#" className="text-gray-400 hover:text-gray-300">
                <span className="sr-only">Facebook</span>
                <i className="fab fa-facebook-f text-xl"></i>
              </a>
              <a href="#" className="text-gray-400 hover:text-gray-300">
                <span className="sr-only">Instagram</span>
                <i className="fab fa-instagram text-xl"></i>
              </a>
              <a href="#" className="text-gray-400 hover:text-gray-300">
                <span className="sr-only">Twitter</span>
                <i className="fab fa-twitter text-xl"></i>
              </a>
              <a href="#" className="text-gray-400 hover:text-gray-300">
                <span className="sr-only">WhatsApp</span>
                <i className="fab fa-whatsapp text-xl"></i>
              </a>
            </div>
          </div>
          <div className="mt-12 grid grid-cols-2 gap-8 xl:mt-0 xl:col-span-2">
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-sm font-semibold text-gray-300 tracking-wider uppercase">
                  Resources
                </h3>
                <ul className="mt-4 space-y-4">
                  <li>
                    <a href="#blood-facts" className="text-base text-gray-400 hover:text-gray-300">
                      Blood Facts
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-base text-gray-400 hover:text-gray-300">
                      Eligibility
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-base text-gray-400 hover:text-gray-300">
                      Donation Process
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-base text-gray-400 hover:text-gray-300">
                      FAQs
                    </a>
                  </li>
                </ul>
              </div>
              <div className="mt-12 md:mt-0">
                <h3 className="text-sm font-semibold text-gray-300 tracking-wider uppercase">
                  Services
                </h3>
                <ul className="mt-4 space-y-4">
                  <li>
                    <Link href="/donor-directory">
                      <a className="text-base text-gray-400 hover:text-gray-300">
                        Find Donors
                      </a>
                    </Link>
                  </li>
                  <li>
                    <Link href="/request-blood">
                      <a className="text-base text-gray-400 hover:text-gray-300">
                        Request Blood
                      </a>
                    </Link>
                  </li>
                  <li>
                    <Link href="/donor-registration">
                      <a className="text-base text-gray-400 hover:text-gray-300">
                        Donor Registration
                      </a>
                    </Link>
                  </li>
                  <li>
                    <a href="#" className="text-base text-gray-400 hover:text-gray-300">
                      Reminder Service
                    </a>
                  </li>
                </ul>
              </div>
            </div>
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-sm font-semibold text-gray-300 tracking-wider uppercase">
                  Company
                </h3>
                <ul className="mt-4 space-y-4">
                  <li>
                    <a href="#" className="text-base text-gray-400 hover:text-gray-300">
                      About
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-base text-gray-400 hover:text-gray-300">
                      Partners
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-base text-gray-400 hover:text-gray-300">
                      Blog
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-base text-gray-400 hover:text-gray-300">
                      Contact
                    </a>
                  </li>
                </ul>
              </div>
              <div className="mt-12 md:mt-0">
                <h3 className="text-sm font-semibold text-gray-300 tracking-wider uppercase">
                  Legal
                </h3>
                <ul className="mt-4 space-y-4">
                  <li>
                    <a href="#" className="text-base text-gray-400 hover:text-gray-300">
                      Privacy
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-base text-gray-400 hover:text-gray-300">
                      Terms
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-base text-gray-400 hover:text-gray-300">
                      Cookies
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-12 border-t border-gray-700 pt-8">
          <p className="text-base text-gray-400 xl:text-center">
            &copy; {new Date().getFullYear()} LifeFlow Blood Donation Platform. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
