import type React from "react";
import {
  Avatar,
  Button,
  Snackbar,
  Alert,
  InputAdornment,
  MenuItem,
} from "@mui/material";
import {
  colors,
  ProviderSpecializations,
  stringAvatar,
} from "../../../utils/Constants";
import CommonTextfield from "../../Common/CommonTextfield";
import { useEffect, useState } from "react";
import type { ProviderEO } from "../../../utils/Interfaces";
import axios from "axios";
import { APIEndpoints } from "../../../api/api";
import { getEmailSuffix, validateField } from "../../../utils/Validations";

type ProviderDetailsProps = {
  userId?: string;
};

const ProviderDetails: React.FC<ProviderDetailsProps> = ({ userId }) => {
  const [edit, setEdit] = useState(false);
  const [userDetails, setUserDetails] = useState<ProviderEO>({} as ProviderEO);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">(
    "success"
  );
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const getUserData = async () => {
    try {
      const userData = await axios.get(
        `${APIEndpoints.UserProfile}?ProviderId=${userId}`
      );
      const fetchedUser = userData.data;
      setUserDetails(fetchedUser ?? ({} as ProviderEO));
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  useEffect(() => {
    getUserData();
  }, []);

  const handleSnackbarClose = (
    _: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") return;
    setSnackbarOpen(false);
  };

  const handleUserChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "email" || name === "phone") {
      setUserDetails((prevUser) => ({
        ...prevUser,
        contact: {
          ...prevUser.contact,
          [name]: value,
        },
      }));
    } else if (
      name === "street" ||
      name === "city" ||
      name === "state" ||
      name === "zipcode"
    ) {
      setUserDetails((prevUser) => ({
        ...prevUser,
        address: {
          ...prevUser.address,
          [name]: value,
        },
      }));
    } else {
      setUserDetails((prevUser) => ({
        ...prevUser,
        [name]: value,
      }));
    }
    const errorMsg = validateField(name, value);
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: errorMsg,
    }));
  };

  const handleSubmitChanges = async () => {
    const hasErrors = Object.values(errors).some((error) => error !== "");
    if (hasErrors) {
      setSnackbarSeverity("error");
      setSnackbarMessage("Please correct the validation errors before saving.");
      setSnackbarOpen(true);
      return;
    }

    const updatedUserDetails = {
      ...userDetails,
      contact: {
        ...userDetails.contact,
        email: userDetails.contact?.email
          ? userDetails.contact.email.includes(getEmailSuffix("Doctor"))
            ? userDetails.contact.email
            : userDetails.contact.email + getEmailSuffix("Doctor")
          : undefined,
      },
    };

    try {
      const res = await axios.put(
        `${APIEndpoints.Provider}/${userDetails._id}`,
        updatedUserDetails
      );

      if (!res.data) throw new Error("Update failed");

      setSnackbarSeverity("success");
      setSnackbarMessage("Pharmacy details updated successfully!");
      setSnackbarOpen(true);
      setEdit(false);
    } catch (error) {
      setSnackbarSeverity("error");
      setSnackbarMessage("Failed to update pharmacy details");
      setSnackbarOpen(true);
    }
  };

  const handleCancelChanges = () => {
    setEdit(false);
    getUserData();
    setErrors({});
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-beige-100 mb-8">
        <div className="bg-brown-500 px-6 py-4">
          <div className="flex items-center">
            <div className="h-20 w-20 rounded-full bg-white flex items-center justify-center text-brown-500 text-2xl font-bold">
              <Avatar
                {...stringAvatar(
                  `Dr. ${userDetails?.firstName ?? ""} ${
                    userDetails?.lastName ?? ""
                  }`
                )}
              />
            </div>
            <div className="ml-6">
              <h3 className="text-xl font-semibold text-white">
                Dr. {userDetails?.firstName}&nbsp;{userDetails?.lastName}
              </h3>
              <p className="text-beige-100">Doctor ID: {userDetails?._id}</p>
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
                  value={userDetails?.firstName ?? ""}
                  disabled={!edit}
                  onChange={(e) =>
                    setUserDetails((prev) => ({
                      ...prev,
                      firstName: e.target.value,
                    }))
                  }
                  onChangeCapture={handleUserChange}
                  name="firstName"
                  error={!!errors["firstName"]}
                  helperText={errors["firstName"] || " "}
                />
                <CommonTextfield
                  label="Last Name"
                  type="text"
                  value={userDetails?.lastName ?? ""}
                  disabled={!edit}
                  onChange={(e) =>
                    setUserDetails((prev) => ({
                      ...prev,
                      lastName: e.target.value,
                    }))
                  }
                  onChangeCapture={handleUserChange}
                  name="lastName"
                  error={!!errors["lastName"]}
                  helperText={errors["lastName"] || " "}
                />
                <CommonTextfield
                  label="Email"
                  type="email"
                  value={userDetails?.contact?.email?.split("@")[0] ?? ""}
                  disabled={!edit}
                  onChange={(e) =>
                    setUserDetails((prev) => ({
                      ...prev,
                      contact: {
                        ...prev?.contact,
                        email: e.target.value,
                      },
                    }))
                  }
                  onKeyDown={(e) => {
                    if (e.key === "@") {
                      e.preventDefault();
                    }
                  }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment
                        position="start"
                        style={{ pointerEvents: "none" }}
                      >
                        {getEmailSuffix("Doctor")}
                      </InputAdornment>
                    ),
                  }}
                  name="email"
                  error={!!errors["email"]}
                  helperText={errors["email"] || " "}
                  onChangeCapture={handleUserChange}
                />

                <CommonTextfield
                  label="Phone"
                  type="text"
                  value={userDetails?.contact?.phone ?? ""}
                  disabled={!edit}
                  onChange={(e) =>
                    setUserDetails((prev) => ({
                      ...prev,
                      contact: {
                        ...prev?.contact,
                        phone: e.target.value,
                      },
                    }))
                  }
                  name="phone"
                  error={!!errors["phone"]}
                  helperText={errors["phone"] || " "}
                  onChangeCapture={handleUserChange}
                />
                <CommonTextfield
                  label="Password"
                  type="text"
                  value={userDetails?.password ?? ""}
                  disabled={!edit}
                  onChange={(e) =>
                    setUserDetails((prev) => ({
                      ...prev,
                      password: e.target.value,
                    }))
                  }
                  name="password"
                  error={!!errors["password"]}
                  helperText={errors["password"] || " "}
                  onChangeCapture={handleUserChange}
                />
                <CommonTextfield
                  label="Specialization"
                  isSelect
                  value={userDetails?.specialization ?? ""}
                  disabled={!edit}
                  onChange={(e) =>
                    setUserDetails((prev) => ({
                      ...prev,
                      specialization: e.target.value,
                    }))
                  }
                  onChangeCapture={handleUserChange}
                  name="specialization"
                  error={!!errors["specialization"]}
                  helperText={errors["specialization"] || " "}
                >
                  {ProviderSpecializations.map((spec, index) => (
                    <MenuItem key={`${spec}+${index}`} value={spec}>
                      {spec}
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
                  value={userDetails?.address?.street ?? ""}
                  disabled={!edit}
                  onChange={(e) =>
                    setUserDetails((prev) => ({
                      ...prev,
                      address: {
                        ...prev?.address,
                        street: e.target.value,
                      },
                    }))
                  }
                  name="street"
                  error={!!errors["street"]}
                  helperText={errors["street"] || " "}
                  onChangeCapture={handleUserChange}
                />
                <CommonTextfield
                  label="City"
                  type="text"
                  value={userDetails?.address?.city ?? ""}
                  disabled={!edit}
                  onChange={(e) =>
                    setUserDetails((prev) => ({
                      ...prev,
                      address: {
                        ...prev?.address,
                        city: e.target.value,
                      },
                    }))
                  }
                  name="city"
                  error={!!errors["city"]}
                  helperText={errors["city"] || " "}
                  onChangeCapture={handleUserChange}
                />
                <CommonTextfield
                  label="State"
                  type="text"
                  value={userDetails?.address?.state ?? ""}
                  disabled={!edit}
                  onChange={(e) =>
                    setUserDetails((prev) => ({
                      ...prev,
                      address: {
                        ...prev?.address,
                        state: e.target.value,
                      },
                    }))
                  }
                  name="state"
                  error={!!errors["state"]}
                  helperText={errors["state"] || " "}
                  onChangeCapture={handleUserChange}
                />
                <CommonTextfield
                  label="ZipCode"
                  type="text"
                  value={userDetails?.address?.zipCode ?? ""}
                  disabled={!edit}
                  onChange={(e) =>
                    setUserDetails((prev) => ({
                      ...prev,
                      address: {
                        ...prev?.address,
                        zipCode: e.target.value,
                      },
                    }))
                  }
                  name="zipcode"
                  error={!!errors["zipcode"]}
                  helperText={errors["zipcode"] || " "}
                  onChangeCapture={handleUserChange}
                />
              </div>
            </div>
          </div>

          <div className="mt-8 flex justify-end">
            <Button
              type="button"
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
              onClick={handleCancelChanges}
              className="rounded-lg text-sm font-medium transition-colors duration-300"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              onClick={edit ? handleSubmitChanges : () => setEdit(true)}
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
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
          variant="filled"
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
};

export default ProviderDetails;
