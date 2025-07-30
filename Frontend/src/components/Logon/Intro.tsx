const Intro = () => {
  return (
    <div className="order-1 md:order-0 w-full md:w-5/12 bg-beige-200 p-8 flex flex-col justify-between">
      <div>
        <h2 className="text-2xl font-bold text-brown-600 mb-4">
          Medication Management Made Simple
        </h2>
        <p className="text-brown-500 mb-6">
          Track prescriptions, get reminders, and never miss a dose again.
        </p>

        <div className="space-y-4 mt-8">
          <div className="flex items-start">
            <div className="bg-beige-100 p-2 rounded-full">
              <svg
                className="w-5 h-5 text-brown-500"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                ></path>
              </svg>
            </div>
            <p className="ml-3 text-sm text-brown-500">
              Track multiple medications in one place
            </p>
          </div>
          <div className="flex items-start">
            <div className="bg-beige-100 p-2 rounded-full">
              <svg
                className="w-5 h-5 text-brown-500"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                ></path>
              </svg>
            </div>
            <p className="ml-3 text-sm text-brown-500">
              Get timely reminders for doses and refills
            </p>
          </div>
          <div className="flex items-start">
            <div className="bg-beige-100 p-2 rounded-full">
              <svg
                className="w-5 h-5 text-brown-500"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                ></path>
              </svg>
            </div>
            <p className="ml-3 text-sm text-brown-500">
              Connect with healthcare providers and pharmacies
            </p>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <p className="text-xs text-brown-400">
          © 2025 Cpastone. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default Intro;
