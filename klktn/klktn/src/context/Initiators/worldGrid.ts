import { HighlightLayer, MeshBuilder } from "@babylonjs/core";
import ISystem from "../types";
import { Config } from "../constants";
import { roundDimension } from "../Systems/helpers";

const initWorldGrid = ({ world: w, components: c, entities: e }: ISystem) => {

    const grid : Array<Array<Array<number>>> = [];

    //all these values are in meters
    const cellSize = Config.cellSize;
    const width = 8.66;
    const depth = 8.66;
    const height = 5.64;
    
    //initializing grid with empty 0; No space is taken
    for(let i = 0; i < Math.round(roundDimension(width) / cellSize); i ++){
        if(!grid[i] ) {
            grid[i] = [];
        }
        for(let j = 0; j < Math.round(roundDimension(depth) / cellSize); j ++){
            if(!grid[i][j] ) {
                grid[i][j] = [];
            }
            for(let k = 0; k < Math.round(roundDimension(height) / cellSize); k ++){
                grid[i][j][k] = 0;
            }
        }
    }

    w.entityManager.addComponent(e.worldGrid, c.grid, grid);
    w.entityManager.addComponent(e.worldGrid, c.dimensions, {width, height, depth});
    w.entityManager.addComponent(e.worldGrid, c.highlight, new HighlightLayer("hl1", w.scene));
};

export default initWorldGrid;
