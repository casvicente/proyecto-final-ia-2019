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
        if (arr[i] > max) {
            maxIndex = i;
            max = arr[i];
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
 

function take_snapshot_multi(callback) {
    Webcam.off('uploadComplete')
    let result = {
        tf: {},
        wvr: {},
    }
    let cantUploads = 0;
     Webcam.snap(function (data_uri) {
         //document.getElementById('my_result').innerHTML = '<img src="' + data_uri + '"/>';

         Webcam.upload( data_uri, '/api/v1/classify/image', function(code, text) {
             console.log("Upload complete");
             console.log(code);
             console.log(text);
             let response = JSON.parse(text)
            console.log(response);
            document.getElementById('infoWvr').value = JSON.stringify(response.raw, null, 2);
            result.wvr = response;
         } );


         Webcam.upload( data_uri, '/api/v1/classify/detect', function(code, text) {
            console.log("Upload complete");
            console.log(code);
            console.log(text);
            
            let response = JSON.parse(text)
            document.getElementById('infoTf').value = JSON.stringify(response.raw, null, 2);
            result.tf = response;
        });

        Webcam.on( 'uploadComplete', function(code, text) {
            cantUploads = cantUploads +1;
            console.log("CANT UPLOADS" + cantUploads);
            if (cantUploads == 2) {
               callback(result)
            }
		} );
		
     });
}

function registrarse() {
    result = take_snapshot_multi((result) => {
        console.log(result);
        let tfPredict = result.tf.predict;
        let wvrPredict = result.wvr.predict;
        let suma = [];
        for (let index = 0; index < tfPredict.length; index++) {
           suma.push(tfPredict[index] + wvrPredict[index]);
        }
        console.log(suma);
        let indiceMax = indexOfMax(suma);
        console.log('INDICE MAX' + indiceMax)
        var newcontent = document.createElement('li');
        newcontent.setAttribute('class', 'list-group-item');
        newcontent.innerHTML = (new Date()).toLocaleDateString('es-UY') + ' ' + (new Date()).toLocaleTimeString('es-UY') + ' <br>' +
        'Marca de (tensorflow): ' + labels[result.tf.max] + '<br>'
        + 'Marca de (watson): ' + labels[result.wvr.max];
        document.getElementById('my_result').appendChild(newcontent);
    });
    console.log(result);
}