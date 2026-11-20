import { createSlice } from "@reduxjs/toolkit";

const rawToken = localStorage.getItem("token");
const token = rawToken && rawToken !== "undefined" && rawToken !== "null" ? rawToken : null;
let parsedUser = null;
try {
    const storedUser = localStorage.getItem("user");
    if (storedUser && storedUser !== "undefined" && storedUser !== "null") {
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
          
            if (action.payload.token) {
                localStorage.setItem("token", action.payload.token);
            }
            if (action.payload.userData) {
                localStorage.setItem("user", JSON.stringify(action.payload.userData));
            }
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
