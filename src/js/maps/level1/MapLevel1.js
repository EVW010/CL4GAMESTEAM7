import { Actor, CollisionType, Vector } from 'excalibur'
import wallTextureUrl from './assets/walls/wall1.png'
import treewallTextureUrl from './assets/walls/treewall.png'
import doorTextureUrl from './assets/walls/door.png'
import { MapEngine } from '../MapEngine.js'
import { RenderObject } from '../../renderBase/renderbase.js'
import { UI } from '../../ui.js'

// . = floor, # = wall, T = treewall, D = door
export const MAP = [
    '####################',
    '#..................#',
    '#.##..#.....#.#.##.#',
    '#.#0........#..#.#.#',
    '#.#....0....TTTT.#.#',
    '#..................D',
    '#.#.TTTT.#.#.####..#',
    '#.#.........#.#..#.#',
    '#.##..#.TTT.#.#.##.#',
    '#..................#',
    '####################',
]

export const isWallTile = (char) => char === '#' || char === 'T' || char === 'D'

export class MapLevel1 extends MapEngine {
    constructor(player) {
        super(player)
        this.map = MAP
    }

    isWallTile(char) {
        return char === '#' || char === 'T' || char === 'D'
    }

    getMiniMapColor(tile) {
        if (tile === 'T') return 'rgb(0, 150, 0)'
        if (tile === '#') return 'rgb(150, 0, 150)'
        if (tile === 'D') return 'rgb(120, 70, 0)'
        return 'rgb(0, 0, 0)'
    }

    getTexture(tileType) {
        if (tileType === 'T') return { img: this.treewallImg, loaded: this.treewallImgLoaded }
        if (tileType === 'D') return { img: this.doorImg, loaded: this.doorImgLoaded }
        return { img: this.wallImg, loaded: this.wallImgLoaded }
    }

    onMapSetup(engine) {
        this.wallImg = new Image()
        this.wallImg.src = wallTextureUrl
        this.wallImgLoaded = false
        this.wallImg.onload = () => { this.wallImgLoaded = true }

        this.treewallImg = new Image()
        this.treewallImg.src = treewallTextureUrl
        this.treewallImgLoaded = false
        this.treewallImg.onload = () => { this.treewallImgLoaded = true }

        this.doorImg = new Image()
        this.doorImg.src = doorTextureUrl
        this.doorImgLoaded = false
        this.doorImg.onload = () => { this.doorImgLoaded = true }

        for (let y = 0; y < this.map.length; y++) {
            for (let x = 0; x < this.map[y].length; x++) {
                if (this.isWallTile(this.map[y][x])) {
                    const wall = new Actor({ collisionType: CollisionType.Fixed })
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
