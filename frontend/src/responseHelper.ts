export function generateErrorMessage(statusCode: 409 | 401 | 404 | 400) {
  switch (statusCode) {
    case 409: {
      return "Credentials already exist in the system";
    }
    case 401: {
      return "Credentials are incorrect or you are not authorized to perform action";
    }
    case 404: {
      return "User details cannot be found in the system";
    }
    case 400: {
      return "User details cannot be found in the system";
    }
    default: {
      return "There is an error from the server at the moment";
    }
  }
}
