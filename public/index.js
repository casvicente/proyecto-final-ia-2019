//import { testEpsilon } from "@tensorflow/tfjs-core/dist/test_util";

//import { disposeVariables } from "@tensorflow/tfjs";
//const fs = require('webcam.js');


let labels = ['Vicente', 'Sebastian', 'Paulo', 'Maximiliano'];

function printClassifier(classifier) {
    let html = "<ul>"
    classifier.classes.forEach(
        clase => {
            html += `<li> Clase: ${clase.score} - ${clase.class}</li>`
        });
    html += '</ul>';
    return html;
}

function indexOfMax(arr) {
    if (arr.length === 0) {
        return -1;
    }
    var max = 0;
    var maxIndex = 0;
    for (var i = 1; i < arr.length; i++) {
        if (arr[i][1] > max) {
            maxIndex = arr[i][0];
            max = arr[i][1];
        }
    }
    return maxIndex;
}



function take_snapshot_tf() {
    let formData = new FormData();
    let result;
        Webcam.snap(function (data_uri) {
            //document.getElementById('my_result').innerHTML = '<img src="' + data_uri + '"/>';

            Webcam.upload( data_uri, '/api/v1/classify/detect', function(code, text) {
                console.log("Upload complete");
                console.log(code);
                console.log(text);
                
                let response = JSON.parse(text)
                document.getElementById('my_result').innerHTML = 'Marca de: ' + labels[response.max]
                result = response;
            });

        });
    return result;   
}


function take_snapshot() {
    let result;
     Webcam.snap(function (data_uri) {
         //document.getElementById('my_result').innerHTML = '<img src="' + data_uri + '"/>';

         Webcam.upload( data_uri, '/api/v1/classify/image', function(code, text) {
             console.log("Upload complete");
             console.log(code);
             console.log(text);
             let response = JSON.parse(text)
            console.log(response);
            // document.getElementById('my_result').innerHTML = 'Marca de: ' + labels[response.max]
            result = response;
         } );
     });
     return result;
}
 

function take_snapshot_multi() {
    let result = {
        tf: {},
        wvr: {},
    }
     Webcam.snap(function (data_uri) {
         //document.getElementById('my_result').innerHTML = '<img src="' + data_uri + '"/>';

         Webcam.upload( data_uri, '/api/v1/classify/image', function(code, text) {
             console.log("Upload complete");
             console.log(code);
             console.log(text);
             let response = JSON.parse(text)
            console.log(response);
            // document.getElementById('my_result').innerHTML = 'Marca de: ' + labels[response.max]
            result.wvr = response;
         } );


         Webcam.upload( data_uri, '/api/v1/classify/detect', function(code, text) {
            console.log("Upload complete");
            console.log(code);
            console.log(text);
            
            let response = JSON.parse(text)
            document.getElementById('my_result').innerHTML = 'Marca de: ' + labels[response.max]
            result.tf = response;
        });
     });
     return result;
}

function registrarse() {
    result = take_snapshot_multi();
    console.log(result);
}