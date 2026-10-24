import React, { useState, useEffect } from 'react';
import { Search, Heart, ShoppingBag, User, ArrowRight, X, Plus, Minus, Check, Truck, ShieldCheck, Package, Menu, ChevronRight, SlidersHorizontal, Star } from 'lucide-react';
import './Ladyana.css';
import {supabase} from '../../supabase';
import {CustomerAccount} from './CustomerAccount';
const sampleProducts = [{
  id: 1,
  name: 'The Amara Shoulder Bag',
  cat: 'Bags',
  price: 2850,
  color: '#986449',
  tag: 'BESTSELLER',
  type: 'bag'
}, {
  id: 2,
  name: 'Noor Embellished Flats',
  cat: 'Footwear',
  price: 1650,
  color: '#d2bfa2',
  tag: 'NEW',
  type: 'shoe'
}, {
  id: 3,
  name: 'The Rosé Mini Tote',
  cat: 'Bags',
  price: 2450,
  color: '#bd8580',
  tag: 'LIMITED EDITION',
  type: 'bag'
}, {
  id: 4,
  name: 'Sienna Everyday Sandals',
  cat: 'Footwear',
  price: 1450,
  color: '#292422',
  tag: 'BACK IN STOCK',
  type: 'shoe'
}, {
  id: 5,
  name: 'Pearl Evening Clutch',
  cat: 'Bags',
  price: 2250,
  color: '#e7d8bd',
  tag: 'NEW',
  type: 'clutch'
}, {
  id: 6,
  name: 'Golden Hour Earrings',
  cat: 'Accessories',
  price: 850,
  color: '#bb9152',
  tag: 'EDITOR’S PICK',
  type: 'jewel'
}];
const collectionPhotos = [{"id":"7848","cat":"Bags","name":"Structured handbags","src":"/photos/7848.jpeg"},{"id":"7849","cat":"Bags","name":"Handbag colour collection","src":"/photos/7849.jpeg"},{"id":"7850","cat":"Bags","name":"Pearl-handle embroidered bag","src":"/photos/7850.jpeg"},{"id":"7851","cat":"Bags","name":"Red heart clutch","src":"/photos/7851.jpeg"},{"id":"7854","cat":"Bags","name":"Crystal evening clutches","src":"/photos/7854.jpeg"},{"id":"7852","cat":"Footwear","name":"Pearl embellished heels","src":"/photos/7852.jpeg"},{"id":"7857","cat":"Footwear","name":"Black slingback heels","src":"/photos/7857.jpeg"},{"id":"7858","cat":"Footwear","name":"Champagne slingback heels","src":"/photos/7858.jpeg"},{"id":"7861","cat":"Footwear","name":"Leopard-print shoes","src":"/photos/7861.jpeg"},{"id":"7855","cat":"Dresses","name":"Blue lace outfit","src":"/photos/7855.jpeg"}];
const money = (n: number) => '৳ ' + n.toLocaleString();
function Art({
  p,
  hero = false
}: {
  p: any;
  hero?: boolean;
}) {
  if(p.image_url)return <img className="product-photo" src={p.image_url} alt={p.name}/>;
  return <svg className={'product-art ' + (hero ? 'hero-art' : '')} viewBox="0 0 400 350" role="img" aria-label={p.name}><defs><linearGradient id={'g' + p.id} x1="0" y1="0" x2="1" y2="1"><stop stopColor={p.color} /><stop offset="1" stopColor={p.type === 'shoe' ? '#776456' : '#42291e'} /></linearGradient><filter id={'s' + p.id}><feDropShadow dx="0" dy="16" stdDeviation="12" floodOpacity=".18" /></filter></defs><ellipse cx="200" cy="297" rx="125" ry="15" fill="#9e7d62" opacity=".13" />{p.type === 'bag' ? <g filter={'url(#s' + p.id + ')'}><path d="M132 130 C132 18 267 18 267 130" fill="none" stroke={p.color} strokeWidth="15" /><path d="M137 130 C137 32 262 32 262 130" fill="none" stroke="#efd3a5" strokeWidth="2" /><path d="M96 122 Q200 105 303 122 L320 276 Q200 307 80 276Z" fill={'url(#g' + p.id + ')'} /><path d="M100 131 Q200 159 300 131 L286 196 Q200 225 112 196Z" fill={p.color} /><path d="M101 133 Q200 158 298 133" fill="none" stroke="#e6c59b" strokeWidth="1" /><rect x="187" y="190" width="28" height="30" rx="5" fill="#d9ba7e" /><path d="M194 199h14v13h-14z" fill="#805b37" /><text x="200" y="254" textAnchor="middle" fill="#e9cfab" fontSize="10" letterSpacing="5">LADYANA</text></g> : p.type === 'shoe' ? <g filter={'url(#s' + p.id + ')'} transform="rotate(-18 200 200)"><path d="M65 245 C80 200 205 203 292 113 Q332 84 346 123 Q357 185 268 252 Q141 305 65 267Z" fill="#b59875" /><path d="M66 238 Q165 195 286 111 Q322 95 330 122 Q305 173 254 201 Q149 270 67 257Z" fill={p.color} /><path d="M122 219 Q142 146 186 178 L226 207 L196 228 Q157 192 146 240Z" fill={p.color} stroke="#e6cdae" strokeWidth="5" /><path d="M238 165l29-43 21 14-24 45z" fill={p.color} stroke="#d9b774" strokeWidth="4" /><circle cx="170" cy="202" r="9" fill="#e5c685" /></g> : p.type === 'clutch' ? <g filter={'url(#s' + p.id + ')'}><rect x="75" y="132" width="250" height="140" rx="35" fill={p.color} /><path d="M80 150L200 220 320 150" fill="none" stroke="#c5a36c" strokeWidth="3" /><circle cx="200" cy="206" r="13" fill="#cba76a" /></g> : <g fill="none" stroke={p.color} strokeWidth="13"><ellipse cx="145" cy="184" rx="39" ry="65" /><ellipse cx="255" cy="184" rx="39" ry="65" /><circle cx="145" cy="101" r="9" /><circle cx="255" cy="101" r="9" /></g>}</svg>;
}
export const LadyanaCompleteShoppingExperience = () => {
  const [settings,setSettings]=useState({announcement:'A little luxury, every day.',delivery_fee:80,support_email:''});
  useEffect(()=>{supabase.from('store_settings').select('*').eq('id',1).single().then(({data})=>{if(data)setSettings(data)})},[]);
  const [products,setProducts]=useState<any[]>([]),[catalogStatus,setCatalogStatus]=useState('loading'),[user,setUser]=useState<any>(null),[wishBusy,setWishBusy]=useState(false);
  async function loadCatalog(){setCatalogStatus('loading');const {data,error}=await supabase.from('products').select('*').eq('active',true).order('id');if(error){setCatalogStatus('error');return}setProducts(data||[]);setCatalogStatus('ready')}
  useEffect(()=>{void loadCatalog();const {data:{subscription}}=supabase.auth.onAuthStateChange((_event,session)=>setUser(session?.user??null));supabase.auth.getSession().then(({data})=>setUser(data.session?.user??null));return()=>subscription.unsubscribe()},[]);
  useEffect(()=>{let cancelled=false;setWish([]);if(user)supabase.from('wishlist').select('product_id').eq('user_id',user.id).then(({data,error})=>{if(cancelled)return;if(error)notify('Could not load your saved pieces. Please try again.');else setWish((data||[]).map(r=>r.product_id))});return()=>{cancelled=true}},[user?.id]);
  const [page, setPage] = useState(new URLSearchParams(location.search).get('account')==='1'?'account':'home'),
    [category, setCategory] = useState('All'),
    [query, setQuery] = useState(''),
    [sort, setSort] = useState('Featured'),
    [priceRange,setPriceRange]=useState('All prices'),
    [selected, setSelected] = useState<any>(null),
    [size, setSize] = useState('37'),
    [colour, setColour] = useState('Original'),
    [wish, setWish] = useState<number[]>([]),
    [cart, setCart] = useState<any[]>([]),
    [toast, setToast] = useState(''),
    [payment, setPayment] = useState('Cash on delivery'),
    [order, setOrder] = useState<any>(null),
    [faq, setFaq] = useState(''), [menuOpen,setMenuOpen] = useState(false), [photo,setPhoto]=useState<any>(null);
  const notify = (s: string) => {
    setToast(s);
    setTimeout(() => setToast(''), 3000);
  };
  const go = (s: string, c = 'All') => {
    setPage(s);
    setMenuOpen(false);
    setCategory(c);
    setQuery('');
    setPriceRange('All prices');
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };
  const toggle = async(id:number)=>{if(!user){notify('Sign in to save your favourites.');go('account');return}if(wishBusy)return;setWishBusy(true);const saved=wish.includes(id);const {error}=saved?await supabase.from('wishlist').delete().eq('user_id',user.id).eq('product_id',id):await supabase.from('wishlist').insert({user_id:user.id,product_id:id});if(error)notify('Could not save this change. Please try again.');else setWish(w=>saved?w.filter(x=>x!==id):[...w,id]);setWishBusy(false)};
  const add = () => {
    if(!selected||selected.stock<1){notify('This piece is out of stock.');return}
    const key = `${selected.id}-${colour}-${selected.type === 'shoe' ? size : 'One size'}`;
    setCart(c => c.some(x => x.key === key) ? c.map(x => x.key === key ? {
      ...x,
      qty: x.qty + 1
    } : x) : [...c, {
      ...selected,
      key,
      colour,
      size: selected.type === 'shoe' ? size : 'One size',
      qty: 1
    }]);
    notify('Added to your bag');
    setSelected(null);
  };
  const total = cart.reduce((a, p) => a + p.price * p.qty, 0),
    count = cart.reduce((a, p) => a + p.qty, 0);
  let shown = products.filter(p => (category === 'All' || p.cat === category) && p.name.toLowerCase().includes(query.toLowerCase()) && (priceRange==='All prices'||(priceRange==='Under ৳ 1,500'?p.price<1500:priceRange==='৳ 1,500–2,500'?p.price>=1500&&p.price<=2500:p.price>2500)) && (page !== 'wishlist' || wish.includes(p.id)));
  if (sort === 'Newest first') shown = [...shown].sort((a,b)=>b.id-a.id);
  if (sort === 'Name: A to Z') shown = [...shown].sort((a,b)=>a.name.localeCompare(b.name));
  if (sort === 'Price: low to high') shown = [...shown].sort((a, b) => a.price - b.price);
  if (sort === 'Price: high to low') shown = [...shown].sort((a, b) => b.price - a.price);
  const card = (p: any) => <article className="product" key={p.id}><div className="product-image"><span className="tag">{p.tag}</span><button className={'heart ' + (wish.includes(p.id) ? 'saved' : '')} aria-label={'Save ' + p.name} onClick={() => toggle(p.id)}><Heart size={18} fill={wish.includes(p.id) ? 'currentColor' : 'none'} /></button><button className="art-button" onClick={() => {
        setSelected(p);
        setSize('37');
        setColour('Original');
      }}><Art p={p} /></button><button className="quick" onClick={() => setSelected(p)}>Discover piece <Plus size={15} /></button></div><div className="product-meta"><div><small>{p.cat} · LADYANA EDIT</small><h3><button onClick={() => setSelected(p)}>{p.name}</button></h3><p>{money(p.price)}{p.compare_price>p.price&&<del className="old-price">{money(p.compare_price)}</del>}</p><p className="stock-label">{p.stock>0?`${p.stock} available`:"Out of stock"}</p></div><span className="swatch" style={{
        background: p.color
      }} /></div></article>;
  return <div className="ladyana"><header className="store-header"><button className="menu-toggle" aria-label="Toggle menu" aria-expanded={menuOpen} onClick={()=>setMenuOpen(!menuOpen)}><Menu size={23}/></button><button className="horizontal-brand" aria-label="Ladyana home" onClick={() => go('home')}><svg className="brand-name" viewBox="201 1050 1128 159" aria-hidden="true" focusable="false"><image href="/ladyana-logo.jpeg" width="1536" height="1536"/></svg></button><div className="header-tools"><button aria-label="Search" onClick={() => go('shop')}><Search size={20}/><span>Search</span></button><button aria-label="Shopping bag" onClick={() => go('cart')}><ShoppingBag size={20}/><span>Shopping bag</span><i>{count}</i></button><button aria-label="Wishlist" onClick={() => go('wishlist')}><Heart size={20}/><span>My wish list</span></button><button aria-label="Account" onClick={() => go('account')}><User size={20}/><span>Sign in</span></button></div></header><nav className={'category-nav '+(menuOpen?'is-open':'')} aria-label="Collections">{['New arrivals', 'Bags', 'Footwear', 'Dresses', 'Accessories'].map(n => <button key={n} className={page==='shop'&&category === (n==='New arrivals'?'All':n) ? 'active' : ''} onClick={() => go('shop', n === 'New arrivals' ? 'All' : n)}>{n}</button>)}</nav>

{catalogStatus!=='ready'&&<div className="collection" role="status">{catalogStatus==='loading'?'Loading the collection…':<>We couldn’t load the collection. <button className="text-link" onClick={()=>void loadCatalog()}>Try again</button></>}</div>}
{page === 'home' && <main><section className="campaign"><div className="campaign-art"><img src="/photos/7849.jpeg" alt="Ladyana handbags" fetchPriority="high"/><img src="/photos/7857.jpeg" alt="Ladyana black slingback heels"/></div><div className="campaign-copy"><div className="eyebrow">THE LADYANA EDIT</div><h1>Everyday.<br/><em>Extraordinary.</em></h1><p>Bags, footwear and dresses.<br/>Find your own expression of elegance.</p><button className="primary" onClick={()=>go('shop')}>Explore the collection <ArrowRight size={18}/></button></div></section><div className="announcement">{settings.announcement}</div><section className="collection-intro"><h2>THE EVERYDAY ELEGANCE EDIT</h2><p>Thoughtfully chosen pieces for every version of you. Discover beautiful bags, effortless footwear and accessories that make everyday moments your own.</p></section><section className="top-categories"><h2>TOP CATEGORIES</h2><div className="category-grid">{['Bags','Footwear','Dresses'].map((c,i)=><button className="category-tile" key={c} onClick={()=>go('shop',c)}><div><img src={'/photos/'+['7848','7852','7855'][i]+'.jpeg'} alt={'Ladyana '+c} loading="lazy"/></div><h3>{c}<ArrowRight size={18}/></h3></button>)}</div></section>{['Bags','Footwear','Dresses'].map(c=><section className="collection photo-collection" key={c}><div className="section-head"><h2>{c.toUpperCase()}</h2><button className="text-link" onClick={()=>go('shop',c)}>Explore {c.toLowerCase()} <ArrowRight size={17}/></button></div><div className={'photo-grid '+(c==='Dresses'?'dress-grid':'')}>{collectionPhotos.filter(p=>p.cat===c).map(p=><button className="photo-card" key={p.id} onClick={()=>setPhoto(p)} aria-label={'View '+p.name}><img src={p.src} alt={p.name} loading="lazy"/><span>{p.name}</span></button>)}</div></section>)}<section className="editorial"><div><div className="eyebrow">THE FINISHING TOUCH</div><h2>Small details.<br/><em>Beautiful impact.</em></h2><p>Discover bags for everyday moments<br/>and the occasions you’ll always remember.</p><button className="primary" onClick={()=>go('shop','Bags')}>Shop bags <ArrowRight size={18}/></button></div><img className="editorial-photo" src="/photos/7851.jpeg" alt="Red heart-shaped evening clutch" loading="lazy"/></section><div className="benefits"><span><Truck size={18}/> Delivery across Bangladesh</span><span><ShieldCheck size={18}/> Carefully selected quality</span><span><Package size={18}/> Beautifully packed</span></div></main>}

{(page === 'shop' || page === 'wishlist') && <main className="collection collection-page"><div className="eyebrow">HOME / {page === 'wishlist' ? 'WISHLIST' : 'THE COLLECTION'}</div><div className="section-head"><div><h1 className="page-title">{page === 'wishlist' ? 'Saved for you.' : category === 'All' ? 'The collection.' : category + '.'}</h1><p>Thoughtful pieces. Endless possibilities.</p></div><span>{shown.length} pieces</span></div><div className="shop-controls"><label className="search"><Search size={18} /><input placeholder="Find your next favourite…" value={query} onChange={e => setQuery(e.target.value)} /></label><select aria-label="Filter by price" value={priceRange} onChange={e=>setPriceRange(e.target.value)}>{['All prices','Under ৳ 1,500','৳ 1,500–2,500','Over ৳ 2,500'].map(p=><option key={p}>{p}</option>)}</select><select aria-label="Sort products" value={sort} onChange={e => setSort(e.target.value)}>{['Featured', 'Newest first', 'Price: low to high', 'Price: high to low', 'Name: A to Z'].map(s => <option key={s}>{s}</option>)}</select></div><div className="chips">{['All', 'Bags', 'Footwear', 'Dresses', 'Accessories'].map(c => <button key={c} className={category === c ? 'chosen' : ''} onClick={() => setCategory(c)}>{c}</button>)}</div>{page==='shop'&&<section className="collection-gallery" aria-label="Collection photos"><h2>Collection photos</h2><div className="photo-grid">{collectionPhotos.filter(p=>(category==='All'||p.cat===category)&&p.name.toLowerCase().includes(query.toLowerCase())).map(p=><button className="photo-card" key={p.id} onClick={()=>setPhoto(p)} aria-label={'View '+p.name}><img src={p.src} alt={p.name} loading="lazy"/><span>{p.name}</span></button>)}</div></section>}{category==='Dresses'?null:shown.length ? <div className="product-grid">{shown.map(card)}</div> : <div className="empty"><Heart /><h2>{page === 'wishlist' ? 'Your favourites start here.' : catalogStatus==='loading'?'Loading the collection…':catalogStatus==='error'?'Collection unavailable.':'No pieces found.'}</h2><p>{page === 'wishlist' ? 'Tap the heart on a piece you love.' : 'Try another name or collection.'}</p><button className="primary" onClick={() => go('shop')}>Explore all pieces</button></div>}</main>}
{page === 'cart' && <main className="collection"><div className="eyebrow">YOUR LADYANA SELECTION</div><h1 className="page-title">The shopping bag.</h1>{cart.length ? <div className="two-col"><div>{cart.map(p => <div className="cart-row" key={p.key}><div className="mini-art"><Art p={p} /></div><div className="grow"><h3>{p.name}</h3><p>{p.colour} · {p.size}</p><strong>{money(p.price)}</strong><div className="quantity"><button aria-label="Decrease quantity" onClick={() => setCart(c => c.map(x => x.key === p.key ? {
                  ...x,
                  qty: Math.max(1, x.qty - 1)
                } : x))}><Minus size={14} /></button>{p.qty}<button aria-label="Increase quantity" onClick={() => setCart(c => c.map(x => x.key === p.key ? {
                  ...x,
                  qty: x.qty + 1
                } : x))}><Plus size={14} /></button></div></div><button aria-label="Remove item" onClick={() => setCart(c => c.filter(x => x.key !== p.key))}><X size={18} /></button></div>)}</div><aside className="summary"><h2>Order summary</h2><p><span>Subtotal</span>{money(total)}</p><p><span>Delivery</span>Calculated at checkout</p><hr /><p><strong>Total</strong><strong>{money(total)}</strong></p><button className="primary full" onClick={() => go('checkout')}>Continue to checkout <ArrowRight size={17} /></button><small>Sample shopping experience · No payment collected</small></aside></div> : <div className="empty"><ShoppingBag /><h2>A little room for something lovely.</h2><p>Your shopping bag is empty.</p><button className="primary" onClick={() => go('shop')}>Discover the collection</button></div>}</main>}
{page === 'checkout' && <main className="collection"><div className="eyebrow">BAG → DELIVERY → CONFIRMATION</div><h1 className="page-title">Almost yours.</h1><form className="two-col" onSubmit={e => {
        e.preventDefault();
        setOrder({
          id: 'LD' + Date.now().toString().slice(-6),
          total: total + settings.delivery_fee,
          items: [...cart]
        });
        setCart([]);
        go('success');
      }}><section className="checkout-form"><h2>Contact & delivery</h2><div className="form-grid"><label>Full name<input required placeholder="Your name" /></label><label>Mobile number<input required type="tel" pattern="[+]?[0-9 ()-]{10,16}" placeholder="01XXXXXXXXX" /></label><label className="wide">Email (optional)<input type="email" placeholder="you@example.com" /></label><label className="wide">Delivery address<textarea required placeholder="House, road, area and city" /></label><label>District<select required><option>Dhaka</option><option>Chattogram</option><option>Sylhet</option><option>Other district</option></select></label><label>Postal code<input required placeholder="Postal code" /></label></div><h2>Payment method</h2>{['Cash on delivery', 'bKash', 'Nagad'].map(p => <label className="payment" key={p}><input type="radio" name="payment" checked={payment === p} onChange={() => setPayment(p)} /><span>{p}</span><small>{p === 'Cash on delivery' ? 'Pay when it arrives' : 'Preview option'}</small></label>)}<p className="muted">This is a design preview. Orders and payments are simulated.</p></section><aside className="summary"><h2>Your selection</h2>{cart.map(p => <p key={p.key}><span>{p.name} × {p.qty}</span>{money(p.price * p.qty)}</p>)}<hr /><p><span>Subtotal</span>{money(total)}</p><p><span>Sample delivery fee</span>{money(settings.delivery_fee)}</p><hr /><p><strong>Total</strong><strong>{money(total + settings.delivery_fee)}</strong></p><button className="primary full" disabled={!cart.length}>Place demo order <ArrowRight size={17} /></button></aside></form></main>}
{page === 'success' && <main className="empty confirmation"><div className="check"><Check size={30} /></div><div className="eyebrow">A LITTLE JOY IS ON ITS WAY</div><h1 className="page-title">Beautiful choice.</h1><p>Your demo order <strong>#{order?.id}</strong> is confirmed.</p><p>No real order or payment has been processed.</p><button className="primary" onClick={() => go('account')}>View order details <ArrowRight size={17} /></button><button className="text-link" onClick={() => go('shop')}>Continue exploring</button></main>}
{page === 'account' && <main className="collection"><div className="eyebrow">YOUR PERSONAL LADYANA SPACE</div><h1 className="page-title">Hello, lovely.</h1><CustomerAccount user={user}/><div className="two-col"><section><h2>My orders</h2>{order ? <div className="order-card"><div className="section-head"><strong>#{order.id}</strong><span className="status">Confirmed · Demo</span></div><p>{order.items.length} selected pieces · {money(order.total)}</p><div className="timeline">{['Confirmed', 'Preparing', 'Dispatched', 'Delivered'].map((s, i) => <div key={s} className={i === 0 ? 'done' : ''}><span>{i === 0 ? <Check size={13} /> : i + 1}</span>{s}</div>)}</div><p className="muted">Order tracking preview. Delivery updates will appear here in a live app.</p></div> : <div className="order-card"><Package /><h3>Your next lovely find awaits.</h3><p>No orders yet.</p><button className="text-link" onClick={() => go('shop')}>Start shopping <ArrowRight size={16} /></button></div>}<h2>How can we help?</h2>{['Delivery information', 'Returns & exchanges', 'Product care'].map(s => <div className="faq" key={s}><button onClick={() => setFaq(faq === s ? '' : s)}>{s}<Plus size={17} /></button>{faq === s && <p>{s === 'Delivery information' ? 'Delivery fee and estimated arrival are confirmed before purchase in the live store.' : s === 'Returns & exchanges' ? 'Contact Ladyana with your order number to request support. Final return terms will be provided before launch.' : 'Keep bags dry, wipe gently with a soft cloth, and store footwear away from direct heat.'}</p>}</div>)}</section><aside className="summary"><Heart size={25} /><h2>Your favourites</h2><p>{wish.length} pieces saved for later.</p><button className="primary full" onClick={() => go('wishlist')}>View wishlist <ArrowRight size={17} /></button><hr /><h3>Need a little guidance?</h3><p>Explore size, colour and product details before adding your favourites to the bag.</p></aside></div></main>}
<footer><div><button className="brand-logo footer-logo" aria-label="Ladyana home" onClick={() => go('home')}><img src="/ladyana-logo.jpeg" alt="Ladyana"/></button><p>Everyday elegance. Uniquely yours.</p></div><div><h4>EXPLORE</h4><button onClick={() => go('shop', 'Bags')}>Bags</button><button onClick={() => go('shop', 'Footwear')}>Footwear</button><button onClick={() => go('shop', 'Dresses')}>Dresses</button><button onClick={() => go('shop', 'Accessories')}>Accessories</button></div><div><h4>HERE FOR YOU</h4><a href="/admin">Store admin</a>{settings.support_email&&<a href={`mailto:${settings.support_email}`}>Contact support</a>}<button onClick={() => go('account')}>My orders & help</button><button onClick={() => go('wishlist')}>Your wishlist</button><small>Bangladesh · BDT ৳</small></div><div className="newsletter"><h4>A LITTLE SOMETHING LOVELY</h4><p>Be first to discover the next Ladyana edit.</p><form onSubmit={e => {
          e.preventDefault();
          notify('You’re on the list — demo subscription');
          (e.target as HTMLFormElement).reset();
        }}><input type="email" required placeholder="Your email address" aria-label="Email address" /><button aria-label="Subscribe"><ArrowRight size={20} /></button></form></div><div className="footer-bottom">© 2026 Ladyana. <span>Everyday elegance · Bangladesh</span></div></footer>
{photo&&<div className="overlay" onClick={()=>setPhoto(null)}><section className="photo-dialog" role="dialog" aria-modal="true" aria-label={photo.name} onClick={e=>e.stopPropagation()}><button className="close" aria-label="Close photo" onClick={()=>setPhoto(null)}><X/></button><img src={photo.src} alt={photo.name}/><p>{photo.name}</p></section></div>}{selected && <div className="overlay" onClick={() => setSelected(null)}><section className="modal" role="dialog" aria-modal="true" aria-label={selected.name} onClick={e => e.stopPropagation()}><button className="close" aria-label="Close product" onClick={() => setSelected(null)}><X /></button><div className="detail-art"><Art p={selected} /></div><div className="detail-copy"><div className="eyebrow">THE LADYANA COLLECTION</div><h2>{selected.name}</h2><h3>{money(selected.price)}</h3><p>{selected.description || 'An elegant finishing touch for your everyday.'}</p><h4>Colour — {colour}</h4><div className="chips">{['Original', 'Black', 'Gold'].map(c => <button key={c} className={colour === c ? 'chosen' : ''} onClick={() => setColour(c)}>{c}</button>)}</div>{selected.type === 'shoe' && <><h4>Choose your size · EU</h4><div className="chips">{['34', '35', '36', '37', '38', '39'].map(s => <button key={s} className={size === s ? 'chosen' : ''} onClick={() => setSize(s)}>{s}</button>)}</div></>}<button className="primary full" disabled={!selected.stock} onClick={add}>{selected.stock>0?'Add to shopping bag':'Out of stock'} <ShoppingBag size={18} /></button><button className="save-detail" onClick={() => toggle(selected.id)}><Heart size={17} fill={wish.includes(selected.id) ? 'currentColor' : 'none'} />{wish.includes(selected.id) ? 'Saved to wishlist' : 'Save for later'}</button><p className="muted"><Truck size={16} /> Delivery across Bangladesh</p></div></section></div>}{toast && <div className="toast" role="status"><Check size={17} />{toast}</div>}<div className="mobile-nav"><button onClick={() => go('home')}>Home</button><button onClick={() => go('shop')}>Shop</button><button onClick={() => go('account')}>Account</button><button onClick={() => go('wishlist')}>Saved</button><button onClick={() => go('cart')}>Bag ({count})</button></div></div>;
};
