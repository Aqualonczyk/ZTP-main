
import { sprite }    from "zcanvas";
import Config        from "@/config/Config";
import TileGenerator from "@/util/TileGenerator";

export default class TileRenderer extends sprite
{
    /**
     * a renderer that represents a tiled background on screen
     *
     * @constructor
     * @param {number} y
     * @param {number} speed
     * @param {number} type
     * @param {number=} scale
     */
    constructor( y, speed, type, scale ) {

        super({ x: 0, y });

        /* instance properties */

        this.speed = speed;

        /* initialization */

        const generateFn = type === TileRenderer.TYPE.ISLAND ? TileGenerator.createIslandTileMap : TileGenerator.createTileMap;

        const cvs = generateFn( scale );
        this.setBitmap( cvs, cvs.width, cvs.height );
    }

    /* public methods */

    setCanvas( canvas ) {
        super.setCanvas( canvas );
        positionOnRandomX( this );
    }

    // draw( aCanvasContext ) {
    //     // there is no associated Actor for a tile, run the update logic
    //     // inside the draw method
    //     this._bounds.top += this.speed;
    //     // when moving out of the screen reset position to the top
    //     if ( this._bounds.top > this.canvas.getHeight() ) {
    //         this._bounds.top = -Math.round( this._bounds.height * ( 1 + Math.random() ));
    //         positionOnRandomX( this );
    //     }
    //     super.draw( aCanvasContext );
    // }
}

/* class constants */

TileRenderer.TYPE = {
    STONE  : 0,
    ISLAND : 1
};

/* internal methods */

function positionOnRandomX( sprite ) {
    sprite.setX( Math.round( Math.random() * sprite.canvas.getWidth() ));
}
