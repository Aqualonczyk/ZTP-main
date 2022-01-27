
import gsap, { Cubic, Elastic } from "gsap";
import Pubsub        from "pubsub-js";
import Config        from "@/config/Config";
import Assets        from "@/definitions/Assets";
import Messages      from "@/definitions/Messages";
import AnimationUtil from "@/util/AnimationUtil";
import EventHandler  from "@/util/EventHandler";
import HTMLTemplate  from "Templates/title_screen.hbs";

let handler, startButton, highScoresButton, howToPlayButton, aboutButton;
let title, menu, footer, buttons;
let audioModel;

export default {

    render( wrapper, models ) {
        wrapper.innerHTML = HTMLTemplate();

        // ({ audioModel } = models );

        title   = wrapper.querySelector( ".gme-title" );
        menu    = wrapper.querySelector( ".gme-button-list" );
        footer  = wrapper.querySelector( ".gme-footer" );
        buttons = wrapper.querySelectorAll( "button" );

        startButton      = wrapper.querySelector( "#btnStart" );
        highScoresButton = wrapper.querySelector( "#btnHighScores" );
        // howToPlayButton  = wrapper.querySelector( "#btnHowToPlay" );
        // aboutButton      = wrapper.querySelector( "#btnAbout" );


        handler = new EventHandler();

        // handler.listen( howToPlayButton,  "click",   handleHowToPlayClick );
        handler.listen( highScoresButton, "click",   handleHighScoresClick );
        //handler.listen( aboutButton,      "click",   handleAboutClick );
        handler.listen( startButton,      "mouseup", handlePlayClick );

        handler.listen( document, "touchcancel", handleTouch );
        handler.listen( document, "touchend",    handleTouch );
    },

    dispose() {
        if ( handler )
            handler.dispose();
    }
};


function handlePlayClick( event ) {
    AnimationUtil.startGame( audioModel, animateOut );
}

function handleTouch( event ) {
    Config.HAS_TOUCH_CONTROLS = true;
}

function handleHighScoresClick( event ) {
    //animateOut(() => {
        Pubsub.publish( Messages.SHOW_HIGHSCORES );
    //});
}

function handleAboutClick( event ) {
    //animateOut(() => {
        Pubsub.publish( Messages.SHOW_ABOUT );
    //});
}

function handleHowToPlayClick( event ) {
    //animateOut(() => {
        Pubsub.publish( Messages.SHOW_HOW_TO_PLAY );
    //});
}

// function animateIn() {
//     const tl = gsap.timeline();
//     tl.add( gsap.fromTo( title, 2,
//         { css: { marginTop: "-200px" }},
//         { css: { marginTop: 0 }, ease: Elastic.easeInOut })
//     );
//     tl.add( gsap.from( footer, 1.5, { css: { bottom: "-200px" }, ease: Cubic.easeOut }));

//     for ( let i = 0; i < buttons.length; ++i ) {
//         const button = buttons[ i ];
//         gsap.fromTo( button, 1.5,
//             { css: { marginLeft: `-${window.innerWidth}px` } },
//             { css: { marginLeft: "auto" }, ease: Elastic.easeInOut, delay: 1 + ( i * .4 ) }
//         );
//     }
// }

// function animateOut( callback ) {
//     AnimationUtil.animateOut( title, menu, footer, callback );
// }
