
export default {

    /* General application states */

    READY                 : "READY",
    GAME_START            : "GAME_START",
    GAME_OVER             : "GAME_OVER",
    HIGH_SCORES_RETRIEVED : "HIGH_SCORES_RETRIEVED", // payload is Array<{name: string, score: number}>
    HIGH_SCORE_SAVED      : "HIGH_SCORE_SAVED",      // payload is { name: string, score: number }

    /* Game state changes */

    ACTOR_ADDED                 : "S01", // payload is newly added Actor
    ACTOR_REMOVED               : "S02", // payload is Actor to remove
    ACTOR_EXPLODE               : "S03", // payload is Actor that is about to explode
    ACTOR_LAYER_SWITCH_START    : "S04", // payload is { actor: Actor, layer: number }
    ACTOR_LAYER_SWITCH_COMPLETE : "S05", // payload is { actor: Actor, layer: number }
    PLAYER_HIT                  : "S06", // payload is { player: Player, object: Actor }
    IMPACT                      : "S07",
    FIRE                        : "S08",
    BOSS_DEFEATED               : "S00", // payload is Boss
    UPDATE_ENERGY               : "S10", // payload is Player
    UPDATE_SCORE                : "S11", // payload is numerical value of new score
    SHOW_INSTRUCTIONS           : "S12",
    INSTRUCTIONS_COMPLETE       : "S13",
    SHOW_MESSAGE                : "S14", // payload is { title: string, body: string }
    SHOW_TITLE_SCREEN           : "S15",
    SHOW_ABOUT                  : "S16",
    SHOW_HOW_TO_PLAY            : "S17",
    SHOW_HIGHSCORES             : "S18"
};
