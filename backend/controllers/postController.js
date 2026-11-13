import Post from "../models/Post.js";
import { postSchema } from "../validations/schemas.js";
import {
  uploadBufferToCloudinary,
  deleteCloudinaryImage,
} from "../utils/cloydinaryUpload.js";
const populate = (query) =>
  query.populate("author", "name profilePicture").populate("likes", "_id");

export async function createPost(req, res) {
  try {
    const parsed = postSchema.safeParse({ text: req.body.text || "" });
    if (!parsed.success)
      return res
        .status(400)
        .json({ message: parsed.error.issues[0]?.message || "Invalid post" });
    let image = "",
      imagePublicId = "";
    if (req.file) {
      const uploaded = await uploadBufferToCloudinary(
        req.file.buffer,
        "emilo/posts",
      );
      image = uploaded.secure_url;
      imagePublicId = uploaded.public_id;
    }
    if (!parsed.data.text && !image)
      return res
        .status(400)
        .json({ message: "Write something or select an image" });
    const post = await Post.create({
      text: parsed.data.text,
      image,
      imagePublicId,
      author: req.user._id,
    });
    await post.populate("author", "name profilePicture");
    res.status(201).json({ message: "Post created", post });
  } catch (error) {
    console.error("Post creation failed:", error);
    res.status(500).json({ message: "Could not create post or upload image" });
  }
}
export async function getFeed(req, res) {
  const posts = await populate(Post.find()).sort({ createdAt: -1 }).limit(100);
  res.json({ posts });
}
export async function getMyPosts(req, res) {
  const posts = await populate(Post.find({ author: req.user._id })).sort({
    createdAt: -1,
  });
  res.json({ posts });
}
export async function deletePost(req, res) {
  const post = await Post.findById(req.params.id);
  if (!post) return res.status(404).json({ message: "Post not found" });
  if (!post.author.equals(req.user._id))
    return res
      .status(403)
      .json({ message: "You can delete only your own posts" });
  await post.deleteOne();
  await deleteCloudinaryImage(post.imagePublicId);
  res.json({ message: "Post deleted" });
}
export async function toggleLike(req, res) {
  const post = await Post.findById(req.params.id);
  if (!post) return res.status(404).json({ message: "Post not found" });
  const liked = post.likes.some((id) => id.equals(req.user._id));
  if (liked) post.likes.pull(req.user._id);
  else post.likes.addToSet(req.user._id);
  await post.save();
  res.json({
    message: liked ? "Like removed" : "Post liked",
    liked: !liked,
    likes: post.likes.length,
  });
}
