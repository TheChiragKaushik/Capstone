const CalendarNavigation = () => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 border border-beige-100 mb-8">
      <div className="flex justify-between items-center mb-6">
        <button className="text-brown-500 hover:text-brown-700">
          <i className="fas fa-chevron-left"></i>
        </button>
        <h3 className="text-lg font-medium text-brown-700">June 2023</h3>
        <button className="text-brown-500 hover:text-brown-700">
          <i className="fas fa-chevron-right"></i>
        </button>
      </div>

      <div className="grid grid-cols-7 gap-2">
        <div className="text-center text-sm font-medium text-brown-500 py-2">
          Sun
        </div>
        <div className="text-center text-sm font-medium text-brown-500 py-2">
          Mon
        </div>
        <div className="text-center text-sm font-medium text-brown-500 py-2">
          Tue
        </div>
        <div className="text-center text-sm font-medium text-brown-500 py-2">
          Wed
        </div>
        <div className="text-center text-sm font-medium text-brown-500 py-2">
          Thu
        </div>
        <div className="text-center text-sm font-medium text-brown-500 py-2">
          Fri
        </div>
        <div className="text-center text-sm font-medium text-brown-500 py-2">
          Sat
        </div>

        <div className="h-24 border border-beige-100 rounded-lg bg-beige-50 p-1 opacity-50"></div>
        <div className="h-24 border border-beige-100 rounded-lg bg-beige-50 p-1 opacity-50"></div>
        <div className="h-24 border border-beige-100 rounded-lg bg-beige-50 p-1 opacity-50"></div>
        <div className="h-24 border border-beige-100 rounded-lg bg-beige-50 p-1 opacity-50"></div>

        <div className="calendar-day h-24 border border-beige-100 rounded-lg bg-white p-1 hover:shadow-md">
          <div className="text-right text-sm text-brown-400">1</div>
          <div className="mt-1">
            <div className="bg-green-100 rounded-full w-3 h-3 mb-1"></div>
            <div className="bg-green-100 rounded-full w-3 h-3 mb-1"></div>
            <div className="bg-green-100 rounded-full w-3 h-3"></div>
          </div>
        </div>
        <div className="calendar-day h-24 border border-beige-100 rounded-lg bg-white p-1 hover:shadow-md">
          <div className="text-right text-sm text-brown-400">2</div>
          <div className="mt-1">
            <div className="bg-green-100 rounded-full w-3 h-3 mb-1"></div>
            <div className="bg-green-100 rounded-full w-3 h-3 mb-1"></div>
            <div className="bg-yellow-100 rounded-full w-3 h-3"></div>
          </div>
        </div>
        <div className="calendar-day h-24 border border-beige-100 rounded-lg bg-white p-1 hover:shadow-md">
          <div className="text-right text-sm text-brown-400">3</div>
          <div className="mt-1">
            <div className="bg-green-100 rounded-full w-3 h-3 mb-1"></div>
            <div className="bg-green-100 rounded-full w-3 h-3 mb-1"></div>
            <div className="bg-green-100 rounded-full w-3 h-3"></div>
          </div>
        </div>
        <div className="calendar-day h-24 border border-beige-100 rounded-lg bg-white p-1 hover:shadow-md">
          <div className="text-right text-sm text-brown-400">4</div>
          <div className="mt-1">
            <div className="bg-green-100 rounded-full w-3 h-3 mb-1"></div>
            <div className="bg-green-100 rounded-full w-3 h-3 mb-1"></div>
            <div className="bg-green-100 rounded-full w-3 h-3"></div>
          </div>
        </div>
        <div className="calendar-day h-24 border border-beige-100 rounded-lg bg-white p-1 hover:shadow-md">
          <div className="text-right text-sm text-brown-400">5</div>
          <div className="mt-1">
            <div className="bg-green-100 rounded-full w-3 h-3 mb-1"></div>
            <div className="bg-yellow-100 rounded-full w-3 h-3 mb-1"></div>
            <div className="bg-green-100 rounded-full w-3 h-3"></div>
          </div>
        </div>
        <div className="calendar-day h-24 border border-beige-100 rounded-lg bg-white p-1 hover:shadow-md">
          <div className="text-right text-sm text-brown-400">6</div>
          <div className="mt-1">
            <div className="bg-green-100 rounded-full w-3 h-3 mb-1"></div>
            <div className="bg-green-100 rounded-full w-3 h-3 mb-1"></div>
            <div className="bg-green-100 rounded-full w-3 h-3"></div>
          </div>
        </div>
        <div className="calendar-day h-24 border border-beige-100 rounded-lg bg-white p-1 hover:shadow-md">
          <div className="text-right text-sm text-brown-400">7</div>
          <div className="mt-1">
            <div className="bg-green-100 rounded-full w-3 h-3 mb-1"></div>
            <div className="bg-green-100 rounded-full w-3 h-3 mb-1"></div>
            <div className="bg-green-100 rounded-full w-3 h-3"></div>
          </div>
        </div>
        <div className="calendar-day h-24 border border-beige-100 rounded-lg bg-white p-1 hover:shadow-md">
          <div className="text-right text-sm text-brown-400">8</div>
          <div className="mt-1">
            <div className="bg-green-100 rounded-full w-3 h-3 mb-1"></div>
            <div className="bg-green-100 rounded-full w-3 h-3 mb-1"></div>
            <div className="bg-red-100 rounded-full w-3 h-3"></div>
          </div>
        </div>
        <div className="calendar-day h-24 border border-beige-100 rounded-lg bg-white p-1 hover:shadow-md">
          <div className="text-right text-sm text-brown-400">9</div>
          <div className="mt-1">
            <div className="bg-green-100 rounded-full w-3 h-3 mb-1"></div>
            <div className="bg-green-100 rounded-full w-3 h-3 mb-1"></div>
            <div className="bg-green-100 rounded-full w-3 h-3"></div>
          </div>
        </div>
        <div className="calendar-day h-24 border border-beige-100 rounded-lg bg-white p-1 hover:shadow-md">
          <div className="text-right text-sm text-brown-400">10</div>
          <div className="mt-1">
            <div className="bg-green-100 rounded-full w-3 h-3 mb-1"></div>
            <div className="bg-green-100 rounded-full w-3 h-3 mb-1"></div>
            <div className="bg-green-100 rounded-full w-3 h-3"></div>
          </div>
        </div>
        <div className="calendar-day h-24 border border-beige-100 rounded-lg bg-white p-1 hover:shadow-md">
          <div className="text-right text-sm text-brown-400">11</div>
          <div className="mt-1">
            <div className="bg-green-100 rounded-full w-3 h-3 mb-1"></div>
            <div className="bg-yellow-100 rounded-full w-3 h-3 mb-1"></div>
            <div className="bg-green-100 rounded-full w-3 h-3"></div>
          </div>
        </div>
        <div className="calendar-day h-24 border border-beige-100 rounded-lg bg-white p-1 hover:shadow-md">
          <div className="text-right text-sm text-brown-400">12</div>
          <div className="mt-1">
            <div className="bg-green-100 rounded-full w-3 h-3 mb-1"></div>
            <div className="bg-green-100 rounded-full w-3 h-3 mb-1"></div>
            <div className="bg-green-100 rounded-full w-3 h-3"></div>
          </div>
        </div>
        <div className="calendar-day h-24 border border-beige-100 rounded-lg bg-white p-1 hover:shadow-md">
          <div className="text-right text-sm text-brown-400">13</div>
          <div className="mt-1">
            <div className="bg-green-100 rounded-full w-3 h-3 mb-1"></div>
            <div className="bg-green-100 rounded-full w-3 h-3 mb-1"></div>
            <div className="bg-green-100 rounded-full w-3 h-3"></div>
          </div>
        </div>
        <div className="calendar-day h-24 border border-beige-100 rounded-lg bg-white p-1 hover:shadow-md">
          <div className="text-right text-sm text-brown-400">14</div>
          <div className="mt-1">
            <div className="bg-green-100 rounded-full w-3 h-3 mb-1"></div>
            <div className="bg-green-100 rounded-full w-3 h-3 mb-1"></div>
            <div className="bg-red-100 rounded-full w-3 h-3"></div>
          </div>
        </div>
        <div className="calendar-day h-24 border border-beige-100 rounded-lg bg-brown-50 p-1 hover:shadow-md">
          <div className="text-right text-sm font-medium text-brown-600">
            15
          </div>
          <div className="mt-1">
            <div className="bg-green-100 rounded-full w-3 h-3 mb-1"></div>
            <div className="bg-beige-200 rounded-full w-3 h-3 mb-1"></div>
            <div className="bg-beige-200 rounded-full w-3 h-3"></div>
          </div>
        </div>
        <div className="calendar-day h-24 border border-beige-100 rounded-lg bg-white p-1 hover:shadow-md">
          <div className="text-right text-sm text-brown-400">16</div>
        </div>
        <div className="calendar-day h-24 border border-beige-100 rounded-lg bg-white p-1 hover:shadow-md">
          <div className="text-right text-sm text-brown-400">17</div>
        </div>
        <div className="calendar-day h-24 border border-beige-100 rounded-lg bg-white p-1 hover:shadow-md">
          <div className="text-right text-sm text-brown-400">18</div>
        </div>
        <div className="calendar-day h-24 border border-beige-100 rounded-lg bg-white p-1 hover:shadow-md">
          <div className="text-right text-sm text-brown-400">19</div>
        </div>
        <div className="calendar-day h-24 border border-beige-100 rounded-lg bg-white p-1 hover:shadow-md">
          <div className="text-right text-sm text-brown-400">20</div>
        </div>
        <div className="calendar-day h-24 border border-beige-100 rounded-lg bg-white p-1 hover:shadow-md">
          <div className="text-right text-sm text-brown-400">21</div>
        </div>
        <div className="calendar-day h-24 border border-beige-100 rounded-lg bg-white p-1 hover:shadow-md">
          <div className="text-right text-sm text-brown-400">22</div>
        </div>
        <div className="calendar-day h-24 border border-beige-100 rounded-lg bg-white p-1 hover:shadow-md">
          <div className="text-right text-sm text-brown-400">23</div>
        </div>
        <div className="calendar-day h-24 border border-beige-100 rounded-lg bg-white p-1 hover:shadow-md">
          <div className="text-right text-sm text-brown-400">24</div>
        </div>
        <div className="calendar-day h-24 border border-beige-100 rounded-lg bg-white p-1 hover:shadow-md">
          <div className="text-right text-sm text-brown-400">25</div>
        </div>
        <div className="calendar-day h-24 border border-beige-100 rounded-lg bg-white p-1 hover:shadow-md">
          <div className="text-right text-sm text-brown-400">26</div>
        </div>
        <div className="calendar-day h-24 border border-beige-100 rounded-lg bg-white p-1 hover:shadow-md">
          <div className="text-right text-sm text-brown-400">27</div>
        </div>
        <div className="calendar-day h-24 border border-beige-100 rounded-lg bg-white p-1 hover:shadow-md">
          <div className="text-right text-sm text-brown-400">28</div>
        </div>
        <div className="calendar-day h-24 border border-beige-100 rounded-lg bg-white p-1 hover:shadow-md">
          <div className="text-right text-sm text-brown-400">29</div>
        </div>
        <div className="calendar-day h-24 border border-beige-100 rounded-lg bg-white p-1 hover:shadow-md">
          <div className="text-right text-sm text-brown-400">30</div>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-center space-x-6">
        <div className="flex items-center">
          <div className="w-3 h-3 bg-green-100 rounded-full mr-2"></div>
          <span className="text-xs text-brown-500">Taken</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-yellow-100 rounded-full mr-2"></div>
          <span className="text-xs text-brown-500">Delayed</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-red-100 rounded-full mr-2"></div>
          <span className="text-xs text-brown-500">Missed</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-beige-200 rounded-full mr-2"></div>
          <span className="text-xs text-brown-500">Scheduled</span>
        </div>
      </div>
    </div>
  );
};

export default CalendarNavigation;
