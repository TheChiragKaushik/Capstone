const SelectedDayDetails = () => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 border border-beige-100">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-medium text-brown-700">
          June 15, 2023 (Today)
        </h3>
        <span className="px-2 py-1 text-xs font-medium rounded-full bg-brown-100 text-brown-600">
          Today
        </span>
      </div>

      <div className="space-y-4">
        <div className="flex items-center p-3 bg-green-50 border border-green-100 rounded-lg">
          <div className="flex-shrink-0 h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
            <i className="fas fa-check text-green-500"></i>
          </div>
          <div className="ml-4 flex-1">
            <div className="flex justify-between">
              <p className="text-sm font-medium text-brown-700">
                Lisinopril 10mg
              </p>
              <span className="text-xs text-green-600 font-medium">
                Taken at 8:05 AM
              </span>
            </div>
            <p className="text-xs text-brown-400">
              Scheduled for 8:00 AM with breakfast
            </p>
          </div>
        </div>

        <div className="flex items-center p-3 bg-beige-50 border border-beige-100 rounded-lg">
          <div className="flex-shrink-0 h-10 w-10 rounded-full bg-beige-100 flex items-center justify-center">
            <i className="fas fa-pills text-brown-400"></i>
          </div>
          <div className="ml-4 flex-1">
            <div className="flex justify-between">
              <p className="text-sm font-medium text-brown-700">
                Metformin 500mg
              </p>
              <span className="text-xs text-brown-400 font-medium">
                Scheduled for 1:00 PM
              </span>
            </div>
            <p className="text-xs text-brown-400">Take with lunch</p>
          </div>
          <button className="ml-4 bg-brown-500 hover:bg-brown-600 text-white py-1 px-3 rounded text-xs font-medium transition-colors duration-300">
            Mark as Taken
          </button>
        </div>

        <div className="flex items-center p-3 bg-beige-50 border border-beige-100 rounded-lg">
          <div className="flex-shrink-0 h-10 w-10 rounded-full bg-beige-100 flex items-center justify-center">
            <i className="fas fa-pills text-brown-400"></i>
          </div>
          <div className="ml-4 flex-1">
            <div className="flex justify-between">
              <p className="text-sm font-medium text-brown-700">
                Atorvastatin 20mg
              </p>
              <span className="text-xs text-brown-400 font-medium">
                Scheduled for 8:00 PM
              </span>
            </div>
            <p className="text-xs text-brown-400">Take before bedtime</p>
          </div>
          <button className="ml-4 bg-brown-500 hover:bg-brown-600 text-white py-1 px-3 rounded text-xs font-medium transition-colors duration-300">
            Mark as Taken
          </button>
        </div>
      </div>
    </div>
  );
};

export default SelectedDayDetails;
