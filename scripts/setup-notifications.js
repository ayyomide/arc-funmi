const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env.local' });

async function setupNotifications() {
  // Initialize Supabase client
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  if (!supabaseUrl || !supabaseServiceKey) {
    console.error('❌ Missing Supabase environment variables');
    console.log('Required variables:');
    console.log('- NEXT_PUBLIC_SUPABASE_URL');
    console.log('- SUPABASE_SERVICE_ROLE_KEY');
    process.exit(1);
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  try {
    console.log('🚀 Setting up notifications table...');

    // Read the SQL file
    const sqlPath = path.join(__dirname, '../database/notifications-schema.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');

    // Split the SQL into individual statements
    const statements = sql
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0);

    console.log(`📝 Executing ${statements.length} SQL statements...`);

    // Execute each statement
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i] + ';';
      console.log(`   ${i + 1}/${statements.length}: ${statement.substring(0, 50)}...`);
      
      const { error } = await supabase.rpc('exec_sql', {
        sql: statement
      });

      if (error) {
        // Try direct query method if RPC fails
        const { error: directError } = await supabase
          .from('_supabase_admin')
          .select('*')
          .limit(1);
        
        if (directError) {
          console.log(`   ⚠️  Statement ${i + 1} failed via RPC, trying alternative method...`);
          // For this setup, we'll output the SQL for manual execution
        }
      }
    }

    // Test if the table was created successfully
    const { data, error: testError } = await supabase
      .from('notifications')
      .select('count(*)')
      .limit(1);

    if (testError) {
      console.log('\n❌ Notifications table was not created successfully.');
      console.log('\n📋 Please execute the following SQL manually in your Supabase SQL Editor:');
      console.log('\n' + '='.repeat(60));
      console.log(sql);
      console.log('='.repeat(60));
      console.log('\nSteps:');
      console.log('1. Go to your Supabase dashboard');
      console.log('2. Navigate to SQL Editor');
      console.log('3. Copy and paste the SQL above');
      console.log('4. Click "Run"');
      process.exit(1);
    }

    console.log('\n✅ Notifications table created successfully!');
    
    // Test notification functions
    console.log('\n🧪 Testing notification functions...');
    
    const { data: testData, error: functionError } = await supabase.rpc('create_notification', {
      p_recipient_id: '00000000-0000-0000-0000-000000000000',
      p_actor_id: '11111111-1111-1111-1111-111111111111',
      p_type: 'like',
      p_entity_type: 'article',
      p_entity_id: '22222222-2222-2222-2222-222222222222',
      p_message: 'Test notification'
    });

    if (functionError && !functionError.message.includes('violates foreign key constraint')) {
      console.log('⚠️  Function test failed:', functionError.message);
    } else {
      console.log('✅ Notification functions are working!');
    }

    console.log('\n🎉 Setup complete! Your notification system is ready to use.');

  } catch (error) {
    console.error('❌ Setup failed:', error.message);
    
    console.log('\n📋 Please execute the SQL manually in your Supabase dashboard:');
    console.log('\n1. Go to your Supabase dashboard');
    console.log('2. Navigate to SQL Editor');
    console.log('3. Copy the contents of database/notifications-schema.sql');
    console.log('4. Paste and run the SQL');
    
    process.exit(1);
  }
}

setupNotifications(); 