'use strict';

class APIError extends Error {
  constructor(code, message) {
    super();
    this.code = code;
    this.message = message;
  }
}

module.exports.APIError = APIError;

let errors = {
  BadContentType: {
    code: 406,
    message: 'Request must sent JSON.'
  },
  Unauthorized: {
    code: 401,
    message: 'Unauthorized.'
  },
  UserEmailExists: {
    code: 409,
    message: 'User email already taken.'
  }
};

Object.keys(errors).forEach(key => {
  let code = errors[key].code;
  let message = errors[key].message;

  module.exports[key] = class extends APIError {
    constructor() {
      super(code, message);
    }
  }
});