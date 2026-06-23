import { Actor, CollisionType, Vector } from 'excalibur'
import wallTextureUrl from './assets/walls/wall3.png'
import { MapEngine } from '../MapEngine.js'
import { RenderObject } from '../../renderBase/renderbase.js'
import { UI } from '../../ui.js'
import { WallCollider } from '../level1/wall-collider.js'

// . = floor, # = wall
export const MAP = [
    '####################',
    '#..................#',
    '#..#....#..#....#..#',
    '#..................#',
    '#....0.......0.....#',
    '#..................#',
    '#....0.......0.....#',
    '#..................#',
    '#..#....#..#....#..#',
    '#..................#',
    '####################',
]

export const isWallTile = (char) => char === '#'

export class MapLevel3 extends MapEngine {
    constructor(player) {
        super(player)
        this.map = MAP
    }

    isWallTile(char) {
        return char === '#'
    }

    getMiniMapColor(tile) {
        if (tile === '#') return 'rgb(150, 0, 150)'
        return 'rgb(0, 0, 0)'
    }

    getTexture(tileType) {
        return { img: this.wallImg, loaded: this.wallImgLoaded }
    }

    onMapSetup(engine) {
        this.wallImg = new Image()
        this.wallImg.src = wallTextureUrl
        this.wallImgLoaded = false
        this.wallImg.onload = () => { this.wallImgLoaded = true }

        for (let y = 0; y < this.map.length; y++) {
            for (let x = 0; x < this.map[y].length; x++) {
                if (this.isWallTile(this.map[y][x])) {
                    const wall = new WallCollider(new Vector(x, y))
                    this.add(wall)
                }

                if (this.map[y][x] === '0') {
                    const obj = new RenderObject(new Vector(x, y), 90, this.player)
                    this.add(obj)
                    const objt = new RenderObject(new Vector(x, y), 180, this.player)
                    obj.vertical = 10
                    this.add(objt)
                }
            }
        }

        this.add(new UI(this.player))
    }
}
