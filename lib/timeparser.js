function parseTime(input) {
  input = input.toLowerCase().trim();

  // Direct formats like 10m, 2h, 3d
  const match = input.match(/^(\d+)(m|h|d)$/);
  if (match) {
    const value = parseInt(match[1]);
    const unit = match[2];
    if (unit === "m") return Date.now() + value * 60 * 1000;
    if (unit === "h") return Date.now() + value * 60 * 60 * 1000;
    if (unit === "d") return Date.now() + value * 24 * 60 * 60 * 1000;
  }

  // Format like "2025-04-15 14:30"
  const dateTimeMatch = input.match(/^(\d{4})-(\d{2})-(\d{2})\s+(\d{2}):(\d{2})$/);
  if (dateTimeMatch) {
    const year = dateTimeMatch[1];
    const month = dateTimeMatch[2] - 1; // Month is 0-indexed
    const day = dateTimeMatch[3];
    const hour = dateTimeMatch[4];
    const minute = dateTimeMatch[5];

    const date = new Date(year, month, day, hour, minute, 0, 0); // Set seconds and milliseconds to 0
    return date.getTime();
  }

  return null; // If no valid time format is found
}

module.exports = { parseTime };
