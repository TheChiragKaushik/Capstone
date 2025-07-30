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
  provider: "Doctor",
  pharmacy: "Pharmacy",
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
