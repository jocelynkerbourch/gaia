var AWS = require('aws-sdk');

exports.handler = function(event, context, callback) {
    setTips (event, callback);
}
 
function setTips (event, callback) {

    var uniqid = (new Date().getTime() + Math.floor((Math.random()*10000)+1)).toString(16);
    var title = getParameter(event,"title");
    var text = getParameter(event,"text");
    var image = getParameter(event,"image");
    var type = getParameter(event,"type");

    var items = {
            "id": uniqid,
            "title": title,
            "text": text,
            "image": image,
            "type": type
        };
    var params = {
        TableName:"gaia_tips",
        Item:items
    };

    putItem(params, getMessage, callback);
}

function putItem(params, getMessage, callback) {
    if(
        params.Item.title!=null &&
        params.Item.text!=null &&
        params.Item.image!=null &&
        params.Item.type!=null &&
        (
            params.Item.type=="mind" ||
            params.Item.type=="eat" ||
            params.Item.type=="move" ||
            params.Item.type=="sleep"
        )
    ){
        var documentClient = new AWS.DynamoDB.DocumentClient();
        documentClient.put(params, function(err, data) {
            var status = "insert";
            if (err) {
                status = "error";
            }

            var result = getMessage(status,params.Item);
            callback(null, result);
        });
    }else{
        var result = getMessage('error',params.Item);
        callback(null, result);
    }
}

function getMessage(status,infos){
    var body = {"status": status, infos};
    var statusCode = 200;
    return {
        "statusCode": statusCode,
        "headers": {},
        "body": JSON.stringify(body)
    };
}

function getParameter(event,param) {
    var val = null;
    if (event.queryStringParameters !== null && event.queryStringParameters !== undefined) {
        if (event.queryStringParameters[param] !== undefined && 
            event.queryStringParameters[param] !== null && 
            event.queryStringParameters[param] !== "") {
            val = event.queryStringParameters[param] ;
        }
    }
    return val;
}

