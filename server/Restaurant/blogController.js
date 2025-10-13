import BlogPost from "../models/blogPost.js";

// Public: Get all posts
export const getAllPosts = async (req, res) => {
  try {
    const posts = await BlogPost.find().sort({ createdAt: -1 });
    res.json(posts);
  } catch {
    res.status(500).json({ message: "Failed to fetch blog posts" });
  }
};

// Public: Get single post
export const getPostById = async (req, res) => {
  try {
    const post = await BlogPost.findById(req.params.id);
    res.json(post);
  } catch {
    res.status(404).json({ message: "Post not found" });
  }
};

// Admin: Create post
export const createPost = async (req, res) => {
  try {
    const { title, content, author } = req.body;
    const image = req.file?.path; // Cloudinary URL

    const post = new BlogPost({
      title,
      content,
      image,
      author,
    });

    await post.save();
    res.status(201).json({ message: "Post created", post });
  } catch (err) {
    res.status(500).json({ message: "Failed to create post" });
  }
};


// Admin: Update post
export const updatePost = async (req, res) => {
  try {
    const { title, content, author } = req.body;
    const image = req.file?.path;

    const updateData = { title, content, author };
    if (image) updateData.image = image;

    const post = await BlogPost.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
    });

    res.json({ message: "Post updated", post });
  } catch {
    res.status(500).json({ message: "Failed to update post" });
  }
};


// Admin: Delete post
export const deletePost = async (req, res) => {
  try {
    await BlogPost.findByIdAndDelete(req.params.id);
    res.json({ message: "Post deleted" });
  } catch {
    res.status(500).json({ message: "Failed to delete post" });
  }
};
