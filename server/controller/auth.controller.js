const asyncHandler = require('express-async-handler');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const validator = require('validator');
const Auth = require('../models/Auth');
const { checkEmpty } = require('../utils/checkEmpty');
const User = require('../models/User');

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

    // Create user with new fields
    const newUser = await User.create({
        Name: name,
        email,
        mobile,
        password: hashedPassword,
        companyName: companyName || "", // optional fields
        district: district || "",
    });

    res.status(201).json({
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

