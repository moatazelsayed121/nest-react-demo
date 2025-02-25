interface ApiErrorResponse {
  status: number;
  data: { message: string[] };
}

export function generateErrorMessage(
  apiErrorResponse: ApiErrorResponse
): string[] {
  const statusCode = apiErrorResponse?.status;
  const apiErrorMessages = apiErrorResponse.data?.message;
  if (Array.isArray(apiErrorMessages)) return apiErrorMessages;
  if (!statusCode) return ["Internal server error"];
  switch (statusCode) {
    case 409: {
      return ["Credentials already exist in the system"];
    }
    case 401: {
      return [
        "Credentials are incorrect or you are not authorized to perform action",
      ];
    }
    case 404: {
      return ["User details cannot be found in the system"];
    }
    case 400: {
      return ["Bad request"];
    }
    default: {
      return ["There is an error from the server at the moment"];
    }
  }
}
