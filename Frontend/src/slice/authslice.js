import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { axiosClient } from "../config/axiosClient";

const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axiosClient.post("user/register", data);
      return response.data.user;
    } catch (err) {
      return rejectWithValue(err);
    }
  },
);

const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axiosClient.post("user/login", data);
      return response.data.user;
    } catch (err) {
      return rejectWithValue(err);
    }
  },
);

const LogOut = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      await axiosClient.post("user/logout");
      return null;
    } catch (err) {
      return rejectWithValue(err);
    }
  },
);

const checkauth = createAsyncThunk(
  "auth/checkauth",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosClient.get("user/checkauth");
      return response.data.user;
    } catch (err) {
      if (err.response?.status === 401) {
        return rejectWithValue(null); // Special case for no session
      }
      return rejectWithValue(err);
    }
  },
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    isAuthenticated: false,
    error: null,
    isLoading: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuthenticated = !!action.payload;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || "Something went wrong";
        state.isAuthenticated = false;
        state.user = null;
      })
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuthenticated = !!action.payload;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || "Something went wrong";
        state.isAuthenticated = false;
        state.user = null;
      })
      .addCase(LogOut.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(LogOut.fulfilled, (state) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
      })
      .addCase(LogOut.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || "Something went wrong";
        state.isAuthenticated = false;
        state.user = null;
      })
      .addCase(checkauth.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(checkauth.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuthenticated = !!action.payload;
      })
      .addCase(checkauth.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          action.payload === null
            ? null
            : action.payload?.message || "Something went wrong";
        state.isAuthenticated = false;
        state.user = null;
      });
  },
});

export { checkauth, loginUser, LogOut, registerUser };

export default authSlice.reducer;
