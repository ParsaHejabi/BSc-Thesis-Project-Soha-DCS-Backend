module.exports.validateRequestInput = (username, text) => {
  const errors = {}
  if (username.trim() === '') {
    errors.username = 'نام کاربری نمی‌تواند خالی باشد.'
  }
  if (text.trim() === '') {
    errors.text = 'متن ورودی نمی‌تواند خالی باشد.'
  } else {
    if (text.trim().length <= 10) {
      errors.text = 'متن ورودی بسیار کوتاه است.'
    }
  }

  return {
    errors,
    valid: Object.keys(errors).length < 1,
  }
}
