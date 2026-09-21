const dishes = [
  {
    name: "Peking Duck",
    desc: "Lacquered skin, thin pancakes, hoisin and spring onion.",
    price: "₹1,450",
  },
  {
    name: "Mapo Tofu",
    desc: "Silken tofu, Sichuan peppercorn, fermented chilli bean.",
    price: "₹620",
  },
  {
    name: "Dim Sum Selection",
    desc: "Hand-folded har gow, siu mai and truffle dumplings.",
    price: "₹780",
  },
  {
    name: "Kung Pao Prawns",
    desc: "Wok-fired with roasted peanuts and dried chilli.",
    price: "₹980",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Navbar */}
      <header className="sticky top-0 z-50 border-b border-bronze/40 bg-background/90 backdrop-blur">
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <a href="#" className="font-serif text-2xl tracking-wide text-gold">
            Golden Dragon
          </a>
          <ul className="hidden gap-8 text-sm uppercase tracking-widest text-champagne/80 md:flex">
            <li><a href="#about" className="hover:text-gold">About</a></li>
            <li><a href="#menu" className="hover:text-gold">Menu</a></li>
            <li><a href="#reserve" className="hover:text-gold">Reserve</a></li>
          </ul>
          <a href="#reserve" className="btn-outline hidden md:inline-block">
            Book a Table
          </a>
        </nav>
      </header>

      {/* Hero */}
      <section className="relative flex min-h-[85vh] items-center justify-center overflow-hidden px-6 text-center">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,var(--maroon)_0%,var(--ink)_70%)] opacity-70" />
        <div className="relative max-w-3xl">
          <p className="mb-4 text-sm uppercase tracking-[0.4em] text-gold">
            金龍 · Fine Chinese Dining
          </p>
          <h1 className="text-5xl leading-tight md:text-7xl">
            A Feast Worthy of Emperors
          </h1>
          <div className="gold-divider mx-auto my-8 w-40" />
          <p className="mx-auto max-w-xl text-lg text-champagne/80">
            Authentic Sichuan and Cantonese cuisine, crafted by master chefs
            and served in an atmosphere of quiet luxury.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <a href="#reserve" className="btn-primary">Reserve a Table</a>
            <a href="#menu" className="btn-outline">View Menu</a>
          </div>
        </div>
      </section>

      {/* About */}
      <section id="about" className="mx-auto max-w-4xl px-6 py-24 text-center">
        <p className="mb-3 text-sm uppercase tracking-[0.3em] text-vermilion">
          Our Story
        </p>
        <h2 className="text-4xl md:text-5xl">Tradition, Refined</h2>
        <div className="gold-divider mx-auto my-8 w-24" />
        <p className="text-lg leading-8 text-champagne/75">
          For over two decades, Golden Dragon has honoured the recipes of
          China's great culinary regions. Every dish is built on slow-simmered
          stocks, fiery woks and ingredients chosen with care.
        </p>
      </section>

      {/* Menu */}
      <section id="menu" className="border-y border-bronze/30 bg-maroon/20 py-24">
        <div className="mx-auto max-w-5xl px-6">
          <div className="text-center">
            <p className="mb-3 text-sm uppercase tracking-[0.3em] text-vermilion">
              Signature Dishes
            </p>
            <h2 className="text-4xl md:text-5xl">From Our Kitchen</h2>
            <div className="gold-divider mx-auto my-8 w-24" />
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {dishes.map((dish) => (
              <article key={dish.name} className="menu-card p-6">
                <div className="flex items-baseline justify-between gap-4">
                  <h3 className="text-2xl">{dish.name}</h3>
                  <span className="font-serif text-xl text-gold">
                    {dish.price}
                  </span>
                </div>
                <p className="mt-2 text-champagne/70">{dish.desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Reservation CTA */}
      <section id="reserve" className="mx-auto max-w-3xl px-6 py-24 text-center">
        <h2 className="text-4xl md:text-5xl">Reserve Your Evening</h2>
        <div className="gold-divider mx-auto my-8 w-24" />
        <p className="mb-10 text-lg text-champagne/75">
          Open daily, 12:00 PM to 11:00 PM. Book ahead for weekends and
          private dining.
        </p>
        <a href="tel:+910000000000" className="btn-primary">
          Call to Reserve
        </a>
      </section>

      {/* Footer */}
      <footer className="border-t border-bronze/40 py-8 text-center text-sm text-champagne/60">
        <p className="font-serif text-lg text-gold">Golden Dragon</p>
        <p className="mt-2">
          © {new Date().getFullYear()} Golden Dragon. All rights reserved.
        </p>
      </footer>
    </div>
  );
}