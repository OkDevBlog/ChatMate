#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const readline = require('readline');
const { execSync } = require('child_process');
const os = require('os');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('🤖 ChatMate Setup Assistant\n');

// Check if we're on macOS and have CocoaPods for iOS development
const isMac = os.platform() === 'darwin';
const hasCocoaPods = (() => {
  try {
    execSync('pod --version', { stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
})();

const questions = [
  {
    key: 'SUPABASE_URL',
    question: 'Enter your Supabase URL (https://your-project.supabase.co): ',
    validate: (value) => value.startsWith('https://') && value.includes('supabase.co')
  },
  {
    key: 'SUPABASE_ANON_KEY',
    question: 'Enter your Supabase Anon Key: ',
    validate: (value) => value.length > 50
  },
  {
    key: 'OPENAI_API_KEY',
    question: 'Enter your OpenAI API Key (sk-...): ',
    validate: (value) => value.startsWith('sk-')
  }
];

async function askQuestion(question) {
  return new Promise((resolve) => {
    rl.question(question.question, (answer) => {
      if (question.validate && !question.validate(answer)) {
        console.log('❌ Invalid input. Please try again.');
        resolve(askQuestion(question));
      } else {
        resolve(answer);
      }
    });
  });
}

async function main() {
  const answers = {};
  
  for (const question of questions) {
    answers[question.key] = await askQuestion(question);
  }
  
  // Read the current env.ts file
  const envPath = path.join(__dirname, '../src/config/env.ts');
  let envContent = fs.readFileSync(envPath, 'utf8');
  
  // Replace the placeholder values
  Object.keys(answers).forEach(key => {
    const regex = new RegExp(`${key}: '[^']*'`, 'g');
    envContent = envContent.replace(regex, `${key}: '${answers[key]}'`);
  });
  
  // Write the updated file
  fs.writeFileSync(envPath, envContent);
  
  console.log('\n✅ Configuration updated successfully!');
  
  // Try to install iOS pods if on macOS
  if (isMac && hasCocoaPods) {
    console.log('\n📱 Installing iOS dependencies...');
    try {
      execSync('cd ios && pod install', { stdio: 'inherit' });
      console.log('✅ iOS dependencies installed successfully!');
    } catch (error) {
      console.log('⚠️  iOS pod install failed. You can run it manually later: cd ios && pod install');
    }
  } else if (isMac && !hasCocoaPods) {
    console.log('\n⚠️  CocoaPods not found. Install it for iOS development: sudo gem install cocoapods');
  } else {
    console.log('\n📱 iOS development requires macOS. You can develop for Android on this platform.');
  }
  
  console.log('\nNext steps:');
  console.log('1. Set up your Supabase database by running the SQL in supabase-schema.sql');
  console.log('2. Configure permissions in android/app/src/main/AndroidManifest.xml');
  if (isMac) {
    console.log('3. Configure permissions in ios/ChatMate/Info.plist');
    console.log('4. Run: npm run android or npm run ios');
  } else {
    console.log('3. Run: npm run android (iOS requires macOS)');
  }
  
  rl.close();
}

main().catch(console.error);