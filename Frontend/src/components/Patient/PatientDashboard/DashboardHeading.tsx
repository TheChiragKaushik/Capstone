import type React from "react";

type DashboardHeadingProps = {
  name: string;
};
const DashboardHeading: React.FC<DashboardHeadingProps> = ({ name }) => {
  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold text-brown-700">
        Welcome back, {name}
      </h2>
      <p className="text-brown-500">
        Here's your medication overview for today
      </p>
    </div>
  );
};

export default DashboardHeading;
