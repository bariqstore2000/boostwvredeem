const axios = require('axios');

// دخول التوكن السيرفر
async function joinServer(token, invite) {
  try {
    await axios.post(`https://discord.com/api/v9/invites/${invite}`, {}, {
      headers: {
        Authorization: token
      }
    });
    console.log(`✅ Joined: ${token.slice(0, 25)}...`);
  } catch (err) {
    console.log(`❌ Failed Join: ${token.slice(0, 25)}...`);
  }
}

// ضرب البوستات (بسيط بدون IDs)
async function boostServer(token) {
  try {
    await axios.put(`https://discord.com/api/v9/users/@me/guilds/premium/subscriptions`, {
      user_premium_guild_subscription_slot_ids: []
    }, {
      headers: {
        Authorization: token
      }
    });
    console.log(`🚀 Boosted: ${token.slice(0, 25)}...`);
  } catch (err) {
    console.log(`⚠️ Failed Boost: ${token.slice(0, 25)}...`);
  }
}

// دالة رئيسية
async function redeem(invite, tokens) {
  const code = invite.split('/').pop();
  for (const token of tokens) {
    await joinServer(token, code);
    await new Promise(r => setTimeout(r, 2000)); // تأخير بسيط
    await boostServer(token);
  }
}

module.exports = redeem;
