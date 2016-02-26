ps -ef | grep express_chat.js | grep -v grep | awk '{print $2}' | xargs kill
node express_chat.js > /var/app_root/chat_test/express_new/log/out.log 2> /var/app_root/chat_test/express_new/log/err.log & 

