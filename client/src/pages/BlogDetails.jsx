import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { apis } from "../utils/apis";

const BlogDetail = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);

  useEffect(() => {
    fetch(apis().getBlogById(id),{credentials: "include"})
      .then((res) => res.json())
      .then(setPost);
  }, [id]);

  if (!post) return <div>Loading...</div>;

  return (
    <div className="container mt-5 py-5">
      <h2>{post.title}</h2>
      {post.image && (
        <img
          src={post.image}
          alt={post.title || "Blog image"}
          className="img-fluid my-3"
        />
      )}

      <p>{post.content}</p>
      <small className="text-muted">
        Posted on {new Date(post.createdAt).toLocaleString()} by{" "}
        {post.author || "Admin"}
      </small>
    </div>
  );
};

export default BlogDetail;
