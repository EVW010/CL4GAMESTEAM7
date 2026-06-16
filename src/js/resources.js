import { ImageSource, Sound, Resource, Loader, SpriteSheet, Sprite } from 'excalibur'

// voeg hier jouw eigen resources toe
const Resources = {
    // Sprite: new ImageSource('images/sprite.png')
    None: new ImageSource('images/PurpleCheckers.png')
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