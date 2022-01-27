
import gsap, { TweenMax, Power1 } from "gsap";
import Pubsub          from "pubsub-js";
import { canvas, sprite, collision } from "zcanvas";
import Messages        from "@/definitions/Messages";
import RendererFactory from "@/factory/RendererFactory";
//import CloudRenderer   from "@/view/renderers/CloudRenderer";
//import TileRenderer    from "@/view/renderers/TileRenderer";
//import WaterRenderer   from "@/view/renderers/WaterRenderer";
import FXRenderer      from "@/view/renderers/FXRenderer";
import Boss            from "@/model/actors/Boss";
import Powerup         from "@/model/actors/Powerup";
import Random          from "@/util/Random";

let audioModel, gameModel, zCanvas, player, renderer;
//, waterRenderer

const IDEAL_WIDTH = 400;


const actors = [];
//let COLLIDABLE_TILE;


const layers = new Array( 5 );

let GROUND_LAYER            = 0;
let BOTTOM_ACTOR_LAYER      = 1;
//let BOTTOM_DECORATION_LAYER = 2;
let TOP_ACTOR_LAYER         = 3;
let TOP_DECORATION_LAYER    = 4;

const COLORS = {
    TOP     : "#418ac3",
    BOTTOM  : "#101b25"
};

const FXRenderers = new Array( 25 );

const RenderController = {

    init( container, models ) {

        ({ gameModel, audioModel } = models );

        zCanvas = new canvas({
            width       : IDEAL_WIDTH,
            height      : IDEAL_WIDTH,
            animate     : true,
            smoothing   : false,
            stretchToFit: true,
            fps         : 60,
            onUpdate    : gameModel.update
        });
        zCanvas.preventEventBubbling( true );
        zCanvas.setBackgroundColor( COLORS.TOP );
        zCanvas.insertInPage( container );

        setupGame();


        window.addEventListener( "resize",            handleResize );
        window.addEventListener( "orientationchange", handleResize );


        [
            Messages.GAME_START,
            Messages.ACTOR_ADDED,
            Messages.ACTOR_REMOVED,
            Messages.ACTOR_EXPLODE,
            Messages.ACTOR_LAYER_SWITCH_START,
            Messages.ACTOR_LAYER_SWITCH_COMPLETE,
            Messages.PLAYER_HIT

        ].forEach(( msg ) => Pubsub.subscribe( msg, handleBroadcast ));
    },

    /**
     * invoked when an FXRenderer has completed its animation
     *
     * @param {FXRenderer} renderer
     */
    onFXComplete( renderer ) {
        removeRendererFromDisplayList( renderer );
        FXRenderers.push( renderer );
    },

    /**
     * @type {{ active: boolean, x: number, y: number }}
     */
    rumbling: { active: false, x: 0, y: 0 }
};
export default RenderController;


function setupGame() {

    clearGame();

    player = RendererFactory.createRenderer(
        gameModel.player, RenderController
    );

    for ( let i = 0; i < layers.length; ++i ) {
        const layer = new sprite();//{ width: 0, height: 0 });
        zCanvas.addChild( layer );
        layers[ i ] = layer;
    }


    GROUND_LAYER            = layers[ 0 ];
    BOTTOM_ACTOR_LAYER      = layers[ 1 ];
    //BOTTOM_DECORATION_LAYER = layers[ 2 ];
    TOP_ACTOR_LAYER         = layers[ 3 ];
    TOP_DECORATION_LAYER    = layers[ 4 ];

    //COLLIDABLE_TILE = new TileRenderer( -200, 1.5, TileRenderer.TYPE.STONE );


    //waterRenderer = new WaterRenderer();
    //GROUND_LAYER.addChild( waterRenderer ); // eternally animating water sprite
    //GROUND_LAYER.addChild( new TileRenderer( -500, 0.75, TileRenderer.TYPE.ISLAND, .5 ));
    //GROUND_LAYER.addChild( new TileRenderer( -200, 0.75, TileRenderer.TYPE.ISLAND, .5 ));
    //GROUND_LAYER.addChild( new TileRenderer( 0, 1, TileRenderer.TYPE.STONE, .5 ) );

    //BOTTOM_DECORATION_LAYER.addChild( new CloudRenderer( 0, 0, .5 ) );
    //TOP_ACTOR_LAYER.addChild( COLLIDABLE_TILE );
    //TOP_DECORATION_LAYER.addChild( new CloudRenderer( zCanvas.getWidth() - 100, -100, 1 ) );


    for ( let i = 0; i < FXRenderers.length; ++i ) {
        FXRenderers[ i ] = new FXRenderer( RenderController );
    }

    handleResize();
}

function handleBroadcast( type, payload ) {
    switch ( type ) {
        case Messages.GAME_START:
            addRendererToAppropriateLayer( gameModel.player.layer, gameModel.player.renderer );
            break;

        case Messages.ACTOR_ADDED:
            renderer = RendererFactory.createRenderer(
                payload, RenderController
            );
            RendererFactory.setSheetForRenderer( payload, renderer );
            addRendererToAppropriateLayer( /** @type {Actor} */ ( payload ).layer, renderer );
            actors.push( payload );
            break;

        case Messages.ACTOR_REMOVED:
            const index = actors.indexOf( /** @type {Actor} */ ( payload ));
            if ( index !== -1 ) {
                actors.splice( index, 1 );
            }
            removeRendererFromDisplayList( /** @type {Actor} */ ( payload ).renderer );
            break;

        case Messages.ACTOR_EXPLODE:
            showExplodeAnimation( /** @type {Actor} */ ( payload ));
            break;

        case Messages.ACTOR_LAYER_SWITCH_START:
            showLayerSwitchAnimation( payload.actor, payload.layer );
            gsap.delayedCall( .5, () => checkLayerSwitchCollision( payload.actor, payload.layer ));
            break;

        case Messages.ACTOR_LAYER_SWITCH_COMPLETE:
            renderer = payload.actor.renderer;
            if ( renderer ) {
                removeRendererFromDisplayList( renderer );
                addRendererToAppropriateLayer( payload.layer, renderer );
            }
            break;

        case Messages.PLAYER_HIT:
            if ( !( payload.object instanceof Powerup )) {
                rumble();
            }
            break;
    }
}

function clearGame() {
    if ( player ) {
        zCanvas.removeChild( player );
    }
    let i = actors.length;
    while ( i-- ) {
        actors[ i ].dispose();
        actors.splice( i, 1 );
    }
    layers.forEach(( layer ) => layer.dispose());
}

function addRendererToAppropriateLayer( layer, renderer ) {

    switch ( layer ) {
        case 1:
            TOP_ACTOR_LAYER.addChild( renderer );
            break;
        case 0:
            BOTTOM_ACTOR_LAYER.addChild( renderer );
            break;
        default:
           // BOTTOM_DECORATION_LAYER.addChild( renderer );
            break;
    }
}

function removeRendererFromDisplayList( renderer ) {
    if ( !renderer ) {
        return;
    }
    const parent = renderer.getParent();
    if ( parent ) {
        parent.removeChild( renderer );
    }
}

function rumble() {

    if ( RenderController.rumbling.active ) {
        return;
    }
    RenderController.rumbling.active = true;

    const tl = gsap.timeline({ repeat: 5, onComplete: () => {
        RenderController.rumbling.active = false;
    }});
    tl.add( new TweenMax(
        RenderController.rumbling, .05, {
            "x": 5, "y": 5, "ease": Power1.easeInOut
        })
    );
    tl.add( new TweenMax(
        RenderController.rumbling, .05, {
            "x": 0, "y": 0, "ease": Power1.easeInOut
        })
    );
}


function checkLayerSwitchCollision( actor, targetLayer ) {


    removeRendererFromDisplayList( actor.renderer );
    addRendererToAppropriateLayer( targetLayer, actor.renderer );

    //, COLLIDABLE_TILE
    if ( collision.pixelCollision( actor.renderer )) {
        actor.layer = 1;
        actor.die();

        if ( actor === gameModel.player ) {
            gameModel.onPlayerHit( null );
        }
    }
}

function showExplodeAnimation( actor ) {
    if ( actor instanceof Boss ) {
        const halfWidth  = actor.width / 2;
        const halfHeight = actor.height / 2;
        const incrX      = actor.width  / 4;
        const incrY      = actor.height / 4;
        for ( let x = 0; x < actor.width; x += incrX ) {
            for ( let y = 0; y < actor.height; y += incrY ) {
                const renderer = FXRenderers.shift(); // get FXRenderer from pool
                if ( renderer ) {
                    renderer.showAnimation(
                        actor, FXRenderer.ANIMATION.EXPLOSION, x * ( Math.random() + 0.5 ), y * ( Math.random() + .5 )
                    );
                    addRendererToAppropriateLayer( actor.layer, renderer );
                }
            }
        }
        return;
    }
    const renderer = FXRenderers.shift(); // get FXRenderer from pool
    if ( renderer ) {
        renderer.showAnimation( actor, FXRenderer.ANIMATION.EXPLOSION );
        addRendererToAppropriateLayer( actor.layer, renderer );
    }
}

function showLayerSwitchAnimation( actor, targetLayer ) {
    // get FXRenderer from pool
    const renderer = FXRenderers.shift();
    //if ( renderer ) {
    //    renderer.showAnimation( actor, FXRenderer.ANIMATION.CLOUD );
    //    addRendererToAppropriateLayer( targetLayer, renderer );
    //}
    if ( actor === player.actor ) {
        animateBackgroundColor( targetLayer );
        audioModel.setFrequency(( targetLayer === 1 ) ? 22050 : 1980 );
    }
}

function handleResize() {
    gameModel.world.width  = zCanvas.getWidth();
    gameModel.world.height = zCanvas.getHeight();
    gameModel.player.cacheBounds();
    //waterRenderer.cacheBounds();
}

function animateBackgroundColor( targetLayer ) {
    gsap.killTweensOf( zCanvas );
    gsap.to( zCanvas, 2, { _bgColor: ( targetLayer === 1 ) ? COLORS.TOP : COLORS.BOTTOM });
}
