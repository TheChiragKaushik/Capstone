import { Button } from "@mui/material";
import type React from "react";
import { colors } from "../../../utils/Constants";

type ActionCardProps = {
  icon?: string;
  heading?: string;
  totalCount?: string;
  specificCount?: string;
  specificCountColor?: string;
  onClickFunction?: () => void;
  buttonHeading?: string;
  style?: string;
};

const ActionCard: React.FC<ActionCardProps> = ({
  icon,
  heading,
  totalCount,
  specificCount,
  specificCountColor,
  onClickFunction,
  buttonHeading,
  style,
}) => {
  return (
    <div
      className={`bg-white rounded-lg shadow-sm p-6 border border-gray-200 ${style}`}
    >
      <div className="flex items-center">
        <div className="flex-shrink-0 bg-beige-100 rounded-md p-3">
          <i className={`${icon} text-brown-600 text-xl`}></i>
        </div>
        <div className="ml-5">
          <p className="text-sm font-medium text-gray-500">{heading}</p>
          <div className="flex items-baseline">
            <p className="text-2xl font-semibold text-gray-900">{totalCount}</p>
            <p className={`ml-2 text-sm font-medium ${specificCountColor}`}>
              {specificCount}
            </p>
          </div>
        </div>
      </div>
      <div className="mt-4">
        <Button
          onClick={onClickFunction}
          className="text-sm font-medium text-brown-600 hover:text-brown-700"
          sx={{
            color: colors.brown600,
            "&:hover": {
              color: colors.brown700,
            },
          }}
        >
          {buttonHeading} <i className="fas fa-arrow-right ml-1"></i>
        </Button>
      </div>
    </div>
  );
};

export default ActionCard;
