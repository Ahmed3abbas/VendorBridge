import { asyncHandler } from '../../utils/asyncHandler.js';
import { successResponse } from '../../utils/apiResponse.js';
import * as authService from './auth.service.js';

export const register = asyncHandler(async (req, res) => {
  const data = await authService.register(req.body);
  successResponse(res, data, 'Registered successfully', 201);
});

export const login = asyncHandler(async (req, res) => {
  const data = await authService.login(req.body);
  successResponse(res, data, 'Login successful');
});

export const refresh = asyncHandler(async (req, res) => {
  const data = await authService.refresh(req.body.refresh_token);
  successResponse(res, data, 'Token refreshed');
});

export const logout = asyncHandler(async (req, res) => {
  // Stateless JWT — client discards tokens; extend with a blacklist if needed
  successResponse(res, null, 'Logged out');
});

export const forgotPassword = asyncHandler(async (req, res) => {
  await authService.forgotPassword(req.body.email);
  successResponse(res, null, 'OTP sent if email exists');
});

export const resetPassword = asyncHandler(async (req, res) => {
  await authService.resetPassword(req.body);
  successResponse(res, null, 'Password reset successful');
});
