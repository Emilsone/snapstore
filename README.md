

## Setup

**Requirements:** Node.js 18+, Google Chrome installed

```bash
# 1. Install dependencies
npm install

# 2. Copy and fill in your credentials
cp .env.example .env.local

# 3. Terminal 1 — web app
npm run dev

# 4. Terminal 2 — scheduler
node scheduler.js
```

Open http://localhost:3000



## Deploying to Railway

1. Push to GitHub
2. New Project → Deploy from GitHub repo
3. Add environment variables in Railway dashboard
4. Add volumes: `/app/data` and `/app/public/screenshots`

---
