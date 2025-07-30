const Providers = () => {
  return (
    <div className="bg-white col-span-2 rounded-lg shadow-sm p-6 border border-beige-100">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium text-brown-700">Healthcare Team</h3>
        <button className="text-sm text-brown-500 hover:text-brown-600 flex items-center">
          <i className="fas fa-plus mr-1"></i>
          Add
        </button>
      </div>
      <div className="space-y-4">
        <div className="flex items-center p-3 bg-beige-50 border border-beige-100 rounded-lg">
          <div className="flex-shrink-0 h-12 w-12 rounded-full bg-brown-100 flex items-center justify-center text-brown-500">
            <i className="fas fa-user-md text-lg"></i>
          </div>
          <div className="ml-4 flex-1">
            <div className="flex justify-between">
              <div>
                <p className="text-sm font-medium text-brown-700">
                  Dr. Sarah Johnson
                </p>
                <p className="text-xs text-brown-400">Primary Care Physician</p>
              </div>
              <button className="text-brown-500 hover:text-brown-600">
                <i className="fas fa-comment-alt"></i>
              </button>
            </div>
          </div>
        </div>

        <div className="flex items-center p-3 bg-beige-50 border border-beige-100 rounded-lg">
          <div className="flex-shrink-0 h-12 w-12 rounded-full bg-brown-100 flex items-center justify-center text-brown-500">
            <i className="fas fa-heartbeat text-lg"></i>
          </div>
          <div className="ml-4 flex-1">
            <div className="flex justify-between">
              <div>
                <p className="text-sm font-medium text-brown-700">
                  Dr. Michael Chen
                </p>
                <p className="text-xs text-brown-400">Cardiologist</p>
              </div>
              <button className="text-brown-500 hover:text-brown-600">
                <i className="fas fa-comment-alt"></i>
              </button>
            </div>
          </div>
        </div>

        <div className="flex items-center p-3 bg-beige-50 border border-beige-100 rounded-lg">
          <div className="flex-shrink-0 h-12 w-12 rounded-full bg-brown-100 flex items-center justify-center text-brown-500">
            <i className="fas fa-prescription-bottle-alt text-lg"></i>
          </div>
          <div className="ml-4 flex-1">
            <div className="flex justify-between">
              <div>
                <p className="text-sm font-medium text-brown-700">
                  MedPlus Pharmacy
                </p>
                <p className="text-xs text-brown-400">Main Street Branch</p>
              </div>
              <button className="text-brown-500 hover:text-brown-600">
                <i className="fas fa-comment-alt"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Providers;
