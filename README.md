# eps-cmd-sampleapp01
## インストール手順
    $ mkdir eps-cmd-sampleapp01
    $ cd eps-cmd-sampleapp01
    $ git clone https://github.com/hinabasfdc/eps-cmd-sampleapp01.git
    $ npm install
## 事前準備
- Einstein Platform Services のアカウントを取得 (https://api.einstein.ai/signup)
- Key 情報を einstein_platform.pem として、上記インストールフォルダに配置
## 実行手順
    $ node ./eps_prediction.js [アカウントID] [Keyファイル] [機能種別] [モデルID] [テキスト|画像ファイル名|ディレクトリ名]

    実行コマンド例
    $ node ./eps_prediction.js einstein@example.com einstein_platform.pem IMAGECLASSIFICATION GeneralImageClassifier ./image01.jpg
    $ node ./eps_prediction.js einstein@example.com einstein_platform.pem IMAGECLASSIFICATION GeneralImageClassifier ./testimages
    $ node ./eps_prediction.js einstein@example.com einstein_platform.pem SENTIMENT CommunitySentiment "the presentation was great and I learned a lot"

- 機能種別
  - IMAGECLASSIFICATION
  - OBJECTDETECTION
  - SENTIMENT
  - INTENT
## 出力結果
- フォーマット(画像): "ファイル名","最も確率が高いラベル","確率","返り値全文"
- コマンドの出力をリダイレクトさせることで、CSV形式のファイルを作成可能
## 出力結果例
    "image01.jpg","window shade","0.29381847","{""probabilities"":[{""label"":""window shade"",""probability"":0.29381847},{""label"":""planetarium"",""probability"":0.108530216},{""label"":""obelisk"",""probability"":0.076751806},{""label"":""window screen"",""probability"":0.06482558},{""label"":""flagpole, flagstaff"",""probability"":0.0583598}],""object"":""predictresponse""}"
    "image02.jpg","studio couch, day bed","0.72092235","{""probabilities"":[{""label"":""studio couch, day bed"",""probability"":0.72092235},{""label"":""cradle"",""probability"":0.15921988},{""label"":""dining table, board"",""probability"":0.025897386},{""label"":""crib, cot"",""probability"":0.024748603},{""label"":""four-poster"",""probability"":0.020135025}],""object"":""predictresponse""}"
## 免責事項
このサンプルコードは、あくまで機能利用の1例を示すためのものであり、コードの書き方や特定ライブラリの利用を推奨したり、機能提供を保証するものではありません。