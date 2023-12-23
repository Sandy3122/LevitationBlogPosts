import { useEffect, useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import Editor from "../Editor";

export default function EditPost() {
  const { id } = useParams();
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [redirect, setRedirect] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:4000/post/${id}`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch post data');
        }
        return response.json();
      })
      .then(postInfo => {
        setTitle(postInfo.title);
        setContent(postInfo.content);
        setSummary(postInfo.summary);
        setImageUrl(postInfo.imageUrl); // Set the imageUrl from fetched data
      })
      .catch(error => {
        console.error('Error fetching post data:', error);
        setError('Failed to fetch post data');
      });
  }, [id]);

  async function updatePost(ev) {
    ev.preventDefault();

    const postData = {
      title,
      summary,
      content,
      imageUrl,
    };

    try {
      const response = await fetch(`http://localhost:4000/post/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(postData),
        credentials: 'include',
      });

      if (response.ok) {
        setRedirect(true);
      } else {
        const responseData = await response.json();
        setError(responseData.error || 'Failed to update post');
      }
    } catch (error) {
      console.error('Error updating post:', error);
      setError('Failed to update post');
    }
  }

  if (redirect) {
    return <Navigate to={`/post/${id}`} />;
  }

  return (
    <form onSubmit={updatePost}>
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={ev => setTitle(ev.target.value)}
      />
      <input
        type="text"
        placeholder="Summary"
        value={summary}
        onChange={ev => setSummary(ev.target.value)}
      />
      {/* Use text input for image URL */}
      <input
        type="text"
        placeholder="Image URL"
        value={imageUrl}
        onChange={ev => setImageUrl(ev.target.value)}
      />
      <Editor onChange={setContent} value={content} />
      <button style={{ marginTop: '5px' }}>Update post</button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </form>
  );
}
