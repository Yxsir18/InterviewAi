const axios = require('axios');

const API_URL = 'http://localhost:3001';

async function testGamification() {
  try {
    console.log('🧪 Testing Gamification System...\n');

    // Step 1: Login
    console.log('1️⃣ Logging in...');
    const loginResponse = await axios.post(`${API_URL}/api/auth/login`, {
      email: 'khanyasirraza1@gmail.com',
      password: '12345678'
    });
    
    const token = loginResponse.data.data.accessToken;
    console.log('✅ Login successful');
    
    if (!token) {
      throw new Error('Token not found in login response');
    }
    console.log(`Token: ${token.substring(0, 20)}...\n`);

    const headers = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };

    // Step 2: Get gamification profile
    console.log('2️⃣ Getting gamification profile...');
    const profileResponse = await axios.get(`${API_URL}/api/gamification/profile`, { headers });
    console.log('✅ Profile fetched');
    console.log(`Level: ${profileResponse.data.data.level}`);
    console.log(`XP: ${profileResponse.data.data.xp}/${profileResponse.data.data.xpToNextLevel}`);
    console.log(`Streak: ${profileResponse.data.data.streak.current} days`);
    console.log(`Career Rank: ${profileResponse.data.data.careerRank}\n`);

    // Step 3: Trigger login event (streak update)
    console.log('3️⃣ Triggering login event...');
    const loginEventResponse = await axios.post(`${API_URL}/api/gamification/event`, 
      { eventType: 'login', eventData: {} },
      { headers }
    );
    console.log('✅ Login event processed');
    console.log(`Notifications: ${loginEventResponse.data.data.notifications.length}\n`);

    // Step 4: Simulate interview completion
    console.log('4️⃣ Simulating interview completion...');
    const interviewResponse = await axios.post(`${API_URL}/api/gamification/event`,
      { 
        eventType: 'interview_completed', 
        eventData: { score: 85, interviewType: 'conversational' }
      },
      { headers }
    );
    console.log('✅ Interview completion processed');
    console.log(`Notifications: ${interviewResponse.data.data.notifications.length}`);
    interviewResponse.data.data.notifications.forEach(notif => {
      console.log(`  - ${notif.type}: ${notif.message}`);
    });
    console.log();

    // Step 5: Get updated profile
    console.log('5️⃣ Getting updated profile...');
    const updatedProfileResponse = await axios.get(`${API_URL}/api/gamification/profile`, { headers });
    console.log('✅ Updated profile fetched');
    console.log(`Level: ${updatedProfileResponse.data.data.level}`);
    console.log(`XP: ${updatedProfileResponse.data.data.xp}/${updatedProfileResponse.data.data.xpToNextLevel}`);
    console.log(`Total XP: ${updatedProfileResponse.data.data.totalXP}`);
    console.log(`Streak: ${updatedProfileResponse.data.data.streak.current} days`);
    console.log(`Career Rank: ${updatedProfileResponse.data.data.careerRank}\n`);

    // Step 6: Check badges
    console.log('6️⃣ Checking badges...');
    const badges = updatedProfileResponse.data.data.badges;
    const unlockedBadges = badges.filter(b => b.unlockedAt);
    console.log(`Total badges: ${badges.length}`);
    console.log(`Unlocked badges: ${unlockedBadges.length}`);
    unlockedBadges.forEach(badge => {
      console.log(`  - ${badge.name}: ${badge.description}`);
    });
    console.log();

    // Step 7: Check challenges
    console.log('7️⃣ Checking challenges...');
    const activeChallenges = updatedProfileResponse.data.data.activeChallenges;
    console.log(`Active challenges: ${activeChallenges.length}`);
    activeChallenges.forEach(challenge => {
      console.log(`  - ${challenge.title}: ${challenge.progress}/${challenge.target} (${challenge.type})`);
    });
    console.log();

    // Step 8: Check achievements
    console.log('8️⃣ Checking achievements...');
    const achievements = updatedProfileResponse.data.data.achievements;
    const unlockedAchievements = achievements.filter(a => a.unlockedAt);
    console.log(`Total achievements: ${achievements.length}`);
    console.log(`Unlocked achievements: ${unlockedAchievements.length}`);
    unlockedAchievements.forEach(achievement => {
      console.log(`  - ${achievement.name}: ${achievement.description}`);
    });
    console.log();

    // Step 9: Check rewards
    console.log('9️⃣ Checking rewards...');
    const rewards = updatedProfileResponse.data.data.rewards;
    const unlockedRewards = rewards.filter(r => r.unlocked);
    console.log(`Total rewards: ${rewards.length}`);
    console.log(`Unlocked rewards: ${unlockedRewards.length}`);
    unlockedRewards.forEach(reward => {
      console.log(`  - ${reward.name}: ${reward.description}`);
    });
    console.log();

    console.log('🎉 Gamification system test completed successfully!');

  } catch (error) {
    console.error('❌ Error testing gamification system:');
    if (error.response) {
      console.error(`Status: ${error.response.status}`);
      console.error(`Data: ${JSON.stringify(error.response.data, null, 2)}`);
    } else {
      console.error(error.message);
    }
  }
}

testGamification();
