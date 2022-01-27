
import { loader } from "zcanvas";
import Assets     from "@/definitions/Assets";

export default {

    /**
     * @public
     * @return {Promise}
     */
    prepare() {


        const graphics = Object.values( Assets.GRAPHICS );
        return new Promise( async ( resolve, reject ) => {
            let pending = graphics.length;
            for ( let i = 0; i < pending; ++i ) {
                const entry = graphics[ i ];
                const { image } = await loader.loadImage( entry.src );
                entry.img = image;
            }
            resolve();
        });
    }
};
