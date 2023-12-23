import "react-quill/dist/quill.snow.css";
import React, { useState } from "react";
import { Navigate } from "react-router-dom";
import Editor from "../Editor";

export default function CreatePost() {
  const [title, setTitle] = useState("");

  const [summary, setSummary] = useState("");

  const [content, setContent] = useState("");

  const [imageUrl, setImageUrl] = useState("");

  const [redirect, setRedirect] = useState(false);

  async function createNewPost(ev) {
    ev.preventDefault();

    const postData = {
      title,
      summary,
      content,
      imageUrl,
    };

    try {
      const response = await fetch("http://localhost:4000/post", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(postData),
        credentials: "include",
      });
      if (response.ok) {
        setRedirect(true);
      }
    } catch (error) {
      console.error("Error creating post:", error);
    }
  }

  if (redirect) {
    return <Navigate to={"/"} />;
  }

  return (
    <form onSubmit={createNewPost}>
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(ev) => setTitle(ev.target.value)}
      />

      <input
        type="text"
        placeholder="Summary"
        value={summary}
        onChange={(ev) => setSummary(ev.target.value)}
      />


      <input
        type="text"
        placeholder="Image URL"
        value={imageUrl}
        onChange={(ev) => setImageUrl(ev.target.value)}
      />

      {imageUrl && (
        <img src={imageUrl} alt="Preview" style={{ maxWidth: "100px" }} />
        )}

      <Editor value={content} onChange={setContent} />
      <button type="submit" style={{ marginTop: "5px" }}>
        Create post
      </button>
    </form>
  );
}
