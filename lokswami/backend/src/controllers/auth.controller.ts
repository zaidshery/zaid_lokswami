import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';
import { asyncHandler } from '../middleware/errorHandler';
import { AuthTokens, JWTPayload } from '../types';

/**
 * Generate access and refresh tokens
 */
const generateTokens = (payload: JWTPayload): AuthTokens => {
  const accessSecret = process.env.JWT_ACCESS_SECRET as string;
  const refreshSecret = process.env.JWT_REFRESH_SECRET as string;
  
  const accessExpiry = process.env.JWT_ACCESS_EXPIRY || '15m';
  const refreshExpiry = process.env.JWT_REFRESH_EXPIRY || '7d';

  // FIX: We use 'as any' to force TypeScript to accept the options object
  // This bypasses the strict overload check causing the "ExpiresIn" error
  const accessToken = jwt.sign(
    { ...payload }, 
    accessSecret, 
    { expiresIn: accessExpiry } as any
  );

  const refreshToken = jwt.sign(
    { ...payload }, 
    refreshSecret, 
    { expiresIn: refreshExpiry } as any
  );

  return { accessToken, refreshToken };
};

/**
 * Register new user
 * POST /api/auth/register
 */
export const register = asyncHandler(async (req: Request, res: Response) => {
  const { name, email, password, role } = req.body;

  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    res.status(409).json({
      success: false,
      error: 'User with this email already exists',
      code: 'USER_EXISTS',
      timestamp: new Date().toISOString()
    });
    return;
  }

  // Create new user
  const user = await User.create({
    name,
    email,
    password,
    role: role || 'REPORTER'
  });

  // Generate tokens
  const payload: JWTPayload = {
    userId: user._id.toString(),
    email: user.email,
    role: user.role
  };
  const tokens = generateTokens(payload);

  res.status(201).json({
    success: true,
    data: {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      },
      tokens
    },
    message: 'User registered successfully'
  });
});

/**
 * Login user
 * POST /api/auth/login
 */
export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  // Find user with password
  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    res.status(401).json({
      success: false,
      error: 'Invalid email or password',
      code: 'INVALID_CREDENTIALS',
      timestamp: new Date().toISOString()
    });
    return;
  }

  // Check if user is active
  if (!user.isActive) {
    res.status(403).json({
      success: false,
      error: 'Account is deactivated',
      code: 'ACCOUNT_INACTIVE',
      timestamp: new Date().toISOString()
    });
    return;
  }

  // Verify password
  const isPasswordValid = await user.comparePassword(password);
  if (!isPasswordValid) {
    res.status(401).json({
      success: false,
      error: 'Invalid email or password',
      code: 'INVALID_CREDENTIALS',
      timestamp: new Date().toISOString()
    });
    return;
  }

  // Generate tokens
  const payload: JWTPayload = {
    userId: user._id.toString(),
    email: user.email,
    role: user.role
  };
  const tokens = generateTokens(payload);

  res.json({
    success: true,
    data: {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      },
      tokens
    },
    message: 'Login successful'
  });
});

/**
 * Refresh access token
 * POST /api/auth/refresh
 */
export const refreshToken = asyncHandler(async (req: Request, res: Response) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    res.status(401).json({
      success: false,
      error: 'Refresh token is required',
      code: 'NO_REFRESH_TOKEN',
      timestamp: new Date().toISOString()
    });
    return;
  }

  try {
    const refreshSecret = process.env.JWT_REFRESH_SECRET as string;
    const decoded = jwt.verify(refreshToken, refreshSecret) as JWTPayload;

    // Verify user still exists
    const user = await User.findById(decoded.userId);
    if (!user || !user.isActive) {
      res.status(401).json({
        success: false,
        error: 'Invalid refresh token',
        code: 'INVALID_REFRESH_TOKEN',
        timestamp: new Date().toISOString()
      });
      return;
    }

    // Generate new tokens
    const payload: JWTPayload = {
      userId: user._id.toString(),
      email: user.email,
      role: user.role
    };
    const tokens = generateTokens(payload);

    res.json({
      success: true,
      data: { tokens },
      message: 'Token refreshed successfully'
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      error: 'Invalid or expired refresh token',
      code: 'INVALID_REFRESH_TOKEN',
      timestamp: new Date().toISOString()
    });
  }
});

/**
 * Get current user profile
 * GET /api/auth/me
 */
export const getMe = asyncHandler(async (req: Request, res: Response) => {
  const user = await User.findById(req.user!.userId);

  if (!user) {
    res.status(404).json({
      success: false,
      error: 'User not found',
      code: 'USER_NOT_FOUND',
      timestamp: new Date().toISOString()
    });
    return;
  }

  res.json({
    success: true,
    data: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      isActive: user.isActive,
      createdAt: user.createdAt
    }
  });
});

/**
 * Update user profile
 * PATCH /api/auth/me
 */
export const updateProfile = asyncHandler(async (req: Request, res: Response) => {
  const { name, email } = req.body;
  const userId = req.user!.userId;

  // Check if email is already taken
  if (email) {
    const existingUser = await User.findOne({ email, _id: { $ne: userId } });
    if (existingUser) {
      res.status(409).json({
        success: false,
        error: 'Email is already in use',
        code: 'EMAIL_EXISTS',
        timestamp: new Date().toISOString()
      });
      return;
    }
  }

  const user = await User.findByIdAndUpdate(
    userId,
    { name, email },
    { new: true, runValidators: true }
  );

  if (!user) {
    res.status(404).json({
      success: false,
      error: 'User not found',
      code: 'USER_NOT_FOUND',
      timestamp: new Date().toISOString()
    });
    return;
  }

  res.json({
    success: true,
    data: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    },
    message: 'Profile updated successfully'
  });
}); 