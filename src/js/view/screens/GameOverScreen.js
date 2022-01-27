
import Pubsub        from "pubsub-js";
import Messages      from "@/definitions/Messages";
import AnimationUtil from "@/util/AnimationUtil";
import EventHandler  from "@/util/EventHandler";
import HTMLTemplate  from "Templates/game_over_screen.hbs";

let models, handler, text, playButton, homeButton, nameInput, saveButton;
let title, footer;

const GameOverScreen = {

    render( wrapper, modelRefs ) {

        models = modelRefs;

        const player       = models.gameModel.player;
        const score        = player.score;
        const hasHighScore = models.highScoresModel.isNewScore( score );

        wrapper.innerHTML = HTMLTemplate({
            highScore: hasHighScore,
            score
        });

        // grab references to HTML Elements

        title   = wrapper.querySelector( ".wks-title" );
        footer  = wrapper.querySelector( ".wks-footer" );
        text    = wrapper.querySelector( ".wks-text" );

        nameInput  = wrapper.querySelector( "#nameInput" );
        saveButton = wrapper.querySelector( "#saveHighScore" );
        playButton = wrapper.querySelector( ".wks-menu__play-button" );
        homeButton = wrapper.querySelector( ".wks-menu__home-button" );

        handler = new EventHandler();

        // in case of new high score, show last known player name
        // as well as option to save this stuff!

        if ( hasHighScore ) {
            if ( player.name.length > 0 ) {
                nameInput.value = player.name;
            }
            handler.listen( saveButton, "click", handleSaveClick );

            // also save on keyboard enter press
            handler.listen( window, "keyup", ( e ) => {
                if ( e.keyCode === 13 ) {
                    handleSaveClick();
                }
            });
        }
        handler.listen( playButton, "click", handlePlayClick );
        handler.listen( homeButton, "click", handleHomeClick );

        animateIn();
    },

    dispose() {
        // remove all DOM listeners
        if ( handler )
            handler.dispose();
    }
};
export default GameOverScreen;

/* private methods */

function handleSaveClick( event ) {

    const { gameModel, highScoresModel } = models;

    if ( nameInput.value.length > 2 ) {

        GameOverScreen.dispose(); // prevent double save cheaply ;)

        gameModel.player.name = nameInput.value;
        highScoresModel.save( gameModel.player.name, gameModel.player.score );

        animateOut(() => {
            Pubsub.publish( Messages.SHOW_HIGHSCORES );
        });
    }
    else {
        nameInput.classList.add( "error" );
    }
}

function handlePlayClick( event ) {
    AnimationUtil.startGame( models.audioModel, animateOut );
}

function handleHomeClick( event ) {

    animateOut(() => {
        Pubsub.publish( Messages.SHOW_TITLE_SCREEN );
    });
}

function animateIn() {
    AnimationUtil.animateIn( title, text, footer );
}

function animateOut( callback ) {
    AnimationUtil.animateOut( title, text, footer, callback );
}
