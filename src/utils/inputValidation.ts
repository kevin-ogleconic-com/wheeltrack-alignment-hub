
// Input validation utilities for security

export const validateVehicleYear = (year: number): boolean => {
  const currentYear = new Date().getFullYear();
  return year >= 1900 && year <= currentYear + 1;
};

export const validateAlignmentMeasurement = (value: number, type: 'toe' | 'camber' | 'caster'): boolean => {
  // Realistic automotive alignment measurement ranges
  const ranges = {
    toe: { min: -5.0, max: 5.0 }, // degrees
    camber: { min: -10.0, max: 10.0 }, // degrees
    caster: { min: -15.0, max: 15.0 } // degrees
  };
  
  const range = ranges[type];
  return value >= range.min && value <= range.max;
};

export const sanitizeTextInput = (input: string): string => {
  // Remove potentially dangerous characters and trim whitespace
  return input
    .replace(/[<>\"'&]/g, '') // Remove HTML/script injection chars
    .trim()
    .substring(0, 255); // Limit length
};

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 254;
};

export const validatePhone = (phone: string): boolean => {
  // Allow various phone formats
  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
  const cleanPhone = phone.replace(/[\s\-\(\)\.]/g, '');
  return phoneRegex.test(cleanPhone);
};

export const validateVIN = (vin: string): boolean => {
  // Basic VIN validation (17 characters, no I, O, Q)
  const vinRegex = /^[A-HJ-NPR-Z0-9]{17}$/;
  return vinRegex.test(vin.toUpperCase());
};

export const validateLicensePlate = (plate: string): boolean => {
  // Basic license plate validation (2-8 alphanumeric characters)
  const plateRegex = /^[A-Z0-9]{2,8}$/;
  return plateRegex.test(plate.toUpperCase());
};

export const validateMileage = (mileage: number): boolean => {
  return mileage >= 0 && mileage <= 1000000; // Reasonable mileage range
};
