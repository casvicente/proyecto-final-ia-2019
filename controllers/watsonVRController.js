const fs = require('fs');
const VisualRecognitionV3 = require('ibm-watson/visual-recognition/v3');
const { IamAuthenticator } = require('ibm-watson/auth');
console.log(process.env)
const visualRecognition = new VisualRecognitionV3({
    version: process.env.WATSON_VR_VERSION,
    authenticator: new IamAuthenticator({
        apikey: process.env.WATSON_VR_API_KEY
    }),
    url: process.env.WATSON_VR_URL,
});

function maxClass (classes) {
    let maxClass = 'unknown';
    let maxScore = -1.0;
    for (let index = 0; index < classes.length; index++) {
      let element = classes[index];
      if (element.score > maxScore) {
          maxScore = element.score;
          maxClass = element.class;
      }
    }
    return maxClass;
}

function classToInt(clase) {
  switch (clase) {
    case 'Vicente100.zip':
        return 0;
    case 'Seba100.zip':
        return 1;
    case 'Paulo100.zip':
        return 2;
    case 'Maxi100.zip':
        return 3
    default:
      break;
  }
}
let classifyImage = async (req, res) => {
        let files = req.files;
        
        const classifyParams = {
            imagesFile: fs.createReadStream(files.webcam.path),
           owners: [process.env.WATSON_VR_CLASSIFY_OWNER],
            classifier_ids:[process.env.WATSON_VR_CLASSIFIER_ID],
            threshold: process.env.WATSON_VR_CLASSIFY_THRESHOLD,

          };
          
          visualRecognition.classify(classifyParams)
            .then(response => {
              const classifiedImages = response.result;
              console.log(JSON.stringify(classifiedImages, null, 2));
              predict = [0,0,0,0];
              let classes = response.result.images[0].classifiers[0].classes;
              for (let index = 0; index < classes.length; index++) {
                const element = classes[index];
                i = classToInt(element.class);
                predict[i] = element.score;
              }
              res.send({
                predict: predict,
                raw: response.result,
                max: classToInt(maxClass(classes))
              });
            })
            .catch(err => {
              console.log('error:', err);
            });
}


module.exports = {
    classifyImage,
}