export const formatDataItemId = function (string) {
  return string
    .toLowerCase() // Convert to lowercase
    .trim() // Trim out any extra spaces
    .replace(/\s+/g, '-') // Replace one or more spaces with a single dash
}
