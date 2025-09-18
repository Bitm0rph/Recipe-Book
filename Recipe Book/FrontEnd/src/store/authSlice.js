import { createSlice } from "@reduxjs/toolkit";

const token = localStorage.getItem("token"); // check token on load
let parsedUser = null;
try {
    const storedUser = localStorage.getItem("user");
    if (storedUser && storedUser !== "undefined") {
        parsedUser = JSON.parse(storedUser);
    }
} catch (e) {
    console.error("Failed to parse user from localStorage", e);
}


const initialState = {
    status: !!token,
    userData: parsedUser,
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        login: (state, action) => {
            state.status = true;
            state.userData = action.payload.userData;

            // persist to localStorage
            localStorage.setItem("token", action.payload.token);
            localStorage.setItem("user", JSON.stringify(action.payload.userData));
        },
        logout: (state) => {
            state.status = false;
            state.userData = null;

            // clear localStorage
            localStorage.removeItem("token");
            localStorage.removeItem("user");
        },
    },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
