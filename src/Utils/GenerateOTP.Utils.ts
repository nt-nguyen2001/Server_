import { totp } from "otplib";

totp.options = {
  step: 120,
};
export function generateOTP(payload: string) {
  const tokenOTP = totp.generate((process.env.SECRET_OTP || "ASD") + payload);
  return tokenOTP;
}
