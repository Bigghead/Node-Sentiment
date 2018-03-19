require('dotenv').config()

const express      = require( 'express' );
const bodyParser   = require( 'body-parser' );
const path         = require( 'path' );
const app          = express();


app.use(bodyParser.json( { limit: '50mb' } ));
app.use(bodyParser.urlencoded( { extended: true } ));
app.use(express.static('../client/dist'))


app.use( '/read', require( './routes/readImage' ) );

app.get( '/', ( req, res ) => {
    res.sendFile( path.join(__dirname, '../client/dist/index.html') )
} )

app.listen(9000)