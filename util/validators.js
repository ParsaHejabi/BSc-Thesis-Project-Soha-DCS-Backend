module.exports.validateRegisterInput = (username, password) => {
  const errors = {}
  if (username.trim() === '') {
    errors.username = 'نام کاربری نمی‌تواند خالی باشد.'
  }
  if (password === '') {
    errors.password = 'گذرواژه نمی‌تواند خالی باشد.'
  }

  return {
    errors,
    valid: Object.keys(errors).length < 1,
  }
}

module.exports.validateLoginInput = (username, password) => {
  const errors = {}
  if (username.trim() === '') {
    errors.username = 'نام کاربری نمی‌تواند خالی باشد.'
  }
  if (password === '') {
    errors.password = 'گذرواژه نمی‌تواند خالی باشد.'
  }

  return {
    errors,
    valid: Object.keys(errors).length < 1,
  }
}

module.exports.validateRequestInput = (text) => {
  const errors = {}
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
