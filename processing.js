var  model;

//Loading the pre-trained model
async function loadModel() {
     model = await tf.loadGraphModel('TJFS/model.json')
  }

  function predict_image() {
    
    console.log('processing...');

    //Read the image and covert to B&W
    let image = cv.imread(canvas);
    cv.cvtColor(image, image, cv.COLOR_RGB2GRAY, 0);
    cv.threshold(image, image, 175, 255, cv.THRESH_BINARY);

    //Find the contours
    let contours = new cv.MatVector();
    let hierarchy = new cv.Mat();
    cv.findContours(image, contours, hierarchy, cv.RETR_CCOMP, cv.CHAIN_APPROX_SIMPLE);

    //Crop the image
    let cnt = contours.get(0);
    let rect = cv.boundingRect(cnt);
    image = image.roi(rect);

    //Resize to model specifications
    var height = image.rows;
    var width = image.cols;

    if(height> width){

        height = 20;
        const scaleFactor = image.rows / height;
        width = Math.round(image.cols / scaleFactor);

    }
    else
    {
        width = 20;
        const scaleFactor = image.cols / width;
        height = Math.round(image.rows / scaleFactor);
    }
    let dsize = new cv.Size(width, height)
    cv.resize(image, image, dsize, 0, 0, cv.INTER_AREA);

    //Adding the padding

    const LEFT = Math.ceil((4 + (20 - width) / 2));
    const RIGHT = Math.floor((4 + (20 - width) / 2));
    const TOP = Math.ceil((4 + (20 - height) / 2));
    const BOTTOM = Math.floor((4 + (20 - height) / 2));
    //console.log(`t: ${TOP}, b: ${BOTTOM}, l: ${LEFT}, r: ${RIGHT}`);

    const BLACK = new cv.Scalar(0, 0, 0, 0);
    cv.copyMakeBorder(image, image, TOP, BOTTOM, LEFT, RIGHT, cv.BORDER_CONSTANT, BLACK);

    //Find Centre of mass(centroid) of image
    cv.findContours(image, contours, hierarchy, cv.RETR_CCOMP, cv.CHAIN_APPROX_SIMPLE);
    cnt = contours.get(0);
    const Moments = cv.moments(cnt, false);
    
    const cx = Moments.m10 / Moments.m00;
    const cy = Moments.m01 / Moments.m00;
    //console.log(`M00: ${Moments.m00}, cx: ${cx}, cy: ${cy}`);

    const X_SHIFT = Math.round(image.cols / 2.0 - cx);
    const Y_SHIFT = Math.round(image.rows / 2.0 - cy);

    const matrix = cv.matFromArray(2, 3, cv.CV_64FC1, [1, 0, X_SHIFT, 0, 1, Y_SHIFT]);
    newSize = new cv.Size(image.cols, image.rows);
    cv.warpAffine(image, image, matrix, newSize,  cv.INTER_LINEAR, cv.BORDER_CONSTANT, BLACK);

    let pixelValues = image.data;
    //console.log(`pixel val: ${pixelValues}`);

    pixelValues = Float32Array.from(pixelValues); //changing from array of integers to an array of decimals

    //Normalize in Pixel Values (divide all elements in JS array)
    pixelValues = pixelValues.map(function (item) {
        
        return item / 255.0;
    });
    //console.log(`scaled array: ${pixelValues}`);

    // Making tensors and storing the pixel values
    const X = tf.tensor ([pixelValues]);
    //console.log(`shape of tensor: ${X.shape}`);
    //console.log(`data-type: ${X.dtype}`);

    result = model.predict(X);
    result.print();
    //console.log(tf.memory());

    //Download and store tensor data

    const output = result.dataSync()[0];

    
    // Testing only
    //const outputCanvas = document.createElement('CANVAS');
    //cv.imshow(outputCanvas, image);
    //document.body.appendChild(outputCanvas);

    //CleanUP

    image.delete();
    contours.delete();
    cnt.delete();
    hierarchy.delete();
    matrix.delete();
    X.dispose();
    result.dispose();

    return output;

  }