
import Pubsub           from "pubsub-js";
import Messages         from "@/definitions/Messages";
import TitleScreen      from "@/view/screens/TitleScreen";
import GameScreen       from "@/view/screens/GameScreen";
import GameOverScreen   from "@/view/screens/GameOverScreen";
import HighScoresScreen from "@/view/screens/HighScoresScreen";
import AboutScreen      from "@/view/screens/AboutScreen";
import HowToPlayScreen  from "@/view/screens/HowToPlayScreen";

let wrapper, currentScreen, models, gameModel, highScoresModel;

export default {

    init( container, modelRefs ) {

        models = modelRefs;
        ({ gameModel, highScoresModel } = models );

        wrapper = document.createElement( "div" );
        wrapper.setAttribute( "class", "gme-container" );
        container.appendChild( wrapper );

        // subscribe to messaging system

        [
            Messages.SHOW_TITLE_SCREEN,
            Messages.SHOW_HIGHSCORES,
            Messages.GAME_START,
            Messages.GAME_OVER

        ].forEach(( msg ) => Pubsub.subscribe( msg, handleBroadcast ));

        // render the first screen

        renderScreen( TitleScreen );
    }
};

/* private methods */

function handleBroadcast( msg, payload ) {
    switch ( msg ) {
        case Messages.SHOW_TITLE_SCREEN:
            renderScreen( TitleScreen );
            break;

        case Messages.SHOW_HIGHSCORES:
            renderScreen( HighScoresScreen );
            break;

        case Messages.GAME_START:
            renderScreen( GameScreen );
            wrapper.classList.add( "playing" );
            break;

        case Messages.GAME_OVER:
            renderScreen( GameOverScreen );
            wrapper.classList.remove( "playing" );
            break;
    }
}

function renderScreen( screen ) {
    if ( currentScreen ) {
        currentScreen.dispose();
        wrapper.innerHTML = "";
    }
    screen.render( wrapper, models );
    currentScreen = screen;
}
