module.exports.validateRequestInput = (username, text) => {
  const errors = {}
  if (username.trim() === '') {
    errors.username = 'username must not be empty'
  }
  if (text.trim() === '') {
    errors.text = 'text must not be empty'
  } else {
    if (text.trim().length <= 10) {
      errors.text = 'text is too short'
    }
  }

  return {
    errors,
    valid: Object.keys.length < 1,
  }
}
