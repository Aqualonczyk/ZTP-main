
 const AudioTracks =
 {
     /**
      * Track ids of music on SoundCloud
      *
      * (you can retrieve a SoundCloud identifier by clicking "Share" on the track page,
      * selecting "Embed" and retrieving the numerical value from the URL)
      */
     THEME_1 : "300767985",
     THEME_2 : "222536433",

     /**
     * convenience method to return a list of all track ids
      * listed in this Object
      *
      * @public
      * @return {Array<string>}
      */
     getAll() {
         const out = [];
         Object.keys( AudioTracks ).forEach(( key ) => {
             if ( typeof AudioTracks[ key ] !== "function" )
                 out.push( AudioTracks[ key ] );
         });
         return out;
     }
 };
 export default AudioTracks;
