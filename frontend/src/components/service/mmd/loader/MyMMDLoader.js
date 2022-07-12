import { LoaderUtils } from 'three';
import { MMDLoader } from 'three/examples/jsm/loaders/MMDLoader'

export class MyMMDLoader extends MMDLoader{
    /*
    * Loads Model file (.pmd or .pmx) as a THREE.SkinnedMesh.
    * you can handy specify modelExtension (if null, use file extension)
    *
    * @param {string} url - url to Model(.pmd or .pmx) file
    * @param {function} onLoad
    * @param {function} onProgress
    * @param {function} onError
    * @param {function} modelExtension
    */

         load( url, onLoad, onProgress, onError, modelExtension ) {
 
             const builder = this.meshBuilder.setCrossOrigin( this.crossOrigin ); // resource path
 
             let resourcePath;
 
             if ( this.resourcePath !== '' ) {
 
                 resourcePath = this.resourcePath;
 
             } else if ( this.path !== '' ) {
 
                 resourcePath = this.path;
 
             } else {
 
                 resourcePath = LoaderUtils.extractUrlBase( url );
 
             }
 
             if( !modelExtension ) modelExtension = this._extractExtension( url ).toLowerCase(); // Should I detect by seeing header?
 
 
             if ( modelExtension !== 'pmd' && modelExtension !== 'pmx' ) {
 
                 if ( onError ) onError( new Error( 'THREE.MMDLoader: Unknown model file extension .' + modelExtension + '.' ) );
                 return;
 
             }
 
             this[ modelExtension === 'pmd' ? 'loadPMD' : 'loadPMX' ]( url, function ( data ) {
 
                 onLoad( builder.build( data, resourcePath, onProgress, onError ) );
 
             }, onProgress, onError );
 
         }
}
