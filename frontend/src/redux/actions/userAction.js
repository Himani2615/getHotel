import {
	setLoader,
	setUser,
	logoutUser,
	setUsersLoader,
	setAllUsers,
} from "../slices/userSlice";
import { setError } from "../slices/appSlice";
import axios from "axios";
import { API_URL, getErrorMessage } from "../../utils/api";

// sign up user
export const signUpAction = (formData) => async (dispatch) => {
	try {
		dispatch(setLoader(true));
		const { data } = await axios.post(
			API_URL + "/api/v1/user/new",
			formData,
			{
				headers: { "Content-Type": "application/json" },
				withCredentials: true,
			}
		);

		dispatch(setUser(data.user));
		dispatch(setLoader(false));
	} catch (err) {
		dispatch(setLoader(false));
		dispatch(setError(getErrorMessage(err)));
	}
};

// log in user
export const signInAction = (formData) => async (dispatch) => {
	try {
		dispatch(setLoader(true));
		const { data } = await axios.post(
			API_URL + "/api/v1/login",
			formData,
			{
				headers: { "Content-Type": "application/json" },
				withCredentials: true,
			}
		);

		dispatch(setUser(data.user));
		dispatch(setLoader(false));
	} catch (err) {
		dispatch(setLoader(false));
		dispatch(setError(getErrorMessage(err)));
	}
};

// get user
export const getUserAction = () => async (dispatch) => {
	try {
		dispatch(setLoader(true));
		const { data } = await axios.get(
			API_URL + "/api/v1/me",
			{ withCredentials: true }
		);

		dispatch(setUser(data.user));
		dispatch(setLoader(false));
	} catch (err) {
		dispatch(setLoader(false));
	}
};

// log out user
export const logoutAction = () => async (dispatch) => {
	try {
		dispatch(setLoader(true));
		await axios.get(API_URL + "/api/v1/logout", {
			withCredentials: true,
		});

		dispatch(logoutUser());
		dispatch(setLoader(false));
	} catch (err) {
		dispatch(setLoader(false));
		dispatch(setError(getErrorMessage(err)));
	}
};

// update user data
export const updateUserAction = (formData) => async (dispatch) => {
	try {
		const { data } = await axios.put(
			API_URL + "/api/v1/me",
			formData,
			{
				headers: { "Content-Type": "application/json" },
				withCredentials: true,
			}
		);

		dispatch(setUser(data.user));
	} catch (err) {
		dispatch(setError(getErrorMessage(err)));
	}
};

// change user password
export const changePasswordAction = (formData) => async (dispatch) => {
	try {
		const { data } = await axios.put(
			API_URL + "/api/v1/me/password",
			formData,
			{
				headers: { "Content-Type": "application/json" },
				withCredentials: true,
			}
		);

		dispatch(setUser(data.user));
	} catch (err) {
		dispatch(setError(getErrorMessage(err)));
	}
};

// delete user account
export const deleteUserAction = () => async (dispatch) => {
	try {
		dispatch(setLoader(true));
		await axios.delete(API_URL + "/api/v1/me", {
			withCredentials: true,
		});

		dispatch(logoutUser());
		dispatch(setLoader(false));
	} catch (err) {
		dispatch(setError(getErrorMessage(err)));
		dispatch(setLoader(false));
	}
};

// get all users -- admin
export const getAllUsers = () => async (dispatch) => {
	try {
		dispatch(setUsersLoader(true));
		const { data } = await axios.get(
			API_URL + "/api/v1/admin/users",
			{ withCredentials: true }
		);

		dispatch(setAllUsers(data.users));
		dispatch(setUsersLoader(false));
	} catch (err) {
		dispatch(setError(getErrorMessage(err)));
		dispatch(setUsersLoader(false));
	}
};

// update user's role -- admin
export const updateUserRole = (id, role) => async (dispatch) => {
	try {
		const { data } = await axios.put(
			API_URL + `/api/v1/admin/user/${id}`,
			{ role },
			{
				headers: { "Content-Type": "application/json" },
				withCredentials: true,
			}
		);

		dispatch(setAllUsers(data.users));
	} catch (err) {
		dispatch(setError(getErrorMessage(err)));
	}
};
