import ActionCard from "./ActionCard";

const DashboardActions = () => {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <ActionCard
          icon="fas fa-prescription"
          heading={`Pending Refills`}
          totalCount={`24`}
          specificCount={`+8 today`}
          specificCountColor={`text-red-600`}
          buttonHeading={`Process refills`}
        />
        <ActionCard
          icon="fas fa-pills"
          heading={`Low Stock Items`}
          totalCount={`12`}
          specificCount={`3 critical`}
          specificCountColor={`text-amber-600`}
          buttonHeading={`Update inventory`}
        />
      </div>
    </>
  );
};

export default DashboardActions;
