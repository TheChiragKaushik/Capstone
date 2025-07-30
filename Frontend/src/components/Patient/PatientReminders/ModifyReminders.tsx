const ModifyReminders = () => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 border border-beige-100 mb-8">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-medium text-brown-700">
          Current Reminders
        </h3>
        <button
          id="add-reminder-btn"
          className="bg-brown-500 hover:bg-brown-600 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors duration-300 flex items-center"
        >
          <i className="fas fa-plus mr-2"></i>
          Add New Reminder
        </button>
      </div>

      <div className="space-y-6">
        <div className="border border-beige-200 rounded-lg overflow-hidden">
          <div className="bg-beige-50 px-4 py-3 flex justify-between items-center">
            <div className="flex items-center">
              <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-500 mr-3">
                <i className="fas fa-capsules"></i>
              </div>
              <h4 className="font-medium text-brown-700">Lisinopril 10mg</h4>
            </div>
            <div className="flex space-x-2">
              <button className="text-brown-400 hover:text-brown-600">
                <i className="fas fa-edit"></i>
              </button>
              <button className="text-brown-400 hover:text-red-500">
                <i className="fas fa-trash-alt"></i>
              </button>
            </div>
          </div>
          <div className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-xs text-brown-400 mb-1">Schedule</p>
                <p className="text-sm text-brown-700">Daily at 8:00 AM</p>
              </div>
              <div>
                <p className="text-xs text-brown-400 mb-1">Instructions</p>
                <p className="text-sm text-brown-700">Take with breakfast</p>
              </div>
              <div>
                <p className="text-xs text-brown-400 mb-1">Notification Type</p>
                <p className="text-sm text-brown-700">
                  Push notification, Email
                </p>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-beige-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <span className="text-sm text-brown-700 mr-2">Status:</span>
                  <span className="px-2 py-1 inline-flex text-xs leading-4 font-semibold rounded-full bg-green-100 text-green-800">
                    Active
                  </span>
                </div>
                <label className="inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    value=""
                    className="sr-only peer"
                    checked
                  />
                  <div className="relative w-11 h-6 bg-beige-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-brown-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-beige-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brown-500"></div>
                </label>
              </div>
            </div>
          </div>
        </div>

        <div className="border border-beige-200 rounded-lg overflow-hidden">
          <div className="bg-beige-50 px-4 py-3 flex justify-between items-center">
            <div className="flex items-center">
              <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-500 mr-3">
                <i className="fas fa-pills"></i>
              </div>
              <h4 className="font-medium text-brown-700">Metformin 500mg</h4>
            </div>
            <div className="flex space-x-2">
              <button className="text-brown-400 hover:text-brown-600">
                <i className="fas fa-edit"></i>
              </button>
              <button className="text-brown-400 hover:text-red-500">
                <i className="fas fa-trash-alt"></i>
              </button>
            </div>
          </div>
          <div className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-xs text-brown-400 mb-1">Schedule</p>
                <p className="text-sm text-brown-700">Daily at 1:00 PM</p>
              </div>
              <div>
                <p className="text-xs text-brown-400 mb-1">Instructions</p>
                <p className="text-sm text-brown-700">Take with lunch</p>
              </div>
              <div>
                <p className="text-xs text-brown-400 mb-1">Notification Type</p>
                <p className="text-sm text-brown-700">Push notification, SMS</p>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-beige-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <span className="text-sm text-brown-700 mr-2">Status:</span>
                  <span className="px-2 py-1 inline-flex text-xs leading-4 font-semibold rounded-full bg-green-100 text-green-800">
                    Active
                  </span>
                </div>
                <label className="inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    value=""
                    className="sr-only peer"
                    checked
                  />
                  <div className="relative w-11 h-6 bg-beige-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-brown-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-beige-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brown-500"></div>
                </label>
              </div>
            </div>
          </div>
        </div>

        <div className="border border-beige-200 rounded-lg overflow-hidden">
          <div className="bg-beige-50 px-4 py-3 flex justify-between items-center">
            <div className="flex items-center">
              <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center text-green-500 mr-3">
                <i className="fas fa-tablets"></i>
              </div>
              <h4 className="font-medium text-brown-700">Atorvastatin 20mg</h4>
            </div>
            <div className="flex space-x-2">
              <button className="text-brown-400 hover:text-brown-600">
                <i className="fas fa-edit"></i>
              </button>
              <button className="text-brown-400 hover:text-red-500">
                <i className="fas fa-trash-alt"></i>
              </button>
            </div>
          </div>
          <div className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-xs text-brown-400 mb-1">Schedule</p>
                <p className="text-sm text-brown-700">Daily at 8:00 PM</p>
              </div>
              <div>
                <p className="text-xs text-brown-400 mb-1">Instructions</p>
                <p className="text-sm text-brown-700">Take before bedtime</p>
              </div>
              <div>
                <p className="text-xs text-brown-400 mb-1">Notification Type</p>
                <p className="text-sm text-brown-700">Push notification</p>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-beige-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <span className="text-sm text-brown-700 mr-2">Status:</span>
                  <span className="px-2 py-1 inline-flex text-xs leading-4 font-semibold rounded-full bg-green-100 text-green-800">
                    Active
                  </span>
                </div>
                <label className="inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    value=""
                    className="sr-only peer"
                    checked
                  />
                  <div className="relative w-11 h-6 bg-beige-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-brown-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-beige-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brown-500"></div>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModifyReminders;
