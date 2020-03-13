const isRequired = (fieldName) => v => ((!!v && v.length > 0) || `${fieldName} is required`)

const createEmailRules = [
  isRequired('Email'),
  v => /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(v)
    || 'Email must be valid',
]

const createPasswordRules = [
  isRequired('Password'),
  v => new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})').test(v)
    || 'Your password needs to be 8+ characters and contain at least 1 number and 1 caps',
]
const confirmInputWrapper = (inputName, input) => [
  isRequired(`${inputName} confirmation`),
  v => input === v
    || `This field does not match ${inputName}`,
]

const createUsernameRules = [
  isRequired('Username'),
  v => v.length >= 3 || 'Username must be 3+ characters',
]

const enterPasswordRules = [
  isRequired('Password'),
]

const selectGenderRules = [
  isRequired('Gender'),
]

const selectOrientationRules = [
  isRequired('Orientation'),
]

const selectAgeRangeRules = [
  isRequired('Age range'),
  v => ((v[0] >= 18 && v[1] <= 99) || 'Age range limits are in 18 to 99'),
]

const addPictureRules = [
  v => ((!!v && v.size > 0) || 'Picture is required'),
  v => !v || v.size <= 2000000 || 'Picture size should be less then 2MB',
]

export default {
  createEmailRules,
  createPasswordRules,
  confirmInputWrapper,
  createUsernameRules,
  enterPasswordRules,
  selectGenderRules,
  selectOrientationRules,
  selectAgeRangeRules,
  addPictureRules,
}
