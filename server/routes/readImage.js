// ===== CLARIFAI ===== //
const clarifai   = require( 'clarifai' );
const Clarifai   = new clarifai.App( { apiKey: process.env.CLARIFAI_KEY } );

// ==== GOOGLE VISION ===== //
const vision   = require('@google-cloud/vision'); 
const client   = new vision.ImageAnnotatorClient();

const fs           = require( 'fs' );
const { readFile } = require( '../helpers/fsHelper' );
const router       = require( 'express' ).Router();


// ===== CLARIFAI READ ===== //
// Clarifai.models.predict( Clarifai.GENERAL_MODEL, baseImage )
//         .then( 
//             result => {
//                 res.json( result );
//             },
//             err => {
//                 throw new Error( err )
//             }
//         )



router.get( '/', ( req, res ) => {
    client.labelDetection('./Rottweiler-1.jpg')
          .then(results => {
              const labels = results[0].labelAnnotations;
              res.json( results )
          } )
          .catch(err => {
              res.json( err )
          } );
} )


router.post( '/', async ( req, res ) => {
    let imageName = Date.now();
    req.body.image = req.body.image.replace(/^data:image\/jpeg+;base64,/, "");
    req.body.image = req.body.image.replace(/ /g, '+');

    fs.writeFileSync(`./assets/${imageName}.jpeg`, 
                      req.body.image,
                      'base64' );

    try {

        const picture = await readFile( `./assets/${imageName}.jpeg` );
        let baseImage = picture.toString('base64');

        const recog   = await client.faceDetection(`./assets/${imageName}.jpeg`);
        await fs.unlink( `./assets/${imageName}.jpeg`, ( err ) => console.log( err ) );
        const labels = recog[0].labelAnnotations;
        res.json( recog );

    } catch( err ) {
        console.log( err )
        res.status(400).json(err)
    }

} )


module.exports = router;