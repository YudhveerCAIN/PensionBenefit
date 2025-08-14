export default function About() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header - Same as main page */}
      <header className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                </svg>
              </div>
              <span className="text-xl font-bold text-gray-900">Pension Planner Pro</span>
            </div>
            <nav className="hidden md:flex space-x-8">
              <a href="/" className="text-gray-700 hover:text-green-600 transition-colors">Home</a>
              <a href="/about" className="text-green-600 font-semibold">About</a>
              <a href="/features" className="text-gray-700 hover:text-green-600 transition-colors">Features</a>
              <a href="/faq" className="text-gray-700 hover:text-green-600 transition-colors">FAQ</a>
              <a href="/contact" className="text-gray-700 hover:text-green-600 transition-colors">Contact</a>
            </nav>
            <div className="flex items-center space-x-4">
              <button className="px-4 py-2 text-green-600 border border-green-600 rounded-lg hover:bg-green-50 transition-colors">
                Sign In
              </button>
              <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* About Content */}
      <main className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold text-green-800 mb-6">About Pension Planner Pro</h1>
            <p className="text-xl text-gray-600">
              Empowering individuals to take control of their retirement planning journey
            </p>
          </div>

          <div className="space-y-12">
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Our Mission</h2>
              <p className="text-gray-600 leading-relaxed">
                At Pension Planner Pro, we believe everyone deserves a secure and comfortable retirement. 
                Our mission is to simplify the complex world of pension planning, making it accessible 
                and understandable for everyone, regardless of their financial expertise.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">What We Do</h2>
              <p className="text-gray-600 leading-relaxed">
                We provide comprehensive tools and resources to help you track your pension contributions, 
                understand your benefits, and plan for a financially secure future. Our platform combines 
                cutting-edge technology with expert financial guidance to give you the confidence you need 
                to make informed decisions about your retirement.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Why Choose Us</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-green-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-green-800 mb-2">Expert Guidance</h3>
                  <p className="text-gray-600">
                    Access to financial experts and comprehensive resources to guide your decisions.
                  </p>
                </div>
                <div className="bg-green-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-green-800 mb-2">Easy to Use</h3>
                  <p className="text-gray-600">
                    Intuitive interface designed to make pension planning simple and stress-free.
                  </p>
                </div>
                <div className="bg-green-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-green-800 mb-2">Secure & Private</h3>
                  <p className="text-gray-600">
                    Bank-level security to protect your sensitive financial information.
                  </p>
                </div>
                <div className="bg-green-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-green-800 mb-2">24/7 Support</h3>
                  <p className="text-gray-600">
                    Round-the-clock customer support to help you whenever you need assistance.
                  </p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-50 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex space-x-6 mb-6 md:mb-0">
              <a href="#" className="text-gray-600 hover:text-green-600 transition-colors">Privacy Policy</a>
              <a href="#" className="text-gray-600 hover:text-green-600 transition-colors">Terms of Service</a>
            </div>
            <div className="text-center">
              <p className="text-gray-600">© 2024 Pension Planner Pro. All rights reserved.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
} 