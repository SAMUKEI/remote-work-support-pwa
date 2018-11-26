# はじめに

Face Detection API活用したPWA appです

### 事前準備

１. Chromeブラウザで以下URLを開きます。
```
chrome://flags/#enable-experimental-web-platform-features
```

２. 開いたら以下画面が表示されます。

「Experimental Web Platform features」をEnabledに変更します。
「RELAUNCH NOW」ボタンでChrome再起動すると「Shape Detection API」が使用できるようになります。


### ローカル実行

１． [ウェブサーバーのインストールと確認](https://developers.google.com/web/fundamentals/codelabs/debugging-service-workers/?hl=ja#_7)の設定でローカル実行可能です。

２．[ユーザトークンを取得](https://api.slack.com/custom-integrations/legacy-tokens)

３．localhostのAPIトークンにトークンを設定する。

４．Slackのステータスが在席・離席で変わります。