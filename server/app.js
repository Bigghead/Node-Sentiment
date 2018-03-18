require('dotenv').config()

const express      = require( 'express' );
const bodyParser   = require( 'body-parser' );
const fs           = require( 'fs' );
const path         = require( 'path' );
const app          = express();
const { readFile } = require( './helpers/fsHelper' );

// ===== CLARIFAI ===== //
const clarifai   = require( 'clarifai' );
const Clarifai   = new clarifai.App( { apiKey: process.env.CLARIFAI_KEY } );

// ==== GOOGLE VISION ===== //
const vision   = require('@google-cloud/vision'); 
const client   = new vision.ImageAnnotatorClient();



app.use(bodyParser.json( { limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('../client/dist'))


app.post( '/read', ( req, res ) => {
    let imageName = Date.now();
    req.body.image = req.body.image.replace(/^data:image\/jpeg+;base64,/, "");
    req.body.image = req.body.image.replace(/ /g, '+');

    fs.writeFileSync(`./assets/${imageName}.jpeg`, 
                      req.body.image,
                      'base64' );
                      
    readFile( `./assets/${imageName}.jpeg` )
        .then( data => {
            let baseImage = data.toString('base64')
            // Clarifai.models.predict( Clarifai.GENERAL_MODEL, baseImage )
            //         .then( 
            //             result => {
            //                 res.json( result );
            //             },
            //             err => {
            //                 throw new Error( err )
            //             }
            //         )
            client.faceDetection(`./assets/${imageName}.jpeg`)
                  .then( results => {
                      fs.unlink( `./assets/${imageName}.jpeg`, ( err ) => console.log( err ) );

                      const labels = results[0].labelAnnotations;
                      res.json( results )
                  } )
                  .catch(err => {
                      res.json( err )
                  } );
        } ) 
        .catch( error => res.status(400).json( { error } ) )
} )


app.get( '/read', ( req, res ) => {
    client.labelDetection('./Rottweiler-1.jpg')
          .then(results => {
              const labels = results[0].labelAnnotations;
              res.json( results )
          } )
          .catch(err => {
              res.json( err )
          } );
} )


app.get( '/', ( req, res ) => {
    res.sendFile( path.join(__dirname, '../client/dist/index.html') )
})

app.listen( 9000 )