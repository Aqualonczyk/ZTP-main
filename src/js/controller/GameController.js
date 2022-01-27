
import gsap          from "gsap";
import Pubsub        from "pubsub-js";
import Messages      from "@/definitions/Messages";
import ActionFactory from "@/factory/ActionFactory";
import Assets        from "@/definitions/Assets";

let audioModel, gameModel, settingsModel;
let actionTimeout;

export default {

    init( models) {
        ({ gameModel, audioModel, settingsModel } = models );

        // subscribe to pubsub system to receive and broadcast messages

        [
            Messages.GAME_START,
            Messages.GAME_OVER,
            Messages.BOSS_DEFEATED,
            Messages.INSTRUCTIONS_COMPLETE

        ].forEach(( msg ) => Pubsub.subscribe( msg, handleBroadcast ));
    }
};

/* private methods */

function handleBroadcast( type, payload ) {

    switch ( type ) {
        case Messages.GAME_START:
            gameModel.reset();
            // start the music
            audioModel.playEnqueuedTrack();

            if ( !settingsModel.get( settingsModel.PROPS.HAS_PLAYED )) {
                // show instructions first
                gsap.delayedCall( .5, () => Pubsub.publish( Messages.SHOW_INSTRUCTIONS ));
            }
            else {
                startActionQueue();
            }
            break;

        case Messages.GAME_OVER:
            gameModel.active = false;
            stopActions();
            audioModel.playSoundFX( Assets.AUDIO.AU_EXPLOSION );
            // enqueue next music track so we have a different one ready for the next game
            audioModel.enqueueTrack();
            // store the flag stating the player has played at least one game
            settingsModel.set( settingsModel.PROPS.HAS_PLAYED, true );
            break;

        case Messages.BOSS_DEFEATED:
            // restart the action queue for the next "level"
            ActionFactory.reset();
            executeAction();
            break;

        case Messages.INSTRUCTIONS_COMPLETE:
            startActionQueue();
            break;
    }
}

function startActionQueue() {
    // start the game actions queue
    startActions( ActionFactory.reset() );
}

/**
 * actions are scheduled periodic changes that
 * update the game world and its properties
 */
function startActions( timeout ) {
    if ( typeof timeout === "number" )
        actionTimeout = gsap.delayedCall( timeout, executeAction );
}

function executeAction() {
    // execute and enqueue next action
    startActions( ActionFactory.execute( gameModel ));
}

function stopActions() {
    if ( actionTimeout ) {
        actionTimeout.kill();
        actionTimeout = null;
    }
}
