
import gsap, { Cubic, Elastic } from "gsap";
import Pubsub   from "pubsub-js";
import Messages from "@/definitions/Messages";

const pendingDebounces = new Map();

export default {
    animateIn( topContent, middleContent, bottomContent ) {
        const tl = gsap.timeline();
        tl.add( gsap.to( middleContent, 0, { css: { autoAlpha: 0 }} ));
        gsap.fromTo( topContent, 2,
            { css: { marginTop: "-200px" }},
            { css: { marginTop: 0 }, ease: Elastic.easeInOut }
        );
        gsap.from( bottomContent, 1.5, { css: { bottom: "-200px" }, ease: Cubic.easeOut });
        tl.add( gsap.to( middleContent, 1, { css: { autoAlpha: 1 }, delay: 1.5 }));
    },


     animateOut( topContent, middleContent, bottomContent, callback ) {
        const tl = gsap.timeline();
        tl.add( gsap.to( middleContent, 0.75, { css: { autoAlpha: 0 }, onComplete: () => {
            gsap.to( topContent, 0.75, { css: { marginTop: "-200px" }, ease: Cubic.easeIn, onComplete: callback });
            gsap.to( bottomContent, 0.75, { css: { bottom: "-200px" }, ease: Cubic.easeIn });
        }}));
    },

    startGame( audioModel, animateOutFunction ) {
        // audioModel.init();
        // audioModel.playEnqueuedTrack();
        animateOutFunction(() => {
            Pubsub.publish( Messages.GAME_START );
        });
    },
    
    debounce( name, callback, replaceExisting = false ) {
        if ( pendingDebounces.has( name )) {
            if ( !replaceExisting ) {
                return;
            }
            window.cancelAnimationFrame( pendingDebounces.get( name ));
        }
        pendingDebounces.set( name, window.requestAnimationFrame(() => {
            callback();
            pendingDebounces.delete( name );
        }));
    }
};
