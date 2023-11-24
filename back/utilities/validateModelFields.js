const errorMessages = {
  emptyField: (field) => {
    throw new Error(`${field} is empty, please fill it!`);
  },
  isStringField: (field) => {
    throw new Error(`${field} is not a string, please check it!`);
  },
  isAEmailField: (field) => {
    throw new Error(`${field} is not a email, please check it!`);
  },
};

const validateEmptyfield = (valueField) =>
  !valueField || valueField.length <= 0 ? false : true;

const validateStringfield = (valueField) =>
  typeof valueField !== "string" || valueField.length < 3 ? false : true;

const validateEmailfield = (valueField) =>
  !/^(?!\.)(?!.*\.\.)([A-Z0-9_+-\.]*)[A-Z0-9_+-]@([A-Z0-9][A-Z0-9\-]*\.)+[A-Z]{2,}$/i.test(
    valueField
  )
    ? false
    : true;

export {
  validateEmptyfield,
  validateStringfield,
  validateEmailfield,
  errorMessages,
};
