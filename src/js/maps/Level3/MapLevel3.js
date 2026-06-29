import { Actor, CollisionType, Vector } from 'excalibur'
import wallTexture1Url from './assets/walls/wallspritelevel3-1.png'
import wallTexture2Url from './assets/walls/wallspritelevel3-2.png'
import wallTexture3Url from './assets/walls/wallspritelevel3-3.png'
import doorTextureUrl from './assets/walls/wallspritelevel3-door.png'
import { MapEngine } from '../MapEngine.js'
import { RenderObject } from '../../renderBase/renderbase.js'
import { UI } from '../../ui.js'
import { WallCollider } from '../level1/wall-collider.js'
import { Bush } from '../../enemies/George.js'
import { Lobber } from '../../enemies/Lobber.js'
import { Rock, BigTreeTop, BigTreeBottom } from '../../objects/objects.js'

// . = floor, # = wall
export const MAP = [
    '####################',    
    '#...#B.###.........#',
    '##...........L.....#',    
    '#...........########',
    '#..##########......#',
    '#..#...............#',
    '#....T.......#..#..#',
    '#.......###BL#..#..#',
    '#..#....#D####..#..#',
    '#..##...#...B...#..#',
    '#...#...#########..#',
    '#...#..............#',
    '#...#..B....LR.....#',
    '#..................#',
    '####################',
]

export const isWallTile = (char) => char === '#'

export class MapLevel3 extends MapEngine {
    constructor(player) {
        super(player)
        this.map = MAP
        this.wallTextureMap = {}
        this.skyColor = 'rgb(140, 145, 155)'
        this.floorColor = 'rgb(82, 74, 58)'
    }

    isWallTile(char) {
        return char === '#' || char === 'D'
    }

    getSceneTransition(char) {
        return char === 'D' ? 'level4' : null
    }

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

    onMapSetup(engine) {
        const urls = [wallTexture1Url, wallTexture2Url, wallTexture3Url]
        this.wallImgs = urls.map(url => {
            const img = new Image()
            img.src = url
            return img
        })
        this.wallImgsLoaded = [false, false, false]
        this.wallImgs.forEach((img, i) => {
            img.onload = () => { this.wallImgsLoaded[i] = true }
        })

        this.doorImg = new Image()
        this.doorImg.src = doorTextureUrl
        this.doorImgLoaded = false
        this.doorImg.onload = () => { this.doorImgLoaded = true }

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

                if (this.map[y][x] === 'B') {
                    const obj = new Bush(new Vector(x + 0.5, y + 0.5), 90, this.player)
                    this.add(obj)
                }

                if (this.map[y][x] === 'L') {
                    const obj = new Lobber(new Vector(x + 0.5, y + 0.5), 90, this.player)
                    this.add(obj)
                }

                if (this.map[y][x] === 'R') {
                    const obj = new Rock(new Vector(x + 0.5, y + 0.5), 90, this.player)
                    this.add(obj)
                }

                if (this.map[y][x] === 'T') {
                    const obj = new BigTreeBottom(new Vector(x + 0.5, y + 0.5), 90, this.player)
                    this.add(obj)
                    const objt = new BigTreeTop(new Vector(x + 0.5, y + 0.5), 180, this.player)
                    objt.vertical = 10
                    this.add(objt)
                }
            }
        }

        this.add(new UI(this.player))
    }
}
