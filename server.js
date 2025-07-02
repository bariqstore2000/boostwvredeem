const express = require('express');
const fs = require('fs');
const path = require('path');
const redeemTokens = require('./boost');
const app = express();

app.use(express.json());
app.use(express.static('public'));

const ADMIN_PASSWORD = '12345'; // غيرها لو حبيت
const codesFile = 'codes.json';
const tokensFolder = 'tokens';

function generateCode() {
  return Math.random().toString(36).substring(2, 10).toUpperCase();
}

// توليد كود من الأدمن
app.post('/generate', (req, res) => {
  const { password, filename } = req.body;
  if (password !== ADMIN_PASSWORD) {
    return res.json({ message: '❌ Wrong admin password.' });
  }

  const filePath = path.join(__dirname, tokensFolder, filename);
  if (!fs.existsSync(filePath)) {
    return res.json({ message: '❌ Tokens file not found.' });
  }

  const tokens = fs.readFileSync(filePath, 'utf-8').split(/\r?\n/).filter(Boolean);
  if (tokens.length < 7) {
    return res.json({ message: '❌ At least 7 tokens required.' });
  }

  const code = generateCode();
  const codes = fs.existsSync(codesFile) ? JSON.parse(fs.readFileSync(codesFile)) : {};
  codes[code] = tokens.slice(0, 7);
  fs.writeFileSync(codesFile, JSON.stringify(codes, null, 2));

  res.json({ message: `✅ Code generated: ${code}` });
});

// تفعيل الكود
app.post('/redeem', (req, res) => {
  const { code, invite } = req.body;
  if (!code || !invite) return res.json({ message: '❌ Code and invite required.' });

  if (!fs.existsSync(codesFile)) return res.json({ message: '❌ No codes available.' });

  const codes = JSON.parse(fs.readFileSync(codesFile));
  const tokens = codes[code];

  if (!tokens) return res.json({ message: '❌ Invalid or expired code.' });

  // تنفيذ العملية
  redeemTokens(invite, tokens);

  // حذف الكود بعد الاستخدام
  delete codes[code];
  fs.writeFileSync(codesFile, JSON.stringify(codes, null, 2));

  res.json({ message: `✅ Code redeemed. Boosts in progress for ${invite}` });
});

// تشغيل السيرفر
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Boosts Wave running on port ${PORT}`));
