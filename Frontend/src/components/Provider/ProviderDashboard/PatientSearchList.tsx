const PatientSearchList = () => {
  return (
    <>
      <div className="bg-white rounded-lg shadow-sm p-6 border border-beige-100 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="col-span-2">
            <label className="block text-sm font-medium text-brown-700 mb-2">
              Search Patient
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <i className="fas fa-search text-brown-400"></i>
              </div>
              <input
                type="text"
                id="patient-search"
                className="bg-beige-50 border border-beige-200 text-brown-700 text-sm rounded-lg focus:ring-brown-400 focus:border-brown-400 block w-full pl-10 p-2.5"
                placeholder="Search by name, ID, or phone number"
              />
            </div>
          </div>
        </div>
      </div>
      <div className="bg-white rounded-lg shadow-sm border border-beige-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-beige-200">
            <thead className="bg-beige-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-brown-500 uppercase tracking-wider"
                >
                  Patient
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-brown-500 uppercase tracking-wider"
                >
                  ID
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-brown-500 uppercase tracking-wider"
                >
                  Date of Birth
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-brown-500 uppercase tracking-wider"
                >
                  Last Visit
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-brown-500 uppercase tracking-wider"
                >
                  Active Medications
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-brown-500 uppercase tracking-wider"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-beige-100">
              <tr
                className="hover:bg-beige-50 cursor-pointer patient-row"
                data-patient="john-doe"
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-8 w-8 rounded-full bg-beige-200 flex items-center justify-center text-brown-600">
                      <span>JD</span>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-brown-700">
                        John Doe
                      </div>
                      <div className="text-xs text-brown-400">
                        john.doe@example.com
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-brown-700">P-12345678</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-brown-700">06/15/1985</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-brown-700">June 10, 2023</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-brown-700">3</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex space-x-2">
                    <button
                      className="bg-brown-500 hover:bg-brown-600 text-white py-1 px-3 rounded text-xs font-medium transition-colors duration-300 view-records-btn"
                      data-patient="john-doe"
                    >
                      Records
                    </button>
                    <button
                      className="bg-green-600 hover:bg-green-700 text-white py-1 px-3 rounded text-xs font-medium transition-colors duration-300 prescribe-btn"
                      data-patient="john-doe"
                    >
                      Prescribe
                    </button>
                  </div>
                </td>
              </tr>
              <tr
                className="hover:bg-beige-50 cursor-pointer patient-row"
                data-patient="maria-garcia"
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-8 w-8 rounded-full bg-beige-200 flex items-center justify-center text-brown-600">
                      <span>MG</span>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-brown-700">
                        Maria Garcia
                      </div>
                      <div className="text-xs text-brown-400">
                        maria.garcia@example.com
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-brown-700">P-23456789</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-brown-700">03/22/1978</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-brown-700">June 8, 2023</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-brown-700">2</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex space-x-2">
                    <button
                      className="bg-brown-500 hover:bg-brown-600 text-white py-1 px-3 rounded text-xs font-medium transition-colors duration-300 view-records-btn"
                      data-patient="maria-garcia"
                    >
                      Records
                    </button>
                    <button
                      className="bg-green-600 hover:bg-green-700 text-white py-1 px-3 rounded text-xs font-medium transition-colors duration-300 prescribe-btn"
                      data-patient="maria-garcia"
                    >
                      Prescribe
                    </button>
                  </div>
                </td>
              </tr>
              <tr
                className="hover:bg-beige-50 cursor-pointer patient-row"
                data-patient="robert-johnson"
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-8 w-8 rounded-full bg-beige-200 flex items-center justify-center text-brown-600">
                      <span>RJ</span>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-brown-700">
                        Robert Johnson
                      </div>
                      <div className="text-xs text-brown-400">
                        robert.johnson@example.com
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-brown-700">P-34567890</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-brown-700">11/04/1962</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-brown-700">June 12, 2023</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-brown-700">4</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex space-x-2">
                    <button
                      className="bg-brown-500 hover:bg-brown-600 text-white py-1 px-3 rounded text-xs font-medium transition-colors duration-300 view-records-btn"
                      data-patient="robert-johnson"
                    >
                      Records
                    </button>
                    <button
                      className="bg-green-600 hover:bg-green-700 text-white py-1 px-3 rounded text-xs font-medium transition-colors duration-300 prescribe-btn"
                      data-patient="robert-johnson"
                    >
                      Prescribe
                    </button>
                  </div>
                </td>
              </tr>
              <tr
                className="hover:bg-beige-50 cursor-pointer patient-row"
                data-patient="sarah-williams"
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-8 w-8 rounded-full bg-beige-200 flex items-center justify-center text-brown-600">
                      <span>SW</span>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-brown-700">
                        Sarah Williams
                      </div>
                      <div className="text-xs text-brown-400">
                        sarah.williams@example.com
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-brown-700">P-45678901</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-brown-700">09/28/1990</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-brown-700">June 5, 2023</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-brown-700">1</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex space-x-2">
                    <button
                      className="bg-brown-500 hover:bg-brown-600 text-white py-1 px-3 rounded text-xs font-medium transition-colors duration-300 view-records-btn"
                      data-patient="sarah-williams"
                    >
                      Records
                    </button>
                    <button
                      className="bg-green-600 hover:bg-green-700 text-white py-1 px-3 rounded text-xs font-medium transition-colors duration-300 prescribe-btn"
                      data-patient="sarah-williams"
                    >
                      Prescribe
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-beige-200 sm:px-6">
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-brown-500">
                Showing <span className="font-medium">1</span> to
                <span className="font-medium">4</span> of
                <span className="font-medium">42</span> patients
              </p>
            </div>
            <div>
              <nav
                className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                aria-label="Pagination"
              >
                <a
                  href="#"
                  className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-beige-200 bg-white text-sm font-medium text-brown-400 hover:bg-beige-50"
                >
                  <span className="sr-only">Previous</span>
                  <i className="fas fa-chevron-left"></i>
                </a>
                <a
                  href="#"
                  className="relative inline-flex items-center px-4 py-2 border border-beige-200 bg-beige-50 text-sm font-medium text-brown-700 hover:bg-beige-100"
                >
                  1
                </a>
                <a
                  href="#"
                  className="relative inline-flex items-center px-4 py-2 border border-beige-200 bg-white text-sm font-medium text-brown-500 hover:bg-beige-50"
                >
                  2
                </a>
                <a
                  href="#"
                  className="relative inline-flex items-center px-4 py-2 border border-beige-200 bg-white text-sm font-medium text-brown-500 hover:bg-beige-50"
                >
                  3
                </a>
                <span className="relative inline-flex items-center px-4 py-2 border border-beige-200 bg-white text-sm font-medium text-brown-400">
                  ...
                </span>
                <a
                  href="#"
                  className="relative inline-flex items-center px-4 py-2 border border-beige-200 bg-white text-sm font-medium text-brown-500 hover:bg-beige-50"
                >
                  11
                </a>
                <a
                  href="#"
                  className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-beige-200 bg-white text-sm font-medium text-brown-400 hover:bg-beige-50"
                >
                  <span className="sr-only">Next</span>
                  <i className="fas fa-chevron-right"></i>
                </a>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PatientSearchList;
