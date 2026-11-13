import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
const makeToken = id => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });
const publicUser = user => ({ id: user._id, name: user.name, email: user.email, bio: user.bio, profilePicture: user.profilePicture, followers: user.followers, following: user.following });
export async function register(req, res) {
  try {
    const { name, email, password } = req.body;
    if (await User.findOne({ email })) return res.status(409).json({ message: 'Email is already registered' });
    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await User.create({ name, email, password: hashedPassword });
    return res.status(201).json({ message: 'Account created', token: makeToken(user._id), user: publicUser(user) });
  } catch (error) { return res.status(500).json({ message: 'Registration failed' }); }
}
export async function login(req, res) {
  try {
    const user = await User.findOne({ email: req.body.email }).select('+password');
    if (!user || !(await bcrypt.compare(req.body.password, user.password))) return res.status(401).json({ message: 'Invalid email or password' });
    return res.json({ message: 'Login successful', token: makeToken(user._id), user: publicUser(user) });
  } catch (error) { return res.status(500).json({ message: 'Login failed' }); }
}
export async function me(req, res) { res.json({ user: publicUser(req.user) }); }
