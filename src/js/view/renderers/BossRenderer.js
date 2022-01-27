
import ActorRenderer from "./ActorRenderer";
import Config        from "@/config/Config";
import Boss          from "@/model/actors/Boss";
import Assets        from "@/definitions/Assets";

export default class BossRenderer extends ActorRenderer
{
    /**
     * a renderer that represents a Boss actor on screen
     *
     * @constructor
     * @param {Boss} boss
     * @param {RenderController} renderController
     */
    constructor( boss, renderController ) {
        super( boss, renderController );

        this.setBitmap( Assets.GRAPHICS.BOSS.img );
        this.setSheet([
                // Boss sprites (facing down)
                { row: 0, col: 0, fpt: 1, amount: 1, w: 2, h: 1 },
                { row: 0, col: 2, fpt: 1, amount: 1, w: 2, h: 1 },
                { row: 1, col: 0, fpt: 1, amount: 1, w: 2, h: 1 },
                { row: 1, col: 2, fpt: 1, amount: 1, w: 2, h: 1 },
                { row: 0, col: 4, fpt: 1, amount: 1, w: 2, h: 2 },
            ],
            BossRenderer.TILE_SIZE.width,
            BossRenderer.TILE_SIZE.height
        );

        this.lastEnergy = boss.energy;
    }


    /* public methods */

    /**
     * @override
     * @param {CanvasRenderingContext2D} aCanvasContext
     */
    draw( aCanvasContext ) {

        if ( !this.canvas ) {
            return;
        }

        // we override the draw method as we have different size sprites within the tile sheet
        // TODO: is this something we want to be able to solve from zCanvas itself ? ;)

        const bounds = this._bounds;
        const { tileWidth, tileHeight, type } = this._animation;

        const isHit = this.actor.energy !== this.lastEnergy;

        // flash when hit
        if ( isHit ) {
            this.lastEnergy = this.actor.energy;
            aCanvasContext.save();
            aCanvasContext.globalAlpha = 0.5;
        }

        aCanvasContext.drawImage(
            this._bitmap,
            type.col * tileWidth,
            type.row * tileHeight,
            tileWidth  * type.w,
            tileHeight * type.h,
            ( 0.5 + bounds.left )   << 0,
            ( 0.5 + bounds.top )    << 0,
            ( 0.5 + bounds.width  ) << 0,
            ( 0.5 + bounds.height ) << 0
        );

        if ( isHit ) {
            aCanvasContext.restore();
        }
        /*
        if ( process.env.NODE_ENV === "development" ) {
            this.debug( aCanvasContext );
        }
        */
    }

    setSheetForBoss() {
        // type has 1:1 relation ship to the sheet for the Boss
        this.switchAnimation( this.actor.type );
    }
}

/**
 * dimensions of each tile in the spritesheet
 *
 * @type {{width: number, height: number}}
 */
BossRenderer.TILE_SIZE = { width: 128, height: 128 };
