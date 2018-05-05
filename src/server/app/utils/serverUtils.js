// inRange validation to send and receive values
const inRange = (value, minValue, maxValue) => {
    return (value >= minValue && value <= maxValue) ? true : false;
}
  
// Generic error handler used by all endpoints
const handleError = (res, reason, message, code) => {
  console.log('ERROR: ' + reason);
  res.status(code || 500).json({'error': message});
}

module.exports = {
  inRange: inRange,
  handleError: handleError
}
