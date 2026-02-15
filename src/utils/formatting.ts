/**
 * Formatting utility functions
 * Centralized formatting for prices, phone numbers, dates, etc.
 */

/**
 * Format price to currency string
 * @param price - Price value (can be null/undefined)
 * @param currency - Currency symbol (default: "Rs.")
 * @returns Formatted price string or "N/A"
 */
export function formatPrice(
  price: number | null | undefined,
  currency: string = "Rs."
): string {
  if (price === null || price === undefined || isNaN(price)) {
    return "N/A";
  }
  return `${currency} ${price.toLocaleString()}`;
}

/**
 * Format currency amount
 * @param amount - Amount to format
 * @param currency - Currency code (default: "PKR")
 * @returns Formatted currency string
 */
export function formatCurrency(
  amount: number,
  currency: string = "PKR"
): string {
  return new Intl.NumberFormat("en-PK", {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Clean phone number (remove non-digits)
 * @param phone - Phone number string
 * @returns Cleaned phone number (digits only)
 */
export function cleanPhoneNumber(phone: string): string {
  return phone.replace(/\D/g, "");
}

/**
 * Format phone number for display
 * @param phone - Phone number string
 * @param format - Format style (default: "international")
 * @returns Formatted phone number
 */
export function formatPhoneNumber(
  phone: string,
  format: "international" | "local" = "international"
): string {
  const cleaned = cleanPhoneNumber(phone);
  
  if (format === "international") {
    if (cleaned.startsWith("92")) {
      return `+${cleaned}`;
    }
    if (cleaned.startsWith("0")) {
      return `+92${cleaned.slice(1)}`;
    }
    return `+92${cleaned}`;
  }
  
  return cleaned;
}

/**
 * Format date to readable string
 * @param date - Date object or string
 * @param format - Format style (default: "short")
 * @returns Formatted date string
 */
export function formatDate(
  date: Date | string,
  format: "short" | "long" | "iso" = "short"
): string {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  
  if (isNaN(dateObj.getTime())) {
    return "Invalid Date";
  }
  
  switch (format) {
    case "long":
      return dateObj.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    case "iso":
      return dateObj.toISOString().split("T")[0];
    case "short":
    default:
      return dateObj.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
  }
}

/**
 * Format number with thousand separators
 * @param num - Number to format
 * @returns Formatted number string
 */
export function formatNumber(num: number): string {
  return num.toLocaleString();
}
