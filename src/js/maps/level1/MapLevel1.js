import { Actor, CollisionType, Vector } from 'excalibur'
import wallTexture1Url from './assets/walls/wallspritelevel1-1.png'
import wallTexture2Url from './assets/walls/wallspritelevel1-2.png'
import wallTexture3Url from './assets/walls/wallspritelevel1-3.png'
import wallTextureLoraxUrl from './assets/walls/wallspritelevel1-lorax.png'
import wallTextureDoorUrl from './assets/walls/wallspritelevel1-door.png'
import { MapEngine } from '../MapEngine.js'
import { RenderObject } from '../../renderBase/renderbase.js'
import { UI } from '../../ui.js'
import { WallCollider } from './wall-collider.js'
import { Bush } from '../../enemies/George.js'


// . = floor, # = wall, D = door
export const MAP = [
    '####################',
    '#..................#',
    '#.##..#.....#.#.##.#',
    '#.#0........#..#.#.#',
    '#.#....0....####.#.#',
    '#..................D',
    '#.#.####.#.#.####..#',
    '#.#.........#.#..#.#',
    '#.##..#.###...#.##.#',
    '#..................#',
    '##################L#',
]

export const isWallTile = (char) => char === '#' || char === 'D' || char === 'L'

export class MapLevel1 extends MapEngine {
    constructor(player) {
        super(player)
        this.map = MAP
        this.wallTextureMap = {}
        this.skyColor = 'rgb(55, 75, 92)'
        this.floorColor = 'rgb(45, 65, 25)'
    }
    

    isWallTile(char) {
        return char === '#' || char === 'D' || char === 'L'
    }

    getSceneTransition(char) {
        return char === 'D' ? 'level2' : null
    }

    getMiniMapColor(tile) {
        if (tile === '#') return 'rgb(150, 0, 150)'
        if (tile === 'D') return 'rgb(120, 70, 0)'
        if (tile === 'L') return 'rgb(255, 140, 0)'
        return 'rgb(0, 0, 0)'
    }

    getTexture(tileType, mapX, mapY) {
        if (tileType === 'L') return { img: this.wallImgs[3], loaded: this.wallImgsLoaded[3] }
        if (tileType === 'D') return { img: this.wallImgs[4], loaded: this.wallImgsLoaded[4] }
        const idx = this.wallTextureMap[`${mapX},${mapY}`] ?? 0
        return { img: this.wallImgs[idx], loaded: this.wallImgsLoaded[idx] }
    }

    onMapSetup(engine) {
        const urls = [wallTexture1Url, wallTexture2Url, wallTexture3Url, wallTextureLoraxUrl, wallTextureDoorUrl]
        this.wallImgs = urls.map(url => {
            const img = new Image()
            img.src = url
            return img
        })
        this.wallImgsLoaded = [false, false, false, false, false]
        this.wallImgs.forEach((img, i) => {
            img.onload = () => { this.wallImgsLoaded[i] = true }
        })

        // random wall textures
        const wallPositions = []
        for (let y = 0; y < this.map.length; y++) {
            for (let x = 0; x < this.map[y].length; x++) {
                if (this.isWallTile(this.map[y][x])) {
                    wallPositions.push({ x, y })
                }
            }
        }
        for (let i = wallPositions.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1))
            ;[wallPositions[i], wallPositions[j]] = [wallPositions[j], wallPositions[i]]
        }
        wallPositions.forEach(({ x, y }, i) => {
            this.wallTextureMap[`${x},${y}`] = i % 3
        })

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
