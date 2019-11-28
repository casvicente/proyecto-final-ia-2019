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

let classifyImage = async (req, res) => {
        let files = req.files;
  
        
        const classifyParams = {
            imagesFile: fs.createReadStream(files.webcam.path),
           // owners: [process.env.WATSON_VR_CLASSIFY_OWNER],
            classifier_ids:[process.env.WATSON_VR_CLASSIFIER_ID],
            threshold: process.env.WATSON_VR_CLASSIFY_THRESHOLD,

          };
          
          visualRecognition.classify(classifyParams)
            .then(response => {
              const classifiedImages = response.result;
              console.log(JSON.stringify(classifiedImages, null, 2));
              res.send(response);
            })
            .catch(err => {
              console.log('error:', err);
            });
}


module.exports = {
    classifyImage,
}