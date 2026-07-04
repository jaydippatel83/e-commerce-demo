// Pull the human-readable message out of an axios error, falling back sensibly.
export function getErrorMessage(error, fallback = "Something went wrong") {
  return error?.response?.data?.message || error?.message || fallback;
}
