const fs = require( 'fs' );


const readFile = ( filePath ) => {
    return new Promise( ( resolve, reject ) => {
        fs.readFile( filePath, ( err, data ) =>  {
            if( err ) reject( err );
            resolve( data );
        } )
    } )
}


module.exports = {
    readFile
}