require('dotenv').config()

const express    = require( 'express' );
const bodyParser = require( 'body-parser' );
const fs         = require( 'fs' );
const Clarifai   = require( 'clarifai' );
const app        = express();
const { readFile } = require( './helpers/fsHelper' );

const clarifai = new Clarifai.App( { apiKey: process.env.CLARIFAI_KEY } );

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.get( '/', ( req, res ) => {
    

    readFile( './Rottweiler-1.jpg' )
        .then( data => {
            let baseImage = data.toString('base64')
            clarifai.models.predict( Clarifai.GENERAL_MODEL, baseImage )
                    .then( 
                        result => res.json( result ),
                        err => {
                            throw new Error( err )
                        }
                    )
        } ) 
        .catch( error => res.status(400).json( { error } ) )
} )

app.listen( 9000 )