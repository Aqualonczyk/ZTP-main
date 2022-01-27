
import PubSub           from "pubsub-js";
import Messages         from "./definitions/Messages";
import inputController  from "./controller/InputController";
import gameController   from "./controller/GameController";
import renderController from "./controller/RenderController";
import screenController from "./controller/ScreenController";
import audioModel       from "./model/Audio";
import gameModel        from "./model/Game";
import settingsModel    from "./model/Settings";
import highScoresModel  from "./model/HighScores";
import AssetService     from "./services/AssetService";
import StyleSheet       from "../assets/css/_root.scss";




const container = document.querySelector( "#application" ) || document.querySelector( "body" );


const gme = window.gme = {
    inited : false,
    pubSub : PubSub
};


function init() {

    document.body.classList.remove( "loading" );

    const models = {
        audioModel,
        gameModel,
        settingsModel,
        highScoresModel,
    };

    settingsModel.init();
    highScoresModel.init();

    audioModel.muted = !settingsModel.get( settingsModel.PROPS.MUSIC_ON );


    gameController.init( models );
    inputController.init( models );
    renderController.init( container, models );
    screenController.init( container, models );

    if ( process.env.NODE_ENV === "development" ) {
        gme.models = models;
    }
    PubSub.publish( Messages.READY );
    gme.inited = true;
}


AssetService.prepare().then( init );
