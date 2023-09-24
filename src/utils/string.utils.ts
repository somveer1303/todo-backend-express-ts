export const isValidMobileNo = (mobile: string): boolean => {
  return /^(0|91)?[6-9][0-9]{9}$/.test(mobile);
};

export const isValidIfscCode = (ifscCode: string): boolean => {
  return /^[A-Z]{4}[0][A-Z0-9]{6}$/.test(ifscCode);
};
