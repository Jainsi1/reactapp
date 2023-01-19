const runValidation = (data, rules) => {
  let errors = {};

  data = toDotNot(data);

  console.log("errors",data)
  for (let index in data) {
    const key = index.replace(/[0-9]/g, '*')
    if (key in rules) {
      //apply rules
      const rule = rules[key];
      for (let r of rule) {
        if (
          r == 'required' && (
            data[index] == null ||
            data[index] == undefined ||
            (typeof data[index] == 'string' && data[index].trim().length == 0)
          )
        ) {
          errors = appendError(index, errors, 'This is a required field')
        }
      }
    }
  }

  return errors;
}

const appendError = (key, errors, message) => {

  if (key in errors) {
    errors[key].push(message)
  } else {
    errors[key] = [message]
  }
  return errors;
}

const toDotNot = (input, parentKey) => Object.keys(input || {}).reduce((acc, key) => {
  const value = input[key];
  const outputKey = parentKey ? `${parentKey}.${key}` : `${key}`;

  // NOTE: remove `&& (!Array.isArray(value) || value.length)` to exclude empty arrays from the output
  if (
    value && typeof value === 'object' &&
    (!Array.isArray(value) || value.length)
  ) return ({...acc, ...toDotNot(value, outputKey)});

  return ({...acc, [outputKey]: value});
}, {});

export default runValidation;