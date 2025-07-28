"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { articleService } from "@/lib/articles";
import { useAuth } from "@/contexts/AuthContext";
import { FollowButton } from "@/components/ui/follow-button";
import { 
  ArrowLeft, 
  Eye, 
  Heart, 
  Calendar,
  Clock,
  Share2,
  Bookmark
} from "lucide-react";

export default function ArticlePage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const articleId = params.id as string;
  const [article, setArticle] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [likeLoading, setLikeLoading] = useState(false);
  const [comments, setComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState("");
  const [commentLoading, setCommentLoading] = useState(false);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        setLoading(true);
        console.log("🔍 Fetching article with ID:", articleId);
        
        const result = await articleService.getArticleById(articleId);
        console.log("📄 Article fetch result:", result);
        
        if (result.error) {
          console.error("❌ Error fetching article:", result.error);
          setError(`Failed to load article: ${result.error}`);
        } else if (result.data) {
          console.log("✅ Article loaded successfully:", result.data);
          setArticle(result.data);
          setLikesCount(Number(result.data.likes_count) || 0);
          
          // Check if user has liked this article
          if (user) {
            const likeResult = await articleService.checkUserLike(articleId, user.id);
            setIsLiked(likeResult.liked);
          }

          // Fetch comments
          const commentsResult = await articleService.getComments(articleId);
          if (commentsResult.data) {
            setComments(commentsResult.data);
          }
        } else {
          console.error("❌ No article data returned");
          setError("Article not found or not published");
        }
      } catch (error) {
        console.error("💥 Unexpected error fetching article:", error);
        setError("Failed to load article - please try again");
      } finally {
        setLoading(false);
      }
    };

    if (articleId) {
      fetchArticle();
    }
  }, [articleId, user]);

  const handleLike = async () => {
    if (!user) {
      alert("Please log in to like articles");
      return;
    }

    setLikeLoading(true);
    try {
      const result = await articleService.toggleLike(articleId, user.id);
      
      if (result.error) {
        console.error("Error toggling like:", result.error);
      } else {
        setIsLiked(result.liked);
        if (result.newCount !== undefined) {
          setLikesCount(Number(result.newCount) || 0);
        } else {
          // Fallback to manual update
          setLikesCount(prevCount => result.liked ? prevCount + 1 : Math.max(0, prevCount - 1));
        }
      }
    } catch (error) {
      console.error("Unexpected error liking article:", error);
    } finally {
      setLikeLoading(false);
    }
  };

  const handleAddComment = async () => {
    if (!user) {
      alert("Please log in to comment");
      return;
    }

    if (!newComment.trim()) {
      alert("Please enter a comment");
      return;
    }

    setCommentLoading(true);
    try {
      const result = await articleService.addComment(articleId, newComment.trim(), user.id);
      
      if (result.error) {
        console.error("Error adding comment:", result.error);
        alert("Failed to add comment");
      } else if (result.data) {
        setComments([result.data, ...comments]);
        setNewComment("");
      }
    } catch (error) {
      console.error("Unexpected error adding comment:", error);
      alert("Failed to add comment");
    } finally {
      setCommentLoading(false);
    }
  };

  const handleCommentLike = async (commentId: string) => {
    if (!user) {
      alert("Please log in to like comments");
      return;
    }

    try {
      const result = await articleService.toggleCommentLike(commentId, user.id);
      
      if (result.error) {
        console.error("Error toggling comment like:", result.error);
        alert("Failed to like comment");
      } else {
        // Update the comment likes count in the local state
        setComments(prevComments => 
          prevComments.map(comment => 
            comment.id === commentId 
              ? { ...comment, likes_count: result.liked ? (comment.likes_count || 0) + 1 : Math.max(0, (comment.likes_count || 0) - 1) }
              : comment
          )
        );
      }
    } catch (error) {
      console.error("Unexpected error liking comment:", error);
      alert("Failed to like comment");
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    return formatDate(dateString);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-white text-xl">Loading article...</div>
        </div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900">
        <Header />
        <div className="max-w-4xl mx-auto px-4 py-16 text-center">
          <div className="text-red-400 text-2xl mb-4">Article Not Found</div>
          <p className="text-gray-300 mb-8">The article you're looking for doesn't exist or has been removed.</p>
          <Link 
            href="/articles"
            className="bg-yellow-500 text-black px-6 py-3 rounded-lg font-semibold hover:bg-yellow-400 transition-colors"
          >
            Browse Articles
          </Link>
        </div>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Back Button */}
          <Link 
            href="/articles" 
            className="inline-flex items-center text-gray-400 hover:text-white transition-colors mb-8"
          >
            <ArrowLeft className="mr-2" size={20} />
            Back to Articles
          </Link>

          {/* Article Header */}
          <div className="mb-8">
            {article.image_url && (
              <div className="w-full mb-8 rounded-lg overflow-hidden">
                <img 
                  src={article.image_url} 
                  alt={article.title}
                  className="w-full h-auto max-h-96 object-contain"
                />
              </div>
            )}

            <div className="mb-4">
              <span className="bg-yellow-500 text-black px-3 py-1 rounded-full text-sm font-semibold">
                {article.category}
              </span>
            </div>

            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
              {article.title}
            </h1>

            <p className="text-xl text-gray-300 mb-6">
              {article.description}
            </p>

            {/* Article Meta */}
            <div className="flex flex-wrap items-center gap-4 mb-8 text-gray-400">
              <div className="flex items-center">
                <Calendar size={16} className="mr-2" />
                <span>{formatDate(article.published_at || article.created_at)}</span>
              </div>
              <div className="flex items-center">
                <Eye size={16} className="mr-2" />
                <span>{(article.views || 0).toLocaleString()} views</span>
              </div>
                             <div className="flex items-center">
                 <Heart size={16} className="mr-2" />
                 <span>{likesCount} likes</span>
               </div>
            </div>

            {/* Author Info */}
            {article.author && (
              <div className="flex items-center justify-between mb-8 p-4 bg-gray-800/50 rounded-lg">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gray-600 rounded-full flex items-center justify-center mr-4">
                    <span className="text-white font-semibold">
                      {article.author.full_name?.charAt(0) || 'U'}
                    </span>
                  </div>
                  <div>
                    <Link 
                      href={`/user/${article.author_id}`}
                      className="text-white font-semibold hover:text-yellow-400 transition-colors"
                    >
                      {article.author.full_name || 'Anonymous'}
                    </Link>
                    <div className="text-gray-400 text-sm">{article.author.profession || 'Author'}</div>
                  </div>
                </div>
                {/* Follow Button */}
                <FollowButton userId={article.author_id} />
              </div>
            )}
          </div>

          {/* Article Content */}
          <div className="prose prose-invert prose-lg max-w-none mb-12 overflow-hidden">
            <div 
              className="rich-text-content w-full"
              dangerouslySetInnerHTML={{ __html: article.content }}
            />
          </div>

          {/* Hashtags */}
          {article.tags && article.tags.length > 0 && (
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-white mb-4">Hashtags</h3>
              <div className="flex flex-wrap gap-3">
                {article.tags.map((tag: string, index: number) => (
                  <span 
                    key={index}
                    className="bg-gray-700 text-gray-300 px-3 py-1 rounded-full text-sm hover:bg-gray-600 transition-colors"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4 mb-12">
            <button 
              onClick={handleLike}
              disabled={likeLoading}
              className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
                isLiked 
                  ? 'bg-red-600 hover:bg-red-700 text-white' 
                  : 'bg-gray-700 hover:bg-gray-600 text-white'
              } ${likeLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <Heart 
                size={16} 
                className={`mr-2 ${isLiked ? 'fill-current' : ''}`} 
              />
              {likeLoading ? 'Loading...' : isLiked ? 'Liked' : 'Like'} ({likesCount})
            </button>
            <button className="flex items-center bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors">
              <Bookmark size={16} className="mr-2" />
              Bookmark
            </button>
            <button className="flex items-center bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors">
              <Share2 size={16} className="mr-2" />
              Share
            </button>
          </div>

          {/* Comments Section */}
          <div className="mb-12">
            <h3 className="text-2xl font-bold text-white mb-6">
              Comments ({comments.length})
            </h3>

            {/* Add Comment */}
            {user ? (
              <div className="bg-gray-800/50 rounded-lg p-6 mb-8">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-semibold">
                      {user.email?.charAt(0).toUpperCase() || 'U'}
                    </span>
                  </div>
                  <div className="flex-1">
                    <textarea
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Share your thoughts..."
                      className="w-full bg-gray-700 text-white rounded-lg p-4 border border-gray-600 focus:border-yellow-500 focus:outline-none resize-none"
                      rows={3}
                    />
                    <div className="flex justify-end mt-3">
                      <button
                        onClick={handleAddComment}
                        disabled={commentLoading || !newComment.trim()}
                        className="bg-yellow-500 text-black px-6 py-2 rounded-lg font-semibold hover:bg-yellow-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {commentLoading ? 'Posting...' : 'Post Comment'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-gray-800/50 rounded-lg p-6 mb-8 text-center">
                <p className="text-gray-400 mb-4">Please log in to leave a comment</p>
                <Link 
                  href="/login"
                  className="bg-yellow-500 text-black px-6 py-2 rounded-lg font-semibold hover:bg-yellow-400 transition-colors"
                >
                  Log In
                </Link>
              </div>
            )}

            {/* Comments List */}
            <div className="space-y-6">
              {comments.length > 0 ? (
                comments.map((comment) => (
                  <div key={comment.id} className="bg-gray-800/30 rounded-lg p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-white font-semibold">
                          {comment.author?.full_name?.charAt(0) || 'U'}
                        </span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="font-semibold text-white">
                            {comment.author?.full_name || 'Anonymous'}
                          </h4>
                          <span className="text-gray-500 text-sm">
                            {formatTimeAgo(comment.created_at)}
                          </span>
                        </div>
                        <p className="text-gray-300 leading-relaxed mb-4">
                          {comment.content}
                        </p>
                        <div className="flex items-center gap-4">
                          <button 
                            onClick={() => handleCommentLike(comment.id)}
                            className="flex items-center gap-1 text-gray-400 hover:text-yellow-500 transition-colors text-sm"
                          >
                            <Heart size={14} />
                            <span>{comment.likes_count || 0}</span>
                          </button>
                          <button className="text-gray-400 hover:text-white transition-colors text-sm">
                            Reply
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12">
                  <div className="text-gray-400 text-lg mb-2">No comments yet</div>
                  <p className="text-gray-500">Be the first to share your thoughts!</p>
                </div>
              )}
            </div>
          </div>

          {/* Navigation */}
          <div className="flex justify-between items-center pt-8 border-t border-gray-700">
            <Link 
              href="/articles"
              className="text-yellow-500 hover:text-yellow-400 transition-colors"
            >
              ← Browse More Articles
            </Link>
            <Link 
              href="/my-articles"
              className="text-yellow-500 hover:text-yellow-400 transition-colors"
            >
              View My Articles →
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
