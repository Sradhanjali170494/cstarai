import { createSlice } from '@reduxjs/toolkit';
const sessionData = localStorage.getItem('sessionData') !== null ? JSON.parse(localStorage.getItem('sessionData')) : {};
const isLoggedIn = localStorage.getItem('sessionData') !== null ? true : false;
const initialAuthState = {
    isLoggedIn: isLoggedIn,
    sessionData: sessionData,
};

const authSlice = createSlice({
    name: 'auth',
    initialState: initialAuthState,
    reducers: {
        onLogin(state, action) {   
            const storedLoginInfo = {
                sessionId: action.payload.sessionId,
                user_id:action.payload.user_id,
                user_name: action.payload.user_name,
                email: action.payload.email
            }
            state.isLoggedIn = true;
            state.sessionData = storedLoginInfo;
            localStorage.setItem('sessionData',  JSON.stringify(action.payload));
        },
        onLogout(state) {           
            state.isLoggedIn = false;
            state.sessionData = {};
            localStorage.removeItem('sessionData');
        }
    }
});
export const authActions = authSlice.actions;
export default authSlice.reducer;