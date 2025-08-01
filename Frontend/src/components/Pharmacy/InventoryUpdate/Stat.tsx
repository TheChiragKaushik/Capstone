import type React from "react";

type StatProps = {
  bg?: string;
  icon?: string;
  heading?: string;
  subHeading?: string;
  statStyle?: string;
};

const Stat: React.FC<StatProps> = ({
  bg,
  icon,
  heading,
  subHeading,
  statStyle,
}) => {
  return (
    <div
      className={`bg-white rounded-lg shadow-sm p-6 border border-gray-200 ${statStyle}`}
    >
      <div className="flex items-center">
        <div className={`flex-shrink-0 ${bg} rounded-md p-3`}>
          <i className={`${icon} text-xl`}></i>
        </div>
        <div className="ml-5">
          <p className="text-sm font-medium text-gray-500">{heading}</p>
          <p className="text-2xl font-semibold text-gray-900">{subHeading}</p>
        </div>
      </div>
    </div>
  );
};

export default Stat;
