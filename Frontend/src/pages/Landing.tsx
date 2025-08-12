import { useNavigate } from "react-router";

const Landing = () => {
  const navigate = useNavigate();

  const handleRouting = (to: string) => {
    navigate("/logon", {
      state: {
        page: to,
      },
    });
  };
  return (
    <div className="min-h-screen">
      <nav className="bg-white/90 backdrop-blur-sm shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="bg-brown-500 p-2 rounded-lg">
                <svg
                  className="w-8 h-8 text-white"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fill-rule="evenodd"
                    d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clip-rule="evenodd"
                  ></path>
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-bold text-brown-600">MediCare</h1>
                <p className="text-xs text-brown-400">
                  Smart Medication Management
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <button
                onClick={() => handleRouting("login")}
                className="bg-beige-200 cursor-pointer text-brown-600 px-6 py-2 rounded-lg font-medium hover:bg-beige-300 focus:outline-none focus:ring-2 focus:ring-brown-400"
              >
                Login
              </button>
              <button
                onClick={() => handleRouting("signup")}
                className="text-white cursor-pointer bg-brown-500 hover:bg-brown-600 px-6 py-2 rounded-lg font-medium focus:outline-none focus:ring-2 focus:ring-brown-400"
              >
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </nav>

      <section className="relative overflow-hidden py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="fade-in">
              <h1 className="text-4xl lg:text-6xl font-bold text-brown-600 mb-6 leading-tight">
                Never Miss Your{" "}
                <span className="text-brown-300 bg-clip-text">Medication</span>{" "}
                Again
              </h1>
              <p className="text-lg text-brown-500 mb-8 leading-relaxed">
                Smart reminders, personalized schedules, and comprehensive
                tracking to help you stay on top of your health journey. Take
                control of your medication management with MediCare.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => handleRouting("signup")}
                  className="bg-brown-500 cursor-pointer hover:bg-brown-600 text-white px-8 py-4 rounded-lg font-semibold text-lg focus:outline-none focus:ring-2 focus:ring-brown-400"
                >
                  Get Started
                </button>
              </div>
              <div className="flex items-center space-x-6 mt-8 text-sm text-brown-400">
                <div className="flex items-center space-x-2">
                  <div className="pulse-dot w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>10,000+ Users</span>
                </div>
                <div className="flex items-center space-x-2">
                  <svg
                    className="w-4 h-4 text-yellow-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                  </svg>
                  <span>4.9/5 Rating</span>
                </div>
              </div>
            </div>

            <div className="relative fade-in stagger-1">
              <div className="floating-animation">
                <div className="bg-white rounded-2xl p-8 shadow-2xl max-w-md mx-auto">
                  <svg
                    className="w-full h-64 text-brown-500"
                    viewBox="0 0 200 300"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <rect
                      x="60"
                      y="80"
                      width="80"
                      height="180"
                      rx="8"
                      fill="currentColor"
                      opacity="0.1"
                    />
                    <rect
                      x="65"
                      y="85"
                      width="70"
                      height="170"
                      rx="6"
                      fill="white"
                      stroke="currentColor"
                      stroke-width="2"
                    />

                    <rect
                      x="70"
                      y="60"
                      width="60"
                      height="30"
                      rx="4"
                      fill="currentColor"
                    />
                    <rect
                      x="75"
                      y="50"
                      width="50"
                      height="20"
                      rx="2"
                      fill="currentColor"
                      opacity="0.8"
                    />

                    <circle cx="85" cy="120" r="6" fill="#8A7057" />
                    <circle cx="105" cy="135" r="6" fill="#A58D75" />
                    <circle cx="115" cy="115" r="6" fill="#8A7057" />
                    <circle cx="95" cy="150" r="6" fill="#A58D75" />
                    <circle cx="110" cy="165" r="6" fill="#8A7057" />
                    <circle cx="85" cy="180" r="6" fill="#A58D75" />
                    <circle cx="115" cy="190" r="6" fill="#8A7057" />
                    <circle cx="95" cy="205" r="6" fill="#A58D75" />

                    <rect
                      x="70"
                      y="140"
                      width="55"
                      height="40"
                      rx="2"
                      fill="white"
                      stroke="currentColor"
                      stroke-width="1"
                    />
                    <line
                      x1="75"
                      y1="150"
                      x2="115"
                      y2="150"
                      stroke="currentColor"
                      stroke-width="1"
                    />
                    <line
                      x1="75"
                      y1="155"
                      x2="105"
                      y2="155"
                      stroke="currentColor"
                      stroke-width="1"
                    />
                    <line
                      x1="75"
                      y1="160"
                      x2="120"
                      y2="160"
                      stroke="currentColor"
                      stroke-width="1"
                    />
                    <line
                      x1="75"
                      y1="165"
                      x2="95"
                      y2="165"
                      stroke="currentColor"
                      stroke-width="1"
                    />
                    <line
                      x1="75"
                      y1="170"
                      x2="110"
                      y2="170"
                      stroke="currentColor"
                      stroke-width="1"
                    />

                    <circle cx="150" cy="40" r="20" fill="#8A7057" />
                    <svg
                      x="140"
                      y="30"
                      width="20"
                      height="20"
                      fill="white"
                      viewBox="0 0 20 20"
                    >
                      <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
                    </svg>
                    <circle cx="160" cy="30" r="4" fill="#ef4444" />
                  </svg>
                </div>
              </div>

              <div
                className="absolute -top-4 -right-4 bg-green-100 p-3 rounded-full floating-animation"
                style={{ animationDelay: "1s" }}
              >
                <svg
                  className="w-6 h-6 text-green-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fill-rule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clip-rule="evenodd"
                  />
                </svg>
              </div>

              <div
                className="absolute -bottom-4 -left-4 bg-blue-100 p-3 rounded-full floating-animation"
                style={{ animationDelay: "2s" }}
              >
                <svg
                  className="w-6 h-6 text-blue-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fill-rule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                    clip-rule="evenodd"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 fade-in">
            <h2 className="text-3xl lg:text-4xl font-bold text-brown-600 mb-4">
              Everything You Need for Better Health
            </h2>
            <p className="text-lg text-brown-500 max-w-2xl mx-auto">
              Comprehensive medication management tools designed to make your
              health journey easier and more effective.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="feature-card bg-beige-50 rounded-xl p-8 fade-in stagger-1">
              <div className="bg-brown-100 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                <svg
                  className="w-8 h-8 text-brown-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-brown-600 mb-4">
                Smart Reminders
              </h3>
              <p className="text-brown-500 mb-4">
                Personalized notifications that adapt to your schedule. Never
                miss a dose with our intelligent reminder system.
              </p>
              <ul className="text-sm text-brown-400 space-y-2">
                <li className="flex items-center space-x-2">
                  <div className="w-1.5 h-1.5 bg-brown-400 rounded-full"></div>
                  <span>Custom notification sounds</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-1.5 h-1.5 bg-brown-400 rounded-full"></div>
                  <span>Snooze and reschedule options</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-1.5 h-1.5 bg-brown-400 rounded-full"></div>
                  <span>Multiple reminder types</span>
                </li>
              </ul>
            </div>

            <div className="feature-card bg-beige-50 rounded-xl p-8 fade-in stagger-2">
              <div className="bg-brown-100 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                <svg
                  className="w-8 h-8 text-brown-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fill-rule="evenodd"
                    d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clip-rule="evenodd"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-brown-600 mb-4">
                Medication Tracking
              </h3>
              <p className="text-brown-500 mb-4">
                Keep detailed records of your medications, dosages, and
                adherence patterns with our comprehensive tracking system.
              </p>
              <ul className="text-sm text-brown-400 space-y-2">
                <li className="flex items-center space-x-2">
                  <div className="w-1.5 h-1.5 bg-brown-400 rounded-full"></div>
                  <span>Adherence statistics</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-1.5 h-1.5 bg-brown-400 rounded-full"></div>
                  <span>Progress visualization</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-1.5 h-1.5 bg-brown-400 rounded-full"></div>
                  <span>Historical data</span>
                </li>
              </ul>
            </div>

            <div className="feature-card bg-beige-50 rounded-xl p-8 fade-in stagger-3">
              <div className="bg-brown-100 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                <svg
                  className="w-8 h-8 text-brown-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-brown-600 mb-4">
                Refill Management
              </h3>
              <p className="text-brown-500 mb-4">
                Stay ahead of running out with automatic refill reminders and
                pharmacy integration for seamless ordering.
              </p>
              <ul className="text-sm text-brown-400 space-y-2">
                <li className="flex items-center space-x-2">
                  <div className="w-1.5 h-1.5 bg-brown-400 rounded-full"></div>
                  <span>Low stock alerts</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-1.5 h-1.5 bg-brown-400 rounded-full"></div>
                  <span>Pharmacy contacts</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-1.5 h-1.5 bg-brown-400 rounded-full"></div>
                  <span>Refill history</span>
                </li>
              </ul>
            </div>

            <div className="feature-card bg-beige-50 rounded-xl p-8 fade-in">
              <div className="bg-brown-100 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                <svg
                  className="w-8 h-8 text-brown-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fill-rule="evenodd"
                    d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                    clip-rule="evenodd"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-brown-600 mb-4">
                Doctor Integration
              </h3>
              <p className="text-brown-500 mb-4">
                Connect with your healthcare providers and keep track of
                appointments, prescriptions, and medical advice.
              </p>
              <ul className="text-sm text-brown-400 space-y-2">
                <li className="flex items-center space-x-2">
                  <div className="w-1.5 h-1.5 bg-brown-400 rounded-full"></div>
                  <span>Appointment reminders</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-1.5 h-1.5 bg-brown-400 rounded-full"></div>
                  <span>Prescription management</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-1.5 h-1.5 bg-brown-400 rounded-full"></div>
                  <span>Health records</span>
                </li>
              </ul>
            </div>

            <div className="feature-card bg-beige-50 rounded-xl p-8 fade-in stagger-1">
              <div className="bg-brown-100 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                <svg
                  className="w-8 h-8 text-brown-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-brown-600 mb-4">
                Analytics & Reports
              </h3>
              <p className="text-brown-500 mb-4">
                Gain insights into your medication habits with detailed
                analytics and generate reports for your healthcare team.
              </p>
              <ul className="text-sm text-brown-400 space-y-2">
                <li className="flex items-center space-x-2">
                  <div className="w-1.5 h-1.5 bg-brown-400 rounded-full"></div>
                  <span>Adherence trends</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-1.5 h-1.5 bg-brown-400 rounded-full"></div>
                  <span>Custom reports</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-1.5 h-1.5 bg-brown-400 rounded-full"></div>
                  <span>Export capabilities</span>
                </li>
              </ul>
            </div>
            <div className="feature-card bg-beige-50 rounded-xl p-8 fade-in stagger-2">
              <div className="bg-brown-100 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                <svg
                  className="w-8 h-8 text-brown-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fill-rule="evenodd"
                    d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clip-rule="evenodd"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-brown-600 mb-4">
                Security & Privacy
              </h3>
              <p className="text-brown-500 mb-4">
                Your health data is protected with enterprise-grade security and
                privacy measures that exceed industry standards.
              </p>
              <ul className="text-sm text-brown-400 space-y-2">
                <li className="flex items-center space-x-2">
                  <div className="w-1.5 h-1.5 bg-brown-400 rounded-full"></div>
                  <span>End-to-end encryption</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-1.5 h-1.5 bg-brown-400 rounded-full"></div>
                  <span>HIPAA compliant</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-1.5 h-1.5 bg-brown-400 rounded-full"></div>
                  <span>Data ownership</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-beige-300 py-20">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl lg:text-4xl font-bold text-brown-600 mb-6">
            Ready to Take Control of Your Health?
          </h2>
          <p className="text-xl text-brown-400 mb-8 max-w-2xl mx-auto">
            Join thousands of users who have improved their medication adherence
            and health outcomes with MediCare.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => handleRouting("signup")}
              className="text-brown-600 cursor-pointer px-8 py-4 rounded-lg font-semibold text-lg bg-beige-200 hover:bg-brown-300 focus:outline-none focus:ring-2 focus:ring-white transition-all duration-200"
            >
              Start Now!
            </button>
          </div>
        </div>
      </section>

      <footer className="bg-brown-600 text-beige-100 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-center">
            <div className="flex items-center space-x-3 mb-4">
              <div className="bg-beige-200 p-2 rounded-lg">
                <svg
                  className="w-6 h-6 text-brown-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fill-rule="evenodd"
                    d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clip-rule="evenodd"
                  />
                </svg>
              </div>
              <div>
                <h3 className="font-bold text-white">MediCare</h3>
                <p className="text-xs">Smart Medication Management</p>
              </div>
            </div>
            <p className="text-sm">
              Empowering better health outcomes through intelligent medication
              management and personalized care.
            </p>
          </div>

          <div className="border-t border-brown-500 mt-8 pt-8 text-center text-sm">
            <p>
              &copy; 2024 MediCare. All rights reserved. Made with ❤️ for better
              health.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
