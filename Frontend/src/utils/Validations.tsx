export const validateFirstName = (value: string) =>
  !value ? "First Name is required." : "";

export const validateLastName = (value: string) =>
  !value ? "Last Name is required." : "";

const mobileRegex = /^\d{10}$/;
export const validateMobile = (value: string) => {
  if (!value) return "Mobile Number is required.";
  if (!mobileRegex.test(value))
    return "Invalid mobile number (10 digits required).";
  return "";
};

export const Role = {
  patient: "Patient",
  provider: "Provider",
  pharmacy: "Pharmacy",
};

export const getEmailSuffix = (currentRole: string) => {
  switch (currentRole) {
    case Role.patient:
      return "@capstone.com";
    case Role.provider:
      return "@capstone.care";
    case Role.pharmacy:
      return "@capstone.med";
    default:
      return "";
  }
};

export const validateEmail = (value: string, currentRole: string) => {
  if (!value) return "Email is required.";

  let emailPattern;
  switch (currentRole) {
    case Role.patient:
      emailPattern = /^[a-zA-Z0-9._-]+@capstone\.com$/;
      break;
    case Role.provider:
      emailPattern = /^[a-zA-Z0-9._-]+@capstone\.care$/;
      break;
    case Role.pharmacy:
      emailPattern = /^[a-zA-Z0-9._-]+@capstone\.med$/;
      break;
    default:
      emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  }

  if (!emailPattern.test(value)) {
    return `Invalid email format for a ${currentRole}. Must end with ${currentRole === Role.patient ? "@capstone.com" : "@capstone.med"}.`;
  }
  return "";
};

export const validateUserEmail = (value: string) => {
  if (!value) return "Email is required.";
  const usernameRegex = /^[a-zA-Z0-9.\-_]+$/;
  if (!usernameRegex.test(value)) {
    return "Username can only contain alphabets, numbers, hyphens, periods, and underscores.";
  }
  return "";
};

const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

export const validatePassword = (value: string) => {
  if (!value) return "Password is required.";
  if (!passwordRegex.test(value))
    return "Password must be at least 8 characters, include uppercase, lowercase, number, and special character.";
  return "";
};

export const validateSignUpEmail = (value: string, currentRole: string) => {
  if (!value) return "Email is required.";

  const expectedSuffix = getEmailSuffix(currentRole);
  if (!value.endsWith(expectedSuffix)) {
    return `Email must end with ${expectedSuffix} for a ${currentRole}.`;
  }

  const prefix = value.substring(0, value.length - expectedSuffix.length);
  if (prefix.length === 0) {
    return "Email prefix cannot be empty.";
  }

  return "";
};

export const validateStreet = (value: string) => {
  if (!value.trim()) return "Street is required.";
  if (value.trim().length < 3)
    return "Street must be at least 3 characters long.";
  if (/^\d+$/.test(value.trim())) return "Street cannot be numbers only.";
  return "";
};

export const validateCity = (value: string) => {
  if (!value.trim()) return "City is required.";
  if (value.trim().length < 2) return "City must be at least 2 characters.";
  if (!/^[A-Za-z\s]+$/.test(value.trim()))
    return "City can only contain letters and spaces.";
  return "";
};

export const validateState = (value: string) => {
  if (!value.trim()) return "State is required.";
  if (value.trim().length < 2) return "State must be at least 2 characters.";
  if (!/^[A-Za-z\s]+$/.test(value.trim()))
    return "State can only contain letters and spaces.";
  return "";
};

export const validateZipCode = (value: string) => {
  if (!value.trim()) return "ZipCode is required.";
  if (!/^\d{6}$/.test(value.trim())) return "ZipCode must be exactly 6 digits.";
  return "";
};

export const validateField = (name: string, value: string): string => {
  switch (name) {
    case "name":
      return validateFirstName(value);
    case "email":
      return validateEmail(value + getEmailSuffix("Pharmacy"), "Pharmacy");
    case "phone":
      return validateMobile(value);
    case "password":
      return validatePassword(value);
    case "street":
      return validateStreet(value);
    case "city":
      return validateCity(value);
    case "state":
      return validateState(value);
    case "zipcode":
      return validateZipCode(value);
    default:
      return "";
  }
};
