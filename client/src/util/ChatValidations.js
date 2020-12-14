import persianRex from 'persian-rex'
const MIN_WORDS = 1
const MAX_WORDS = 25
const MIN_CHARS = 3
const MAX_CHARS = 120
const MAX_DUPLICATE_WORD_PERCENTAGE = 25

const isContentValid = (content) => {
  const words = content.split(' ')
  let error = null
  let isValid = true
  if (!(words.length >= MIN_WORDS))
    return `لطفاً جملاتی بلند‌تر از ${MIN_WORDS} کلمه انتخاب کنید`
  if (!(words.length <= MAX_WORDS))
    return `لطفاً جملاتی کوتاه‌تر از ${MAX_WORDS} کلمه انتخاب کنید`
  if (!(content.length >= MIN_CHARS))
    return `لطفاً جملاتی بلند‌تر از ${MIN_CHARS} حرف انتخاب کنید`
  if (!(content.length <= MAX_CHARS))
    return `لطفاً جملاتی کوتاه‌تر از ${MAX_CHARS} حرف انتخاب کنید`
  const wordMap = {}
  words.forEach((element) => {
    if (!wordMap[element]) wordMap[element] = 1
    else wordMap[element]++
  })
  if (
    words.some(
      (w) => wordMap[w] / words.length > MAX_DUPLICATE_WORD_PERCENTAGE / 100
    ) &&
    words.length >= 4
  )
    return `لطفاً از تکرار کلمات بپرهیزید`
  if (!persianRex.hasLetter.test(content))
    return `لطفاً از جملات فارسی استفاده کنید`

  return null
}

export default isContentValid
