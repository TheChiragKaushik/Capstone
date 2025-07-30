const RefillStatus = () => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 border border-beige-100">
      <h3 className="text-lg font-medium text-brown-700 mb-4">Refill Status</h3>
      <div className="space-y-4">
        <div className="flex items-center">
          <div className="w-full bg-beige-100 rounded-full h-2.5">
            <div
              className="bg-red-400 h-2.5 rounded-full"
              style={{ width: "15%" }}
            ></div>
          </div>
          <span className="ml-2 text-sm font-medium text-brown-500">15%</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-brown-500">Lisinopril 10mg</span>
          <span className="text-red-500 font-medium">3 days left</span>
        </div>
        <button className="w-full bg-brown-500 hover:bg-brown-600 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors duration-300">
          Request Refill
        </button>

        <div className="mt-4 pt-4 border-t border-beige-100">
          <div className="flex items-center">
            <div className="w-full bg-beige-100 rounded-full h-2.5">
              <div
                className="bg-yellow-400 h-2.5 rounded-full"
                style={{ width: "40%" }}
              ></div>
            </div>
            <span className="ml-2 text-sm font-medium text-brown-500">40%</span>
          </div>
          <div className="flex justify-between text-sm mt-1">
            <span className="text-brown-500">Metformin 500mg</span>
            <span className="text-yellow-600 font-medium">12 days left</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RefillStatus;
