// cron/otpCleaner.js
import cron from 'node-cron';
import User from '../models/user.js';

export const startOtpCleaner = () => {
    //console.log("🔁 OTP cleaner cron job started.");

  cron.schedule('* * * * *', async () => {
    const now = Date.now();
    await User.updateMany(
      { 'otp.sendTime': { $lt: now } },
      { $unset: { otp: 1 } }
    );
    //console.log("🧹 Expired OTPs removed.");
  });
};
