import type React from "react";

type InventoryProp = {
  medicationName?: string;
  medicationUnit?: string;
  currenStock?: string;
  reorderPoint?: string;
  maxStock?: string;
};

const Inventory: React.FC<InventoryProp> = ({
  medicationName = "Metoprolol",
  medicationUnit = "50mg",
  currenStock = "142 tablets",
  reorderPoint = "50",
  maxStock = "300",
}) => {
  return (
    <div className="mb-6">
      <h4 className="text-md font-medium text-gray-700 mb-4">
        Inventory Check
      </h4>
      <div className="bg-gray-50 p-4 rounded-lg">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-md font-medium text-gray-900">
              {medicationName}
            </p>
            <p className="text-sm text-gray-500">{medicationUnit}</p>
          </div>
          <div className="text-right">
            <p className="text-md font-medium text-gray-900">
              Current Stock: {currenStock}
            </p>
          </div>
        </div>
        <div className="mt-4">
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className="bg-brown-500 h-2.5 rounded-full"
              style={{ width: "45%" }}
            ></div>
          </div>
          <div className="flex justify-between mt-1">
            <span className="text-xs text-gray-500">
              Reorder Point: {reorderPoint}{" "}
            </span>
            <span className="text-xs text-gray-500">
              Max Stock: {maxStock}{" "}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Inventory;
