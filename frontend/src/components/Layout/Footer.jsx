import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="relative mt-auto overflow-hidden border-t border-green-300/50">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1490645935967-10de6ba17061?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-green-100 via-emerald-50 to-green-200"></div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-green-400/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-emerald-400/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <h3 className="text-xl font-bold text-green-900 mb-2 flex items-center">
              <div className="inline-flex items-center justify-center w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg shadow-lg mr-2">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              Nutrition Advisor
            </h3>
            <p className="text-green-800 text-sm leading-relaxed">
              Your trusted companion for healthy eating and nutrition management.
            </p>
          </div>
          <div>
            <h4 className="text-base font-semibold text-green-900 mb-3 flex items-center">
              <svg className="w-4 h-4 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
              Quick Links
            </h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-green-800 hover:text-green-600 text-sm transition-colors duration-200">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/tips" className="text-green-800 hover:text-green-600 text-sm transition-colors duration-200">
                  Tips
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-green-800 hover:text-green-600 text-sm transition-colors duration-200">
                  About Us
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-base font-semibold text-green-900 mb-3 flex items-center">
              <svg className="w-4 h-4 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Contact
            </h4>
            <p className="text-green-800 text-sm leading-relaxed">
              For support and inquiries, please reach out through our contact form.
            </p>
          </div>
        </div>
        <div className="mt-6 pt-4 border-t border-green-300/50 text-center">
          <p className="text-green-800 text-sm">
            &copy; {new Date().getFullYear()} Nutrition Advisor. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

