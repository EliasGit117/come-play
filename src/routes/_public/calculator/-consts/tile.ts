export const TILE_WIDTH_MM = 320;
export const TILE_HEIGHT_MM = 160;

export const TILE_WIDTH_CM = TILE_WIDTH_MM / 10;
export const TILE_HEIGHT_CM = TILE_HEIGHT_MM / 10;

export const DEFAULT_TILES_X_COUNT = 5;
export const DEFAULT_TILES_Y_COUNT = 5;

// Wall starts a tile bigger than the default screen on each side, so the wall
// surface is visible around the panel out of the box
export const DEFAULT_WALL_WIDTH_CM = (DEFAULT_TILES_X_COUNT + 2) * TILE_WIDTH_CM;
export const DEFAULT_WALL_HEIGHT_CM = (DEFAULT_TILES_Y_COUNT + 2) * TILE_HEIGHT_CM;
