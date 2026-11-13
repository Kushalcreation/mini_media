import User from "../models/User.js";
import {
  uploadBufferToCloudinary,
  deleteCloudinaryImage,
} from "../utils/cloydinaryUpload.js";

const safe = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  bio: user.bio,
  profilePicture: user.profilePicture,
  followers: user.followers,
  following: user.following,
  createdAt: user.createdAt,
});

export async function updateProfile(req, res) {
  try {
    const { name, bio = "" } = req.body;
    req.user.name = name;
    req.user.bio = bio;

    if (req.file) {
      const uploaded = await uploadBufferToCloudinary(
        req.file.buffer,
        "emilo/profiles",
      );
      const oldPublicId = req.user.profilePicturePublicId;
      req.user.profilePicture = uploaded.secure_url;
      req.user.profilePicturePublicId = uploaded.public_id;
      await req.user.save();
      if (oldPublicId) await deleteCloudinaryImage(oldPublicId);
    } else {
      await req.user.save();
    }

    res.json({ message: "Profile updated", user: safe(req.user) });
  } catch (error) {
    console.error("Profile update failed:", error);
    res
      .status(500)
      .json({ message: "Could not update profile or upload image" });
  }
}

export async function getProfile(req, res) {
  try {
    const user = await User.findById(req.params.id)
      .populate("followers", "name profilePicture")
      .populate("following", "name profilePicture");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ user: safe(user) });
  } catch {
    res.status(400).json({ message: "Invalid user ID" });
  }
}

export async function listUsers(req, res) {
  const users = await User.find({ _id: { $ne: req.user._id } })
    .select("name bio profilePicture followers following")
    .sort({ createdAt: -1 })
    .limit(100);
  res.json({ users: users.map(safe) });
}

export async function toggleFollow(req, res) {
  try {
    const target = await User.findById(req.params.id);
    if (!target) return res.status(404).json({ message: "User not found" });
    if (target._id.equals(req.user._id))
      return res.status(400).json({ message: "You cannot follow yourself" });
    const alreadyFollowing = req.user.following.some((id) =>
      id.equals(target._id),
    );
    if (alreadyFollowing) {
      req.user.following.pull(target._id);
      target.followers.pull(req.user._id);
    } else {
      req.user.following.addToSet(target._id);
      target.followers.addToSet(req.user._id);
    }
    await Promise.all([req.user.save(), target.save()]);
    res.json({
      message: alreadyFollowing ? "Unfollowed" : "Following",
      following: !alreadyFollowing,
    });
  } catch {
    res.status(500).json({ message: "Could not update follow status" });
  }
}
