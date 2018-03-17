require('dotenv').config()

const express    = require( 'express' );
const bodyParser = require( 'body-parser' );
const fs         = require( 'fs' );
const Clarifai   = require( 'clarifai' );
const path       = require( 'path' );
const app        = express();
const { readFile } = require( './helpers/fsHelper' );

const clarifai = new Clarifai.App( { apiKey: process.env.CLARIFAI_KEY } );

app.use(bodyParser.json( { limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('../client/dist'))


app.post( '/read', ( req, res ) => {
    let imageName = Date.now();
    req.body.image = req.body.image.replace(/^data:image\/jpeg+;base64,/, "");
    req.body.image = req.body.image.replace(/ /g, '+');

    fs.writeFileSync(`./assets/${imageName}.jpeg`, 
                      req.body.image,
                      'base64', 
                      ( err ) => console.log( err ) );
                      
    readFile( `./assets/${imageName}.jpeg` )
        .then( data => {
            let baseImage = data.toString('base64')
            fs.unlink( `./assets/${imageName}.jpeg`, ( err ) => console.log( err ) );
            clarifai.models.predict( Clarifai.GENERAL_MODEL, baseImage )
                    .then( 
                        result => {
                            res.json( result );
                        },
                        err => {
                            throw new Error( err )
                        }
                    )
        } ) 
        .catch( error => res.status(400).json( { error } ) )
} )


app.get( '/', ( req, res ) => {
    res.sendFile( path.join(__dirname, '../client/dist/index.html') )
})

app.listen( 9000 )