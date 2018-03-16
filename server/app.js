require('dotenv').config()

const express    = require( 'express' );
const bodyParser = require( 'body-parser' );
const fs         = require( 'fs' );
const Clarifai   = require( 'clarifai' );
const app        = express();

const clarifai = new Clarifai.App( { apiKey: process.env.CLARIFAI_KEY } );

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.get( '/', ( req, res ) => {
    fs.readFile('./Rottweiler-1.jpg', function(err, original_data){
        if(err){
            return;
        }
        else{
            // this variable contains the correctly encoded image. Just use it as it is in the Clarifai API
            var base64Image = original_data.toString('base64');
            clarifai.models.predict( Clarifai.GENERAL_MODEL, base64Image )
                    .then( 
                        result => res.json( result ),
                        err => res.json(err)
                    )
        }
     });
    
} )

app.listen( 9000 )