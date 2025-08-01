type CommonHeadingProps = {
  heading?: string;
  subHeading?: string;
};

const CommonHeading = ({ heading, subHeading }: CommonHeadingProps) => {
  return (
    <div className="mb-8">
      <h2 className="text-2xl font-semibold text-gray-800">{heading}</h2>
      <p className="text-gray-600">{subHeading}</p>
    </div>
  );
};

export default CommonHeading;
