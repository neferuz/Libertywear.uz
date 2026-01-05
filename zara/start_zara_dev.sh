#!/bin/bash
cd /root/liberty/zara

# Kill any existing Next.js processes
pkill -9 -f "next" 2>/dev/null
sleep 2

# Kill process on port 3000
lsof -ti:3000 | xargs kill -9 2>/dev/null
sleep 1

# Start dev server
nohup npm run dev > /root/liberty/zara/frontend.log 2>&1 &
echo "✅ Next.js dev server starting..."
echo "📝 Logs: /root/liberty/zara/frontend.log"
echo "🌐 URL: http://localhost:3000"
