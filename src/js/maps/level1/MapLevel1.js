import { Actor, CollisionType, Vector } from 'excalibur'
import wallTexture1Url from './assets/wallspritelevel1-1.png'
import wallTexture2Url from './assets/wallspritelevel1-2.jpg'
import doorTextureUrl from './assets/wallspritelevel1-door.png'
import { MapEngine } from '../MapEngine.js'
import { RenderObject } from '../../renderBase/renderbase.js'
import { UI } from '../../ui.js'
import { WallCollider } from './wall-collider.js'
import { Bush } from '../../enemies/George.js'
import { Lobber } from '../../enemies/Lobber.js'
import { CorpoJoe, Pillar } from '../../objects/objects.js'


// . = floor, # = wall, D = door
export const MAP = [
    '#################',
    '#...............#',
    '#.#######.###.###',
    '#....#....#.....#',
    '#.#C.#C.#.#.P.P.#',
    '#.#######....C..D',
    '#.#.C#C.#.#.P.P.#',
    '#....#....#.....#',
    '#.#######.###.###',
    '#...............#',
    '#################',
]

export const isWallTile = (char) => char === '#' || char === 'D' || char === 'L'

export class MapLevel1 extends MapEngine {
    constructor(player) {
        super(player)
        this.map = MAP
        this.wallTextureMap = {}
        this.skyColor = 'rgb(30, 35, 45)'
        this.floorColor = 'rgb(55, 58, 65)'
        this.player.resetPlayer()
    }
    

    isWallTile(char) {
        return char === '#' || char === 'D' || char === 'L'
    }

    getSceneTransition(char) {
        return char === 'D' ? 'level2' : null
    }

    // Return the color for the mini-map based on the tile type
    getMiniMapColor(tile) {
        if (tile === '#') return 'rgb(150, 0, 150)'
        if (tile === 'D') return 'rgb(244, 0, 0)'
        return 'rgb(0, 0, 0)'
    }

    getTexture(tileType, mapX, mapY) {
        if (tileType === 'D') {
            return { img: this.doorImg, loaded: this.doorImgLoaded }
        }
        const idx = this.wallTextureMap[`${mapX},${mapY}`] ?? 0
        return { img: this.wallImgs[idx], loaded: this.wallImgsLoaded[idx] }
    }

    // Setup the map by adding wall colliders and render objects based on the map layout
    onMapSetup(engine) {
        const urls = [wallTexture1Url, wallTexture2Url]
        this.wallImgs = urls.map(url => {
            const img = new Image()
            img.src = url
            return img
        })
        this.wallImgsLoaded = [false, false]
        this.wallImgs.forEach((img, i) => {
            img.onload = () => { this.wallImgsLoaded[i] = true }
        })

        this.doorImg = new Image()
        this.doorImg.src = doorTextureUrl
        this.doorImgLoaded = false
        this.doorImg.onload = () => { this.doorImgLoaded = true }

        const wallPositions = []
        for (let y = 0; y < this.map.length; y++) {
            for (let x = 0; x < this.map[y].length; x++) {
                if (this.map[y][x] === '#') wallPositions.push({ x, y })
            }
        }
        for (let i = wallPositions.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1))
            ;[wallPositions[i], wallPositions[j]] = [wallPositions[j], wallPositions[i]]
        }
        wallPositions.forEach(({ x, y }, i) => {
            this.wallTextureMap[`${x},${y}`] = i % 2
        })

        for (let y = 0; y < this.map.length; y++) {
            for (let x = 0; x < this.map[y].length; x++) {
                if (this.isWallTile(this.map[y][x])) {
                    const wall = new WallCollider(new Vector(x, y))
                    this.add(wall)
                }

                if (this.map[y][x] === '0') {
                    const obj = new Lobber(new Vector(x, y), 90, this.player)
                    this.add(obj)
                }   

                if (this.map[y][x] === 'P') {
                    const obj = new Pillar(new Vector(x + 0.5, y + 0.5), 90, this.player)
                    this.add(obj)
                }
                if (this.map[y][x] === 'C') {
                    const obj = new CorpoJoe(new Vector(x + 0.5, y + 0.5), 90, this.player)
                    this.add(obj)
                }
            }
        }

        this.add(new UI(this.player))
    }
}
