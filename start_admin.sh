#!/bin/bash
cd /root/liberty/admin
export PORT=3001
nohup npm start > /root/liberty/admin/admin.log 2>&1 &
echo "Админка запущена на порту 3001, PID: $!"
