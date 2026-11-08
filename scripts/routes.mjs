import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { categories, collections, products } from '../src/catalog.js';

const routes = ['shop', 'collections', 'our-craft', 'contact', 'size-guide', 'shipping-returns', 'care', 'faq', 'checkout',
  ...categories.map(category => 'categories/' + category.toLowerCase()),
  ...collections.map(collection => 'collections/' + collection.id),
  ...products.map(product => 'shop/' + product.id)];

const home = await readFile('dist/index.html', 'utf8');
const interior = home.replace(/<link\b[^>]*\bdata-home-preload\b[^>]*>/g, '');

await Promise.all(routes.map(async route => {
  const dir = 'dist/' + route;
  await mkdir(dir, { recursive: true });
  await writeFile(dir + '/index.html', interior);
}));
await writeFile('dist/404.html', interior);
