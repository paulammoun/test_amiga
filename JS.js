// Function to format the date as DD/MM/YYYY
function formatDate(date) {
    let day = date.getDate();
    let month = date.getMonth() + 1; // Months are zero-based
    let year = date.getFullYear();

    // Add leading zero to day and month if needed
    if (day < 10) day = '0' + day;
    if (month < 10) month = '0' + month;

    return `${day}/${month}/${year}`;
}

// Function to get the current date in DD/MM/YYYY format
function getCurrentDate() {
    let currentDate = new Date();
    return formatDate(currentDate);
}

// Function to get the date x days ago in DD/MM/YYYY format
function getDateXDaysAgo(x) {
    let pastDate = new Date();
    pastDate.setDate(pastDate.getDate() - x);
    return formatDate(pastDate);
}

function getMonday(d) {
  d = new Date();
  var day = d.getDay(),
  diff = d.getDate() - day + (day == 0 ? -6:1); // adjust when day is sunday
  let mmon =  new Date(d.setDate(diff));
  return  formatDate(mmon);
}




function calculateDistance(lat1, lon1, lat2, lon2) {
     const toRadians = (degree) => degree * (Math.PI / 180);
     const R = 6371000; // Radius of the Earth in meters

     const lat1Rad = toRadians(lat1);
     const lat2Rad = toRadians(lat2);
     const deltaLatRad = toRadians(lat2 - lat1);
     const deltaLonRad = toRadians(lon2 - lon1);

     const a = Math.sin(deltaLatRad / 2) * Math.sin(deltaLatRad / 2) +
               Math.cos(lat1Rad) * Math.cos(lat2Rad) *
               Math.sin(deltaLonRad / 2) * Math.sin(deltaLonRad / 2);
     const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

      return R * c; // Distance in meters
}

//////////////
// Function to generate a random 4-digit code
function generateRandomCode() {
    return Math.floor(1000 + Math.random() * 9000).toString(); // Generates a random 4-digit code
}

// Function to encode the original code
function encodeCode(originalCode) {
    // Split the original code into its digits
    const digits = originalCode.split('').map(Number);

    // Perform a specific calculation to generate the encoded pin
    const encodedDigits = digits.map((digit, index) => (digit + index + 1) % 10);

    // Combine the encoded digits into a 4-digit pin
    const encodedPin = encodedDigits.join('');

    return encodedPin;
}

// Function to verify if the original code matches the encoded pin
function verifyCode(originalCode, encodedPin) {
    // Encode the original code again
    const expectedPin = encodeCode(originalCode);

    // Check if the encoded pin matches the expected pin
    return encodedPin === expectedPin;
}

// Example usage

