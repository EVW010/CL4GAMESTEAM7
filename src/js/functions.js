import { toDegrees, toRadians, Vector } from 'excalibur'

export function addAngle(angle, add) { // magic, just makes angle wrap around blahblah
    let val = angle + add              // probably better way to do this but eh
    if(val > 360) {
        val -= 360
    }
    if(val < 0) {
        val += 360  
    }
    return(val)
}

export function toXY(speed, angle) {       // WHHYY DOES JAVASCRIPT USE RADIANS WHY DID NOBODY TELL ME THIS I AAAAA
    let angledeg = toRadians(angle)        // dir+  -> clockwise? not sure
    let x = speed * Math.sin(angledeg)     // dir=0 -> down
    let y = speed * Math.cos(angledeg)
    return(new Vector(x, y))
} 

export function vectorDiff(from, to) { // gets vector, probably no use but it exists
    let dx = to.x - from.x
    let dy = to.y - from.y
    let temp = new Vector(dx, dy)
    return(temp.normalize())
}

export function getQuadFacing(dir) {
    let slice = (Math.PI * 2) / 4
    let temp = toRadians(dir)
    return Math.round(temp / slice) & 3
}

export function getOctFacing(dir) { // gets octagonal facing based on angle from topdown perspective
    let slice = (Math.PI * 2) / 8
    let temp = toRadians(dir)
    return Math.round(temp / slice) & 7
}
