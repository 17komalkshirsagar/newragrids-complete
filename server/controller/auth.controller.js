const asyncHandler = require('express-async-handler');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const validator = require('validator');
const Auth = require('../models/Auth');
const { checkEmpty } = require('../utils/checkEmpty');
const User = require('../models/User');
const sendEmail = require('../utils/email');

// Register admin
exports.register = asyncHandler(async (req, res) => {
    const { name, email, mobile, password } = req.body;

    const { isError, error } = checkEmpty({ name, email, mobile, password })
    if (isError) {
        return res.status(400).json({ message: "All Fields are required", error });
    }
    if (!validator.isEmail(email)) {
        return res.status(400).json({ message: "Invalid Email" });
    }
    if (!validator.isMobilePhone(mobile.toString(), "en-IN")) {
        return res.status(400).json({ message: "Invalid Mobile Number" });
    }
    if (!validator.isStrongPassword(password)) {
        return res.status(400).json({ message: "Provide Strong Password" });
    }

    // Check if already registered
    const userExists = await Auth.findOne({ email });
    if (userExists) {
        return res.status(400).json({ message: "Email Already Registered" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const newUser = await Auth.create({
        Name: name,
        email,
        mobile,
        password: hashedPassword,
    });

    res.status(201).json({ message: "User registered successfully", userId: newUser._id });
});
// Login with password
exports.login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "Email and Password required" });
    }

    const user = await Auth.findOne({ email }).select("+password");
    if (!user) {
        return res.status(400).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
        { userId: user._id, email: user.email },
        process.env.JWT_KEY,
        { expiresIn: '1d' }
    );

    res.cookie("AdminToken", token, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: 24 * 60 * 60 * 1000,
        path: "/",
    });

    const { password: _, ...safeUser } = user._doc; // ✅ password remove

    res.json({ message: "Login success", data: safeUser, token });
});

// Logout admin
exports.logout = asyncHandler(async (req, res) => {
    res.clearCookie('authToken');
    res.json({ message: "Logout success" });
});


//register user
exports.userregister = asyncHandler(async (req, res) => {
    const { name, email, mobile, password, companyName, district } = req.body;

    // Basic empty check
    const { isError, error } = checkEmpty({ name, email, mobile, password, companyName, district });
    if (isError) {
        return res.status(400).json({ message: "All required fields must be filled", error });
    }

    // Email validation
    if (!validator.isEmail(email)) {
        return res.status(400).json({ message: "Invalid Email" });
    }

    // Mobile validation
    if (!validator.isMobilePhone(mobile.toString(), "en-IN")) {
        return res.status(400).json({ message: "Invalid Mobile Number" });
    }

    // Strong password validation
    if (!validator.isStrongPassword(password)) {
        return res.status(400).json({ message: "Provide a Strong Password" });
    }

    // Check if already registered
    const userExists = await User.findOne({ email });
    if (userExists) {
        return res.status(400).json({ message: "Email Already Registered" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const newUser = await User.create({
        Name: name,
        email,
        mobile,
        password: hashedPassword,
        companyName: companyName || "",
        district: district || "",
    });

    // ✅ Send registration email
    try {
        const subject = "Welcome to Our Platform 🎉";
        const message = `
  <div style="font-family: 'Segoe UI', Arial, sans-serif; background-color: #f5f7fa; padding: 30px;">
    <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 10px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); overflow: hidden;">

      <!-- Header -->
      <div style="background: linear-gradient(135deg, #16a34a, #22c55e); color: #fff; text-align: center; padding: 25px 10px;">
        <h1 style="margin: 0; font-size: 24px;">Welcome to NewRa Grids Pvt. Ltd.</h1>
        <p style="margin: 5px 0 0; font-size: 15px;">Empowering India With Sustainable Energy</p>
      </div>

      <!-- Body -->
      <div style="padding: 25px; color: #333;">
        <h2 style="color: #16a34a; margin-bottom: 10px;">Hello, ${name} 👋</h2>
        <p style="margin: 0 0 15px;">Thank you for registering with <b>NewRa Grids Pvt. Ltd.</b> We’re excited to have you onboard!</p>
        <p style="margin: 0 0 15px;">Here are your registration details:</p>

        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
          <tr><td style="padding: 8px 0;"><b>Email:</b></td><td>${email}</td></tr>
          <tr><td style="padding: 8px 0;"><b>Mobile:</b></td><td>${mobile}</td></tr>
          <tr><td style="padding: 8px 0;"><b>Company:</b></td><td>${companyName || "N/A"}</td></tr>
          <tr><td style="padding: 8px 0;"><b>District:</b></td><td>${district || "N/A"}</td></tr>
          <tr><td style="padding: 8px 0;"><b>Password:</b></td><td>${password}</td></tr>
        </table>

        <p style="margin: 15px 0;">You can now log in and explore your dashboard. If you didn’t register for this account, please contact our support team immediately.</p>

        <div style="text-align: center; margin-top: 30px;">
          <a href="https://newragrids.com/UserLogin" style="background-color: #16a34a; color: #fff; padding: 10px 25px; text-decoration: none; border-radius: 6px; font-weight: bold;">
            Go to Dashboard
          </a>
        </div>
      </div>

      <!-- Footer -->
      <div style="background-color: #f0fdf4; text-align: center; padding: 15px; font-size: 13px; color: #555;">
        <p style="margin: 0;">© ${new Date().getFullYear()} Newra Grids Pvt. Ltd. All rights reserved.</p>
        <p style="margin: 5px 0 0;">📍 Chhatrapati SambhajNagar, Maharashtra | 🌐 <a href="https://newragrids.com" style="color: #16a34a; text-decoration: none;">www.newragrids.com</a></p>
      </div>

    </div>
  </div>
`;

        await sendEmail({
            subject,
            to: email,
            message,
        });
        console.log("Registration email sent successfully ✅");
    } catch (err) {
        console.error("Failed to send registration email ❌", err);
    }

    res.status(200).json({
        message: "User registered successfully",
        userId: newUser._id,
    });
});






// Login with password
exports.userlogin = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "Email and Password required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
        return res.status(400).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return res.status(401).json({ message: "Invalid credentials" });
    }

    // Issue JWT token
    const token = jwt.sign(
        { userId: user._id, email: user.email },
        process.env.JWT_KEY,
        { expiresIn: '1d' }
    );

    res.cookie("userToken", token, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: 24 * 60 * 60 * 1000,
        path: "/",
    });
    res.json({ message: "Login success", data: user, token });
});
// Logout user
exports.userlogout = asyncHandler(async (req, res) => {
    res.clearCookie('userToken');
    res.json({ message: "Logout success" });
});

// edit cha con tole

// User Profile Update
exports.updateUserProfile = asyncHandler(async (req, res) => {
    const { id } = req.params; // user id from route
    const { email, mobile, companyName, district } = req.body;

    // Find user by ID
    const user = await User.findById(id);
    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }

    // Validate email if provided
    if (email && !validator.isEmail(email)) {
        return res.status(400).json({ message: "Invalid Email" });
    }

    // Validate mobile if provided
    if (mobile && !validator.isMobilePhone(mobile.toString(), "en-IN")) {
        return res.status(400).json({ message: "Invalid Mobile Number" });
    }

    // Check if new email is already taken by another user
    if (email && email !== user.email) {
        const emailExists = await User.findOne({ email });
        if (emailExists) {
            return res.status(400).json({ message: "Email already in use" });
        }
    }

    // Update fields
    if (email) user.email = email;
    if (mobile) user.mobile = mobile;
    if (companyName) user.companyName = companyName;
    if (district) user.district = district;

    await user.save();

    // Respond with updated info (only selected fields)
    const responseData = {
        Name: user.Name,
        email: user.email,
        mobile: user.mobile,
        companyName: user.companyName,
        district: user.district,
        files: user.files || []
    };

    res.json({ message: "Profile updated successfully", data: responseData });
});

// find customer
exports.Findcustomer = asyncHandler(async (req, res) => {
    try {
        // ✅ सर्व users fetch करा (password hide केला आहे)
        const result = await User.find().select("-password");

        if (!result || result.length === 0) {
            return res.status(404).json({ message: "No customers found" });
        }

        res.status(200).json({
            message: "Customers fetched successfully",
            count: result.length,
            result,
        });

    } catch (error) {
        console.error("Error fetching customers:", error);
        res.status(500).json({
            message: "Server Error",
            error: error.message,
        });
    }
});

