 import Messages from "../definitions/Messages";
 import PubSub   from "pubsub-js";
 
 const STORAGE_KEY = "wks.highscores";
 let list;
 
 /**
  * model that manages the list of
  * high scores within LocalStorage
  */
 const HighScores = {
 
     /**
      * fetch the high scores from LocalStorage
      */
     init() {
 
         // when high scores are retrieved, save them into LocalStorage
         // this message based mechanism allows us to feed the high scores
         // from outside applications
 
         PubSub.subscribe( Messages.HIGH_SCORES_RETRIEVED, ( msg, payload ) => {
 
             if ( Array.isArray( payload )) {
                 list = payload;
                 save( list );
             }
         });
         retrieve.getInstance();
     },
 
     /**
      * retrieve the list of high scores
      *
      * @return {Array<{name: string, score: number}>}
      */
     get() {
         return list;
     },
 
     /**
      * validates whether given score is
      * eligible to appear in the high scores list
      *
      * @param {number} score
      * @return {boolean}
      */
     isNewScore( score ) {
         const lowestScore = list[ list.length - 1 ].score;
         return score > lowestScore;
     },
 
     /**
      * save given name and score into the list of
      * high scores
      *
      * @param {string} name
      * @param {number} score
      */
     save( name, score ) {
         if ( HighScores.isNewScore( score )) {
             const newScore = { name: name, score: score };
             let i = list.length, found = false;
             while ( i-- ) {
                 // replace last lower score with new score
                 if ( list[ i ].score >= score ) {
                     // split list into two...
                     const head = list.splice( 0, i + 1 );
                     // ...and combine the list with the new high score entry in the middle
                     list = head.concat([ newScore ], list );
 
                     found = true;
                     break;
                 }
             }
 
             // 1st place!
 
             if ( !found )
                 list.unshift( newScore );
 
             // remove the last entry
             list.pop();
 
             save( list );
 
             // allows us to save the high scores in an outside application
             PubSub.publish( Messages.HIGH_SCORE_SAVED, newScore );
         }
     }
 };
 export default HighScores;
 

  var retrieve = (function () {

    var instance;

    function init() {

    
     let scores;
     try {
         const data = localStorage.getItem( STORAGE_KEY );
         if ( data ) {
             scores = JSON.parse( data );
         }
     }
     catch ( e ) {}
 
     // no high scores yet, create generic list
 
     if ( !Array.isArray( scores )) {
         scores = [
             { name: "AAA", score: 10000 },
             { name: "BBB", score: 9000 },
             { name: "CCC", score: 8000 },
             { name: "DDD", score: 7000 },
             { name: "EEE", score: 6000 },
             { name: "FFF", score: 5000 },
             { name: "GGG", score: 4000 },
             { name: "HHH", score: 3000 },
             { name: "III", score: 2000 },
             { name: "JJJ", score: 1000 }
         ];
     }
     PubSub.publish( Messages.HIGH_SCORES_RETRIEVED, scores );
     
            return 0;
        

    };

    return {
        getInstance: function () {
            if ( !instance ) {
                instance = init();
            }
            return instance;
        }
    };
})();






 function save( data ) {
     try {
         localStorage.setItem( STORAGE_KEY, JSON.stringify( data ));
         return true;
     }
     catch ( e ) {}
 }