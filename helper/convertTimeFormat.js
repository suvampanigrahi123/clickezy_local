export function convertTimeFormat(inputTime) {
  // Split the input time string into hours and minutes
  const [hours, minutes] = inputTime ? inputTime.split(':') : ['00', '00'];

  // Convert hours to a number (removes leading zeroes)
  const hourNumber = Number(hours);

  // Create the desired output format with or without minutes
  let outputTime = `${hourNumber.toString().padStart(2, '0')}hr`;

  // Check if minutes are available (not "00"), then include them in the output
  if (minutes !== '00') {
    const minuteNumber = Number(minutes);
    outputTime += ` ${minuteNumber.toString().padStart(2, '0')}min`;
  }
  return outputTime;
}
