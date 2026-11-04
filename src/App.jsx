import { useState } from 'react';

function App() {
  const [isLiked, setIsLiked] = useState(false);
  const [showComments, setShowComments] = useState(false);

  return (
    <>
      <header className="page-header bg-white shadow-sm">
        <nav className="header-navigation container d-flex align-items-center gap-3 py-3">
          <h1 className="site-name text-primary fw-bold mb-0">facebook</h1>

          <input
            type="search"
            className="search-input form-control rounded-pill"
            placeholder="Search Facebook"
            aria-label="Search Facebook"
          />

          <button className="home-button btn btn-primary">Home</button>
        </nav>
      </header>

      <main className="page-content container py-4">
        <div className="feed-layout row justify-content-center">
          <div className="feed col-12 col-md-8 col-lg-6">
            <h2 className="feed-title h4 mb-3">Your feed</h2>

            <article className="post-card card border-0 shadow-sm">
              <div className="post-content card-body">
                <div className="post-author d-flex align-items-center gap-3 mb-3">
                  <div className="profile-avatar">P</div>

                  <div className="author-details">
                    <h3 className="author-name h6 mb-1">Phuong</h3>
                    <small className="post-time text-secondary">
                      Just now · Public
                    </small>
                  </div>
                </div>

                <p className="post-text">
                  Hello everyone! This is my first post.
                </p>

                <p className="like-count text-secondary small mb-0">
                  {isLiked ? '1 like' : '0 likes'}
                </p>
                <hr className="post-divider" />

                <div className="post-actions d-flex gap-2">
                  <button
                    className={`like-button btn flex-fill ${
                      isLiked ? 'btn-primary' : 'btn-light'
                    }`}
                    onClick={() => setIsLiked(!isLiked)}
                    aria-pressed={isLiked}
                  >
                    {isLiked ? 'Liked' : 'Like'}
                  </button>
                  <button
                    className="comment-button btn btn-light flex-fill"
                    onClick={() => setShowComments(!showComments)}
                    aria-expanded={showComments}
                  >
                    Comment
                  </button>
                  <button className="share-button btn btn-light flex-fill">
                    Share
                  </button>
                </div>
                {showComments && (
                  <div className="comment-section mt-3">
                    <input
                      type="text"
                      className="comment-input form-control rounded-pill"
                      placeholder="Write a comment..."
                      aria-label="Write a comment"
                    />
                  </div>
                )}
              </div>
            </article>
          </div>
        </div>
      </main>
    </>
  );
}

export default App;
