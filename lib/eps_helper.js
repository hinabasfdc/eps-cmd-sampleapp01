/*
* Einstein Prediciton Builder ヘルパープログラム
* Usage: var eps = require('./lib/eps_helper.js');
*/

var http = require('http');
var jwt = require('jsonwebtoken');
var request = require('request');

var EPS_URL_BASE = 'https://api.einstein.ai/v2';
var EPS_URLS = {
  "oauth": EPS_URL_BASE + '/oauth2/token',
  "imageclassification": EPS_URL_BASE + '/vision/predict',
  "objectdetection": EPS_URL_BASE + '/vision/detect',
  "sentiment": EPS_URL_BASE + '/language/sentiment',
  "intent": EPS_URL_BASE + '/language/intent'
};
var EPS_DEFAULT_EXPIRE_TIME = 60;

exports.getPrediction = function (eps_account_id, eps_private_key, eps_prediction_type, eps_model_id, eps_data, cb) {

  var m;
  if (!eps_account_id) m = JSON.stringify('{"message":"No Einstein Platform Services Account ID."}');
  if (!eps_private_key) m = JSON.stringify('{"message":"No Einstein Platform Services Private Key."}');
  if (!eps_prediction_type) m = JSON.stringify('{"message":"No Einstein Platform Services Private Key."}');
  if (!eps_model_id) m = JSON.stringify('{"message":"No Einstein Platform Services Private Key."}');
  if (!eps_data) m = JSON.stringify('{"message":"No Data"}');
  if (!cb) m = JSON.stringify('{"message":"No Callback Function"}');
  if (m) {
    console.log('DEBUG: ' + m);
    cb(m);
    return;
  }

  var rsa_payload = {
    "sub": eps_account_id,
    "aud": EPS_URLS.oauth
  }

  var rsa_options = {
    "header": {
      "alg": "RS256",
      "typ": "JWT"
    },
    "expiresIn": EPS_DEFAULT_EXPIRE_TIME
  }

  var assertion = jwt.sign(rsa_payload, eps_private_key, rsa_options);
  var http_request_options = {
    "url": EPS_URLS.oauth,
    "headers": {
      "Content-Type": "application/x-www-form-urlencoded",
      "accept": "application/json"
    },
    "body": `grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=${encodeURIComponent(assertion)}`
  }

  request.post(http_request_options, function (err, res, body) {
    if (err) throw err;

    var o = JSON.parse(body);
    if (o.access_token) {

      if (eps_prediction_type == 'IMAGECLASSIFICATION' || eps_prediction_type == 'OBJECTDETECTION') {

        var url = (eps_prediction_type == 'IMAGECLASSIFICATION') ? EPS_URLS.imageclassification : EPS_URLS.objectdetection;
        var formData = {
          "modelId": eps_model_id,
          "sampleBase64Content": eps_data
        }

        var http_request_options = {
          "url": url,
          "headers": {
            "Authorization": "Bearer " + o.access_token,
            "Cache-Control": "no-cache",
            "Content-Type": "multipart/form-data"
          },
          "formData": formData
        }

        request.post(http_request_options, function (err, res, body) {
          cb(err, body);
        });

      } else if (eps_prediction_type == 'SENTIMENT' || eps_prediction_type == 'INTENT') {

        var url = (eps_prediction_type == 'SENTIMENT') ? EPS_URLS.sentiment : EPS_URLS.intent;
        var json = {
          "modelId": eps_model_id,
          "document": eps_data
        };
        var http_request_options = {
          "url": url,
          "headers": {
            "Authorization": "Bearer " + o.access_token,
            "Cache-Control": "no-cache",
            "Content-Type": "application/json"
          },
          "body": JSON.stringify(json)
        };
        request.post(http_request_options, function (err, res, body) {
          cb(err, body);
        });
      }

    } else {
      console.log(body);
      cb(body);
    }
  });
}