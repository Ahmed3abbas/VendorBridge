import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import db from '../../config/db.js';
import { env } from '../../config/env.js';
import { AppError } from '../../utils/AppError.js';
import { sendEmail } from '../../utils/sendEmail.js';

// In-memory OTP store (use Redis in production)
const otpStore = new Map();

function signTokens(user) {
  const payload = { id: user.id, email: user.email, role: user.role, name: user.name };
  const access_token = jwt.sign(payload, env.JWT_SECRET, { expiresIn: env.JWT_EXPIRES_IN });
  const refresh_token = jwt.sign({ id: user.id }, env.JWT_REFRESH_SECRET, { expiresIn: env.JWT_REFRESH_EXPIRES_IN });
  return { access_token, refresh_token };
}

export async function register({ name, email, password, role }) {
  const exists = await db.user.findUnique({ where: { email } });
  if (exists) throw new AppError('Email already registered', 409, 'CONFLICT');

  const password_hash = await bcrypt.hash(password, 12);
  const user = await db.user.create({ data: { name, email, password_hash, role } });
  const tokens = signTokens(user);
  return { user: { id: user.id, name: user.name, email: user.email, role: user.role }, ...tokens };
}

export async function login({ email, password }) {
  const user = await db.user.findUnique({ where: { email } });
  if (!user || !user.is_active) throw new AppError('Invalid credentials', 401, 'UNAUTHORIZED');

  const valid = await bcrypt.compare(password, user.password_hash);
  if (!valid) throw new AppError('Invalid credentials', 401, 'UNAUTHORIZED');

  const tokens = signTokens(user);
  return { user: { id: user.id, name: user.name, email: user.email, role: user.role }, ...tokens };
}

export function refresh(token) {
  try {
    const { id } = jwt.verify(token, env.JWT_REFRESH_SECRET);
    return db.user.findUniqueOrThrow({ where: { id } }).then((user) => {
      const { access_token, refresh_token } = signTokens(user);
      return { access_token, refresh_token };
    });
  } catch {
    throw new AppError('Invalid refresh token', 401, 'UNAUTHORIZED');
  }
}

export async function forgotPassword(email) {
  const user = await db.user.findUnique({ where: { email } });
  if (!user) return; // Silent — don't reveal email existence

  const otp = crypto.randomInt(100000, 999999).toString();
  otpStore.set(email, { otp, expires: Date.now() + 10 * 60 * 1000 });

  await sendEmail({
    to: email,
    subject: 'VendorBridge — Password Reset OTP',
    html: `<p>Your OTP is <strong>${otp}</strong>. It expires in 10 minutes.</p>`,
  });
}

export async function resetPassword({ email, otp, newPassword }) {
  const record = otpStore.get(email);
  if (!record || record.otp !== otp || Date.now() > record.expires) {
    throw new AppError('Invalid or expired OTP', 400, 'INVALID_OTP');
  }
  const password_hash = await bcrypt.hash(newPassword, 12);
  await db.user.update({ where: { email }, data: { password_hash } });
  otpStore.delete(email);
}
