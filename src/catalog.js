export const categories = ['Rings', 'Necklaces', 'Earrings', 'Bracelets'];
export const collections = [
  { id: 'blue-hour', name: 'Blue Hour', image: 'editorial-1', line: 'A study in cool light, warm gold, and the hour in between.' },
  { id: 'soft-forms', name: 'Soft Forms', image: 'editorial-2', line: 'Curves, softened edges, and pieces that feel familiar from the first wear.' },
  { id: 'daybreak', name: 'Daybreak', image: 'editorial-3', line: 'Small glints of light, made to move with you.' },
];

const assortment = [
  [
    ['Vesper Ring', 580, 'An oval green tourmaline held in a low, polished bezel.', 'Green tourmaline'],
    ['Dune Band', 410, 'A softly domed band with a broad sweep of polished gold.'],
    ['Aster Ring', 465, 'Three points of light set into a slim gold band.', 'Lab-grown diamond'],
    ['Lune Ring', 320, 'A luminous freshwater pearl on a delicate band.', 'Freshwater pearl'],
    ['Noir Signet', 495, 'A dark onyx face framed by a softly squared shoulder.', 'Black onyx'],
    ['Rill Band', 350, 'A lightly hammered surface that catches the light as you move.'],
  ],
  [
    ['Vesper Pendant', 460, 'An oval green stone on a fine, adjustable chain.', 'Green tourmaline'],
    ['Serein Chain', 340, 'An understated chain with fine links and a soft shine.'],
    ['First Light Pendant', 510, 'A single bright diamond held close on a fine chain.', 'Lab-grown diamond'],
    ['Mira Pearl Necklace', 395, 'An irregular pearl suspended from a delicate gold chain.', 'Freshwater pearl'],
    ['Sol Medallion', 485, 'A round pendant etched with fine rays that catch the light.'],
    ['Tide Pendant', 370, 'A rounded gold drop with the weight and softness of a pebble.'],
  ],
  [
    ['Dune Hoops', 385, 'Rounded hoops with a full profile and a smooth finish.'],
    ['Mira Drops', 350, 'Two freshwater pearls that move gently below the ear.', 'Freshwater pearl'],
    ['Vesper Studs', 275, 'A close-set pair of green stones framed in polished gold.', 'Green tourmaline'],
    ['Twine Hoops', 365, 'A subtle twist in gold, small enough to wear every day.'],
    ['Aster Studs', 450, 'A pair of fine diamond studs with a low profile.', 'Lab-grown diamond'],
    ['Reed Drops', 315, 'Slender gold drops that turn softly with each step.'],
  ],
  [
    ['Arc Cuff', 425, 'An open cuff with rounded ends and a polished curve.'],
    ['Serein Bracelet', 295, 'A neat line of gold links, finished with a small clasp.'],
    ['Vesper Bracelet', 360, 'A single green stone on a delicate bracelet chain.', 'Green tourmaline'],
    ['Dune Bangle', 650, 'A wide, softly sculpted bangle with a polished surface.'],
    ['Mira Pearl Bracelet', 330, 'A strand of luminous freshwater pearls.', 'Freshwater pearl'],
    ['Twine Bracelet', 285, 'A fine rope chain with a warm, textured shine.'],
  ],
];
export const products = assortment.flatMap((items, row) => items.map(([name, price, description, stone], column) => ({
  id: name.toLowerCase().replaceAll(' ', '-'), name, price, description, stone,
  category: categories[row], collection: collections[column % 3].id, image: 'piece-' + (row * 6 + column + 1),
  sku: 'LY-' + categories[row].slice(0, 3).toUpperCase() + '-' + String(column + 1).padStart(2, '0'),
  material: '14k yellow gold', fresh: column === 0 || column === 3,
  sizes: row === 0 ? ['5', '6', '7', '8', '9'] : row === 1 ? ['16 in', '18 in'] : row === 3 ? ['6.5 in', '7 in', '7.5 in'] : [],
})));
export const productById = Object.fromEntries(products.map(product => [product.id, product]));
export const featured = products[0];
export const money = price => new Intl.NumberFormat('en-US', {style:'currency', currency:'USD'}).format(price);
export const image = name => '/images/' + name + '.jpg';
