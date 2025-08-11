import type React from "react";
import type { PharmacyEO } from "../../../../utils/Interfaces";
import { Box } from "@mui/material";

type PharmacyDetailsProps = {
    pharmacy?: PharmacyEO;
};

const PharmacyDetails: React.FC<PharmacyDetailsProps> = ({ pharmacy }) => {
    return (
        <Box
            className="flex flex-col bg-beige-200 p-4 rounded-lg shadow-md w-full max-w-full"
        >
            <h3
                className="flex items-center justify-center w-full p-3 bg-brown-300 rounded-full 
          text-lg md:text-xl font-semibold text-brown-700 my-4 text-center truncate"
                title={pharmacy?.name}
            >
                {pharmacy?.name || "Pharmacy Name"}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-stretch">
                <div className="flex flex-col bg-beige-100 p-4 gap-3 rounded-lg shadow-sm w-full">
                    <p className="flex justify-center items-center py-2 px-4 rounded-full bg-orange-300 
            text-orange-700 font-semibold text-sm md:text-base w-full max-w-[200px] mx-auto text-center">
                        Address
                    </p>
                    <div className="flex flex-col gap-1 text-sm md:text-base break-words">
                        <p title={pharmacy?.address?.street}>
                            <strong>
                                Shop No:{" "}
                            </strong>
                            {pharmacy?.address?.street || "N/A"}
                        </p>
                        <p title={pharmacy?.address?.city}>
                            <strong>
                                City:{" "}
                            </strong>
                            {pharmacy?.address?.city || "N/A"}
                        </p>
                        <p title={pharmacy?.address?.state}>
                            <strong>
                                State:{" "}
                            </strong>
                            {pharmacy?.address?.state || "N/A"}
                        </p>
                        <p title={pharmacy?.address?.zipCode}>
                            <strong>
                                Zipcode:{" "}
                            </strong>
                            {pharmacy?.address?.zipCode || "N/A"}
                        </p>
                    </div>
                </div>

                <div className="flex flex-col bg-beige-100 p-4 gap-3 rounded-lg shadow-sm w-full">
                    <p className="flex justify-center items-center py-2 px-4 rounded-full bg-green-300 
            text-green-700 font-semibold text-sm md:text-base w-full max-w-[200px] mx-auto text-center">
                        Contact
                    </p>
                    <div className="flex flex-col gap-1 text-sm md:text-base break-all">
                        <p title={pharmacy?.contact?.email}>
                            <strong>
                                Email:{" "}
                            </strong>
                            {pharmacy?.contact?.email || "N/A"}
                        </p>
                        <p title={pharmacy?.contact?.phone}>
                            <strong>
                                Phone:{" "}
                            </strong>
                            {pharmacy?.contact?.phone || "N/A"}
                        </p>
                    </div>
                </div>
            </div>
        </Box>
    );
};

export default PharmacyDetails;
