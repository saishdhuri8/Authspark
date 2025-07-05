import dotenv from 'dotenv';
dotenv.config();
import jwt from "jsonwebtoken"

const key = process.env.JWT_SECRET;

export const generateToken = (userId, time) => {
  const token = jwt.sign({
    userId: userId
  }, key, { expiresIn: time })
  return token
}

export const verifyToken = (token) => {
  try {
    const decoded = jwt.verify(token, key);

    return decoded.userId;
  } catch (err) {
    return false;
  }
};

export const generateApiKey = (userId, projectId) => {
  const apiKey = jwt.sign({ userId: userId, projectId: projectId }, key);
  return apiKey;
}

export const decodeApiKeys = (apiKey) => {
  try {
    const decoded = jwt.verify(apiKey, key);
    return decoded;
  } catch (error) {
    return false;
  }
}