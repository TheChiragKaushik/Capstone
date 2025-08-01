import type React from "react";
import type { PatientEO } from "../../../utils/Interfaces";
import { Avatar, Button, MenuItem } from "@mui/material";
import {
  bloodGroupDropdownValues,
  colors,
  genderDropdownValues,
  stringAvatar,
} from "../../../utils/Constants";
import CommonTextfield from "../../Common/CommonTextfield";
import { useState } from "react";

type PatientDetailsProps = {
  user?: PatientEO;
};

const PatientDetails: React.FC<PatientDetailsProps> = ({ user }) => {
  console.log(user?.gender);
  const [edit, setEdit] = useState(false);

  const handleSubmitChanges = () => {
    console.log("submit");
  };

  // const [userDetails, setUserDetails] = useState<PatientEO>();

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-beige-100 mb-8">
      <div className="bg-brown-500 px-6 py-4">
        <div className="flex items-center">
          <div className="h-20 w-20 rounded-full bg-white flex items-center justify-center text-brown-500 text-2xl font-bold">
            <Avatar {...stringAvatar(user?.firstName + " " + user?.lastName)} />
          </div>
          <div className="ml-6">
            <h3 className="text-xl font-semibold text-white">
              {user?.firstName}&nbsp;{user?.lastName}
            </h3>
            <p className="text-beige-100">Patient ID: {user?._id}</p>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-lg font-medium text-brown-700 mb-4">
              Personal Information
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <CommonTextfield
                label="First Name"
                type="text"
                value={user?.firstName}
                disabled={!edit}
              />
              <CommonTextfield
                label="Last Name"
                type="text"
                value={user?.lastName}
                disabled={!edit}
              />
              <CommonTextfield
                label="Email"
                type="email"
                value={user?.contact?.email}
                disabled={!edit}
              />
              <CommonTextfield
                label="Phone"
                type="text"
                value={user?.contact?.phone}
                disabled={!edit}
              />
              <CommonTextfield
                label="Date of Birth"
                type="date"
                value={user?.dateOfBirth}
                disabled={!edit}
                slotProps={{
                  inputLabel: {
                    shrink: true,
                  },
                }}
              />
              <CommonTextfield
                label="Gender"
                isSelect
                value={user?.gender}
                disabled={!edit}
              >
                {genderDropdownValues.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </CommonTextfield>
              <CommonTextfield
                label="Blood Group"
                isSelect
                value={user?.bloodGroup}
                disabled={!edit}
              >
                {bloodGroupDropdownValues.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </CommonTextfield>
            </div>
          </div>
          <div>
            <h4 className="text-lg font-medium text-brown-700 mb-4">
              Address Information
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <CommonTextfield
                label="Street"
                type="text"
                value={user?.address?.street}
                disabled={!edit}
              />
              <CommonTextfield
                label="City"
                type="text"
                value={user?.address?.city}
                disabled={!edit}
              />
              <CommonTextfield
                label="State"
                type="text"
                value={user?.address?.state}
                disabled={!edit}
              />
              <CommonTextfield
                label="ZipCode"
                type="text"
                value={user?.address?.zipCode}
                disabled={!edit}
              />
            </div>
          </div>
          <div className="mt-8">
            <h4 className="text-lg font-medium text-brown-700 mb-4">
              Emergency Contact
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <CommonTextfield
                label="Contact Name"
                value={user?.emergencyContact?.name}
                type="text"
                disabled={!edit}
                className="md:col-span-2"
              />
              <CommonTextfield
                label="Relationship"
                value={user?.emergencyContact?.relationship}
                type="text"
                disabled={!edit}
              />
              <CommonTextfield
                label="Phone"
                value={user?.emergencyContact?.phone}
                type="text"
                disabled={!edit}
              />
            </div>
          </div>
        </div>

        <div className="mt-8 flex justify-end">
          <Button
            type="button"
            onClick={() => setEdit(false)}
            sx={{
              backgroundColor: colors.beige100,
              color: colors.brown600,
              "&:hover": {
                backgroundColor: colors.beige200,
              },
              marginRight: 1,
              paddingX: 1,
              paddingY: 1,
            }}
            className="rounded-lg text-sm font-medium transition-colors duration-300"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            onClick={edit ? () => handleSubmitChanges() : () => setEdit(true)}
            sx={{
              backgroundColor: colors.brown500,
              color: "white",
              paddingX: 1,
              paddingY: 1,
              "&:hover": {
                backgroundColor: colors.brown600,
              },
            }}
            className="rounded-lg text-sm font-medium transition-colors duration-300"
          >
            {edit ? "Save Changes" : "Edit"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PatientDetails;
