import Admin from '../models/admin.js';
import bcrypt from 'bcrypt';

export const AdminRegister = async (req, res, next) => {
  const { name, email, password } = req.body;

  try {
    const formattedName = name.toLowerCase();
    const formattedEmail = email.toLowerCase();

    const findUser = await Admin.findOne({ email: formattedEmail });

    if (findUser) {
      let errorMessage = "This email already exists.";
      if (findUser.platform === "manual") errorMessage = "Your account has already been created manually";
      else if (findUser.platform === "magic_link") errorMessage = "Your account has already been created via magic link";
      else if (findUser.platform === "google") errorMessage = "Your account has already been created via google";

      const error = new Error(errorMessage);
      error.statusCode = 400;
      throw error;
    }

    // ✅ Strong password validation
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password)) {
      const error = new Error(
        "Password must be at least 8 characters long and include at least one letter, one number, and one special character"
      );
      error.statusCode = 400;
      throw error;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new Admin({
      name: formattedName,
      email: formattedEmail,
      password: hashedPassword,
      platform: "manual",
    });

    await newUser.save();

    res.status(200).json({ message: "User Registered Successfully", status: true });
  } catch (error) {
    next(error);
  }
}; 
