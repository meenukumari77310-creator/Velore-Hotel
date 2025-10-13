import React, { useEffect, useState } from "react";
import { apis } from "../utils/apis";
import { Link } from "react-router-dom";

const BlogList = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    fetch(apis().getBlogs, { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        const blogArray = Array.isArray(data) ? data : data.data;
        setPosts(blogArray || []);
      })
      .catch((err) => {
        console.error("Failed to fetch blog posts", err);
        setPosts([]);
      });
  }, []);

  return (
    <div className="container py-5 mt-5">
      <h2 className="mb-5 text-center">📚 Latest Blog Posts</h2>

      <div className="d-flex flex-column gap-5">
        {posts.map((post) => (
          <div key={post._id} className="row g-4 align-items-center border-bottom pb-4">
            <div className="col-md-5">
              {post.image ? (
                <img
                  src={post.image}
                  alt={post.title}
                  className="img-fluid rounded"
                  style={{ objectFit: "cover", width: "100%", height: "250px" }}
                />
              ) : (
                <div
                  className="bg-light rounded d-flex align-items-center justify-content-center text-muted"
                  style={{ height: "250px" }}
                >
                  No Image
                </div>
              )}
            </div>
            <div className="col-md-7">
              <h3>{post.title}</h3>
              <p className="text-muted small mb-2">
                {new Date(post.createdAt).toLocaleDateString()} by {post.author || "Admin"}
              </p>
              <p className="mb-3">{post.content.slice(0, 150)}...</p>
              <Link to={`/blog/${post._id}`} className="btn btn-outline-primary btn-sm">
                Read Full Post
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BlogList;
