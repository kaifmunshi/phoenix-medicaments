import React from "react";
import { Award, Building2, Clock, ExternalLink, FlaskConical, Globe2, Instagram, Leaf, Mail, MapPin, Menu, MessageCircle, PackageCheck, Phone, ShieldCheck, Sparkles, UserRound } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
const heroImage = "https://res.cloudinary.com/dfqnjuaja/image/upload/v1783000460/herbal-manufacturing_yail06.png";
const home1Image = "https://res.cloudinary.com/dfqnjuaja/image/upload/v1783082762/home1-herbal-image_je86vw.png";
const home2Image = "https://res.cloudinary.com/dfqnjuaja/image/upload/v1783082762/home2-cosmetic-raw-material_wx9a6x.png";
const home3Image = "https://res.cloudinary.com/dfqnjuaja/image/upload/v1783082762/home3-mb-herbal_mqqi3b.png";
const globalExportMap = "https://res.cloudinary.com/dfqnjuaja/image/upload/v1783000810/global-export-map-v2_fdpakh.png";
const certificatePlaceholder = `data:image/svg+xml,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 1200" role="img" aria-labelledby="title desc"><title id="title">Certificate placeholder</title><desc id="desc">Elegant certificate placeholder for Phoenix Medicaments approvals.</desc><rect width="900" height="1200" fill="#fbf8ef"/><rect x="70" y="70" width="760" height="1060" fill="#ffffff" stroke="#c79335" stroke-width="8"/><rect x="105" y="105" width="690" height="990" fill="none" stroke="#113f33" stroke-width="2" opacity="0.35"/><circle cx="450" cy="255" r="74" fill="#113f33"/><path d="M420 255c24-62 72-77 116-85-8 60-43 95-102 111" fill="#2f8b68"/><text x="450" y="390" text-anchor="middle" font-family="Arial, sans-serif" font-size="42" font-weight="800" fill="#113f33">Certificate</text><text x="450" y="450" text-anchor="middle" font-family="Arial, sans-serif" font-size="26" fill="#5f7068">Phoenix Medicaments Pvt Ltd</text><line x1="210" y1="560" x2="690" y2="560" stroke="#dce7df" stroke-width="6"/><line x1="210" y1="640" x2="690" y2="640" stroke="#dce7df" stroke-width="6"/><line x1="210" y1="720" x2="690" y2="720" stroke="#dce7df" stroke-width="6"/><rect x="315" y="860" width="270" height="90" rx="45" fill="#113f33"/><text x="450" y="918" text-anchor="middle" font-family="Arial, sans-serif" font-size="24" font-weight="800" fill="#ffffff">Verified Document</text></svg>')}`;
const mbHerbalsLogo = "https://res.cloudinary.com/dfqnjuaja/image/upload/v1783000730/mb-herbals-logo_xhfixq.svg";
import { fetchCertificates, fetchProducts, sendContactEnquiry, warmApi } from "./api";

const businessNumber = "8511052468";
const contactEmail = "phoenixsalesahmedabad@gmail.com";

const routes = {
  home: "/",
  categories: "/categories",
  contact: "/contact",
  about: "/about",
  certificates: "/certificates"
};

const storyParagraphs = [
  "Phoenix Medicaments Pvt. Ltd. (CIN: U24100GJ2013PTC076688) is an Ahmedabad-based export company specializing in herbal supplements, spray dried food powders, herbal beauty products, hair oils, wellness ingredients, and Ayurvedic formulations for global markets.",
  "Under our flagship brand MB Herbals, we manufacture and export premium-quality herbal powders, wellness products, and beauty care solutions crafted with carefully sourced ingredients and modern manufacturing standards. Our products are trusted by customers across multiple international markets including the USA, UK, Saudi Arabia, Australia, Japan, Russia, Croatia, France, Spain, Hungary, Czech Republic, Poland, and Malaysia.",
  "Over the years, Phoenix Medicaments has evolved into a reliable partner for bulk exports, contract manufacturing, and white-label solutions for herbal and wellness brands worldwide. We operate across leading international B2B and B2C marketplaces with a dedicated team focused on quality, consistency, and customer satisfaction.",
  "With a strong focus on transparency, product quality, and long-term partnerships, we continue to expand our global presence while delivering herbal and wellness products that meet modern international standards."
];

const categoryCards = [
  {
    title: "Herbal & Ayurvedic Ingredients",
    text: "Export-quality herbal powders, botanical ingredients, and wellness raw materials for nutraceutical and personal care applications.",
    badge: "Bulk herbs",
    image: home1Image,
    crop: "center"
  },
  {
    title: "Cosmetic & Industrial Raw Materials",
    text: "Cosmetic-grade minerals and specialty ingredients for skincare, personal care, and industrial formulations.",
    badge: "Raw materials",
    image: home2Image,
    crop: "center"
  },
  {
    title: "MB Herbals Consumer Brand",
    text: "Our flagship consumer brand for herbal powders, oils, beauty products, and everyday natural wellness essentials.",
    badge: "Our Consumer brand",
    image: home3Image,
    crop: "center"
  }
];

function makeProducts(category, items) {
  return items.map((item, index) => ({
    category,
    id: `${category}-${index + 1}`,
    photo: heroImage,
    ...item
  }));
}

const productGroups = {
  dietSupplement: {
    label: "Diet Supplement",
    shortLabel: "Diet",
    intro: "Herbal wellness powders, nutraceutical ingredients, and dietary supplement materials prepared for bulk and private-label supply.",
    accent: "Wellness",
    products: []
  },
  skinCare: {
    label: "Skin Care",
    shortLabel: "Skin",
    intro: "Natural skincare powders and beauty ingredients for face packs, body care, and cosmetic formulations.",
    accent: "Beauty",
    products: []
  },
  hairCare: {
    label: "Hair Care",
    shortLabel: "Hair",
    intro: "Herbal hair care ingredients for oils, masks, cleansing powders, and scalp care formulations.",
    accent: "Scalp care",
    products: []
  },
  fruitPowders: {
    label: "Fruit Powders",
    shortLabel: "Fruit",
    intro: "Spray dried and dehydrated fruit powders for beverages, nutraceutical blends, bakery mixes, and food formulations.",
    accent: "Food grade",
    products: []
  },
  clays: {
    label: "Clays",
    shortLabel: "Clays",
    intro: "Cosmetic-grade clays and mineral powders for skincare, cleansing, and spa formulations.",
    accent: "Minerals",
    products: []
  },
  cosmeticRawMaterials: {
    label: "Cosmetic Raw Materials",
    shortLabel: "Cosmetic",
    intro: "Cosmetic and personal care raw materials for skincare, hair care, cleansing products, and formulation support.",
    accent: "Formulation",
    products: []
  },
  saltSpices: {
    label: "Salt & Spices",
    shortLabel: "Spices",
    intro: "Food-grade salts, spices, and seasoning ingredients for culinary and processed food applications.",
    accent: "Culinary",
    products: []
  },
  processedFoodAdditives: {
    label: "Processed Food Additives",
    shortLabel: "Additives",
    intro: "Food additives and functional ingredients for processed foods, beverages, and industrial formulations.",
    accent: "Functional",
    products: []
  }
};
const exportFeatures = ["Premium natural ingredients", "Advanced manufacturing support", "Custom formulations", "Bulk export solutions", "Private labelling", "Global marketplace supply"];

const aboutStats = [
  ["2013", "Established"],
  ["20+", "Export markets"],
  ["B2B + B2C", "Marketplace reach"]
];

const storyCards = [
  {
    title: "What we make",
    text: "Herbal supplements, spray dried food powders, herbal beauty products, hair oils, wellness ingredients, and Ayurvedic formulations."
  },
  {
    title: "How we support brands",
    text: "Bulk exports, contract manufacturing, packaging, labelling, and white-label solutions for wellness businesses."
  },
  {
    title: "How we work",
    text: "Transparent communication, consistent quality, and practical export support for long-term global partnerships."
  }
];

const marketRegions = [
  { region: "America", markets: "USA, Canada" },
  { region: "Europe", markets: "Europe, Russia" },
  { region: "Middle East", markets: "UAE, Saudi Arabia" },
  { region: "Asia", markets: "India and regional sourcing hub" },
  { region: "Australia", markets: "Australia" }
];
const homeProofStats = [
  ["20+", "Export markets"],
  ["8", "Core categories"],
  ["B2B", "Bulk & private label"]
];

const homeCategoryStrip = ["Diet supplements", "Skin care", "Hair care", "Fruit powders", "Clays", "Cosmetic raw materials", "Salt & spices", "Food additives"];
const certificateCards = [
  {
    title: "Quality & export documents",
    subtitle: "Certificate placeholder",
    image: certificatePlaceholder,
    note: "Add APEDA, FSSAI, GMP, Organic, Spice Board, SHEFEXIL, and other certificate scans here."
  }
];

const amazonCountryLinks = [
  ["India", "https://www.amazon.in/stores/page/12F97B58-2733-4DD2-B807-3A585AD15A78?ingress=2&lp_context_asin=B082DFCCZX&lp_context_query=MB%20Herbals&visitId=59f56445-4dd0-4d43-8665-f804539f9132&store_ref=bl_ast_dp_brandlogo_sto&ref_=ast_bln"],
  ["USA", "https://www.amazon.com/stores/MBHerbals/page/31F954B7-210F-4C24-89E3-37A4FCFD49FD"],
  ["UAE", "https://www.amazon.ae/s?k=MB+Herbals"],
  ["Australia", "https://www.amazon.com.au/s?k=mb+herbals"]
];

function getRouteFromPath() {
  const path = window.location.pathname;
  if (path.startsWith("/categories")) return "categories";
  if (path.startsWith("/contact")) return "contact";
  if (path.startsWith("/about")) return "about";
  if (path.startsWith("/certificates")) return "certificates";
  return "home";
}

function navigateTo(event, href) {
  event.preventDefault();
  if (window.location.pathname !== href) {
    window.history.pushState({}, "", href);
    window.dispatchEvent(new PopStateEvent("popstate"));
  }
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function Header({ activeRoute }) {
  const [isAmazonOpen, setIsAmazonOpen] = useState(false);
  const navItems = [
    ["home", "Home", routes.home],
    ["categories", "Product Categories", routes.categories],
    ["about", "About Us", routes.about],
    ["certificates", "Certificates", routes.certificates],
    ["contact", "Contact", routes.contact]
  ];

  return (
    <header className="site-header">
      <a className="brand" href={routes.home} onClick={(event) => navigateTo(event, routes.home)}>
        <img className="brand-logo" src={mbHerbalsLogo} alt="MB Herbals" />
        <span className="brand-name">Phoenix Medicaments Pvt Ltd</span>
      </a>
      <nav aria-label="Primary navigation">
        {navItems.map(([key, label, href]) => (
          <a className={activeRoute === key ? "active" : ""} href={href} key={key} onClick={(event) => { setIsAmazonOpen(false); navigateTo(event, href); }}>{label}</a>
        ))}
        <div className={`nav-dropdown ${isAmazonOpen ? "is-open" : ""}`}> 
          <button type="button" aria-haspopup="true" aria-expanded={isAmazonOpen} onClick={() => setIsAmazonOpen((open) => !open)}>Buy on Amazon</button>
          <div className="nav-dropdown-menu" aria-label="Amazon country links">
            {amazonCountryLinks.map(([country, href]) => (
              <a href={href} key={country} target="_blank" rel="noreferrer" onClick={() => setIsAmazonOpen(false)}>{country}</a>
            ))}
          </div>
        </div>
      </nav>
      <div className="header-actions" aria-label="Quick actions">
        <a href={routes.contact} aria-label="Contact Phoenix Medicaments" onClick={(event) => navigateTo(event, routes.contact)}><UserRound size={18} /></a>
        <button type="button" className="menu-button" aria-label="Navigation"><Menu size={19} /></button>
      </div>
    </header>
  );
}

function LoadingBanner({ title = "Preparing catalogue", text = "Gathering fresh product details for you." }) {
  return (
    <div className="loading-banner" role="status" aria-live="polite">
      <div className="loading-orbit" aria-hidden="true">
        <Leaf size={24} />
      </div>
      <div className="loading-copy">
        <strong>{title}</strong>
        <span>{text}</span>
      </div>
      <div className="loading-rail" aria-hidden="true">
        <i></i>
      </div>
      <div className="loading-chips" aria-hidden="true">
        <span>Herbs</span>
        <span>Powders</span>
        <span>Extracts</span>
      </div>
    </div>
  );
}
function HomePage() {
  return (
    <>
      <section className="hero-page home-hero">
        <img className="hero-bg" src={heroImage} alt="Herbal products and modern manufacturing facility" />
        <div className="home-hero-content">
          <p className="eyebrow">Pure by nature. Trusted worldwide.</p>
          <h1>Manufacturing and export solutions from India.</h1>
          <p>
            Phoenix Medicaments Pvt Ltd supports global wellness brands with herbal powders,
            fruit powders, cosmetic raw materials, private labelling, packaging, and bulk export supply.
          </p>
          <div className="hero-actions">
            <a className="button primary" href={routes.categories} onClick={(event) => navigateTo(event, routes.categories)}><PackageCheck size={18} />Explore categories</a>
            <a className="button secondary light" href={routes.contact} onClick={(event) => navigateTo(event, routes.contact)}>Start an enquiry</a>
          </div>
          <div className="home-proof-row" aria-label="Business highlights">
            {homeProofStats.map(([value, label]) => (
              <div key={label}>
                <strong>{value}</strong>
                <span>{label}</span>
              </div>
            ))}
          </div>
          <div className="home-category-strip" aria-label="Core product categories">
            {homeCategoryStrip.map((item) => <span key={item}>{item}</span>)}
          </div>
        </div>
      </section>

      <section className="section dark-band home-section-preview">
        <div className="section-heading centered">
          <p className="eyebrow">Core manufacturing & export categories</p>
          <h2>Premium herbal, wellness, and private-label solutions for global buyers.</h2>
        </div>
        <div className="core-grid">
          {categoryCards.map((card) => (
            <article className="core-card" key={card.title}>
              <img src={card.image} alt={card.title} style={{ objectPosition: card.crop }} />
              <div>
                <span>{card.badge}</span>
                <h3>{card.title}</h3>
                <p>{card.text}</p>
              </div>
            </article>
          ))}
        </div>
      </section>


    </>
  );
}
function AboutPage() {
  return (
    <section className="page-shell about-page">
      <div className="about-hero-panel">
        <div className="about-copy-block">
          <p className="page-kicker">About Phoenix Medicaments</p>
          <h1>A trusted Indian partner for natural wellness brands worldwide.</h1>
          <p className="about-lead">
            Phoenix Medicaments Pvt. Ltd. helps global wellness businesses source herbal powders,
            spray dried food powders, beauty ingredients, hair oils, and Ayurvedic formulations with
            practical packaging, labelling, and white-label support.
          </p>
          <div className="about-stat-row">
            {aboutStats.map(([value, label]) => (
              <div key={label}>
                <strong>{value}</strong>
                <span>{label}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="about-image-panel">
          <img src={home3Image} alt="Herbal ingredients and export manufacturing" />
          <div className="about-image-note">
            <strong>MB Herbals</strong>
            <span>Our flagship herbal and wellness consumer brand.</span>
          </div>
        </div>
      </div>

      <div className="about-content-grid">
        <div className="story-card-grid">
          {storyCards.map((card) => (
            <article key={card.title}>
              <h3>{card.title}</h3>
              <p>{card.text}</p>
            </article>
          ))}
        </div>
        <aside className="mission-panel compact-mission">
          <div>
            <h3>Mission</h3>
            <p>Deliver premium herbal, wellness, and white-label products with transparency, consistency, and global standards.</p>
          </div>
          <div>
            <h3>Vision</h3>
            <p>Become a respected Indian exporter and manufacturing partner for natural wellness solutions worldwide.</p>
          </div>
        </aside>
      </div>

      <div className="market-panel global-reach-panel">
        <div className="global-reach-copy">
          <p className="page-kicker">Global reach</p>
          <h2>From India's herbal heartland to global wellness markets.</h2>
          <p>Phoenix Medicaments supports export buyers across America, Europe, Russia, the Middle East, Asia, and Australia with herbal, wellness, food, and personal-care ingredient solutions.</p>
          <div className="market-chip-grid">
            {marketRegions.map(({ region, markets }) => (
              <span key={region}><strong>{region}</strong><small>{markets}</small></span>
            ))}
          </div>
        </div>
        <div className="map-card" aria-label="Global reach map showing export routes from India to worldwide markets">
          <img className="map-base-image" src={globalExportMap} alt="Export route map from India to USA, Canada, Europe, Russia, UAE, Saudi Arabia, and Australia" />
        </div>
      </div>

      <div className="feature-strip">
        {exportFeatures.map((feature) => <span key={feature}>{feature}</span>)}
      </div>
    </section>
  );
}
function CategoriesPage() {
  const [selectedGroup, setSelectedGroup] = useState("skinCare");
  const [apiProducts, setApiProducts] = useState([]);
  const [apiTotal, setApiTotal] = useState(0);
  const [productPage, setProductPage] = useState(1);
  const [hasMoreProducts, setHasMoreProducts] = useState(false);
  const [categoryCounts, setCategoryCounts] = useState({});
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);
  const [isLoadingMoreProducts, setIsLoadingMoreProducts] = useState(false);
  const [productError, setProductError] = useState("");
  const loadMoreRef = useRef(null);
  const productsTopRef = useRef(null);
  const shouldScrollToProductsRef = useRef(false);
  const currentGroup = productGroups[selectedGroup];
  const pageSize = 12;
  const totalProducts = Object.values(categoryCounts).reduce((sum, count) => sum + Number(count || 0), 0);

  function selectCategory(value) {
    shouldScrollToProductsRef.current = true;
    setSelectedGroup(value);
  }

  function loadProductPage(page, { append = false } = {}) {
    if ((append && isLoadingMoreProducts) || (!append && isLoadingProducts)) return Promise.resolve();
    const setLoading = append ? setIsLoadingMoreProducts : setIsLoadingProducts;
    setLoading(true);
    setProductError("");

    return fetchProducts({ type: currentGroup.label, page, limit: pageSize })
      .then((data) => {
        const items = Array.isArray(data.items) ? data.items : [];
        setApiProducts((currentItems) => (append ? [...currentItems, ...items] : items));
        setApiTotal(Number(data.total || 0));
        setProductPage(Number(data.page || page));
        setHasMoreProducts(Boolean(data.hasMore));
      })
      .catch(() => {
        if (!append) {
          setApiProducts([]);
          setApiTotal(0);
          setHasMoreProducts(false);
        }
        setProductError("Could not load products from the database. Please check the backend connection.");
      })
      .finally(() => setLoading(false));
  }


  useEffect(() => {
    let isCurrent = true;
    setApiProducts([]);
    setApiTotal(0);
    setProductPage(1);
    setHasMoreProducts(false);
    setIsLoadingProducts(true);
    setProductError("");

    fetchProducts({ type: currentGroup.label, page: 1, limit: pageSize })
      .then((data) => {
        if (!isCurrent) return;
        const items = Array.isArray(data.items) ? data.items : [];
        setApiProducts(items);
        setApiTotal(Number(data.total || 0));
        setProductPage(Number(data.page || 1));
        setHasMoreProducts(Boolean(data.hasMore));
        setCategoryCounts((counts) => ({ ...counts, [selectedGroup]: Number(data.total || 0) }));
      })
      .catch(() => {
        if (!isCurrent) return;
        setProductError("Could not load products from the database. Please check the backend connection.");
      })
      .finally(() => {
        if (isCurrent) setIsLoadingProducts(false);
      });

    return () => {
      isCurrent = false;
    };
  }, [currentGroup.label, selectedGroup]);


  useEffect(() => {
    if (!shouldScrollToProductsRef.current || isLoadingProducts) return;
    shouldScrollToProductsRef.current = false;
    productsTopRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [isLoadingProducts, apiProducts.length]);
  useEffect(() => {
    const node = loadMoreRef.current;
    if (!node || !hasMoreProducts || isLoadingProducts || isLoadingMoreProducts) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          loadProductPage(productPage + 1, { append: true });
        }
      },
      { rootMargin: "220px" }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [hasMoreProducts, isLoadingProducts, isLoadingMoreProducts, productPage, currentGroup.label]);

  return (
    <section className="page-shell product-page">
      <div className="product-hero-panel">
        <div className="category-hero-copy">
          <p className="eyebrow">Product Categories</p>
          <h1>Explore nature's ingredient library.</h1>
          <p>
            Move through botanicals, fruit powders, minerals, and formulation essentials curated for bulk supply, private label, and export enquiries.
          </p>
          <div className="catalog-trust-row" aria-label="Catalogue highlights">
            <span>Bulk supply</span>
            <span>Private label</span>
            <span>Export ready</span>
          </div>
        </div>
        <aside className="category-total-card" aria-label="Total products in catalogue">
          <span>Catalogue total</span>
          <strong>{isLoadingProducts && totalProducts === 0 ? "..." : totalProducts}</strong>
          <small>products across all categories</small>
        </aside>
      </div>

      <div className="category-control-panel">
        <div className="category-picker-card">
          <label className="category-select">
            <span>Choose product category</span>
            <select value={selectedGroup} onChange={(event) => selectCategory(event.target.value)}>
              {Object.entries(productGroups).map(([key, group]) => (
                <option value={key} key={key}>{group.label}</option>
              ))}
            </select>
          </label>
          <div className="category-picker-meta">
            <strong>{currentGroup.label}</strong>
            <small>{isLoadingProducts ? "Refreshing catalogue" : `${apiTotal} ${apiTotal === 1 ? "product" : "products"} available`}</small>
          </div>
        </div>
        <div className="category-tabs" role="tablist" aria-label="Product category filters">
          {Object.entries(productGroups).map(([key, group]) => {
            const count = Number(categoryCounts[key] || 0);

            return (
              <button
                className={selectedGroup === key ? "active" : ""}
                key={key}
                onClick={() => selectCategory(key)}
                role="tab"
                type="button"
                aria-selected={selectedGroup === key}
              >
                <span>{group.label}</span>
                <small>{count}</small>
              </button>
            );
          })}
        </div>
      </div>

      <div className="catalog-focus-card">
        <div>
          <span>{currentGroup.accent}</span>
          <h2>{currentGroup.label}</h2>
          <p>{currentGroup.intro}</p>
        </div>
        <div className="catalog-count-pill">
          {isLoadingProducts ? "Refreshing..." : `${apiProducts.length} of ${apiTotal} products`}
        </div>
      </div>

      {productError && <p className="inline-alert">{productError}</p>}
      {isLoadingProducts && (
        <LoadingBanner title={`Preparing ${currentGroup.label}`} text="The catalogue service is waking up. This can take a moment on the first visit." />
      )}
      {!isLoadingProducts && !productError && apiProducts.length === 0 && (
        <div className="empty-catalog-state">
          <h3>No products found</h3>
          <p>Add active {currentGroup.label.toLowerCase()} products from the admin panel and they will appear here automatically.</p>
        </div>
      )}
      <div className="product-record-grid enhanced-grid" ref={productsTopRef}>
        {isLoadingProducts && apiProducts.length === 0 && Array.from({ length: 4 }).map((_, index) => (
          <article className="record-card enhanced-card product-skeleton-card" key={`product-skeleton-${index}`} aria-hidden="true">
            <div className="record-image-wrap"></div>
            <div className="record-body">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </article>
        ))}
        {apiProducts.map((product, index) => {
          const image = product.images?.[0];
          const imageUrl = image?.url || heroImage;
          const productDetails = [
            ["Botanical name", product.botanicalName],
            ["Form", product.form || product.specifications?.form],
            ["Shelf life", product.shelfLife || product.specifications?.shelfLife]
          ].filter(([, value]) => String(value || "").trim());

          return (
            <article className="record-card enhanced-card" key={product._id || product.slug || product.name}>
              <div className="record-image-wrap">
                <img src={imageUrl} alt={image?.alt || product.name} style={{ objectPosition: index % 3 === 0 ? "center" : index % 3 === 1 ? "right center" : "60% center" }} />
              </div>
              <div className="record-body">
                <h3>{product.name}</h3>
                {productDetails.length > 0 && (
                  <dl>
                    {productDetails.map(([label, value]) => (
                      <div key={label}><dt>{label}</dt><dd>{value}</dd></div>
                    ))}
                  </dl>
                )}
                <a className="button small" href={product.whatsappUrl || `https://wa.me/91${businessNumber}?text=${encodeURIComponent(`Hello Phoenix Medicaments, I want details for ${product.name}.`)}`} target="_blank" rel="noreferrer">
                  <MessageCircle size={16} />Enquire now
                </a>
              </div>
            </article>
          );
        })}
      </div>

      <div className="load-more-zone" ref={loadMoreRef}>
        {hasMoreProducts ? (
          <button className="button secondary" type="button" onClick={() => loadProductPage(productPage + 1, { append: true })} disabled={isLoadingMoreProducts}>
            {isLoadingMoreProducts ? "Bringing more products..." : "Load more products"}
          </button>
        ) : apiProducts.length > 0 ? (
          <span>All {currentGroup.label.toLowerCase()} products loaded</span>
        ) : null}
      </div>
    </section>
  );
}
function CertificatesPage() {
  const [certificates, setCertificates] = useState(certificateCards);
  const [isLoadingCertificates, setIsLoadingCertificates] = useState(true);
  const [selectedCertificate, setSelectedCertificate] = useState(null);
  const certificateGalleryRef = useRef(null);

  useEffect(() => {
    let isCurrent = true;
    setIsLoadingCertificates(true);

    fetchCertificates()
      .then((data) => {
        if (!isCurrent) return;
        const items = Array.isArray(data.items) ? data.items : [];
        setCertificates(items.length ? items : certificateCards);
      })
      .finally(() => {
        if (isCurrent) setIsLoadingCertificates(false);
      });

    return () => {
      isCurrent = false;
    };
  }, []);

  const certificateCount = certificates.length;
  const certificateHighlights = [
    [certificateCount, "Documents"],
    ["Buyer", "Verification"],
    ["Export", "Ready"]
  ];

  function scrollToCertificates() {
    certificateGalleryRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <section className="page-shell certificates-page">
      <div className="certificate-page-hero">
        <div className="certificate-hero-copy">
          <p className="eyebrow">Certificates & registrations</p>
          <h1>Compliance documents, presented with clarity.</h1>
          <p>
            View Phoenix Medicaments registrations, export certificates, and quality documents in a clean buyer-ready gallery.
          </p>
        </div>
        <div className="certificate-hero-panel" aria-label="Certificate summary">
          {certificateHighlights.map(([value, label], index) => {
            const content = (
              <>
                <strong>{value}</strong>
                <span>{label}</span>
              </>
            );

            return index === 0 ? (
              <button key={label} type="button" onClick={scrollToCertificates} aria-label="Scroll to certificate documents">
                {content}
              </button>
            ) : (
              <div key={label}>
                {content}
              </div>
            );
          })}
        </div>
      </div>

      <div className="certificate-intro-row" ref={certificateGalleryRef}>
        <div>
          <p className="page-kicker">Document library</p>
          <h2>Registration and compliance scans for quick review.</h2>
        </div>
        <p>
          Review our key registrations and compliance documents for buyer confidence, export discussions, and supplier verification.
        </p>
      </div>

      {isLoadingCertificates && (
        <LoadingBanner title="Opening document library" text="Arranging certificates for quick buyer review." />
      )}
      <div className="certificate-page-grid">
        {certificates.map((certificate) => {
          const imageUrl = certificate.image?.url || certificate.image;
          const subtitle = certificate.subtitle || "Verified document";
          const note = certificate.note || "Available for buyer verification and export documentation review.";

          return (
            <article className="certificate-card" key={certificate._id || certificate.title}>
              <button className="certificate-preview-button" type="button" onClick={() => setSelectedCertificate(certificate)} aria-label={`View ${certificate.title}`}>                <img src={imageUrl} alt={certificate.image?.alt || certificate.title} />
              </button>
              <div className="certificate-card-body">
                <span>{subtitle}</span>
                <h3>{certificate.title}</h3>
                <p>{note}</p>
                <button className="button small certificate-view-button" type="button" onClick={() => setSelectedCertificate(certificate)}>
                  <ExternalLink size={15} />View document
                </button>
              </div>
            </article>
          );
        })}
      </div>

      {selectedCertificate && (
        <div className="certificate-modal-backdrop" role="presentation" onClick={() => setSelectedCertificate(null)}>
          <section className="certificate-modal" role="dialog" aria-modal="true" aria-label={selectedCertificate.title} onClick={(event) => event.stopPropagation()}>
            <div className="certificate-modal-head">
              <div>
                <span>Document view</span>
                <h3>{selectedCertificate.title}</h3>
              </div>
              <button type="button" onClick={() => setSelectedCertificate(null)} aria-label="Close document view">Close</button>
            </div>
            <div className="certificate-modal-image">
              <img src={selectedCertificate.image?.url || selectedCertificate.image} alt={selectedCertificate.image?.alt || selectedCertificate.title} />
            </div>
          </section>
        </div>
      )}
    </section>
  );
}
function ContactPage() {
  const [formData, setFormData] = useState({ name: "", number: "", requirement: "" });
  const [formStatus, setFormStatus] = useState({ type: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const mapQuery = encodeURIComponent("Phoenix Medicaments Pvt Ltd F-80 F-81 Tulsi Industrial Estate Changodar Gujarat 382213");
  const mapUrl = `https://www.google.com/maps?q=${mapQuery}&output=embed`;

  function updateField(event) {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  }

  async function submitContact(event) {
    event.preventDefault();
    setIsSubmitting(true);
    setFormStatus({ type: "", message: "" });

    try {
      await sendContactEnquiry(formData);
      setFormData({ name: "", number: "", requirement: "" });
      setFormStatus({ type: "success", message: "Thank you. Your enquiry has been sent to our team." });
    } catch (error) {
      setFormStatus({ type: "error", message: error.message || "Could not send enquiry. Please try WhatsApp or email." });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="page-shell contact-page contact-page-compact">
      <div className="contact-studio-shell">
        <div className="contact-studio-main">
          <p className="page-kicker">Contact Us</p>
          <h1>Send us your requirement.</h1>
          <p className="contact-lead">For bulk exports, private labelling, packaging, and product sourcing, share the essentials and our team will respond quickly.</p>
          <div className="contact-proof-strip" aria-label="Contact response highlights">
            <span>Bulk export</span>
            <span>Private label</span>
            <span>Fast response</span>
          </div>

          <form className="contact-enquiry-form" onSubmit={submitContact}>
            <label>
              <span>Name</span>
              <input name="name" value={formData.name} onChange={updateField} placeholder="Your name" required />
            </label>
            <label>
              <span>Number</span>
              <input name="number" value={formData.number} onChange={updateField} placeholder="Phone or WhatsApp number" required />
            </label>
            <label className="form-wide">
              <span>Requirement</span>
              <textarea name="requirement" value={formData.requirement} onChange={updateField} placeholder="Tell us product name, quantity, packaging, destination, or private-label details" rows="4" required></textarea>
            </label>
            <button className="button primary form-wide" type="submit" disabled={isSubmitting}>
              <Mail size={18} />{isSubmitting ? "Sending enquiry..." : "Send enquiry"}
            </button>
            {formStatus.message && <p className={`form-status ${formStatus.type}`}>{formStatus.message}</p>}
          </form>

          <div className="contact-action-grid compact-actions" aria-label="Quick contact options">
            <a href={`tel:+91${businessNumber}`}><Phone size={18} /><span>+91 {businessNumber}</span></a>
            <a href="https://www.instagram.com/mbherbals/" target="_blank" rel="noreferrer"><Instagram size={18} /><span>@mbherbals</span></a>
          </div>
        </div>

        <aside className="contact-studio-side">
          <div className="mini-location-grid">
            <article>
              <Building2 size={20} aria-hidden="true" />
              <div><strong>Manufacturing Unit & Corporate Office</strong><span>F-80, F-81 Tulsi Industrial Estate, opp. Bhagyoday Hotel, Changodar, Gujarat 382213</span></div>
            </article>
            <article>
              <MapPin size={20} aria-hidden="true" />
              <div><strong>Marketing Office</strong><span>Office 1 - 2, Shreeji Complex, Ellisbridge, Ahmedabad, Gujarat, 380006</span></div>
            </article>
            <article>
              <Clock size={20} aria-hidden="true" />
              <div><strong>Timings</strong><span>Mon to Sat, 9am-6pm</span></div>
            </article>
          </div>

          <div className="contact-map-panel compact-map" aria-label="Phoenix Medicaments map location">
            <iframe title="Phoenix Medicaments location on Google Maps" src={mapUrl} loading="lazy" referrerPolicy="no-referrer-when-downgrade" allowFullScreen></iframe>
            <a className="map-open-link" href={`https://www.google.com/maps/search/?api=1&query=${mapQuery}`} target="_blank" rel="noreferrer">
              <ExternalLink size={16} />Open map
            </a>
          </div>
        </aside>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer>
      <span>Phoenix Medicaments Pvt Ltd</span>
      <span>(c) 2026 Phoenix Medicaments Pvt Ltd. All rights reserved.</span>
      <Award size={18} aria-hidden="true" />
      <ShieldCheck size={18} aria-hidden="true" />
    </footer>
  );
}

export function App() {
  const [activeRoute, setActiveRoute] = useState(getRouteFromPath);

  useEffect(() => {
    warmApi();
  }, []);

  useEffect(() => {
    const handleRouteChange = () => setActiveRoute(getRouteFromPath());
    window.addEventListener("popstate", handleRouteChange);
    return () => window.removeEventListener("popstate", handleRouteChange);
  }, []);

  const page = useMemo(() => {
    if (activeRoute === "about") return <AboutPage />;
    if (activeRoute === "categories") return <CategoriesPage />;
    if (activeRoute === "certificates") return <CertificatesPage />;
    if (activeRoute === "contact") return <ContactPage />;
    return <HomePage />;
  }, [activeRoute]);

  return (
    <main>
      <Header activeRoute={activeRoute} />
      {page}
      <Footer />
    </main>
  );
}












































