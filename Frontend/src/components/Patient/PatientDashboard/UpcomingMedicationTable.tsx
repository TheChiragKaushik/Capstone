const UpcomingMedicationTable = () => (
  <div className="bg-white rounded-lg shadow-sm p-6 border border-beige-100 mb-8">
    <div className="flex justify-between items-center mb-6">
      <h3 className="text-lg font-medium text-brown-700">
        Upcoming Medications
      </h3>
      <a
        href="#"
        className="text-sm text-brown-500 hover:text-brown-600 flex items-center"
      >
        View all
        <i className="fas fa-chevron-right ml-1 text-xs"></i>
      </a>
    </div>

    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-beige-200">
        <thead className="bg-beige-50">
          <tr>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-brown-500 uppercase tracking-wider"
            >
              Medication
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-brown-500 uppercase tracking-wider"
            >
              Dosage
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-brown-500 uppercase tracking-wider"
            >
              Time
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-brown-500 uppercase tracking-wider"
            >
              Instructions
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-brown-500 uppercase tracking-wider"
            >
              Status
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-beige-100">
          <tr>
            <td className="px-6 py-4 whitespace-nowrap">
              <div className="flex items-center">
                <div className="flex-shrink-0 h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-500">
                  <i className="fas fa-capsules"></i>
                </div>
                <div className="ml-4">
                  <div className="text-sm font-medium text-brown-700">
                    Metformin
                  </div>
                  <div className="text-xs text-brown-400">500mg tablet</div>
                </div>
              </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              <div className="text-sm text-brown-700">1 tablet</div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              <div className="text-sm text-brown-700">1:00 PM</div>
              <div className="text-xs text-brown-400">Today</div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              <div className="text-sm text-brown-700">Take with lunch</div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                Upcoming
              </span>
            </td>
          </tr>
          <tr>
            <td className="px-6 py-4 whitespace-nowrap">
              <div className="flex items-center">
                <div className="flex-shrink-0 h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-500">
                  <i className="fas fa-pills"></i>
                </div>
                <div className="ml-4">
                  <div className="text-sm font-medium text-brown-700">
                    Atorvastatin
                  </div>
                  <div className="text-xs text-brown-400">20mg tablet</div>
                </div>
              </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              <div className="text-sm text-brown-700">1 tablet</div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              <div className="text-sm text-brown-700">8:00 PM</div>
              <div className="text-xs text-brown-400">Today</div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              <div className="text-sm text-brown-700">Take before bedtime</div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                Upcoming
              </span>
            </td>
          </tr>
          <tr>
            <td className="px-6 py-4 whitespace-nowrap">
              <div className="flex items-center">
                <div className="flex-shrink-0 h-8 w-8 rounded-full bg-green-100 flex items-center justify-center text-green-500">
                  <i className="fas fa-tablets"></i>
                </div>
                <div className="ml-4">
                  <div className="text-sm font-medium text-brown-700">
                    Lisinopril
                  </div>
                  <div className="text-xs text-brown-400">10mg tablet</div>
                </div>
              </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              <div className="text-sm text-brown-700">1 tablet</div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              <div className="text-sm text-brown-700">8:00 AM</div>
              <div className="text-xs text-brown-400">Tomorrow</div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              <div className="text-sm text-brown-700">Take with breakfast</div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                Tomorrow
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
);

export default UpcomingMedicationTable;
