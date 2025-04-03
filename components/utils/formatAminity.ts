export const formatAmenityText = (amenity: string): string => {
  return amenity
    .replace(/([A-Z])/g, ' $1') // Add space before capital letters
    .replace(/^./, str => str.toUpperCase()) // Capitalize first letter
    .trim()
}