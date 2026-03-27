"use client";

import { useState } from "react";
import { variants, FIXED_PRICE, MESSENGER_PAGE_URL, WHATSAPP_NUMBER, FACEBOOK_PAGE_URL } from "@/lib/products";

// --- helpers ---
const accentClasses: Record<string, { border: string; bg: string; text: string }> = {
  amber:  { border: "border-amber-400",   bg: "bg-amber-50",   text: "text-amber-700"   },
  emerald:{ border: "border-emerald-400", bg: "bg-emerald-50", text: "text-emerald-700" },
  blue:   { border: "border-blue-400",    bg: "bg-blue-50",    text: "text-blue-700"    },
  rose:   { border: "border-rose-400",    bg: "bg-rose-50",    text: "text-rose-700"    },
};

function buildMessengerUrl(variantName: string) {
  const text = encodeURIComponent(`Hi! I'd like to order the ${variantName} – $${FIXED_PRICE}`);
  return `${MESSENGER_PAGE_URL}?text=${text}`;
}

function buildWhatsAppUrl(variantName: string) {
  const text = encodeURIComponent(`Hi! I'd like to order the BackgammonPro ${variantName} – $${FIXED_PRICE}`);
  return `https://wa.me/${WHATSAPP_NUMBER.replace(/\D/g, "")}?text=${text}`;
}

function trackFbEvent(event: string, params?: Record<string, unknown>) {
  if (typeof window !== "undefined" && (window as unknown as { fbq?: (...args: unknown[]) => void }).fbq) {
    (window as unknown as { fbq: (...args: unknown[]) => void }).fbq("track", event, params);
  }
}

// ---- Navbar ----
function Navbar() {
  return (
    <nav className="sticky top-0 z-50 bg-stone-900 text-white shadow-md">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <a href="#" className="text-xl font-bold tracking-tight flex items-center gap-2">
          <span>♟️</span>
          <span>BackgammonPro</span>
        </a>
        <a
          href={FACEBOOK_PAGE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 transition-colors px-3 py-1.5 rounded-full text-sm font-medium"
        >
          <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
            <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.236 2.686.236v2.97h-1.513c-1.491 0-1.956.93-1.956 1.883v2.25h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z"/>
          </svg>
          Follow Us
        </a>
      </div>
    </nav>
  );
}

// ---- Hero ----
function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-stone-900 via-stone-800 to-amber-900 text-white py-20 px-4">
      <div className="absolute inset-0 opacity-5 pointer-events-none" aria-hidden>
        <div className="grid grid-cols-12 h-full">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="border-r border-white h-full" />
          ))}
        </div>
      </div>
      <div className="relative max-w-3xl mx-auto text-center">
        <p className="text-amber-400 font-semibold tracking-widest uppercase text-sm mb-3">
          Premium Handcrafted Sets
        </p>
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight mb-5">
          The Game of Kings,<br />
          <span className="text-amber-400">Crafted for You</span>
        </h1>
        <p className="text-stone-300 text-lg sm:text-xl max-w-xl mx-auto mb-8">
          Four stunning editions. One fixed price. Order directly via Facebook Messenger — no checkout hassle.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <a
            href="#products"
            className="bg-amber-500 hover:bg-amber-400 text-stone-900 font-bold px-8 py-3 rounded-full text-lg transition-colors shadow-lg"
          >
            Shop Now — ${FIXED_PRICE}
          </a>
          <a
            href={FACEBOOK_PAGE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="border border-white/40 hover:bg-white/10 text-white font-semibold px-8 py-3 rounded-full text-lg transition-colors"
          >
            Our Facebook Page
          </a>
        </div>
        <p className="mt-5 text-stone-400 text-sm">
          Free shipping · 30-day returns · Secure Messenger checkout
        </p>
      </div>
    </section>
  );
}

// ---- Trust bar ----
function TrustBar() {
  const items = [
    { icon: "🚚", label: "Free Shipping" },
    { icon: "🔒", label: "Safe & Secure" },
    { icon: "↩️", label: "30-Day Returns" },
    { icon: "💬", label: "Live Chat Support" },
  ];
  return (
    <div className="bg-amber-500 text-stone-900">
      <div className="max-w-6xl mx-auto px-4 py-3 flex flex-wrap justify-center gap-6 text-sm font-semibold">
        {items.map((item) => (
          <span key={item.label} className="flex items-center gap-1.5">
            <span>{item.icon}</span>
            {item.label}
          </span>
        ))}
      </div>
    </div>
  );
}

// ---- Product Card ----
function ProductCard({ variant, isSelected, onSelect }: {
  variant: typeof variants[0];
  isSelected: boolean;
  onSelect: () => void;
}) {
  const accent = accentClasses[variant.color] ?? accentClasses.amber;

  return (
    <div
      onClick={onSelect}
      className={`relative cursor-pointer rounded-2xl border-2 transition-all duration-200 bg-white overflow-hidden shadow-sm hover:shadow-xl
        ${isSelected ? `${accent.border} shadow-xl scale-[1.02]` : "border-stone-200 hover:border-stone-300"}`}
    >
      {variant.badge && (
        <div className={`absolute top-4 right-4 ${variant.badgeColor ?? "bg-stone-700"} text-white text-xs font-bold px-2.5 py-1 rounded-full z-10`}>
          {variant.badge}
        </div>
      )}

      <div className={`${accent.bg} flex items-center justify-center py-10 text-7xl`}>
        {variant.emoji}
      </div>

      <div className="p-5">
        <div className="flex items-start justify-between mb-1">
          <div>
            <h3 className="text-lg font-bold text-stone-900">{variant.name}</h3>
            <p className={`text-sm font-medium ${accent.text}`}>{variant.subtitle}</p>
          </div>
          <span className="text-2xl font-extrabold text-stone-900">${variant.price}</span>
        </div>

        <p className="text-stone-500 text-sm mt-2 mb-4 leading-relaxed">{variant.description}</p>

        <ul className="space-y-1.5 mb-4">
          {variant.features.map((f) => (
            <li key={f} className="flex items-start gap-2 text-sm text-stone-700">
              <span className={`mt-0.5 font-bold ${accent.text}`}>✓</span>
              {f}
            </li>
          ))}
        </ul>

        <div className="flex gap-3 text-xs text-stone-400 border-t border-stone-100 pt-3">
          <span>📐 {variant.dimensions}</span>
          <span>·</span>
          <span>🪵 {variant.material}</span>
        </div>
      </div>

      {isSelected && (
        <div className={`${accent.bg} border-t ${accent.border} px-5 py-2 flex items-center gap-2`}>
          <span className={`text-sm font-semibold ${accent.text}`}>✓ Selected</span>
        </div>
      )}
    </div>
  );
}

// ---- Order Section ----
function OrderSection({ selectedId }: { selectedId: string | null }) {
  const selected = variants.find((v) => v.id === selectedId);

  function handleMessenger() {
    if (!selected) return;
    trackFbEvent("InitiateCheckout", { content_name: selected.name, value: selected.price, currency: "USD" });
    window.open(buildMessengerUrl(selected.name), "_blank");
  }

  function handleWhatsApp() {
    if (!selected) return;
    trackFbEvent("Contact", { content_name: selected.name });
    window.open(buildWhatsAppUrl(selected.name), "_blank");
  }

  return (
    <section id="order" className="max-w-xl mx-auto px-4 mt-10 mb-16">
      <div className="bg-white rounded-2xl border border-stone-200 shadow-lg overflow-hidden">
        <div className="bg-stone-900 text-white px-6 py-5 text-center">
          <h3 className="text-xl font-bold">
            {selected ? `Order: ${selected.name}` : "Select a Set Above"}
          </h3>
          {selected && (
            <p className="text-stone-300 text-sm mt-1">
              Fixed price — <strong className="text-amber-400">${selected.price}</strong> · Free shipping
            </p>
          )}
        </div>

        <div className="p-6 space-y-3">
          {!selected && (
            <p className="text-center text-stone-400 text-sm py-4">
              ↑ Click a set above to select it, then order here.
            </p>
          )}

          {selected && (
            <>
              <button
                onClick={handleMessenger}
                className="w-full flex items-center justify-center gap-3 bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-6 rounded-xl text-lg transition-colors shadow cursor-pointer"
              >
                <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                  <path d="M12 0C5.373 0 0 4.974 0 11.111c0 3.498 1.744 6.614 4.469 8.652V24l4.088-2.242c1.092.3 2.246.464 3.443.464 6.627 0 12-4.975 12-11.111S18.627 0 12 0zm1.191 14.963l-3.055-3.26-5.963 3.26 6.559-6.963 3.13 3.26 5.889-3.26-6.56 6.963z"/>
                </svg>
                Order via Messenger
              </button>

              <button
                onClick={handleWhatsApp}
                className="w-full flex items-center justify-center gap-3 bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-6 rounded-xl text-lg transition-colors shadow cursor-pointer"
              >
                <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                Order via WhatsApp
              </button>

              <p className="text-center text-stone-400 text-xs">
                We&apos;ll confirm your order and payment details over chat
              </p>
            </>
          )}
        </div>
      </div>
    </section>
  );
}

// ---- FAQ ----
function FAQ() {
  const items = [
    {
      q: "How do I place an order?",
      a: "Simply select your preferred edition above, then click 'Order via Messenger' or 'Order via WhatsApp'. We'll confirm your order, shipping address, and payment details over chat.",
    },
    {
      q: "What payment methods do you accept?",
      a: "We accept PayPal, bank transfer, and cash on delivery (selected areas). Our team will guide you through the payment process in the chat.",
    },
    {
      q: "How long does shipping take?",
      a: "Standard shipping takes 5–7 business days. We ship worldwide. Tracking information is provided once your order is dispatched.",
    },
    {
      q: "Can I return a set?",
      a: "Yes — we offer a 30-day hassle-free return policy. If you're not satisfied, contact us and we'll arrange a free return.",
    },
    {
      q: "Are the sets suitable as gifts?",
      a: "Absolutely! All editions come in premium packaging. The Deluxe Edition includes a dedicated gift box. Let us know in the chat and we can add a personalised note.",
    },
  ];

  const [open, setOpen] = useState<number | null>(null);

  return (
    <section className="max-w-2xl mx-auto px-4 py-12">
      <h2 className="text-2xl font-bold text-stone-900 text-center mb-8">Frequently Asked Questions</h2>
      <div className="space-y-3">
        {items.map((item, i) => (
          <div key={i} className="bg-white border border-stone-200 rounded-xl overflow-hidden">
            <button
              onClick={() => setOpen(open === i ? null : i)}
              className="w-full flex items-center justify-between px-5 py-4 text-left font-semibold text-stone-800 hover:bg-stone-50 transition-colors cursor-pointer"
            >
              {item.q}
              <span className="text-amber-500 text-lg ml-4 flex-shrink-0">{open === i ? "−" : "+"}</span>
            </button>
            {open === i && (
              <div className="px-5 pb-4 text-stone-600 text-sm leading-relaxed">{item.a}</div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

// ---- Footer ----
function Footer() {
  return (
    <footer className="bg-stone-900 text-stone-400 text-sm mt-auto">
      <div className="max-w-6xl mx-auto px-4 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="font-bold text-white text-base flex items-center gap-2">
          <span>♟️</span> BackgammonPro
        </p>
        <div className="flex gap-5">
          <a href={FACEBOOK_PAGE_URL} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
            Facebook
          </a>
          <a href={`https://wa.me/${WHATSAPP_NUMBER.replace(/\D/g, "")}`} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
            WhatsApp
          </a>
        </div>
        <p>© {new Date().getFullYear()} BackgammonPro. All rights reserved.</p>
      </div>
    </footer>
  );
}

// ---- Main Page ----
export default function Home() {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  function handleSelect(id: string) {
    setSelectedId(id);
    trackFbEvent("ViewContent", {
      content_name: variants.find((v) => v.id === id)?.name,
      content_ids: [id],
      content_type: "product",
    });
    setTimeout(() => {
      document.getElementById("order")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  }

  return (
    <>
      <Navbar />
      <Hero />
      <TrustBar />

      <main>
        <section id="products" className="max-w-6xl mx-auto px-4 py-14">
          <div className="text-center mb-10">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-stone-900 mb-3">
              Choose Your Edition
            </h2>
            <p className="text-stone-500 text-lg">
              All editions — one fixed price of{" "}
              <span className="font-bold text-amber-600">${FIXED_PRICE}</span> with free shipping.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {variants.map((v) => (
              <ProductCard
                key={v.id}
                variant={v}
                isSelected={selectedId === v.id}
                onSelect={() => handleSelect(v.id)}
              />
            ))}
          </div>
        </section>

        <OrderSection selectedId={selectedId} />

        <FAQ />
      </main>

      <Footer />
    </>
  );
}
