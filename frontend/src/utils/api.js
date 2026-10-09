export const API_URL = (
	process.env.REACT_APP_API_URL || "http://localhost:5000"
).replace(/\/$/, "");

export const getErrorMessage = (error) =>
	error.response?.data?.message ||
	error.message ||
	"Unable to reach the server. Please try again.";
