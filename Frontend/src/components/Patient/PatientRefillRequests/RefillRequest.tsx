const RefillRequest = () => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 border border-beige-100 mb-8">
      <h3 className="text-lg font-medium text-brown-700 mb-6">
        Medications Needing Refill
      </h3>

      <div className="space-y-4">
        <div className="border border-red-100 bg-red-50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center text-red-500 mr-4">
                <i className="fas fa-exclamation-circle"></i>
              </div>
              <div>
                <h4 className="font-medium text-brown-700">Lisinopril 10mg</h4>
                <p className="text-sm text-brown-500">3 days remaining</p>
              </div>
            </div>
            <button className="bg-brown-500 hover:bg-brown-600 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors duration-300">
              Request Refill
            </button>
          </div>
        </div>

        <div className="border border-yellow-100 bg-yellow-50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="h-10 w-10 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-500 mr-4">
                <i className="fas fa-exclamation-triangle"></i>
              </div>
              <div>
                <h4 className="font-medium text-brown-700">Metformin 500mg</h4>
                <p className="text-sm text-brown-500">12 days remaining</p>
              </div>
            </div>
            <button className="bg-brown-500 hover:bg-brown-600 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors duration-300">
              Request Refill
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RefillRequest;
