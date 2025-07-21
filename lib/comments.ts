import { createClient } from './supabase/client';
import { Comment, CommentForm } from './types';

// Create the supabase client instance
const supabase = createClient();

export const commentService = {
  // Create a new comment
  async createComment(data: CommentForm, userId: string) {
    try {
      const { data: comment, error } = await supabase
        .from('comments')
        .insert({
          content: data.content,
          article_id: data.articleId,
          author_id: userId,
          parent_id: data.parentId || null,
        })
        .select(`
          *,
          author:users(*)
        `)
        .single();

      if (error) {
        return { data: null, error: error.message };
      }

      // Increment comments count
      await supabase.rpc('increment_article_comments', { article_id: data.articleId });

      return { data: comment, error: null };
    } catch (error) {
      return { data: null, error: 'An unexpected error occurred' };
    }
  },

  // Get comments for an article
  async getComments(articleId: string) {
    try {
      const { data: comments, error } = await supabase
        .from('comments')
        .select(`
          *,
          author:users(*),
          likes:comment_likes(count),
          replies:comments!parent_id(
            *,
            author:users(*),
            likes:comment_likes(count)
          )
        `)
        .eq('article_id', articleId)
        .is('parent_id', null) // Only get top-level comments
        .order('created_at', { ascending: false });

      if (error) {
        return { data: [], error: error.message };
      }

      return { data: comments || [], error: null };
    } catch (error) {
      return { data: [], error: 'An unexpected error occurred' };
    }
  },

  // Update a comment
  async updateComment(commentId: string, content: string, userId: string) {
    try {
      const { data: comment, error } = await supabase
        .from('comments')
        .update({
          content,
          updated_at: new Date().toISOString(),
        })
        .eq('id', commentId)
        .eq('author_id', userId) // Ensure user can only update their own comments
        .select(`
          *,
          author:users(*)
        `)
        .single();

      if (error) {
        return { data: null, error: error.message };
      }

      return { data: comment, error: null };
    } catch (error) {
      return { data: null, error: 'An unexpected error occurred' };
    }
  },

  // Delete a comment
  async deleteComment(commentId: string, userId: string) {
    try {
      const { error } = await supabase
        .from('comments')
        .delete()
        .eq('id', commentId)
        .eq('author_id', userId); // Ensure user can only delete their own comments

      if (error) {
        return { error: error.message };
      }

      return { error: null };
    } catch (error) {
      return { error: 'An unexpected error occurred' };
    }
  },

  // Toggle like on comment
  async toggleCommentLike(commentId: string, userId: string) {
    try {
      // Check if already liked
      const { data: existingLike } = await supabase
        .from('comment_likes')
        .select('id')
        .eq('comment_id', commentId)
        .eq('user_id', userId)
        .single();

      if (existingLike) {
        // Unlike
        const { error } = await supabase
          .from('comment_likes')
          .delete()
          .eq('comment_id', commentId)
          .eq('user_id', userId);

        if (error) {
          return { liked: false, error: error.message };
        }

        // Decrement likes count
        await supabase.rpc('decrement_comment_likes', { comment_id: commentId });

        return { liked: false, error: null };
      } else {
        // Like
        const { error } = await supabase
          .from('comment_likes')
          .insert({
            comment_id: commentId,
            user_id: userId,
          });

        if (error) {
          return { liked: false, error: error.message };
        }

        // Increment likes count
        await supabase.rpc('increment_comment_likes', { comment_id: commentId });

        return { liked: true, error: null };
      }
    } catch (error) {
      return { liked: false, error: 'An unexpected error occurred' };
    }
  },
}; 