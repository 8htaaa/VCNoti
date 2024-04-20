# VCNoti

VCNotiはVCの入退を通知するDiscordBotです
オープンソースで誰でもbotを使用することができます(サーバーが必要です)

※JS初心者が作ったのでくそコードです。動くので許してください

#　botの構築

DiscordDeveloperPortalに登録し、botを作成、トークンを取得してください。(方法は割愛します。調べてください)

1.このリポジトリをダウンロードしてください

2.VSCodeとかで開いて以下を実行してください

npm init -y
npm install discord.js
npm install keyv
npm install @keyv/sqlite

3.config.jsonにトークンを入力してください。

4.起動します
node deploy-commands.js

5.起動します
node index.js

上手く動作しなかったらごめんなさい
苦情は受け付けていません笑
