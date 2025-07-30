const PatientDetails = () => {
  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-beige-100 mb-8">
      <div className="bg-brown-500 px-6 py-4">
        <div className="flex items-center">
          <div className="h-20 w-20 rounded-full bg-white flex items-center justify-center text-brown-500 text-2xl font-bold">
            JD
          </div>
          <div className="ml-6">
            <h3 className="text-xl font-semibold text-white">John Doe</h3>
            <p className="text-beige-100">Patient ID: P-12345678</p>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-lg font-medium text-brown-700 mb-4">
              Personal Information
            </h4>
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="profile-name"
                  className="block text-sm font-medium text-brown-700 mb-1"
                >
                  Full Name
                </label>
                <input
                  type="text"
                  id="profile-name"
                  className="bg-beige-50 border border-beige-200 text-brown-700 text-sm rounded-lg focus:ring-brown-400 focus:border-brown-400 block w-full p-2.5"
                  value="John Doe"
                />
              </div>
              <div>
                <label
                  htmlFor="profile-email"
                  className="block text-sm font-medium text-brown-700 mb-1"
                >
                  Email Address
                </label>
                <input
                  type="email"
                  id="profile-email"
                  className="bg-beige-50 border border-beige-200 text-brown-700 text-sm rounded-lg focus:ring-brown-400 focus:border-brown-400 block w-full p-2.5"
                  value="john.doe@example.com"
                />
              </div>
              <div>
                <label
                  htmlFor="profile-phone"
                  className="block text-sm font-medium text-brown-700 mb-1"
                >
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="profile-phone"
                  className="bg-beige-50 border border-beige-200 text-brown-700 text-sm rounded-lg focus:ring-brown-400 focus:border-brown-400 block w-full p-2.5"
                  value="(555) 123-4567"
                />
              </div>
              <div>
                <label
                  htmlFor="profile-dob"
                  className="block text-sm font-medium text-brown-700 mb-1"
                >
                  Date of Birth
                </label>
                <input
                  type="date"
                  id="profile-dob"
                  className="bg-beige-50 border border-beige-200 text-brown-700 text-sm rounded-lg focus:ring-brown-400 focus:border-brown-400 block w-full p-2.5"
                  value="1985-06-15"
                />
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-medium text-brown-700 mb-4">
              Address Information
            </h4>
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="profile-address"
                  className="block text-sm font-medium text-brown-700 mb-1"
                >
                  Street Address
                </label>
                <input
                  type="text"
                  id="profile-address"
                  className="bg-beige-50 border border-beige-200 text-brown-700 text-sm rounded-lg focus:ring-brown-400 focus:border-brown-400 block w-full p-2.5"
                  value="123 Main Street"
                />
              </div>
              <div>
                <label
                  htmlFor="profile-city"
                  className="block text-sm font-medium text-brown-700 mb-1"
                >
                  City
                </label>
                <input
                  type="text"
                  id="profile-city"
                  className="bg-beige-50 border border-beige-200 text-brown-700 text-sm rounded-lg focus:ring-brown-400 focus:border-brown-400 block w-full p-2.5"
                  value="Anytown"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="profile-state"
                    className="block text-sm font-medium text-brown-700 mb-1"
                  >
                    State
                  </label>
                  <input
                    type="text"
                    id="profile-state"
                    className="bg-beige-50 border border-beige-200 text-brown-700 text-sm rounded-lg focus:ring-brown-400 focus:border-brown-400 block w-full p-2.5"
                    value="CA"
                  />
                </div>
                <div>
                  <label
                    htmlFor="profile-zip"
                    className="block text-sm font-medium text-brown-700 mb-1"
                  >
                    ZIP Code
                  </label>
                  <input
                    type="text"
                    id="profile-zip"
                    className="bg-beige-50 border border-beige-200 text-brown-700 text-sm rounded-lg focus:ring-brown-400 focus:border-brown-400 block w-full p-2.5"
                    value="12345"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <h4 className="text-lg font-medium text-brown-700 mb-4">
            Emergency Contact
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="profile-emergency-name"
                className="block text-sm font-medium text-brown-700 mb-1"
              >
                Contact Name
              </label>
              <input
                type="text"
                id="profile-emergency-name"
                className="bg-beige-50 border border-beige-200 text-brown-700 text-sm rounded-lg focus:ring-brown-400 focus:border-brown-400 block w-full p-2.5"
                value="Jane Doe"
              />
            </div>
            <div>
              <label
                htmlFor="profile-emergency-relation"
                className="block text-sm font-medium text-brown-700 mb-1"
              >
                Relationship
              </label>
              <input
                type="text"
                id="profile-emergency-relation"
                className="bg-beige-50 border border-beige-200 text-brown-700 text-sm rounded-lg focus:ring-brown-400 focus:border-brown-400 block w-full p-2.5"
                value="Spouse"
              />
            </div>
            <div>
              <label
                htmlFor="profile-emergency-phone"
                className="block text-sm font-medium text-brown-700 mb-1"
              >
                Phone Number
              </label>
              <input
                type="tel"
                id="profile-emergency-phone"
                className="bg-beige-50 border border-beige-200 text-brown-700 text-sm rounded-lg focus:ring-brown-400 focus:border-brown-400 block w-full p-2.5"
                value="(555) 987-6543"
              />
            </div>
            <div>
              <label
                htmlFor="profile-emergency-email"
                className="block text-sm font-medium text-brown-700 mb-1"
              >
                Email Address
              </label>
              <input
                type="email"
                id="profile-emergency-email"
                className="bg-beige-50 border border-beige-200 text-brown-700 text-sm rounded-lg focus:ring-brown-400 focus:border-brown-400 block w-full p-2.5"
                value="jane.doe@example.com"
              />
            </div>
          </div>
        </div>

        <div className="mt-8 flex justify-end">
          <button
            type="button"
            className="bg-beige-100 text-brown-600 hover:bg-beige-200 mr-2 py-2 px-4 rounded-lg text-sm font-medium transition-colors duration-300"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-brown-500 hover:bg-brown-600 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors duration-300"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default PatientDetails;
