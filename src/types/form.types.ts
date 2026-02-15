/**
 * Form-related type definitions
 * Generic form types used across the application
 */

// Generic form errors
export interface FormErrors {
  [key: string]: string;
}

// Generic form state
export interface FormState<T> {
  data: T;
  errors: FormErrors;
  isSubmitting: boolean;
  isDirty: boolean;
}

// Select option
export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

// Form field props
export interface FormFieldProps {
  label: string;
  name: string;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  placeholder?: string;
}
