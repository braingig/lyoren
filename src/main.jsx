import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Link, NavLink, Route, Routes, useLocation, useParams, useSearchParams } from 'react-router-dom';
import { categories, collections, featured, image, money, productById, products } from './catalog';
import { CampaignVideo, FooterWordmark, PointerMotion } from './motion';
import './style.css';
import './motion.css';

const Store = createContext();
const paths = { shop:'/shop', collections:'/collections', craft:'/our-craft', contact:'/contact' };
const categoryPath = name => '/categories/' + name.toLowerCase();
const productPath = product => '/shop/' + product.id;
const glyphs = {
  search: <><circle cx="10.8" cy="10.8" r="6.7"/><path d="m16 16 4 4"/></>,
  bag: <><path d="M4 7h16l1 14H3L4 7Z"/><path d="M8 9V6a4 4 0 0 1 8 0v3"/></>,
  menu: <path d="M3 6h18M3 12h18M3 18h18"/>,
  close: <path d="m5 5 14 14M19 5 5 19"/>,
  down: <path d="m6 9 6 6 6-6"/>,
  right: <path d="M3 12h17m-6-6 6 6-6 6"/>,
  minus: <path d="M5 12h14"/>,
  plus: <path d="M5 12h14M12 5v14"/>,
};
function Icon({ name, size = 20 }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.35" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{glyphs[name]}</svg>;
}
function Photo({ name, alt = '', eager = false, ...props }) {
  return <img src={image(name)} alt={alt} loading={eager ? 'eager' : 'lazy'} decoding="async" {...props}/>;
}
function Action({ to, children, inverse = false }) {
  return <Link className={'action' + (inverse ? ' inverse' : '')} to={to}>{children}</Link>;
}
function Header() {
  const { setOverlay, count } = useContext(Store);
  const messages = ['Fine jewelry in 14k gold', 'Natural textures, thoughtful details', 'Pieces for every day', 'Complimentary insured shipping'];
  return <header>
    <div className="ticker" aria-label={messages.join('. ')}><div className="ticker-track" aria-hidden="true">
      {[0, 1, 2, 3].map(set => <div key={set} className="ticker-run">{messages.map(message => <React.Fragment key={message}><span>{message}</span><i>·</i></React.Fragment>)}</div>)}
    </div></div>
    <div className="navbar">
      <nav className="nav-left" aria-label="Browse">
        <details className="nav-dropdown"><summary>Categories <Icon name="down" size={13}/></summary><div className="drop-panel">{categories.map(category => <Link key={category} to={categoryPath(category)} onClick={event => event.currentTarget.closest('details').open = false}>{category}</Link>)}</div></details>
        <NavLink to={paths.shop}>Shop</NavLink><NavLink to={paths.collections}>Collections</NavLink>
      </nav>
      <Link to="/" aria-label="Lyoren home" className="wordmark">LYOREN</Link>
      <div className="nav-right">
        <nav className="nav-links" aria-label="About"><NavLink to={paths.craft}>Our Craft</NavLink><NavLink to={paths.contact}>Contact</NavLink></nav>
        <div className="nav-icons">
          <button className="icon-button mobile-menu" aria-label="Open menu" onClick={() => setOverlay('menu')}><Icon name="menu"/></button>
          <button className="icon-button" aria-label="Search jewelry" onClick={() => setOverlay('search')}><Icon name="search"/></button>
          <button className="icon-button bag-icon" aria-label={`Open bag, ${count} items`} onClick={() => setOverlay('bag')}><Icon name="bag"/><span>{count}</span></button>
        </div>
      </div>
    </div>
  </header>;
}
function Footer() {
  return <footer className="footer">
    <div className="footer-columns page-width">
      <div><span className="eyebrow">Explore</span>{categories.map(category => <Link key={category} to={categoryPath(category)}>{category}</Link>)}<Link to="/shop">All jewelry</Link></div>
      <div><span className="eyebrow">House</span><Link to="/collections">Collections</Link><Link to="/our-craft">Our craft</Link><Link to="/contact">Contact</Link></div>
      <div><span className="eyebrow">Care</span><Link to="/size-guide">Size guide</Link><Link to="/shipping-returns">Shipping & returns</Link><Link to="/care">Jewelry care</Link><Link to="/faq">FAQ</Link></div>
      <div className="footer-note"><span className="eyebrow">The studio</span><h2>Find a piece to make your own.</h2><Link to="/shop">Explore the jewelry <Icon name="right" size={16}/></Link></div>
    </div>
    <FooterWordmark/>
    <div className="footer-bottom page-width"><span>© {new Date().getFullYear()} Lyoren</span><Link to="/shipping-returns">Shipping & returns</Link></div>
  </footer>;
}
function ProductCard({ product }) {
  const { add } = useContext(Store);
  return <article className="product-card" data-reveal>
    <div className="product-art">
      <Link className="product-picture" to={productPath(product)} aria-label={product.name}><Photo name={product.image}/></Link>
      <div className="quick">{product.sizes.length ? <Link to={productPath(product)}>Select options</Link> : <button onClick={() => add(product)}>Add to bag</button>}</div>
    </div>
    <h3><Link to={productPath(product)}>{product.name}</Link></h3><p>{money(product.price)}</p>
  </article>;
}
function Intro({ kicker, title, children }) {
  return <section className="intro"><p className="eyebrow">{kicker}</p><h1>{title}</h1>{children && <p className="intro-line">{children}</p>}</section>;
}
function Home() {
  return <>
    <section className="hero" data-cursor-light>
      <CampaignVideo/>
      <div className="hero-content">
        <p className="eyebrow">Fine jewelry for every day</p>
        <h1><span>Made for</span> <span>the years</span></h1>
        <p>Warm gold and quietly distinctive stones. Jewelry to wear on your own terms.</p>
        <Action to="/shop" inverse>Explore the collection</Action>
      </div>
    </section>
    <section className="category-section page-width">
      <p className="eyebrow" data-reveal>Shop by category</p>
      <div className="category-grid">{categories.map((category, i) => <Link to={categoryPath(category)} className="category-tile" key={category} data-reveal style={{'--delay':i * 80 + 'ms'}}><Photo name={'piece-' + (i * 6 + 1)}/><span>{category}<Icon name="right" size={15}/></span></Link>)}</div>
    </section>
    <section className="feature">
      <div className="feature-picture" data-reveal="image"><Photo name="feature" alt="Vesper Ring on blue-gray stone"/></div>
      <div className="feature-copy" data-reveal><p className="eyebrow">A closer look</p><h2>{featured.name}</h2><p>{featured.description}</p><span>{money(featured.price)}</span><Action to={productPath(featured)}>Discover the Vesper</Action></div>
    </section>
    <section className="page-width home-products">
      <div className="section-heading" data-reveal><div><p className="eyebrow">New arrivals</p><h2>New this season</h2></div><Link className="text-link" to="/shop?edit=new">View all new <Icon name="right" size={16}/></Link></div>
      <div className="product-grid home-grid">{[products[3], products[6], products[12], products[18]].map(product => <ProductCard key={product.id} product={product}/>)}</div>
    </section>
    <section className="craft-band" data-cursor-light><Photo name="editorial-4"/><div className="craft-copy" data-reveal><p className="eyebrow">Our craft</p><h2>The work behind<br/>the shine</h2><p>From the first sketch to the final polish, each detail earns its place.</p><Action to="/our-craft" inverse>Discover our craft</Action></div></section>
    <section className="editorial-band page-width">
      <Link className="editorial-tile" to="/collections/blue-hour" aria-label="Explore Blue Hour" data-reveal><Photo name="editorial-1"/></Link>
      <div data-reveal><p className="eyebrow">The Blue Hour edit</p><h2>Jewelry in a<br/>different light.</h2><Link className="text-link" to="/collections/blue-hour">Explore Blue Hour <Icon name="right" size={16}/></Link></div>
    </section>
    <section className="closing" data-reveal><p>“A little gold goes a long way.”</p><span className="eyebrow">The Lyoren studio</span></section>
  </>;
}
function Shop({ category, collection }) {
  const [params, setParams] = useSearchParams();
  const fresh = params.get('edit') === 'new';
  const selected = category || params.get('category') || '';
  const stone = params.get('stone') || '';
  const price = params.get('price') || '';
  const sort = params.get('sort') || '';
  const [limit, setLimit] = useState(12);
  const change = (key, value) => {
    const next = new URLSearchParams(params);
    if (value) next.set(key, value); else next.delete(key);
    setLimit(12);
    setParams(next, { replace: true });
  };
  const list = products.filter(p => (!selected || p.category === selected) && (!collection || p.collection === collection.id)
    && (!stone || (p.stone || 'Plain gold') === stone) && (!price || (price === 'under' ? p.price < 400 : p.price >= 400)) && (!fresh || p.fresh));
  if (sort === 'asc') list.sort((a,b) => a.price - b.price);
  if (sort === 'desc') list.sort((a,b) => b.price - a.price);
  if (sort === 'name') list.sort((a,b) => a.name.localeCompare(b.name));
  const lines = { Rings:'Soft edges, clean lines, and a little light for your hands.', Necklaces:'Fine chains and pendants to wear close.', Earrings:'Small statements, made to move with you.', Bracelets:'Gold and stones with room to move.' };
  return <>
    <Intro kicker={collection ? 'The collections' : 'The jewelry'} title={collection?.name || category || (fresh ? 'New arrivals' : 'All jewelry')}>{collection?.line || lines[category] || 'Fine gold, pearls, and stones with a character of their own.'}</Intro>
    <div className="filter-frame"><div className="filters page-width">
      {!category && <label><span>Category</span><select value={selected} onChange={e => change('category', e.target.value)}><option value="">All</option>{categories.map(item => <option key={item}>{item}</option>)}</select></label>}
      <label><span>Stone</span><select value={stone} onChange={e => change('stone', e.target.value)}><option value="">All</option>{[...new Set(products.map(p => p.stone || 'Plain gold'))].map(item => <option key={item}>{item}</option>)}</select></label>
      <label><span>Price</span><select value={price} onChange={e => change('price', e.target.value)}><option value="">All</option><option value="under">Under $400</option><option value="over">$400 and above</option></select></label>
      <label className="sort"><span>Sort</span><select value={sort} onChange={e => change('sort', e.target.value)}><option value="">Featured</option><option value="name">Name</option><option value="asc">Price, low to high</option><option value="desc">Price, high to low</option></select></label>
    </div></div>
    <section className="page-width catalog" aria-label="Products">
      <p className="eyebrow count" role="status">{list.length} {list.length === 1 ? 'piece' : 'pieces'}</p>
      {list.length ? <div className="product-grid">{list.slice(0, limit).map(product => <ProductCard key={product.id} product={product}/>)}</div> : <div className="empty"><h2>No pieces match these filters.</h2><button className="action" onClick={() => {setLimit(12); setParams(fresh ? {edit:'new'} : {});}}>Clear filters</button></div>}
      {list.length > limit && <button className="action load-more" onClick={() => setLimit(limit + 12)}>Load more</button>}
    </section>
  </>;
}
function CategoryRoute() {
  const { slug } = useParams();
  const category = categories.find(item => item.toLowerCase() === slug);
  return category ? <Shop key={slug} category={category}/> : <Missing/>;
}
function CollectionRoute() {
  const { slug } = useParams();
  const collection = collections.find(item => item.id === slug);
  return collection ? <Shop key={slug} collection={collection}/> : <Missing/>;
}
function Collections() {
  return <><Intro kicker="The jewelry" title="Collections">Three ways to find a piece that feels like yours.</Intro><section className="collection-grid page-width">{collections.map((collection, i) => <Link data-reveal style={{'--delay':i * 80 + 'ms'}} className="collection-card" to={'/collections/' + collection.id} key={collection.id}><Photo name={collection.image}/><div><p className="eyebrow">Collection</p><h2>{collection.name}</h2><span className="action inverse">Explore</span></div></Link>)}</section></>;
}
function ProductRoute() {
  const { slug } = useParams();
  return productById[slug] ? <Product key={slug} product={productById[slug]}/> : <Missing/>;
}
function Product({ product }) {
  const { add } = useContext(Store);
  const [size, setSize] = useState('');
  const [sizeError, setSizeError] = useState(false);
  const [photoIndex, setPhotoIndex] = useState(0);
  const photos = product.id === featured.id ? [product.image, 'feature'] : [product.image];
  const related = products.filter(p => p.category === product.category && p.id !== product.id).slice(0, 3);
  return <>
    <section className="product-detail page-width">
      <div className="gallery">
        <div className="main-photo"><Photo key={photos[photoIndex]} name={photos[photoIndex]} alt={photoIndex ? product.name + ' detail view' : product.name} eager/></div>
        {photos.length > 1 && <div className="thumbs">{photos.map((photo, index) => <button aria-label={'Show photo ' + (index + 1)} aria-pressed={photoIndex === index} key={photo} onClick={() => setPhotoIndex(index)}><Photo name={photo}/></button>)}</div>}
      </div>
      <div className="product-info">
        <nav aria-label="Breadcrumb" className="eyebrow breadcrumbs"><Link to="/">Home</Link> / <Link to="/shop">Shop</Link> / <Link to={categoryPath(product.category)}>{product.category}</Link></nav>
        <h1>{product.name}</h1><p className="product-price">{money(product.price)}</p><p className="product-description">{product.description}</p>
        <p className="eyebrow material-label">Metal</p><div className="metal"><span></span>{product.material}</div>
        {!!product.sizes.length && <fieldset className="size-field"><legend className="eyebrow">{product.category === 'Rings' ? 'Size' : 'Length'}</legend><Link to="/size-guide" className="eyebrow size-guide">Size guide</Link><div className="size-options">{product.sizes.map(value => <button key={value} aria-pressed={size === value} onClick={() => {setSize(value); setSizeError(false);}}>{value}</button>)}</div></fieldset>}
        {sizeError && <p className="size-error" role="alert">Choose an option before adding this piece.</p>}
        <button className="action filled buy" onClick={() => product.sizes.length && !size ? setSizeError(true) : add(product, size)}>Add to bag</button>
        <p className="shipping-note">Complimentary insured shipping</p>
        <ul className="product-promises"><li>Presented in a Lyoren jewelry box</li><li><Link to="/shipping-returns">Shipping and returns</Link></li></ul>
      </div>
    </section>
    <section className="page-width particulars" data-reveal><p className="eyebrow">The particulars</p><h2>Materials & details</h2><dl><div><dt>Metal</dt><dd>{product.material}</dd></div>{product.stone && <div><dt>Stone</dt><dd>{product.stone}</dd></div>}<div><dt>Reference</dt><dd>{product.sku}</dd></div></dl>
      <details><summary>Care instructions <Icon name="plus" size={17}/></summary><p>Wipe gently with a clean, soft cloth and store separately in its pouch. Keep away from harsh cleaners and take it off before swimming.</p></details>
      <details><summary>Packaging & gifting <Icon name="plus" size={17}/></summary><p>Each piece arrives in a Lyoren jewelry box with a soft pouch for safekeeping.</p></details>
    </section>
    <section className="page-width home-products"><div className="section-heading" data-reveal><div><p className="eyebrow">Wear it with</p><h2>In good company</h2></div></div><div className="product-grid">{related.map(item => <ProductCard product={item} key={item.id}/>)}</div></section>
  </>;
}
function Craft() {
  return <>
    <Intro kicker="The studio" title="A quieter kind of craft">A piece starts with a line on paper and takes shape in the hands of a jeweler.</Intro>
    <div className="page-width craft-hero" data-reveal="image"><Photo name="editorial-4" alt="A jeweler shaping a ring by hand"/></div>
    <section className="page-width story-grid">
      <div data-reveal><p className="eyebrow">01 · The process</p><h2>Small details, close attention.</h2><p>We look closely at the things you feel first. The weight of a band, the edge of a setting, the way a chain moves against the skin.</p></div>
      <div data-reveal><p className="eyebrow">02 · The materials</p><h2>Gold, stones and pearls.</h2><p>We choose 14k gold for its warmth and strength, and let the character of each stone guide the setting.</p></div>
    </section>
    <section className="closing"><p>Find your everyday piece.</p><Action to="/shop">Explore the jewelry</Action></section>
  </>;
}
const support = {
  'size-guide': { title:'Size guide', line:'A comfortable fit starts with a simple measurement.', entries:[
    ['Rings','Measure the inside diameter of a ring that fits the same finger. Sizes 5, 6, 7, 8 and 9 correspond approximately to 15.7, 16.5, 17.3, 18.1 and 18.9 mm.'],
    ['Necklaces','Use a piece of string to see where your preferred chain length will sit. The available lengths are listed on each product page.'],
    ['Bracelets','Measure around your wrist with a flexible tape, then allow a little extra room for movement.'],
  ] },
  'shipping-returns': { title:'Shipping & returns', line:'From our studio to your door.', entries:[
    ['Shipping','Orders are presented in a Lyoren box and sent with insured shipping. Delivery options depend on the destination.'],
    ['Returns','Get in touch with your order reference and the name of the piece so the studio can help with next steps.'],
  ] },
  care: { title:'Jewelry care', line:'Simple habits for pieces you wear often.', entries:[
    ['Gold','Clean gently with a soft cloth. Remove your jewelry before swimming, exercising or using harsh cleaning products.'],
    ['Gemstones & pearls','Avoid sprays and perfumes, and store pieces separately. Wipe pearls with a soft, slightly damp cloth after wearing.'],
  ] },
  faq: { title:'Frequently asked questions', line:'A few useful details before you choose.', entries:[
    ['What is the jewelry made from?','The collection uses 14k yellow gold. Each product page lists the stone or pearl when applicable.'],
    ['How do I choose a size?','Use the size guide to compare measurements with a piece you already own.'],
    ['Can I give a piece as a gift?','Every piece comes in a Lyoren jewelry box with a soft pouch.'],
  ] },
};
function Support({ page }) {
  const content = support[page];
  return <><Intro kicker="Client care" title={content.title}>{content.line}</Intro><section className="page-width support-list">{content.entries.map(([title, copy]) => <details key={title}><summary>{title}<Icon name="plus" size={18}/></summary><p>{copy}</p></details>)}</section></>;
}
function Contact() {
  const email = import.meta.env.VITE_CONTACT_EMAIL;
  return <><Intro kicker="Contact" title="Let’s talk jewelry.">For help with fit, materials, or choosing a piece, start with our client care guides.</Intro><section className="page-width contact-grid">
    <div className="contact-photo" data-reveal="image"><Photo name="editorial-3" alt="Gold earrings worn with an indigo top"/></div>
    <div data-reveal><p className="eyebrow">Client care</p><h2>How can we help?</h2><div className="support-list">
      {email && <a className="text-link" href={'mailto:' + email}>Email the studio <Icon name="right" size={16}/></a>}
      <Link className="text-link" to="/size-guide">Find your size <Icon name="right" size={16}/></Link>
      <Link className="text-link" to="/shipping-returns">Shipping & returns <Icon name="right" size={16}/></Link>
      <Link className="text-link" to="/faq">Frequently asked questions <Icon name="right" size={16}/></Link>
    </div></div>
  </section></>;
}
function Missing() {
  return <><Intro kicker="Lyoren" title="Page not found">The piece or page you were looking for may have moved.</Intro><div className="center-action"><Action to="/shop">Explore the jewelry</Action></div></>;
}
function BagItems({ editable }) {
  const { bag, update } = useContext(Store);
  return <div className="bag-items">{bag.map(line => {
    const product = productById[line.id];
    return <article key={line.key} className="bag-line"><Link to={productPath(product)} aria-label={product.name}><Photo name={product.image}/></Link><div className="bag-details"><Link to={productPath(product)}>{product.name}</Link><p>{product.material}{line.size && ' · ' + line.size}</p>
      {editable ? <div className="quantity"><button aria-label={'Decrease quantity of ' + product.name} onClick={() => update(line.key, line.qty - 1)}><Icon name="minus" size={13}/></button><span>{line.qty}</span><button aria-label={'Increase quantity of ' + product.name} onClick={() => update(line.key, line.qty + 1)}><Icon name="plus" size={13}/></button></div> : <p>Quantity {line.qty}</p>}
    </div><div className="bag-line-end"><span>{money(product.price * line.qty)}</span>{editable && <button onClick={() => update(line.key, 0)}>Remove</button>}</div></article>;
  })}</div>;
}
function Checkout() {
  const { bag, subtotal } = useContext(Store);
  return <><Intro kicker="Your selection" title="Order summary"/><section className="page-width checkout">
    {bag.length ? <><BagItems/><div className="total"><span>Subtotal</span><strong>{money(subtotal)}</strong></div><p>Online payments are currently unavailable.</p><Action to="/shop">Continue shopping</Action></> : <><h2>Your bag is empty.</h2><Action to="/shop">Explore the jewelry</Action></>}
  </section></>;
}
function Overlays() {
  const { overlay, setOverlay, subtotal, bag } = useContext(Store);
  const [query, setQuery] = useState('');
  const dialog = useRef(null);
  useEffect(() => {
    const node = dialog.current;
    if (!node) return;
    if (overlay && !node.open) node.showModal();
    if (!overlay && node.open) node.close();
    if (!overlay) { setQuery(''); return; }
    document.body.classList.add('locked');
    return () => document.body.classList.remove('locked');
  }, [overlay]);
  const matches = query.trim() ? products.filter(p => query.toLowerCase().trim().split(/\s+/).every(term => [p.name, p.category, p.stone, p.material].join(' ').toLowerCase().includes(term))) : [];
  const title = { bag:'Your selection', menu:'LYOREN', search:'Search jewelry' }[overlay];
  return <dialog ref={dialog} className={'overlay ' + (overlay || '')} aria-labelledby="panel-title" onCancel={() => setOverlay(null)} onClick={event => {
    if (event.target !== dialog.current) return;
    const rect = dialog.current.getBoundingClientRect();
    if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) setOverlay(null);
  }}>
    {overlay && <><div className="panel-title"><h2 id="panel-title">{title}</h2><button aria-label="Close panel" className="icon-button" onClick={() => setOverlay(null)}><Icon name="close"/></button></div>
      {overlay === 'menu' && <nav className="drawer-nav" aria-label="Main navigation"><Link to="/shop">Shop</Link><Link to="/collections">Collections</Link><details><summary>Categories <Icon name="plus" size={17}/></summary>{categories.map(category => <Link key={category} to={categoryPath(category)}>{category}</Link>)}</details><Link to="/our-craft">Our craft</Link><Link to="/contact">Contact</Link></nav>}
      {overlay === 'search' && <div className="search-content"><label className="search-field"><Icon name="search"/><input autoFocus type="search" placeholder="Try “gold” or “Vesper”" aria-label="Search the catalog" value={query} onChange={e => setQuery(e.target.value)}/></label>
        {!query.trim() ? <div className="search-categories">{categories.map(category => <Link key={category} to={categoryPath(category)}>{category}</Link>)}</div> : <p className="eyebrow search-count" role="status">{matches.length} {matches.length === 1 ? 'piece' : 'pieces'} found</p>}
        {matches.map(p => <Link to={productPath(p)} className="search-result" key={p.id}><Photo name={p.image}/><span>{p.name}</span><span>{money(p.price)}</span></Link>)}</div>}
      {overlay === 'bag' && (bag.length ? <><BagItems editable/><div className="bag-footer"><p className="eyebrow">Complimentary insured shipping</p><div className="total"><span>Subtotal</span><strong>{money(subtotal)}</strong></div><Link className="action filled" to="/checkout">Checkout</Link><button className="continue" onClick={() => setOverlay(null)}>Continue browsing</button></div></> : <div className="bag-empty"><p>Your bag is empty.</p><Action to="/shop">Explore the jewelry</Action></div>)}
    </>}
  </dialog>;
}
function readBag() {
  try {
    const value = JSON.parse(localStorage.getItem('lyoren-bag') || '[]');
    return Array.isArray(value) ? value.filter(line => {
      const item = productById[line?.id];
      return item && line.key === item.id + ':' + line.size && Number.isSafeInteger(line.qty) && line.qty > 0
        && (item.sizes.length ? item.sizes.includes(line.size) : line.size === '');
    }) : [];
  } catch { return []; }
}
function PageEffects() {
  const location = useLocation();
  const previousPath = useRef(null);
  useEffect(() => {
    if (previousPath.current === location.pathname) return;
    previousPath.current = location.pathname;
    window.scrollTo(0, 0);
    const title = document.querySelector('main h1')?.textContent?.trim();
    document.title = location.pathname === '/' ? 'LYOREN — Fine Jewelry' : (title || 'Fine Jewelry') + ' | LYOREN';
  }, [location]);
  useEffect(() => {
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    }), { threshold: 0.08 });
    const observe = () => document.querySelectorAll('[data-reveal]:not(.is-visible)').forEach(el => observer.observe(el));
    observe();
    const changes = new MutationObserver(observe);
    changes.observe(document.querySelector('main'), { childList:true, subtree:true });
    return () => { changes.disconnect(); observer.disconnect(); };
  }, []);
  return null;
}
function App() {
  const location = useLocation();
  const [bag, setBag] = useState(readBag);
  const [overlay, setOverlay] = useState(null);
  useEffect(() => { try { localStorage.setItem('lyoren-bag', JSON.stringify(bag)); } catch {} }, [bag]);
  useEffect(() => { setOverlay(null); }, [location.key]);
  const count = bag.reduce((sum, item) => sum + item.qty, 0);
  const subtotal = bag.reduce((sum, item) => sum + item.qty * productById[item.id].price, 0);
  function add(product, size = '') {
    const key = product.id + ':' + size;
    setBag(lines => lines.some(line => line.key === key)
      ? lines.map(line => line.key === key ? {...line, qty:line.qty + 1} : line)
      : [...lines, { key, id:product.id, size, qty:1 }]);
    setOverlay('bag');
  }
  function update(key, qty) {
    setBag(lines => qty > 0 ? lines.map(line => line.key === key ? {...line, qty} : line) : lines.filter(line => line.key !== key));
  }
  return <Store.Provider value={{ bag, count, subtotal, add, update, overlay, setOverlay }}><a className="skip" href="#main">Skip to content</a><Header/>
    <main id="main"><div className="route-frame" key={location.pathname}><Routes>
      <Route path="/" element={<Home/>}/><Route path="/shop" element={<Shop/>}/><Route path="/shop/:slug" element={<ProductRoute/>}/>
      <Route path="/categories/:slug" element={<CategoryRoute/>}/><Route path="/collections" element={<Collections/>}/><Route path="/collections/:slug" element={<CollectionRoute/>}/>
      <Route path="/our-craft" element={<Craft/>}/><Route path="/contact" element={<Contact/>}/><Route path="/checkout" element={<Checkout/>}/>
      {Object.keys(support).map(page => <Route key={page} path={'/' + page} element={<Support page={page}/>}/>)}
      <Route path="*" element={<Missing/>}/>
    </Routes></div></main><Footer key={location.pathname}/><Overlays/><PageEffects/><PointerMotion/></Store.Provider>;
}
createRoot(document.getElementById('root')).render(<BrowserRouter><App/></BrowserRouter>);
