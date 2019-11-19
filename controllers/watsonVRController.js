const fs = require('fs');
const VisualRecognitionV3 = require('ibm-watson/visual-recognition/v3');
const { IamAuthenticator } = require('ibm-watson/auth');

const visualRecognition = new VisualRecognitionV3({
    version: '2018-03-19',
    authenticator: new IamAuthenticator({
        apikey: 'z9So0JhexqWHtVz_csEKWql0XxVFgKoRtf2G3dlzEom-'
    }),
    url: 'https://gateway.watsonplatform.net/visual-recognition/api',
});








let classifyImage = async (req, res) => {
        let files = req.files;
  
        
        const classifyParams = {
            imagesFile: fs.createReadStream(files.webcam.path),
            owners: ['IBM','me'],
            threshold: 0.6,
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