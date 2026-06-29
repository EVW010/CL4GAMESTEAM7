import { ImageSource, Loader, SpriteSheet, ImageFiltering, Sprite } from 'excalibur'
import { PaintSplatter } from './weapons/paint-splatter'

const Resources = {
    None: new ImageSource('images/PurpleCheckers.png'),
    flame_bullet: new ImageSource('images/flame-spritesheet.png'),
    Fiend: new ImageSource('images/WasheeWashee.png'),
    Shrubbery: new ImageSource('images/shrub.png'),
    MadShrub: new ImageSource('images/shrubattack.png'),
    BurnerWeapon: new ImageSource('images/ui/burner-weapon.png'),
    OxygenMask: new ImageSource('images/ui/oxygen-mask.png'),
    CanWeapon: new ImageSource('images/ui/metal-can.png'),
    CanBullet: new ImageSource('images/metal-can-bullet.png'),
    CanAllert: new ImageSource('images/can-allert.png'),
    Lobber : new ImageSource('./images/Lobber.png'),
    LobberWalk : new ImageSource('./images/LobberWalk.png'),
    BrushWeapon: new ImageSource('images/ui/brush-weapon.png'),
    PaintSplatter: new ImageSource('images/ui/paint-splatter.png'),
    Fists: new ImageSource('images/ui/fists.png'),

    Pillar: new ImageSource('images/pillar.png'),
    Rock: new ImageSource('images/rock.png'),
    Corpo: new ImageSource('images/corpocarwyn.png'),
    TreeTop: new ImageSource('images/bigtreetop.png'),
    TreeBottom: new ImageSource('images/bigtreebottom.png'),

    BarBorderVertical: new ImageSource('images/ui/bar-border-vertical.png', {
        filtering: ImageFiltering.Pixel
    }),

    BarBorderHorizontal: new ImageSource('images/ui/bar-border-horizontal.png', {
        filtering: ImageFiltering.Pixel
    }),

    BarFillHealth: new ImageSource('images/ui/bar-fill-health.png', {
        filtering: ImageFiltering.Pixel
    }),

    BarFillOxygen: new ImageSource('images/ui/bar-fill-oxygen.png', {
        filtering: ImageFiltering.Pixel
    }),
}

const Sheets = {
    None: SpriteSheet.fromImageSource({
        image: Resources.None,
        grid: {
            rows: 8,
            columns: 2,
            spriteHeight: 64,
            spriteWidth: 64,
        }
    }),
    flame_bullet: SpriteSheet.fromImageSource({
        image: Resources.flame_bullet,
        grid: {
            rows: 1,
            columns: 6,
            spriteHeight: 64,
            spriteWidth: 64,
        }
    }),
    Fiend: SpriteSheet.fromImageSource({
        image: Resources.Fiend,
        grid: {
            rows: 1,
            columns: 1,
            spriteHeight: 64,
            spriteWidth: 64
        }
    }),
    Can: SpriteSheet.fromImageSource({
        image: Resources.CanBullet,
        grid: {
            rows: 1,
            columns: 1,
            spriteHeight: 800,
            spriteWidth: 800
        }
    }),
    CanAllert: SpriteSheet.fromImageSource({
        image: Resources.CanAllert,
        grid: {
            rows: 1,
            columns: 1,
            spriteHeight: 128,
            spriteWidth: 128
        }
    }),
    Shrub: SpriteSheet.fromImageSource({
        image: Resources.Shrubbery,
        grid: {
            rows: 8,
            columns: 6,
            spriteHeight: 64,
            spriteWidth: 64,
        }
    }),
    ShrubAttack: SpriteSheet.fromImageSource({
        image: Resources.MadShrub,
        grid: {
            columns: 18,
            rows: 1,
            spriteHeight: 64,
            spriteWidth: 64,
        },
    }),
    Lobber: SpriteSheet.fromImageSource({
        image: Resources.Lobber,
        grid: {
            columns: 1,
            rows: 8,
            spriteHeight: 64,
            spriteWidth: 64,
        },
    }),
    LobberWalk: SpriteSheet.fromImageSource({
        image: Resources.LobberWalk,
        grid: {
            columns: 2,
            rows: 8,
            spriteHeight: 64,
            spriteWidth: 64,
        },
    }),
    PaintSplatter: SpriteSheet.fromImageSource({
        image: Resources.PaintSplatter,
        grid: {
            columns: 5,
            rows: 1,
            spriteHeight: 72,
            spriteWidth: 128,
        },
    }),
    Pillar: SpriteSheet.fromImageSource({
        image: Resources.Pillar,
        grid: {
            columns: 1,
            rows: 1,
            spriteHeight: 64,
            spriteWidth: 64,
        },
    }),
    Rock: SpriteSheet.fromImageSource({
        image: Resources.Rock,
        grid: {
            columns: 1,
            rows: 1,
            spriteHeight: 64,
            spriteWidth: 64,
        },
    }),
    Corpo: SpriteSheet.fromImageSource({
        image: Resources.Corpo,
        grid: {
            columns: 1,
            rows: 1,
            spriteHeight: 512,
            spriteWidth: 512,
        },
    }),
    TreeBottom: SpriteSheet.fromImageSource({
        image: Resources.TreeBottom,
        grid: {
            columns: 1,
            rows: 1,
            spriteHeight: 64,
            spriteWidth: 64,
        },
    }),
    TreeTop: SpriteSheet.fromImageSource({
        image: Resources.TreeTop,
        grid: {
            columns: 1,
            rows: 1,
            spriteHeight: 64,
            spriteWidth: 64,
    Fists: SpriteSheet.fromImageSource({
        image: Resources.Fists,
        grid: {
            columns: 2,
            rows: 1,
            spriteHeight: 72,
            spriteWidth: 128,
        },
    }),
}

const ResourceLoader = new Loader()

for (let res of Object.values(Resources)) {
    ResourceLoader.addResource(res)
}

export { Resources, ResourceLoader, Sheets }