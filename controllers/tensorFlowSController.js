const tf = require('@tensorflow/tfjs-node');
const fs = require('fs');
const sharp = require('sharp')

async function readImage(path) {
    const imageBuffer = fs.readFileSync(path);
    imageBufferResized = await sharp(imageBuffer).resize(100,100).toBuffer()
    /* Para probar como recorta
    imageBufferResizedToFile = await sharp(imageBuffer).resize(100,100).toFile('output.jpg', function(err) {return;}
    */
    const tfimage = tf.node.decodeImage(imageBufferResized);
    return tfimage;
}

let detect = async (req, res) => {
    let files = req.files;

    let labels = ['Vicente', 'Sebastian', 'Paulo', 'Maximiliano'];
    let model = await tf.loadLayersModel('file://model/model.json');
    model.summary();
    //file = fs.createReadStream(files.webcam.path),

    //img = files.webcam.path
  
    tfimage = await readImage(files.webcam.path);

    tfimage = tfimage.div(255.0)

    //tfimage = await readImage('paulo1.jpg'); //borrar!!!

    newtensor = tfimage.expandDims();

    result = model.predict(newtensor);
    result.print()
    result.argMax(1).print()
    result.argMax(1).dataSync().map( m => console.log(labels[m]));

    res.send(result.dataSync());
}

module.exports = {
    detect,
}