import { createClient } from './supabase/client';

// Create the supabase client instance
const supabase = createClient();

// Database status interface
export interface DatabaseStatus {
  isSetup: boolean;
  userCheck: {
    exists: boolean;
    data: any;
    error?: string;
  };
  insertionTest: {
    success: boolean;
    data: any;
    error?: string;
  };
  relationshipTest: {
    success: boolean;
    data: any;
    error?: string;
  };
  allPassed: boolean;
}

export const databaseChecker = {
  // Check if user exists in users table
  async checkUserExists(userId: string) {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('id, email, full_name')
        .eq('id', userId)
        .single();

      return { exists: !!data, data, error: error?.message };
    } catch (error) {
      return { exists: false, data: null, error: 'Failed to check user' };
    }
  },

  // Test article insertion
  async testArticleInsertion(userId: string) {
    try {
      const testArticle = {
        title: `Test Article ${Date.now()}`,
        content: 'Test article to verify database connectivity.',
        category: 'Architecture' as const,
        tags: ['test'],
        author_id: userId,
        is_published: false, // Don't publish test articles
      };

      const { data, error } = await supabase
        .from('articles')
        .insert(testArticle)
        .select('id, title, author_id')
        .single();

      if (data) {
        // Clean up test article
        await supabase.from('articles').delete().eq('id', (data as any).id);
      }

      return { success: !!data, data, error: error?.message };
    } catch (error) {
      return { success: false, data: null, error: 'Failed to test article insertion' };
    }
  },

  // Check database relationship
  async testArticleAuthorRelationship(userId: string) {
    try {
      // Try to fetch articles with author relationship
      const { data, error } = await supabase
        .from('articles')
        .select(`
          id,
          title,
          users!articles_author_id_fkey(id, full_name)
        `)
        .eq('author_id', userId)
        .limit(1);

      return { success: !error, data, error: error?.message };
    } catch (error) {
      return { success: false, data: null, error: 'Failed to test relationship' };
    }
  },

  // Run all checks
  async runDiagnostics(userId: string) {
    console.log('🔍 Running database diagnostics...');

    const userCheck = await this.checkUserExists(userId);
    console.log('👤 User check:', userCheck);
    
    const insertionTest = await this.testArticleInsertion(userId);
    console.log('📝 Insertion test:', insertionTest);
    
    const relationshipTest = await this.testArticleAuthorRelationship(userId);
    console.log('🔗 Relationship test:', relationshipTest);

    const allPassed = userCheck.exists && insertionTest.success && relationshipTest.success;

    return {
      allPassed,
      userCheck,
      insertionTest,
      relationshipTest
    };
  }
};

// Export functions that database-status component expects
export async function checkDatabaseSetup(): Promise<DatabaseStatus> {
  try {
    // Get current user from Supabase auth
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      // Return minimal status for unauthenticated users
      return {
        isSetup: false,
        userCheck: { exists: false, data: null, error: 'No authenticated user' },
        insertionTest: { success: false, data: null, error: 'No authenticated user' },
        relationshipTest: { success: false, data: null, error: 'No authenticated user' },
        allPassed: false
      };
    }

    const diagnostics = await databaseChecker.runDiagnostics(user.id);
    
    return {
      isSetup: diagnostics.allPassed,
      userCheck: diagnostics.userCheck,
      insertionTest: diagnostics.insertionTest,
      relationshipTest: diagnostics.relationshipTest,
      allPassed: diagnostics.allPassed
    };
  } catch (error) {
    console.error('Database setup check failed:', error);
    return {
      isSetup: false,
      userCheck: { exists: false, data: null, error: 'Check failed' },
      insertionTest: { success: false, data: null, error: 'Check failed' },
      relationshipTest: { success: false, data: null, error: 'Check failed' },
      allPassed: false
    };
  }
}

export function getSetupInstructions(): string[] {
  return [
    '1. Create Supabase project and get your URL and anon key',
    '2. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to .env.local',
    '3. Run the database schema: Execute database/schema.sql in your Supabase SQL editor',
    '4. Set up RLS policies: Execute database/rls-policies.sql',
    '5. Configure storage policies: Execute database/storage-policies.sql',
    '6. Create your user account through the signup page',
    '7. Verify setup by checking database status'
  ];
} 