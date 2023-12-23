import { formatISO9075 } from "date-fns";
import { Link } from "react-router-dom";

export default function Post({_id, title, summary, imageUrl, createdAt, author}) {
  return (
    <div className="post">
      <div className="image">
        <Link to={`/post/${_id}`}>
          <img src={imageUrl} alt="" />
        </Link>
      </div>
      <div className="texts">
        <Link to={`/post/${_id}`} className="post-link">
          <h2>{title}</h2>
        </Link>
        <p className="info">
          <span className="author">{author.username}</span>
          <time>{formatISO9075(new Date(createdAt))}</time>
        </p>
        <p className="summary">{summary}</p>
      </div>
    </div>
  );
}
