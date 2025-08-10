import type React from "react";
import type { AllergyEO, PatientEO } from "../../../utils/Interfaces";
import {
  Alert,
  Avatar,
  Button,
  Checkbox,
  InputAdornment,
  ListItemText,
  MenuItem,
  Snackbar,
} from "@mui/material";
import {
  bloodGroupDropdownValues,
  checkProfileComplete,
  colors,
  ExistingConditions,
  fetchAllAllergies,
  genderDropdownValues,
  RelationShipWithUser,
  stringAvatar,
} from "../../../utils/Constants";
import CommonTextfield from "../../Common/CommonTextfield";
import { useEffect, useState } from "react";
import axios from "axios";
import { APIEndpoints } from "../../../api/api";
import CommonMultiSelect from "../../Common/CommonMultiSelect";
import { getEmailSuffix, validateField } from "../../../utils/Validations";
import { useAppDispatch } from "../../../redux/hooks";
import { setProfileStatus } from "../../../redux/features/setProfileCompleteSlice";

type PatientDetailsProps = {
  userId?: string;
};

const PatientDetails: React.FC<PatientDetailsProps> = ({ userId }) => {
  const dispatch = useAppDispatch();
  const [edit, setEdit] = useState(false);
  const [user, setUser] = useState<PatientEO>({} as PatientEO);
  const [allAllergies, setAllAllergies] = useState<AllergyEO[]>();
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isAllergiesSelectOpen, setIsAllergiesSelectOpen] = useState(false);
  const [isExistingConditionsSelectOpen, setIsExistingConditionsSelectOpen] =
    useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">(
    "success"
  );
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const getUserData = async () => {
    try {
      const patient = await axios.get(
        `${APIEndpoints.UserProfile}?PatientId=${userId}`
      );
      const fetchedUser = patient.data;
      setUser(fetchedUser ?? ({} as PatientEO));
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  useEffect(() => {
    getUserData();
    const getAllergies = async () => {
      const allergies = await fetchAllAllergies();
      if (allergies) {
        setAllAllergies(allergies);
      }
    };
    getAllergies();
  }, []);

  const handleUserChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let newValue: string[] = [];
    if (typeof value === "string") {
      newValue = value.split(",").filter(Boolean);
    } else if (Array.isArray(value)) {
      newValue = (value as string[]).filter(Boolean);
    }

    if (name === "allergies") {
      setUser((prevUser) => ({
        ...prevUser,
        allergyIds: newValue,
      }));
    } else if (name === "existingConditions") {
      setUser((prevUser) => ({
        ...prevUser,
        existingConditions: newValue as string[],
      }));
    } else if (name === "email" || name === "phone") {
      setUser((prevUser) => ({
        ...prevUser,
        contact: {
          ...prevUser.contact,
          [name]: value,
        },
      }));
    } else if (name === "name" || name === "phone" || name === "relationship") {
      setUser((prevUser) => ({
        ...prevUser,
        emergencyContact: {
          ...prevUser.emergencyContact,
          [name]: value,
        },
      }));
    } else if (
      name === "street" ||
      name === "city" ||
      name === "state" ||
      name === "zipcode"
    ) {
      setUser((prevUser) => ({
        ...prevUser,
        address: {
          ...prevUser.address,
          [name]: value,
        },
      }));
    } else if (name === "dateOfBirth" || name === "gender" || name === "bloodGroup") {
      setUser((prevUser) => ({
        ...prevUser,
        [name]: value,
      }));
    } else {
      setUser((prevUser) => ({
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

  const handleSnackbarClose = (
    _: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") return;
    setSnackbarOpen(false);
  };

  const handleSubmit = async () => {
    const hasErrors = Object.values(errors).some((error) => error !== "");
    if (hasErrors) {
      setSnackbarSeverity("error");
      setSnackbarMessage("Please correct the validation errors before saving.");
      setSnackbarOpen(true);
      return;
    }

    const updatedUserDetails = {
      ...user,
      contact: {
        ...user.contact,
        email: user.contact?.email
          ? user.contact.email.includes(getEmailSuffix("Patient"))
            ? user.contact.email
            : user.contact.email + getEmailSuffix("Patient")
          : undefined,
      },
    };

    try {
      const res = await axios.put(
        `${APIEndpoints.Patient}/${user._id}`,
        updatedUserDetails
      );

      if (!res.data) throw new Error("Update failed");
      const isComplete = checkProfileComplete(updatedUserDetails, "Patient");
      console.log(isComplete)
      dispatch(setProfileStatus(isComplete));

      setSnackbarSeverity("success");
      setSnackbarMessage("Patient details updated successfully!");
      setSnackbarOpen(true);
      setEdit(false);
    } catch (error) {
      setSnackbarSeverity("error");
      setSnackbarMessage("Failed to update Patient details");
      setSnackbarOpen(true);
    }
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-beige-100 mb-8">
        <div className="bg-brown-500 px-6 py-4">
          <div className="flex items-center">
            <div className="h-20 w-20 rounded-full bg-white flex items-center justify-center text-brown-500 text-2xl font-bold">
              <Avatar
                {...stringAvatar(user?.firstName + " " + user?.lastName)}
              />
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
                  value={user?.firstName ?? ""}
                  disabled={!edit}
                  onChange={(e) =>
                    setUser((prev) => ({
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
                  value={user?.lastName ?? ""}
                  disabled={!edit}
                  onChange={(e) =>
                    setUser((prev) => ({
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
                  value={user?.contact?.email?.split("@")[0] ?? ""}
                  disabled={!edit}
                  onChange={(e) =>
                    setUser((prev) => ({
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
                        {getEmailSuffix("Patient")}
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
                  value={user?.contact?.phone ?? ""}
                  disabled={!edit}
                  onChange={(e) =>
                    setUser((prev) => ({
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
                  label="Date of Birth"
                  type="date"
                  value={user?.dateOfBirth}
                  disabled={!edit}
                  onChange={handleUserChange}
                  name="dateOfBirth"
                  slotProps={{
                    inputLabel: {
                      shrink: true,
                    },
                    htmlInput: {
                      max: new Date().toISOString().split("T")[0],
                    }
                  }}
                />
                <CommonTextfield
                  label="Gender"
                  isSelect
                  name="gender"
                  value={user?.gender ?? ""}
                  disabled={!edit}
                  onChange={handleUserChange}
                >
                  {genderDropdownValues.map((option) => (
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
                  value={user?.address?.street ?? ""}
                  disabled={!edit}
                  onChange={(e) =>
                    setUser((prev) => ({
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
                  value={user?.address?.city ?? ""}
                  disabled={!edit}
                  onChange={(e) =>
                    setUser((prev) => ({
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
                  value={user?.address?.state ?? ""}
                  disabled={!edit}
                  onChange={(e) =>
                    setUser((prev) => ({
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
                  value={user?.address?.zipCode ?? ""}
                  disabled={!edit}
                  onChange={(e) =>
                    setUser((prev) => ({
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
            <div className="mt-8">
              <h4 className="text-lg font-medium text-brown-700 mb-4">
                Medical Details
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <CommonMultiSelect
                  className="col-span-2"
                  label="Allergies"
                  name="allergies"
                  value={Array.isArray(user?.allergyIds) ? user.allergyIds : []}
                  onChange={handleUserChange}
                  isMultiSelect={true}
                  disabled={!edit}
                  slotProps={{
                    select: {
                      multiple: true,
                      renderValue: (selected) =>
                        (selected as string[])
                          .filter(Boolean)
                          .map(
                            (id) =>
                              allAllergies?.find(
                                (allergy) => allergy._id === id
                              )?.name
                          )
                          .filter(Boolean)
                          .join(", "),
                      open: isAllergiesSelectOpen,
                      onOpen: () => setIsAllergiesSelectOpen(true),
                      onClose: () => setIsAllergiesSelectOpen(false),
                    },
                  }}
                >
                  {allAllergies?.map((allergy) => (
                    <MenuItem key={allergy._id} value={allergy._id}>
                      <Checkbox
                        checked={
                          (user?.allergyIds || []).indexOf(allergy._id || "") >
                          -1
                        }
                      />
                      <ListItemText primary={allergy.name} />
                    </MenuItem>
                  ))}
                  <MenuItem
                    onClick={(event) => {
                      event.stopPropagation();
                      setIsAllergiesSelectOpen(false);
                    }}
                    disableRipple
                  >
                    <Button
                      variant="contained"
                      fullWidth
                      sx={{
                        backgroundColor: colors.brown500,
                        color: "white",
                        "&:hover": {
                          backgroundColor: colors.brown600,
                        },
                      }}
                    >
                      Done
                    </Button>
                  </MenuItem>
                </CommonMultiSelect>
                <CommonMultiSelect
                  className="col-span-2"
                  label="Existing Conditions"
                  name="existingConditions"
                  value={
                    Array.isArray(user?.existingConditions)
                      ? user.existingConditions
                      : []
                  }
                  onChange={handleUserChange}
                  isMultiSelect={true}
                  disabled={!edit}
                  slotProps={{
                    select: {
                      multiple: true,
                      renderValue: (selected) =>
                        (selected as string[]).filter(Boolean).join(", "),
                      open: isExistingConditionsSelectOpen,
                      onOpen: () => setIsExistingConditionsSelectOpen(true),
                      onClose: () => setIsExistingConditionsSelectOpen(false),
                    },
                  }}
                >
                  {ExistingConditions?.map((ec, index) => (
                    <MenuItem key={ec + index} value={ec}>
                      <Checkbox
                        checked={
                          (user?.existingConditions || []).indexOf(ec || "") >
                          -1
                        }
                      />
                      <ListItemText primary={ec} />
                    </MenuItem>
                  ))}
                  <MenuItem
                    onClick={(event) => {
                      event.stopPropagation();
                      setIsExistingConditionsSelectOpen(false);
                    }}
                    disableRipple
                  >
                    <Button
                      variant="contained"
                      fullWidth
                      sx={{
                        backgroundColor: colors.brown500,
                        color: "white",
                        "&:hover": {
                          backgroundColor: colors.brown600,
                        },
                      }}
                    >
                      Done
                    </Button>
                  </MenuItem>
                </CommonMultiSelect>
                <CommonTextfield
                  label="Blood Group"
                  name="bloodGroup"
                  isSelect
                  value={user?.bloodGroup ?? ""}
                  onChange={handleUserChange}
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
            <div className="mt-8">
              <h4 className="text-lg font-medium text-brown-700 mb-4">
                Emergency Contact
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <CommonTextfield
                  label="Contact Name"
                  type="text"
                  value={user?.emergencyContact?.name}
                  disabled={!edit}
                  onChange={(e) =>
                    setUser((prev) => ({
                      ...prev,
                      emergencyContact: {
                        ...prev?.emergencyContact,
                        name: e.target.value,
                      },
                    }))
                  }
                  name="name"
                  error={!!errors["name"]}
                  helperText={errors["name"] || " "}
                  onChangeCapture={handleUserChange}
                  className="md:col-span-2"
                />
                <CommonTextfield
                  label="Relationship"
                  name="relationship"
                  required
                  type="text"
                  isSelect
                  value={user?.emergencyContact?.relationship}
                  disabled={!edit}
                  onChange={(e) =>
                    setUser((prev) => ({
                      ...prev,
                      emergencyContact: {
                        ...prev?.emergencyContact,
                        relationship: e.target.value,
                      },
                    }))
                  }
                  onChangeCapture={handleUserChange}
                >
                  {RelationShipWithUser.map((relationship, index) => (
                    <MenuItem value={relationship} key={relationship + index}>
                      {relationship}
                    </MenuItem>
                  ))}
                </CommonTextfield>
                <CommonTextfield
                  label="Phone"
                  type="text"
                  value={user?.emergencyContact?.phone}
                  disabled={!edit}
                  onChange={(e) =>
                    setUser((prev) => ({
                      ...prev,
                      emergencyContact: {
                        ...prev?.emergencyContact,
                        phone: e.target.value,
                      },
                    }))
                  }
                  name="phone"
                  error={!!errors["phone"]}
                  helperText={errors["phone"] || " "}
                  onChangeCapture={handleUserChange}
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
              onClick={edit ? () => handleSubmit() : () => setEdit(true)}
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
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
};

export default PatientDetails;
