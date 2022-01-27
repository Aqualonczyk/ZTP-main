
import Enemies from "@/definitions/Enemies";
import Weapons from "@/definitions/Weapons";
import Random  from "@/util/Random";

export default {

    /**
     * @public
     * @param {number} minClass optional minimum class/level of the Weapon
     * @return {number}
     */
    createRandomWeapon( minClass = 0 ) {
        // random value from Weapons enumeration
        return Random.range( minClass, 2 );
    },

    /**
     * apply all required properties for given Weapon type
     * onto given Ship
     *
     * @param {number} weapon from enum above
     * @param {Ship} ship
     */
    applyToActor( weapon, ship ) {
        let fireSpeed;
        // note: speeds are relative to the framerate/game cycles (60 fps)
        switch ( weapon ) {
            default:
                fireSpeed = 7;
                break;

            case Weapons.SPRAY:
                // mines can spray at a higher speed (though the spray moves more slowly)
                fireSpeed = ship.type === Enemies.MINE ? .5 : 5;
                break;

            case Weapons.LASER:
                fireSpeed = 1;
                break;
        }
        ship.weapon    = weapon;
        ship.fireSpeed = fireSpeed;
    }
};
