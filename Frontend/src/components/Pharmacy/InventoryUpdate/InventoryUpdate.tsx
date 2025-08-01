import type { CommonRouteProps } from "../../../utils/Interfaces";
import CommonHeading from "../../Common/CommonHeading";
import InventoryActions from "./InventoryActions";
import Stat from "./Stat";

const InventoryUpdate = ({ userId }: CommonRouteProps) => {
  console.log(userId);
  return (
    <div className="w-full mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <CommonHeading
        heading="Inventory Management"
        subHeading="Update and manage medication inventory"
      />
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Stat
          bg="bg-teal-100"
          icon="fas fa-pills text-teal-600"
          heading="Total Medications"
          subHeading="24"
          statStyle="md:col-start-2"
        />

        <Stat
          bg="bg-red-100"
          icon="fas fa-exclamation-triangle text-red-600"
          heading="Low Stock Items"
          subHeading="3"
        />
      </div>
      <InventoryActions />
    </div>
  );
};

export default InventoryUpdate;
