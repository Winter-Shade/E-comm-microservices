const User = require('../models/userModel');
const { getUserFromAuthService } = require('../utils/serviceRegistry');

const getUserProfile = async (req, res) => {
  try {
    const { userId } = req.user;
    
    let userProfile = await User.findOne({ userId });
    
    if (!userProfile) {
      userProfile = new User({ userId });
      await userProfile.save();
    }
    const authToken = req.headers.authorization.split(' ')[1];
    const authUserData = await getUserFromAuthService(userId, authToken);
    const userResponse = {
      userId: userProfile.userId,
      username: authUserData.username,
      email: authUserData.email,
      firstName: userProfile.firstName,
      lastName: userProfile.lastName,
      phoneNumber: userProfile.phoneNumber,
      address: userProfile.address,
      preferences: userProfile.preferences
    };
    
    res.json(userResponse);
  } catch (err) {
    console.error('Get user profile error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

const updateUserProfile = async (req, res) => {
  try {
    const { userId } = req.user;
    const { firstName, lastName, phoneNumber, address, preferences } = req.body;
  
    let userProfile = await User.findOne({ userId });
    
    if (!userProfile) {
      userProfile = new User({
        userId,
        firstName: firstName || '',
        lastName: lastName || '',
        phoneNumber: phoneNumber || '',
        address: address || {},
        preferences: preferences || {}
      });
    } else {
      if (firstName !== undefined) userProfile.firstName = firstName;
      if (lastName !== undefined) userProfile.lastName = lastName;
      if (phoneNumber !== undefined) userProfile.phoneNumber = phoneNumber;
      if (address) {
        userProfile.address = {
          ...userProfile.address,
          ...(address.street !== undefined && { street: address.street }),
          ...(address.city !== undefined && { city: address.city }),
          ...(address.state !== undefined && { state: address.state }),
          ...(address.zipCode !== undefined && { zipCode: address.zipCode }),
          ...(address.country !== undefined && { country: address.country })
        };
      }
      
      if (preferences) {
        userProfile.preferences = {
          ...userProfile.preferences,
          ...(preferences.theme !== undefined && { theme: preferences.theme }),
          ...(preferences.notifications !== undefined && { notifications: preferences.notifications })
        };
      }
    }
    
    userProfile.updatedAt = Date.now();
    await userProfile.save();
    
    res.json({
      message: 'Profile updated successfully',
      profile: {
        userId: userProfile.userId,
        firstName: userProfile.firstName,
        lastName: userProfile.lastName,
        phoneNumber: userProfile.phoneNumber,
        address: userProfile.address,
        preferences: userProfile.preferences,
        updatedAt: userProfile.updatedAt
      }
    });
  } catch (err) {
    console.error('Update user profile error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

const getUserById = async (req, res) => {
  try {
    const { userId } = req.params;
    
    const userProfile = await User.findOne({ userId });
    
    if (!userProfile) {
      return res.status(404).json({ message: 'User profile not found' });
    }
    
    res.json({
      userId: userProfile.userId,
      firstName: userProfile.firstName,
      lastName: userProfile.lastName,
      phoneNumber: userProfile.phoneNumber,
      address: userProfile.address
    });
  } catch (err) {
    console.error('Get user by ID error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getUserProfile,
  updateUserProfile,
  getUserById
};