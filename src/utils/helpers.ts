// Generate a unique ID
export const generateId = (): string => {
  return Math.random().toString(36).substring(2, 15);
};

// Format date to display in a user-friendly way
export const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('en-US', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(date);
};

// Format time to display in a user-friendly way
export const formatTime = (date: Date): string => {
  return new Intl.DateTimeFormat('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(date);
};

// Format date and time together
export const formatDateTime = (date: Date): string => {
  return `${formatDate(date)} - ${formatTime(date)}`;
};

// Get color brightness to determine text color (for accessibility)
export const getContrastColor = (hexColor: string): string => {
  // Convert hex to RGB
  const r = parseInt(hexColor.substring(1, 3), 16);
  const g = parseInt(hexColor.substring(3, 5), 16);
  const b = parseInt(hexColor.substring(5, 7), 16);
  
  // Calculate brightness (using the luminance formula)
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  
  // Return black or white based on brightness
  return brightness > 128 ? '#000000' : '#ffffff';
};