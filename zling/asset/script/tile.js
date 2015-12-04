/*******************************************************************************
 * T I L E
 * @param   {number}    id  Unique identity of the tile.
 ******************************************************************************/
function Tile(id) {

    /*==========================================================================
     * Variable
     */
    this.vId = id;
    this.vType = C_TILE.TYPE.COMMON;
    this.vCorrectness = C_TILE.CORRECTNESS.INCORRECT;
}