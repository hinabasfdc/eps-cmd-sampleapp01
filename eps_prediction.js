/*
* Einstein Prediciton Builder コマンドラインサンプルプログラム
* Usage: $ node ./eps_prediction.js [アカウントID] [KEYファイル名] [機能種別] [モデルID] [ファイル名|フォルダ名|テキスト]
* 機能種別: IMAGECLASSIFICATION | OBJECTDETECTION | SENTIMENT | INTENT
*/
var eps = require('./lib/eps_helper.js');
var fs = require('fs');

//コマンドラインから引数を読み込み変数に格納
var EPS_ACCOUNT_ID = process.argv[2];
var EPS_PRIVATE_KEY_FILENAME = process.argv[3];
var EPS_PREDICTION_TYPE = process.argv[4];
var EPS_MODEL_ID = process.argv[5];
var EPS_DATA = process.argv[6];

//PRIVATE KEYを格納したファイルの読み込み
fs.readFile(EPS_PRIVATE_KEY_FILENAME, function (err, EPS_PRIVATE_KEY) {
  if (err) throw err;

  //実行機能種別が ImageClassification か ObjectDetection の場合
  if (EPS_PREDICTION_TYPE == 'IMAGECLASSIFICATION' || EPS_PREDICTION_TYPE == 'OBJECTDETECTION') {
    
    //引数がファイルの場合
    if (fs.existsSync(EPS_DATA) && fs.statSync(EPS_DATA).isFile()) {
      fs.readFile(EPS_DATA, 'base64', function (err, base64img) {
        if (err) throw err;

        var output = '"' + EPS_DATA.replace(/"/g, '""') + '",';
        eps.getPrediction(EPS_ACCOUNT_ID, EPS_PRIVATE_KEY, EPS_PREDICTION_TYPE, EPS_MODEL_ID, base64img, function (err, body) {
          if (!err) {
            console.log(makeCsvLine(output, body));
          } else {
            console.log(makeCsvLine(output, err));
          }
        });
      });

  //引数がディレクトリの場合
  } else if (fs.existsSync(EPS_DATA) && fs.statSync(EPS_DATA).isDirectory()) {
      fs.readdir(EPS_DATA, function (err, files) {
        if (err) throw err;

        //読み込むファイルを拡張子がjpg|JPG|png|PNG|jpegに限定 
        files.filter(function (file) {
          return fs.statSync(EPS_DATA + file).isFile() && /.*\.(jpg|JPG|png|PNG|jpeg)$/.test(file);
        }).forEach(file => {
          fs.readFile(EPS_DATA + file, 'base64', function (err, base64img) {
            if (err) throw err;

            var output = '"' + file + '",';
            eps.getPrediction(EPS_ACCOUNT_ID, EPS_PRIVATE_KEY, EPS_PREDICTION_TYPE, EPS_MODEL_ID, base64img, function (err, body) {
              if (!err) {
                console.log(makeCsvLine(output, body));
              } else {
                console.log(makeCsvLine(output, err));
              }
            });
          });
        });
      });
    }

  //実行機能種別が Language の Sentiment か Intent の場合
} else if (EPS_PREDICTION_TYPE == 'SENTIMENT' || EPS_PREDICTION_TYPE == 'INTENT') {
    var output = '"' + EPS_DATA.replace(/"/g, '""') + '",';
    eps.getPrediction(EPS_ACCOUNT_ID, EPS_PRIVATE_KEY, EPS_PREDICTION_TYPE, EPS_MODEL_ID, EPS_DATA, function (err, body) {
      if (!err) {
        console.log(makeCsvLine(output, body));
      } else {
        console.log(makeCsvLine(output, err));
      }
    });
  }
});

//CSV形式の行を生成
function makeCsvLine(output, body) {
  var j = JSON.parse(body);
  if (j.probabilities) {
    output += '"' + j.probabilities[0].label + '","' + j.probabilities[0].probability + '","' + body.replace(/"/g, '""') + '"';
  } else {
    output += ',,"' + body.replace(/"/g, '""') + '"';
  }
  return output;
}