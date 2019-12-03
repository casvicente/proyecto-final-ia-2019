//import { testEpsilon } from "@tensorflow/tfjs-core/dist/test_util";

//import { disposeVariables } from "@tensorflow/tfjs";
//const fs = require('webcam.js');

Webcam.attach('#my_camera');
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


        Webcam.snap(function (data_uri) {
            document.getElementById('my_result').innerHTML = '<img src="' + data_uri + '"/>';

            Webcam.upload( data_uri, '/api/v1/classify/detect', function(code, text) {
                console.log("Upload complete");
                console.log(code);
                console.log(text);
                
                let response = JSON.parse(text)
              
                var json_data = response;
                var result = [];
                for(var i in json_data)
                    result.push([i, json_data [i]]);
    
                console.log(result);

                let max = indexOfMax(result)
                console.log(labels[max])


                //document.getElementById('resultado').innerHTML = '<div id="res"> El Resultado es: </div>';
                // <div id="my_result"> ' + labels[max] + ' </div>
            });

    
               /* divRespuesta.innerHTML = `
                    <h2>Resultados</h2>
                    <br/>
                    <br/>
                    <h3>Modelo Custom</h3>
                    ${customClassifierHtml}
                    <h3>Modelo Default</h3>
                    ${defaultClassifierHtml}
                    ` ;
                    return customClassifier.classes[0].class;
            })
            .then(clazz => {
                console.log('JJJJJJ')
                buscarDiscovery(clazz)
            })
            .catch(error => console.error('Error:', error))*/
        });


        
}
