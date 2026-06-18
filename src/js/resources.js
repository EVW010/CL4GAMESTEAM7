import { ImageSource, Loader, SpriteSheet, ImageFiltering, Sound } from 'excalibur'

const Resources = {
    None: new ImageSource('images/PurpleCheckers.png'),

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

    PistolShot: new Sound('sounds/pistol-shot.mp3'),
    Choking: new Sound('sounds/choking.mp3'),
    WalkingGrass: new Sound('sounds/walking-grass.mp3')
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
}

const ResourceLoader = new Loader()

for (let res of Object.values(Resources)) {
    ResourceLoader.addResource(res)
}

export { Resources, ResourceLoader, Sheets }