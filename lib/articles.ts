import { createClient } from '@/lib/supabase/client';
import { Article, ArticleForm, ArticleFilters, ArticlesResponse } from './types';

const supabase = createClient();

export const articleService = {
  // Create a new article
  async createArticle(data: ArticleForm, authorId: string, isDraft: boolean = false) {
    try {
      console.log('🚀 Step 1: Starting article creation...', { authorId, title: data.title, isDraft });
      
      console.log('🔍 Step 2: Checking if user exists in users table...');
      console.log('🔍 Step 2.1: User ID being checked:', authorId);
      
      // First, verify the user exists in the users table
      try {
        const { data: userExists, error: userCheckError } = await supabase
          .from('users')
          .select('id')
          .eq('id', authorId)
          .single();

        console.log('🔍 Step 2.2: User check response:', { userExists, userCheckError });

        if (userCheckError) {
          console.error('❌ User check error details:', {
            message: userCheckError.message,
            code: userCheckError.code,
            details: userCheckError.details,
            hint: userCheckError.hint
          });
          
          // If user doesn't exist, try to create them
          if (userCheckError.code === 'PGRST116') {
            console.log('🔧 Step 2.3: User not found, attempting to create user profile...');
            
            // Get user info from auth
            const { data: { user: authUser } } = await supabase.auth.getUser();
            console.log('🔧 Step 2.4: Auth user data:', authUser);
            
            if (authUser) {
              const { data: newUser, error: createError } = await supabase
                .from('users')
                .insert({
                  id: authUser.id,
                  email: authUser.email || '',
                  full_name: authUser.user_metadata?.full_name || authUser.email?.split('@')[0] || 'User',
                  profession: authUser.user_metadata?.profession || undefined,
                })
                .select('*')
                .single();
                
              console.log('🔧 Step 2.5: User creation result:', { newUser, createError });
              
              if (createError) {
                return { data: null, error: `Failed to create user profile: ${createError.message}` };
              }
              
              console.log('✅ Step 2.6: User profile created successfully');
            } else {
              return { data: null, error: 'No authenticated user found. Please log in again.' };
            }
          } else {
            return { data: null, error: `Database connection error: ${userCheckError.message}` };
          }
        } else if (userExists) {
          console.log('✅ Step 2 complete: User exists in database');
        } else {
          console.error('❌ User exists check returned null but no error');
          return { data: null, error: 'User profile not found. Please sign out and sign in again to create your profile.' };
        }
      } catch (step2Error) {
        console.error('💥 Step 2 unexpected error:', step2Error);
        return { data: null, error: `Unexpected error checking user: ${step2Error instanceof Error ? step2Error.message : 'Unknown error'}` };
      }

      let imageUrl = null;

      // Upload image if provided
      if (data.imageFile) {
        console.log('📷 Step 3: Uploading image...');
        const fileExt = data.imageFile.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('article-images')
          .upload(fileName, data.imageFile);

        if (uploadError) {
          console.error('❌ Image upload error:', uploadError);
          return { data: null, error: `Image upload failed: ${uploadError.message || 'Storage bucket may not exist'}` };
        }

        const { data: { publicUrl } } = supabase.storage
          .from('article-images')
          .getPublicUrl(fileName);

        imageUrl = publicUrl;
        console.log('✅ Step 3 complete: Image uploaded successfully:', imageUrl);
      } else {
        console.log('⏭️ Step 3 skipped: No image to upload');
      }

      console.log('💾 Step 4: Inserting article into database...');
      console.log('📊 Article data:', {
        title: data.title,
        contentLength: data.content.length,
        description: data.description,
        category: data.category,
        tags: data.tags,
        authorId: authorId,
        isDraft: isDraft
      });
      
      // Insert article with better error handling
      const { data: article, error } = await supabase
        .from('articles')
        .insert({
          title: data.title,
          content: data.content,
          description: data.description,
          category: data.category,
          tags: data.tags,
          image_url: imageUrl,
          author_id: authorId,
          is_published: !isDraft,
          published_at: isDraft ? null : new Date().toISOString(),
        })
        .select('*')
        .single();

      if (error) {
        console.error('❌ Article insertion error:', error);
        console.error('❌ Error details:', {
          message: error.message,
          code: error.code,
          details: error.details,
          hint: error.hint
        });
        const errorMessage = error.message || 'Unknown database error';
        const errorCode = error.code || 'NO_CODE';
        return { data: null, error: `Database error (${errorCode}): ${errorMessage}` };
      }

      console.log(`✅ Step 4 complete: ${isDraft ? 'Draft' : 'Article'} created successfully:`, article.id);

      console.log('👤 Step 5: Fetching author data...');
      // Try to fetch the author separately to avoid relationship issues
      try {
        const { data: authorData } = await supabase
          .from('users')
          .select('*')
          .eq('id', authorId)
          .single();
        
        if (authorData) {
          article.author = authorData;
          console.log('✅ Step 5 complete: Author data fetched');
        }
      } catch (authorError) {
        console.warn('⚠️ Step 5 warning: Could not fetch author data, but article was created:', authorError);
      }

      console.log(`🎉 ${isDraft ? 'Draft' : 'Article'} creation completed successfully!`);
      return { data: article, error: null };
    } catch (error) {
      console.error('💥 Unexpected error in createArticle:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      return { data: null, error: `Unexpected error: ${errorMessage}` };
    }
  },

  // Create draft specifically
  async createDraft(data: ArticleForm, authorId: string) {
    return this.createArticle(data, authorId, true);
  },

  // Publish a draft
  async publishDraft(articleId: string, authorId: string) {
    try {
      console.log('📤 Publishing draft:', articleId);
      
      const { data: article, error } = await supabase
        .from('articles')
        .update({
          is_published: true,
          published_at: new Date().toISOString(),
        })
        .eq('id', articleId)
        .eq('author_id', authorId) // Ensure user can only publish their own drafts
        .select('*')
        .single();

      if (error) {
        console.error('❌ Error publishing draft:', error);
        return { data: null, error: error.message };
      }

      console.log('✅ Draft published successfully');
      return { data: article, error: null };
    } catch (error) {
      console.error('💥 Unexpected error publishing draft:', error);
      return { data: null, error: 'An unexpected error occurred' };
    }
  },

  // Get user's drafts
  async getUserDrafts(userId: string) {
    try {
      console.log('📋 Fetching user drafts for:', userId);
      
      // First get the articles without relationships to avoid errors
      const { data: articles, error } = await supabase
        .from('articles')
        .select('*')
        .eq('author_id', userId)
        .eq('is_published', false)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('❌ Error fetching drafts:', error);
        return { data: [], error: error.message };
      }

      // Then fetch author data separately if we have articles
      if (articles && articles.length > 0) {
        try {
          const { data: authorData } = await supabase
            .from('users')
            .select('*')
            .eq('id', userId)
            .single();
          
          // Add author data to each article
          const enrichedArticles = articles.map((article: any) => ({
            ...article,
            author: authorData,
            likes_count: article.likes_count || 0,
            comments_count: article.comments_count || 0,
            views: article.views || 0
          }));
          
          console.log('✅ Fetched', enrichedArticles.length, 'drafts');
          return { data: enrichedArticles, error: null };
        } catch (authorError) {
          console.warn('⚠️ Could not fetch author data for drafts, returning articles without author');
          return { data: articles, error: null };
        }
      }

      console.log('✅ No drafts found');
      return { data: articles || [], error: null };
    } catch (error) {
      console.error('💥 Unexpected error fetching drafts:', error);
      return { data: [], error: 'An unexpected error occurred' };
    }
  },

  // Get articles with filters
  async getArticles(filters: ArticleFilters = {}): Promise<ArticlesResponse> {
    try {
      console.log('🔍 Fetching articles with filters:', filters);
      
      // First get articles without author data to avoid relationship issues
      let query = supabase
        .from('articles')
        .select('*', { count: 'exact' })
        .eq('is_published', true);

      // Apply filters
      if (filters.category && filters.category !== 'All Articles') {
        query = query.eq('category', filters.category);
      }

      if (filters.author) {
        query = query.eq('author_id', filters.author);
      }

      if (filters.tags && filters.tags.length > 0) {
        query = query.contains('tags', filters.tags);
      }

      // Apply sorting
      switch (filters.sortBy) {
        case 'popular':
        case 'most_liked':
          query = query.order('likes_count', { ascending: false });
          break;
        case 'most_viewed':
          query = query.order('views', { ascending: false });
          break;
        case 'latest':
        default:
          query = query.order('published_at', { ascending: false });
          break;
      }

      // Apply pagination
      const limit = filters.limit || 12;
      const offset = filters.offset || 0;
      query = query.range(offset, offset + limit - 1);

      const { data: articles, error, count } = await query;

      if (error) {
        console.error('❌ Error fetching articles:', error);
        throw new Error(error.message);
      }

      console.log('✅ Fetched', articles?.length || 0, 'articles');

      // Now fetch author data for each article separately
      const enrichedArticles = await Promise.all(
        (articles || []).map(async (article: any) => {
          try {
            const { data: authorData } = await supabase
              .from('users')
              .select('*')
              .eq('id', article.author_id)
              .single();
            
            return {
              ...article,
              author: authorData,
              likes_count: Number(article.likes_count) || 0,
              comments_count: Number(article.comments_count) || 0,
              views: Number(article.views) || 0
            } as unknown as Article;
          } catch (authorError) {
            console.warn('⚠️ Could not fetch author for article:', article.id, authorError);
            return {
              ...article,
              author: null,
              likes_count: Number(article.likes_count) || 0,
              comments_count: Number(article.comments_count) || 0,
              views: Number(article.views) || 0
            } as unknown as Article;
          }
        })
      );

      const totalPages = Math.ceil((count || 0) / limit);
      const currentPage = Math.floor(offset / limit) + 1;

      return {
        articles: enrichedArticles,
        meta: {
          total: count || 0,
          page: currentPage,
          limit,
          totalPages,
        },
      };
    } catch (error) {
      console.error('💥 Error in getArticles:', error);
      throw new Error('Failed to fetch articles');
    }
  },

  // Get single article by ID
  async getArticleById(id: string) {
    try {
      console.log("🔍 Fetching article with ID:", id);
      
      // First, try a simple query to see if the article exists
      const { data: article, error } = await supabase
        .from('articles')
        .select('*')
        .eq('id', id)
        .single();

      console.log("📄 Simple article query result:", { article, error });

      if (error) {
        console.error("❌ Database error details:", {
          message: error.message,
          code: error.code,
          details: error.details,
          hint: error.hint,
          fullError: error
        });
        return { data: null, error: `Article not found: ${error.message || 'Database error'}` };
      }

      if (!article) {
        console.error("❌ No article found with ID:", id);
        return { data: null, error: 'Article not found' };
      }

      console.log("✅ Article found:", article);

      // Now try to get the author information separately
      let authorData = null;
      if (article.author_id) {
        try {
          const { data: author, error: authorError } = await supabase
            .from('users')
            .select('*')
            .eq('id', article.author_id)
            .single();
          
          if (!authorError && author) {
            authorData = author;
            console.log("✅ Author data fetched:", author);
          } else {
            console.warn("⚠️ Could not fetch author data:", authorError);
          }
        } catch (authorErr) {
          console.warn("⚠️ Error fetching author:", authorErr);
        }
      }

      // Combine article with author data
      const enrichedArticle = {
        ...article,
        author: authorData,
        likes_count: article.likes_count || 0,
        views: article.views || 0,
        comments: [] // We'll add this later when comments are implemented
      };

      // Increment view count
      try {
        await supabase
          .from('articles')
          .update({ views: (Number(article.views) || 0) + 1 })
          .eq('id', id);
        console.log("📈 View count incremented");
      } catch (viewErr) {
        console.warn("⚠️ Could not increment view count:", viewErr);
      }

      return { data: enrichedArticle, error: null };
    } catch (error) {
      console.error("💥 Unexpected error in getArticleById:", error);
      return { data: null, error: `Unexpected error: ${error instanceof Error ? error.message : 'Unknown error'}` };
    }
  },

  // Update article
  async updateArticle(id: string, data: Partial<ArticleForm>, authorId: string) {
    try {
      let updateData: any = {
        ...data,
        updated_at: new Date().toISOString(),
      };

      // Handle image upload if new image provided
      if (data.imageFile) {
        const fileExt = data.imageFile.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('article-images')
          .upload(fileName, data.imageFile);

        if (uploadError) {
          return { data: null, error: uploadError.message };
        }

        const { data: { publicUrl } } = supabase.storage
          .from('article-images')
          .getPublicUrl(fileName);

        updateData.image_url = publicUrl;
      }

      const { data: article, error } = await supabase
        .from('articles')
        .update(updateData)
        .eq('id', id)
        .eq('author_id', authorId) // Ensure user can only update their own articles
        .select(`
          *,
          author:users(*)
        `)
        .single();

      if (error) {
        return { data: null, error: error.message };
      }

      return { data: article, error: null };
    } catch (error) {
      return { data: null, error: 'An unexpected error occurred' };
    }
  },

  // Delete article
  async deleteArticle(id: string, authorId: string) {
    try {
      const { error } = await supabase
        .from('articles')
        .delete()
        .eq('id', id)
        .eq('author_id', authorId); // Ensure user can only delete their own articles

      if (error) {
        return { error: error.message };
      }

      return { error: null };
    } catch (error) {
      return { error: 'An unexpected error occurred' };
    }
  },

  // Toggle like on article
  async toggleLike(articleId: string, userId: string) {
    try {
      console.log('❤️ Toggling like for article:', articleId, 'user:', userId);
      
      // Check if already liked
      const { data: existingLike, error: checkError } = await supabase
        .from('article_likes')
        .select('id')
        .eq('article_id', articleId)
        .eq('user_id', userId)
        .single();

      console.log('🔍 Existing like check:', { existingLike, checkError });

      if (existingLike) {
        // Unlike
        console.log('👎 Removing like...');
        const { error } = await supabase
          .from('article_likes')
          .delete()
          .eq('article_id', articleId)
          .eq('user_id', userId);

        if (error) {
          console.error('❌ Error removing like:', error);
          return { liked: false, error: error.message };
        }

        // Decrement likes count manually
        const { data: article } = await supabase
          .from('articles')
          .select('likes_count')
          .eq('id', articleId)
          .single();
        
        const newCount = Math.max(0, (Number(article?.likes_count) || 1) - 1);
        await supabase
          .from('articles')
          .update({ likes_count: newCount })
          .eq('id', articleId);

        console.log('✅ Like removed, new count:', newCount);
        return { liked: false, error: null, newCount };
      } else {
        // Like
        console.log('👍 Adding like...');
        const { error } = await supabase
          .from('article_likes')
          .insert({
            article_id: articleId,
            user_id: userId,
          });

        if (error) {
          console.error('❌ Error adding like:', error);
          return { liked: false, error: error.message };
        }

        // Increment likes count manually  
        const { data: article } = await supabase
          .from('articles')
          .select('likes_count')
          .eq('id', articleId)
          .single();
        
        const newCount = (Number(article?.likes_count) || 0) + 1;
        await supabase
          .from('articles')
          .update({ likes_count: newCount })
          .eq('id', articleId);

        console.log('✅ Like added, new count:', newCount);
        return { liked: true, error: null, newCount };
      }
    } catch (error) {
      console.error('💥 Unexpected error in toggleLike:', error);
      return { liked: false, error: 'An unexpected error occurred' };
    }
  },

  // Check if user has liked an article
  async checkUserLike(articleId: string, userId: string) {
    try {
      const { data: like } = await supabase
        .from('article_likes')
        .select('id')
        .eq('article_id', articleId)
        .eq('user_id', userId)
        .single();
      
      return { liked: !!like, error: null };
    } catch (error) {
      return { liked: false, error: null }; // Don't error on check failures
    }
  },

  // Toggle bookmark on article
  async toggleBookmark(articleId: string, userId: string) {
    try {
      // Check if already bookmarked
      const { data: existingBookmark } = await supabase
        .from('bookmarks')
        .select('id')
        .eq('article_id', articleId)
        .eq('user_id', userId)
        .single();

      if (existingBookmark) {
        // Remove bookmark
        const { error } = await supabase
          .from('bookmarks')
          .delete()
          .eq('article_id', articleId)
          .eq('user_id', userId);

        if (error) {
          return { bookmarked: false, error: error.message };
        }

        return { bookmarked: false, error: null };
      } else {
        // Add bookmark
        const { error } = await supabase
          .from('bookmarks')
          .insert({
            article_id: articleId,
            user_id: userId,
          });

        if (error) {
          return { bookmarked: false, error: error.message };
        }

        return { bookmarked: true, error: null };
      }
    } catch (error) {
      return { bookmarked: false, error: 'An unexpected error occurred' };
    }
  },

  // Get user's articles
  async getUserArticles(userId: string) {
    try {
      console.log('📝 Fetching user articles for:', userId);
      
      // First get the articles without relationships to avoid errors
      const { data: articles, error } = await supabase
        .from('articles')
        .select('*')
        .eq('author_id', userId)
        .eq('is_published', true)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('❌ Error fetching articles:', error);
        return { data: [], error: error.message };
      }

      // Then fetch author data separately if we have articles
      if (articles && articles.length > 0) {
        try {
          const { data: authorData } = await supabase
            .from('users')
            .select('*')
            .eq('id', userId)
            .single();
          
          // Add author data to each article
          const enrichedArticles = articles.map((article: any) => ({
            ...article,
            author: authorData,
            likes_count: article.likes_count || 0,
            comments_count: article.comments_count || 0,
            views: article.views || 0
          }));
          
          console.log('✅ Fetched', enrichedArticles.length, 'published articles');
          return { data: enrichedArticles, error: null };
        } catch (authorError) {
          console.warn('⚠️ Could not fetch author data for articles, returning articles without author');
          return { data: articles, error: null };
        }
      }

      console.log('✅ No published articles found');
      return { data: articles || [], error: null };
    } catch (error) {
      console.error('💥 Unexpected error fetching articles:', error);
      return { data: [], error: 'An unexpected error occurred' };
    }
  },

  // Comments functionality
  async addComment(articleId: string, content: string, userId: string) {
    try {
      console.log('💬 Adding comment to article:', articleId);
      
      const { data: comment, error } = await supabase
        .from('comments')
        .insert({
          article_id: articleId,
          content: content,
          author_id: userId,
        })
        .select(`
          *,
          author:users(*)
        `)
        .single();

      if (error) {
        console.error('❌ Error adding comment:', error);
        return { data: null, error: error.message };
      }

      // Update comments count
      const { data: article } = await supabase
        .from('articles')
        .select('comments_count')
        .eq('id', articleId)
        .single();
      
      const newCount = (Number(article?.comments_count) || 0) + 1;
      await supabase
        .from('articles')
        .update({ comments_count: newCount })
        .eq('id', articleId);

      console.log('✅ Comment added successfully');
      return { data: comment, error: null };
    } catch (error) {
      console.error('💥 Unexpected error adding comment:', error);
      return { data: null, error: 'An unexpected error occurred' };
    }
  },

  async getComments(articleId: string) {
    try {
      console.log('💬 Fetching comments for article:', articleId);
      
      // TEMPORARY DEBUG: Test different approaches
      console.log('🔍 Testing comment fetch...');
      
      // Test 1: Very simple query first
      console.log('Test 1: Simple count query...');
      const { count, error: countError } = await supabase
        .from('comments')
        .select('*', { count: 'exact', head: true })
        .eq('article_id', articleId);
      
      console.log('Count result:', { count, countError });
      
      // Test 2: Try the main query
      console.log('Test 2: Main query...');
      const { data: comments, error } = await supabase
        .from('comments')
        .select('*')
        .eq('article_id', articleId)
        .is('parent_id', null) // Only top-level comments
        .order('created_at', { ascending: false });

      if (error) {
        console.error('❌ Error fetching comments:', {
          error,
          message: error.message,
          code: error.code,
          details: error.details,
          hint: error.hint,
          fullError: JSON.stringify(error)
        });
        return { data: [], error: error.message || 'Failed to fetch comments' };
      }

      if (!comments || comments.length === 0) {
        console.log('📝 No comments found for article');
        return { data: [], error: null };
      }

      console.log('✅ Found', comments.length, 'comments, now fetching author data...');

      // Then fetch author data separately for each comment
      const enrichedComments = await Promise.all(
        comments.map(async (comment: any) => {
          try {
            // Get author data
            const { data: authorData } = await supabase
              .from('users')
              .select('*')
              .eq('id', comment.author_id)
              .single();

            // Get likes count
            const { count: likesCount } = await supabase
              .from('comment_likes')
              .select('*', { count: 'exact', head: true })
              .eq('comment_id', comment.id);

            return {
              ...comment,
              author: authorData,
              likes_count: likesCount || 0
            };
          } catch (err) {
            console.warn('⚠️ Could not fetch author/likes for comment:', comment.id, err);
            return {
              ...comment,
              author: null,
              likes_count: 0
            };
          }
        })
      );

      console.log('✅ Successfully enriched comments with author data');
      return { data: enrichedComments, error: null };
    } catch (error) {
      console.error('💥 Unexpected error fetching comments:', error);
      return { data: [], error: 'An unexpected error occurred' };
    }
  },

  async toggleCommentLike(commentId: string, userId: string) {
    try {
      console.log('❤️ Toggling comment like:', commentId);
      
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

        return { liked: true, error: null };
      }
    } catch (error) {
      return { liked: false, error: 'An unexpected error occurred' };
    }
  },

  // Get featured articles
  async getFeaturedArticles(limit: number = 6): Promise<{ data: Article[] | null; error: string | null }> {
    try {
      console.log('⭐ Fetching featured articles...');
      
      const { data: articles, error } = await supabase
        .from('articles')
        .select(`
          *,
          author:users(*)
        `)
        .eq('is_featured', true)
        .eq('is_published', true)
        .order('published_at', { ascending: false })
        .limit(limit);

      if (error) {
        console.error('❌ Error fetching featured articles:', error);
        return { data: null, error: error.message };
      }

      if (!articles || articles.length === 0) {
        console.log('📝 No featured articles found');
        return { data: [], error: null };
      }

      console.log('✅ Found', articles.length, 'featured articles');
      return { data: articles, error: null };
    } catch (error) {
      console.error('💥 Unexpected error fetching featured articles:', error);
      return { data: null, error: 'An unexpected error occurred' };
    }
  },
}; 