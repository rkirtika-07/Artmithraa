
import { useEffect, useMemo, useState } from 'react'

const ADMIN = {
  id: 'admin-1',
  name: 'ARTMITHRA Admin',
  email: 'admin@mithra.demo',
  password: 'Admin@123',
  role: 'admin'
}

const initialArt = [
  { id: 1, title: 'Golden Hour', artist: 'Aarav Mehta', category: 'Painting', price: 4200, description: 'A warm landscape inspired by the quiet beauty of sunset.', image: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?auto=format&fit=crop&w=900&q=85', auction: false },
  { id: 2, title: 'Blue in Motion', artist: 'Mira Rao', category: 'Abstract', price: 5800, description: 'An expressive abstract study of movement, colour and calm.', image: 'https://images.unsplash.com/photo-1549490349-8643362247b5?auto=format&fit=crop&w=900&q=85', auction: true, bid: 6100 },
  { id: 3, title: 'Quiet Bloom', artist: 'Diya Sen', category: 'Illustration', price: 2600, description: 'A delicate botanical illustration celebrating small details.', image: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?auto=format&fit=crop&w=900&q=85', auction: false },
  { id: 4, title: 'The Old Street', artist: 'Kabir Das', category: 'Photography', price: 3500, description: 'A fine-art photograph of a timeless city corner.', image: 'https://images.unsplash.com/photo-1577083552431-6e5fd01aa342?auto=format&fit=crop&w=900&q=85', auction: true, bid: 3700 },
  { id: 5, title: 'Earth Forms', artist: 'Anaya Kapoor', category: 'Sculpture', price: 7200, description: 'Sculptural forms inspired by natural textures and landscapes.', image: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=900&q=85', auction: false },
  { id: 6, title: 'Dream Garden', artist: 'Ishaan Roy', category: 'Painting', price: 4900, description: 'A colourful garden scene created with layered brushwork.', image: 'https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?auto=format&fit=crop&w=900&q=85', auction: false },
]

const read = (key, fallback) => {
  try {
    return JSON.parse(localStorage.getItem(key)) ?? fallback
  } catch {
    return fallback
  }
}

const write = (key, value) =>
  localStorage.setItem(key, JSON.stringify(value))

const money = n => `₹${Number(n).toLocaleString('en-IN')}`

export default function App() {
  const [users, setUsers] = useState(() => {
    const saved = read('artmithra_users', [])
    return saved.some(u => u.email === ADMIN.email)
      ? saved
      : [ADMIN, ...saved]
  })

  const [artworks, setArtworks] = useState(() =>
    read('artmithra_artworks', initialArt)
  )
  const [orders, setOrders] = useState(() =>
    read('artmithra_orders', [])
  )
  const [bids, setBids] = useState(() =>
    read('artmithra_bids', [])
  )
  const [reviews, setReviews] = useState(() =>
    read('artmithra_reviews', [])
  )
  const [cart, setCart] = useState(() =>
    read('artmithra_cart', [])
  )
  const [current, setCurrent] = useState(() =>
    read('artmithra_currentUser', null)
  )

  const [mode, setMode] = useState('public')
  const [page, setPage] = useState('home')
  const [selected, setSelected] = useState(null)
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('All')
  const [notice, setNotice] = useState('')
  const [authMode, setAuthMode] = useState('login')

  const isAdmin = current?.role === 'admin'

  useEffect(() => write('artmithra_users', users), [users])
  useEffect(() => write('artmithra_artworks', artworks), [artworks])
  useEffect(() => write('artmithra_orders', orders), [orders])
  useEffect(() => write('artmithra_bids', bids), [bids])
  useEffect(() => write('artmithra_reviews', reviews), [reviews])
  useEffect(() => write('artmithra_cart', cart), [cart])
  useEffect(() => write('artmithra_currentUser', current), [current])

  const filtered = useMemo(() => artworks.filter(a =>
    (category === 'All' || a.category === category) &&
    `${a.title} ${a.artist} ${a.category}`
      .toLowerCase()
      .includes(query.toLowerCase())
  ), [artworks, category, query])

  function flash(msg) {
    setNotice(msg)
    window.setTimeout(() => setNotice(''), 2800)
  }

  function nav(p) {
    setPage(p)
    setSelected(null)
  }

  // PUBLIC USER LOGIN
  function login(e) {
    e.preventDefault()
    const data = new FormData(e.currentTarget)
    const email = data.get('email').trim().toLowerCase()
    const password = data.get('password')

    const found = users.find(
      u => u.email.toLowerCase() === email && u.password === password
    )

    if (!found) {
      return flash('Incorrect email or password.')
    }

    setCurrent(found)

    if (found.role === 'admin') {
      setMode('admin')
      setPage('admin')
      flash('Welcome to Admin Mode!')
    } else {
      setMode('public')
      setPage('home')
      flash(`Welcome, ${found.name}!`)
    }
  }

  // SEPARATE ADMIN LOGIN
  function adminLogin(e) {
    e.preventDefault()
    const data = new FormData(e.currentTarget)
    const email = data.get('email').trim().toLowerCase()
    const password = data.get('password')

    const found = users.find(
      u => u.email.toLowerCase() === email &&
        u.password === password &&
        u.role === 'admin'
    )

    if (!found) {
      return flash('Invalid admin credentials.')
    }

    setCurrent(found)
    setMode('admin')
    setPage('admin')
    flash('Admin login successful!')
  }

  function signup(e) {
    e.preventDefault()
    const data = new FormData(e.currentTarget)

    const name = data.get('name').trim()
    const email = data.get('email').trim().toLowerCase()
    const password = data.get('password')

    if (users.some(u => u.email.toLowerCase() === email)) {
      return flash('An account with this email already exists.')
    }

    if (password.length < 6) {
      return flash('Password must contain at least 6 characters.')
    }

    const user = {
      id: Date.now(),
      name,
      email,
      password,
      role: 'user'
    }

    setUsers(prev => [...prev, user])
    setCurrent(user)
    setMode('public')
    setPage('home')
    flash('Account created successfully!')
  }

  function logout() {
    setCurrent(null)
    setMode('public')
    setPage('home')
    flash('You have logged out.')
  }

  function addToCart(item) {
    setCart(prev =>
      prev.some(x => x.id === item.id)
        ? prev
        : [...prev, item]
    )
    flash('Artwork added to your cart.')
  }

  function checkout() {
    if (!current) {
      setPage('auth')
      return flash('Please log in before checkout.')
    }

    if (!cart.length) return

    setOrders(prev => [{
      id: Date.now(),
      buyer: current.email,
      items: cart,
      total: cart.reduce((s, a) => s + Number(a.price), 0),
      date: new Date().toLocaleDateString(),
      status: 'Pending'
    }, ...prev])

    setCart([])
    flash('Demo order placed successfully!')
  }

  function placeBid(item, amount) {
    const value = Number(amount)

    if (!current) {
      return flash('Please log in to place a bid.')
    }

    if (!value || value <= Number(item.bid || item.price)) {
      return flash(`Your bid must be higher than ${money(item.bid || item.price)}.`)
    }

    setArtworks(prev =>
      prev.map(a => a.id === item.id ? { ...a, bid: value } : a)
    )

    setBids(prev => [{
      id: Date.now(),
      artwork: item.title,
      bidder: current.email,
      amount: value
    }, ...prev])

    flash('Your demo bid has been recorded.')
  }

  function saveArtwork(e) {
    e.preventDefault()
    const d = new FormData(e.currentTarget)

    const item = {
      id: selected?.id || Date.now(),
      title: d.get('title'),
      artist: d.get('artist'),
      category: d.get('category'),
      price: Number(d.get('price')),
      description: d.get('description'),
      image: d.get('image') ||
        'https://images.unsplash.com/photo-1541961017774-22349e4a1262?auto=format&fit=crop&w=900&q=85',
      auction: d.get('auction') === 'on',
      bid: Number(d.get('price'))
    }

    setArtworks(prev =>
      selected
        ? prev.map(a => a.id === selected.id ? item : a)
        : [item, ...prev]
    )

    setSelected(null)
    flash(selected ? 'Artwork updated.' : 'Artwork added.')
  }

  function addReview(e, item) {
    e.preventDefault()
    const d = new FormData(e.currentTarget)

    setReviews(prev => [{
      id: Date.now(),
      artwork: item.title,
      user: current?.name || 'Visitor',
      rating: d.get('rating'),
      comment: d.get('comment')
    }, ...prev])

    e.currentTarget.reset()
    flash('Thank you for your review!')
  }

  function updateOrder(id, status) {
    setOrders(prev =>
      prev.map(o => o.id === id ? { ...o, status } : o)
    )
    flash('Order status updated.')
  }

  // ADMIN LOGIN SCREEN
  if (mode === 'admin' && page === 'adminLogin') {
    return (
      <div className="auth-wrap">
        {notice && <div className="toast">{notice}</div>}

        <div className="auth-card">
          <p className="eyebrow">ARTMITHRA MANAGEMENT</p>
          <h1>Admin Login.</h1>
          <p className="muted">Sign in to access the administration panel.</p>

          <form onSubmit={adminLogin}>
            <label>
              Admin email
              <input name="email" type="email" required placeholder="Admin email" />
            </label>

            <label>
              Password
              <input name="password" type="password" required placeholder="Password" />
            </label>

            <button className="dark full">Enter Admin Panel →</button>
          </form>

          <button className="text-btn" onClick={() => {
            setMode('public')
            setPage('home')
          }}>
            ← Back to Public Website
          </button>
        </div>
      </div>
    )
  }

  // ADMIN MODE
  if (mode === 'admin') {
    if (!isAdmin) {
      return (
        <div className="auth-wrap">
          <div className="auth-card">
            <h1>Admin access required</h1>
            <p>Please log in with an administrator account.</p>
            <button className="dark" onClick={() => {
              setCurrent(null)
              setPage('adminLogin')
            }}>
              Admin Login
            </button>
            <button className="outline" onClick={() => {
              setMode('public')
              setPage('home')
            }}>
              Public Website
            </button>
          </div>
        </div>
      )
    }

    return (
      <div className="app">
        {notice && <div className="toast">{notice}</div>}

        <header className="topbar">
          <button className="brand" onClick={() => nav('admin')}>
            <span className="brand-mark">A</span>
            <span>ARTMITHRA<small>ADMINISTRATION PANEL</small></span>
          </button>

          <nav>
            <button onClick={() => nav('admin')}>Dashboard</button>
            <button onClick={() => nav('admin-artworks')}>Artworks</button>
            <button onClick={() => nav('admin-users')}>Users</button>
            <button onClick={() => nav('admin-orders')}>Orders</button>
          </nav>

          <div className="nav-actions">
            <span className="welcome">Admin</span>
            <button className="outline small" onClick={() => {
              setMode('public')
              setPage('home')
            }}>
              Public Mode
            </button>
            <button className="dark small" onClick={logout}>Logout</button>
          </div>
        </header>

        <main>
          {page === 'admin' && (
            <section className="section page-section">
              <p className="eyebrow">CONTROL ROOM</p>
              <h1 className="page-title">Admin dashboard.</h1>

              <div className="stats">
                <Stat label="Artworks" value={artworks.length} />
                <Stat label="Registered accounts" value={users.filter(u => u.role === 'user').length} />
                <Stat label="Orders" value={orders.length} />
                <Stat label="Bids" value={bids.length} />
              </div>

              <div className="admin-grid">
                <div className="admin-panel">
                  <h2>Quick actions</h2>
                  <button className="dark" onClick={() => {
                    setSelected(null)
                    nav('admin-artworks')
                  }}>
                    + Add new artwork
                  </button>
                  <button className="outline" onClick={() => nav('admin-users')}>
                    View registered users
                  </button>
                  <button className="outline" onClick={() => nav('admin-orders')}>
                    Manage customer orders
                  </button>
                </div>

                <div className="admin-panel">
                  <h2>Recent orders</h2>
                  {orders.slice(0, 5).map(o => (
                    <p className="order-line" key={o.id}>
                      {o.buyer} · {money(o.total)}
                    </p>
                  ))}
                  {!orders.length && <p className="muted">No orders yet.</p>}
                </div>
              </div>
            </section>
          )}

          {page === 'admin-artworks' && (
            <section className="section page-section">
              <p className="eyebrow">ARTWORK MANAGEMENT</p>
              <h1 className="page-title">Manage artworks.</h1>

              <div className="admin-grid">
                <div className="admin-panel">
                  <h2>{selected ? 'Edit artwork' : 'Add new artwork'}</h2>

                  <form className="admin-form" onSubmit={saveArtwork}>
                    <input name="title" defaultValue={selected?.title || ''} placeholder="Artwork title" required />
                    <input name="artist" defaultValue={selected?.artist || ''} placeholder="Artist name" required />

                    <select name="category" defaultValue={selected?.category || 'Painting'}>
                      {['Painting', 'Abstract', 'Illustration', 'Photography', 'Sculpture'].map(c =>
                        <option key={c}>{c}</option>
                      )}
                    </select>

                    <input name="price" type="number" min="1" defaultValue={selected?.price || ''} placeholder="Price in INR" required />
                    <input name="image" defaultValue={selected?.image || ''} placeholder="Image URL (optional)" />
                    <textarea name="description" defaultValue={selected?.description || ''} placeholder="Description" required />

                    <label className="check">
                      <input name="auction" type="checkbox" defaultChecked={selected?.auction || false} />
                      Enable auction
                    </label>

                    <div className="row">
                      <button className="dark">{selected ? 'Save changes' : 'Add artwork'}</button>
                      {selected && (
                        <button type="button" className="outline" onClick={() => setSelected(null)}>
                          Cancel
                        </button>
                      )}
                    </div>
                  </form>
                </div>

                <div className="admin-panel">
                  <h2>All artworks ({artworks.length})</h2>

                  {artworks.map(a => (
                    <div className="manage-row" key={a.id}>
                      <span>
                        {a.title}
                        <small>{a.category} · {money(a.price)}</small>
                      </span>

                      <button onClick={() => {
                        setSelected(a)
                        window.scrollTo({ top: 0, behavior: 'smooth' })
                      }}>Edit</button>

                      <button className="danger" onClick={() => {
                        setArtworks(prev => prev.filter(x => x.id !== a.id))
                        flash('Artwork deleted.')
                      }}>Delete</button>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}

          {page === 'admin-users' && (
            <section className="section page-section">
              <p className="eyebrow">USER MANAGEMENT</p>
              <h1 className="page-title">Registered users.</h1>

              <div className="admin-panel table-panel">
                <h2>Total users: {users.filter(u => u.role === 'user').length}</h2>

                {users.filter(u => u.role === 'user').map(u => (
                  <div className="manage-row" key={u.id}>
                    <span>
                      {u.name}
                      <small>{u.email}</small>
                    </span>
                    <span className="muted">Customer</span>
                    <button className="danger" onClick={() => {
                      setUsers(prev => prev.filter(x => x.id !== u.id))
                      flash('User removed.')
                    }}>
                      Remove
                    </button>
                  </div>
                ))}

                {!users.some(u => u.role === 'user') &&
                  <p className="muted">No registered users yet.</p>}
              </div>
            </section>
          )}

          {page === 'admin-orders' && (
            <section className="section page-section">
              <p className="eyebrow">ORDER MANAGEMENT</p>
              <h1 className="page-title">Customer orders.</h1>

              <div className="admin-panel table-panel">
                <h2>Total orders: {orders.length}</h2>

                {orders.map(o => (
                  <div className="manage-row" key={o.id}>
                    <span>
                      Order #{o.id}
                      <small>{o.buyer} · {o.date} · {money(o.total)}</small>
                    </span>

                    <select
                      value={o.status || 'Pending'}
                      onChange={e => updateOrder(o.id, e.target.value)}
                    >
                      <option>Pending</option>
                      <option>Processing</option>
                      <option>Shipped</option>
                      <option>Delivered</option>
                      <option>Cancelled</option>
                    </select>
                  </div>
                ))}

                {!orders.length && <p className="muted">No orders yet.</p>}
              </div>
            </section>
          )}
        </main>

        <footer>
          <div className="footer-brand">
            ARTMITHRA
            <span>Administration Panel</span>
          </div>
          <small>© 2026 ARTMITHRA.</small>
        </footer>
      </div>
    )
  }

  // PUBLIC MODE
  return (
    <div className="app">
      <header className="topbar">
        <button className="brand" onClick={() => nav('home')}>
          <span className="brand-mark">A</span>
          <span>ARTMITHRA<small>ART • COMMUNITY • CULTURE</small></span>
        </button>

        <nav>
          <button onClick={() => nav('home')}>Home</button>
          <button onClick={() => nav('gallery')}>Gallery</button>
          <button onClick={() => nav('auctions')}>Auctions</button>
          {current && <button onClick={() => nav('dashboard')}>My Space</button>}
        </nav>

        <div className="nav-actions">
          <button className="cart-btn" onClick={() => nav('cart')}>
            Bag <span>{cart.length}</span>
          </button>

          {current ? (
            <>
              <span className="welcome">Hi, {current.name.split(' ')[0]}</span>
              <button className="outline small" onClick={logout}>Logout</button>
            </>
          ) : (
            <button className="dark small" onClick={() => nav('auth')}>
              Login / Sign up
            </button>
          )}
        </div>
      </header>

      {notice && <div className="toast" role="status">{notice}</div>}

      <main>
        {page === 'home' && (
          <>
            <section className="hero">
              <div className="hero-copy">
                <p className="eyebrow">A SPACE FOR EVERY KIND OF ART</p>
                <h1>Art has a place.<br /><em>So do you.</em></h1>
                <p className="hero-text">
                  Discover original creations, meet the artists behind them,
                  and bring a little more imagination into your everyday.
                </p>

                <div className="hero-buttons">
                  <button className="dark" onClick={() => nav('gallery')}>Explore the gallery ↗</button>
                  <button className="text-btn" onClick={() => nav('auctions')}>Discover auctions →</button>
                </div>

                <div className="hero-note">
                  <span>✳</span> A community made for curious minds and creative souls.
                </div>
              </div>

              <div className="hero-art">
                <img src={artworks[0]?.image} alt="Featured artwork" />
                <div className="art-label">
                  <span>FEATURED PIECE</span>
                  <b>{artworks[0]?.title || 'New artwork'}</b>
                  <small>by {artworks[0]?.artist || 'ARTMITHRA artists'}</small>
                </div>
                <div className="round-stamp">MADE<br />WITH<br />IMAGINATION</div>
              </div>
            </section>

            <section className="section">
              <div className="section-head">
                <div>
                  <p className="eyebrow">CURATED FOR YOU</p>
                  <h2>Find your kind of art.</h2>
                </div>
                <button className="text-btn" onClick={() => nav('gallery')}>View all artwork ↗</button>
              </div>

              <ArtworkGrid
                items={artworks.slice(0, 3)}
                onView={a => { setSelected(a); nav('detail') }}
                onAdd={addToCart}
              />
            </section>

            <section className="community">
              <p className="eyebrow">MORE THAN A MARKETPLACE</p>
              <h2>Every artwork has a story.<br /><em>Come be part of it.</em></h2>
              <button className="light" onClick={() => nav('auth')}>Join the community ↗</button>
            </section>
          </>
        )}

        {page === 'gallery' && (
          <section className="section page-section">
            <p className="eyebrow">THE COLLECTION</p>
            <h1 className="page-title">Explore the gallery.</h1>

            <div className="filters">
              <input placeholder="Search artwork or artist..." value={query} onChange={e => setQuery(e.target.value)} />
              <select value={category} onChange={e => setCategory(e.target.value)}>
                {['All', 'Painting', 'Abstract', 'Illustration', 'Photography', 'Sculpture'].map(c =>
                  <option key={c}>{c}</option>
                )}
              </select>
            </div>

            <ArtworkGrid
              items={filtered}
              onView={a => { setSelected(a); nav('detail') }}
              onAdd={addToCart}
            />

            {!filtered.length && <p className="empty">No artwork found. Try another search.</p>}
          </section>
        )}

        {page === 'auctions' && (
          <section className="section page-section">
            <p className="eyebrow">BID FOR SOMETHING BEAUTIFUL</p>
            <h1 className="page-title">Art auctions.</h1>
            <p className="muted">Place a demo bid on an artwork. The highest bid is shown instantly.</p>

            <ArtworkGrid
              items={artworks.filter(a => a.auction)}
              onView={a => { setSelected(a); nav('detail') }}
              onAdd={addToCart}
              auction
            />
          </section>
        )}

        {page === 'detail' && selected && (
          <section className="detail section">
            <img src={selected.image} alt={selected.title} />

            <div>
              <p className="eyebrow">{selected.category} · ORIGINAL ARTWORK</p>
              <h1>{selected.title}</h1>
              <p className="muted">Created by {selected.artist}</p>
              <h2>{money(selected.price)}</h2>
              <p>{selected.description}</p>

              <button className="dark" onClick={() => addToCart(selected)}>Add to bag</button>

              {selected.auction && (
                <div className="bid-box">
                  <h3>Current bid: {money(selected.bid || selected.price)}</h3>
                  <form onSubmit={e => {
                    e.preventDefault()
                    placeBid(selected, new FormData(e.currentTarget).get('amount'))
                    e.currentTarget.reset()
                  }}>
                    <input name="amount" type="number" min={Number(selected.bid || selected.price) + 1} placeholder="Enter a higher bid" required />
                    <button className="dark">Place bid</button>
                  </form>
                </div>
              )}

              <div className="review-box">
                <h3>Share your thoughts</h3>

                {current ? (
                  <form onSubmit={e => addReview(e, selected)}>
                    <select name="rating">
                      <option value="5">5 stars</option>
                      <option value="4">4 stars</option>
                      <option value="3">3 stars</option>
                      <option value="2">2 stars</option>
                      <option value="1">1 star</option>
                    </select>
                    <input name="comment" placeholder="Write a review..." required />
                    <button className="outline">Post review</button>
                  </form>
                ) : (
                  <p className="muted">Log in to write a review.</p>
                )}

                {reviews.filter(r => r.artwork === selected.title).map(r => (
                  <p className="review" key={r.id}>
                    ★ {r.rating}/5 · {r.comment} <small>— {r.user}</small>
                  </p>
                ))}
              </div>
            </div>
          </section>
        )}

        {page === 'auth' && (
          <section className="auth-wrap">
            <div className="auth-card">
              <p className="eyebrow">WELCOME TO ARTMITHRA</p>
              <h1>{authMode === 'login' ? 'Good to see you.' : 'Create your space.'}</h1>

              <div className="tabs">
                <button className={authMode === 'login' ? 'active' : ''} onClick={() => setAuthMode('login')}>Login</button>
                <button className={authMode === 'signup' ? 'active' : ''} onClick={() => setAuthMode('signup')}>Sign up</button>
              </div>

              <form onSubmit={authMode === 'login' ? login : signup}>
                {authMode === 'signup' && (
                  <label>
                    Full name
                    <input name="name" placeholder="Your name" required />
                  </label>
                )}

                <label>
                  Email address
                  <input name="email" type="email" placeholder="you@example.com" required />
                </label>

                <label>
                  Password
                  <input name="password" type="password" placeholder="At least 6 characters" minLength="6" required />
                </label>

                <button className="dark full">
                  {authMode === 'login' ? 'Login to ARTMITHRA' : 'Create account'} →
                </button>
              </form>
            </div>
          </section>
        )}

        {page === 'cart' && (
          <section className="section page-section">
            <p className="eyebrow">YOUR SELECTION</p>
            <h1 className="page-title">Your bag.</h1>

            {cart.length ? (
              <>
                <div className="cart-list">
                  {cart.map(a => (
                    <div className="cart-row" key={a.id}>
                      <img src={a.image} alt="" />
                      <div>
                        <b>{a.title}</b>
                        <p className="muted">{a.artist}</p>
                      </div>
                      <strong>{money(a.price)}</strong>
                      <button className="remove" onClick={() =>
                        setCart(prev => prev.filter(x => x.id !== a.id))
                      }>Remove</button>
                    </div>
                  ))}
                </div>

                <div className="cart-total">
                  <h3>Total: {money(cart.reduce((s, a) => s + Number(a.price), 0))}</h3>
                  <button className="dark" onClick={checkout}>Place demo order</button>
                </div>
              </>
            ) : (
              <p className="empty">Your bag is waiting for something beautiful.</p>
            )}
          </section>
        )}

        {page === 'dashboard' && current && !isAdmin && (
          <section className="section page-section">
            <p className="eyebrow">YOUR ARTMITHRA SPACE</p>
            <h1 className="page-title">Hello, {current.name}.</h1>

            <div className="stats">
              <Stat label="Orders" value={orders.filter(o => o.buyer === current.email).length} />
              <Stat label="Bids placed" value={bids.filter(b => b.bidder === current.email).length} />
              <Stat label="Cart items" value={cart.length} />
            </div>

            <h2 className="subhead">Your recent orders</h2>

            {orders.filter(o => o.buyer === current.email).map(o => (
              <p className="order-line" key={o.id}>
                Order #{o.id} · {o.date} · {money(o.total)} · {o.status || 'Pending'}
              </p>
            ))}

            {!orders.some(o => o.buyer === current.email) &&
              <p className="muted">Your orders will appear here after checkout.</p>}
          </section>
        )}

        {page === 'adminLogin' && (
          <section className="auth-wrap">
            <div className="auth-card">
              <p className="eyebrow">ADMINISTRATION</p>
              <h1>Admin Login.</h1>

              <form onSubmit={adminLogin}>
                <label>
                  Admin email
                  <input name="email" type="email" required />
                </label>
                <label>
                  Password
                  <input name="password" type="password" required />
                </label>
                <button className="dark full">Enter Admin Mode →</button>
              </form>

              <button className="text-btn" onClick={() => nav('home')}>
                Back to Public Website
              </button>
            </div>
          </section>
        )}

        {page !== 'home' &&
          page !== 'gallery' &&
          page !== 'auctions' &&
          page !== 'detail' &&
          page !== 'auth' &&
          page !== 'cart' &&
          page !== 'dashboard' &&
          page !== 'adminLogin' && (
            <section className="section">
              <h1>Page not found</h1>
              <button className="dark" onClick={() => nav('home')}>Go home</button>
            </section>
          )}
      </main>

      <footer>
        <div className="footer-brand">
          ARTMITHRA
          <span>Art brings us together.</span>
        </div>

        <p>Discover · Collect · Celebrate</p>
        <small>© 2026 ARTMITHRA. College demonstration project.</small>

        <div style={{ marginTop: '20px' }}>
          <button className="outline small" onClick={() => {
            setMode('admin')
            setPage('adminLogin')
          }}>
            Admin Portal →
          </button>
        </div>
      </footer>
    </div>
  )
}

function ArtworkGrid({ items, onView, onAdd, auction = false }) {
  return (
    <div className="art-grid">
      {items.map(a => (
        <article className="art-card" key={a.id}>
          <button className="image-button" onClick={() => onView(a)}>
            <img src={a.image} alt={a.title} />
            {(auction || a.auction) && <span className="auction-tag">AUCTION</span>}
          </button>

          <div className="card-info">
            <div>
              <p className="eyebrow">{a.category}</p>
              <h3>{a.title}</h3>
              <p className="muted">by {a.artist}</p>
            </div>
            <strong>{money(a.price)}</strong>
          </div>

          <div className="card-actions">
            <button className="text-btn" onClick={() => onView(a)}>View details ↗</button>
            <button className="outline small" onClick={() => onAdd(a)}>Add to bag</button>
          </div>

          {a.auction && (
            <p className="current-bid">Current bid: {money(a.bid || a.price)}</p>
          )}
        </article>
      ))}
    </div>
  )
}

function Stat({ label, value }) {
  return (
    <div className="stat">
      <strong>{value}</strong>
      <span>{label}</span>
    </div>
  )
}
