/* ==========================================================================
   ButterBlues — site behaviour
   Edit these two values if the number or email ever changes.
   ========================================================================== */
const WHATSAPP = "918077002435";          // country code + number, digits only
const EMAIL = "contact@butterblues.com";

(function () {
  "use strict";

  const $ = (sel) => document.querySelector(sel);
  const $$ = (sel) => Array.from(document.querySelectorAll(sel));
  const calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- current year ---------- */
  const year = $("#year");
  if (year) year.textContent = new Date().getFullYear();

  /* ---------- sticky header + floating WhatsApp ---------- */
  const masthead = $("#masthead");
  const waFloat = $("#waFloat");

  const onScroll = () => {
    const y = window.scrollY;
    masthead.classList.toggle("is-stuck", y > 40);
    if (waFloat) waFloat.classList.toggle("is-shown", y > 600);
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* ---------- mobile nav ---------- */
  const toggle = $("#navToggle");
  const nav = $("#nav");

  const closeNav = () => {
    nav.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
  };

  toggle.addEventListener("click", () => {
    const open = nav.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", String(open));
  });

  nav.addEventListener("click", (e) => {
    if (e.target.tagName === "A") closeNav();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeNav();
  });

  /* ---------- reveal on scroll ---------- */
  const revealables = $$(".reveal");

  if (calm || !("IntersectionObserver" in window)) {
    revealables.forEach((el) => el.classList.add("is-in"));
  } else {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-in");
          io.unobserve(entry.target);
        });
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.08 }
    );
    revealables.forEach((el) => io.observe(el));
  }

  /* ---------- highlight the section you're reading ---------- */
  const sections = $$("main section[id]");
  const navLinks = new Map(
    $$(".nav a").map((a) => [a.getAttribute("href").slice(1), a])
  );

  if ("IntersectionObserver" in window) {
    const spy = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const link = navLinks.get(entry.target.id);
          if (!link) return;
          if (entry.isIntersecting) {
            navLinks.forEach((l) => l.classList.remove("is-active"));
            link.classList.add("is-active");
          }
        });
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );
    sections.forEach((s) => spy.observe(s));
  }

  /* ---------- enquiry form ---------- */
  const form = $("#enquiry");
  const hint = $("#formHint");
  if (!form) return;

  const read = () => {
    const get = (name) => (form.elements[name]?.value || "").trim();
    return {
      name: get("name"),
      phone: get("phone"),
      email: get("email"),
      occasion: get("occasion"),
      date: get("date"),
      quantity: get("quantity"),
      message: get("message"),
    };
  };

  const missing = (data) => {
    if (!data.name) return { field: "name", label: "your name" };
    if (!data.phone) return { field: "phone", label: "a phone number we can reach you on" };
    return null;
  };

  const flag = (gap) => {
    hint.textContent = `Add ${gap.label} and we'll get this to the right place.`;
    hint.style.color = "#b3261e";
    const input = form.elements[gap.field];
    input.focus();
    input.scrollIntoView({ block: "center", behavior: calm ? "auto" : "smooth" });
  };

  const clearFlag = () => {
    hint.textContent =
      "Either button opens your own email app or WhatsApp with the details filled in, so nothing is stored on this site.";
    hint.style.color = "";
  };

  form.addEventListener("input", clearFlag);

  const summarise = (d) => {
    const lines = [
      `Name: ${d.name}`,
      `Phone: ${d.phone}`,
      d.email && `Email: ${d.email}`,
      `Occasion: ${d.occasion}`,
      d.date && `Needed by: ${d.date}`,
      d.quantity && `Quantity: ${d.quantity}`,
      d.message && `\nDetails:\n${d.message}`,
    ].filter(Boolean);
    return lines.join("\n");
  };

  /* Email route — opens the visitor's mail app, pre-filled. */
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const data = read();
    const gap = missing(data);
    if (gap) return flag(gap);

    const subject = `Enquiry — ${data.occasion}${data.date ? ` — ${data.date}` : ""}`;
    const body = `Hello ButterBlues,\n\nI'd like to enquire about an order.\n\n${summarise(data)}\n\nThank you!`;
    window.location.href = `mailto:${EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    hint.textContent = "Your email app should be opening now with everything filled in.";
    hint.style.color = "";
  });

  /* WhatsApp route — same details, sent as a chat message. */
  $("#sendWa").addEventListener("click", () => {
    const data = read();
    const gap = missing(data);
    if (gap) return flag(gap);

    const text = `Hi ButterBlues! I'd like to enquire about an order.\n\n${summarise(data)}`;
    window.open(`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(text)}`, "_blank", "noopener");

    hint.textContent = "WhatsApp should be opening in a new tab with your details ready to send.";
    hint.style.color = "";
  });
})();
