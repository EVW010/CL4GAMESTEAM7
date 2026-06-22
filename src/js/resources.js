import { ImageSource, Loader, SpriteSheet, ImageFiltering, Sprite } from 'excalibur'

const Resources = {
    None: new ImageSource('images/PurpleCheckers.png'),
    flame_bullet: new ImageSource('images/flame-spritesheet.png'),
    Fiend: new ImageSource('images/WasheeWashee.png'),

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
    })
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
    })
}

const ResourceLoader = new Loader()

for (let res of Object.values(Resources)) {
    ResourceLoader.addResource(res)
}

export { Resources, ResourceLoader, Sheets }