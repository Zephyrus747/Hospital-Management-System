import { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "react-router-dom";

/* ─── ICONS ─── */
function ChevL() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path
        d="M15 18l-6-6 6-6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
function ChevR() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path
        d="M9 18l6-6-6-6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const SLIDES = [
  {
    image: "/image1-carousel.jpeg",
    title: "Care that changed my life",
    subtitle:
      "The team at Meridian handled my surgery with precision and compassion. I was back on my feet faster than I ever expected. — Sarah L.",
  },
  {
    image: "/image2-carousel.jpeg",
    title: "Always there when I need them",
    subtitle:
      "Booking an appointment through the portal took under a minute. The entire experience was seamless from start to finish. — Daniel M.",
  },
  {
    image: "/image3-carousel.jpeg",
    title: "World-class psychiatric support",
    subtitle:
      "The psychiatry department helped me reclaim my mental clarity after an incredibly difficult year. Forever grateful. — Priya K.",
  },
  {
    image: "/image4-carousel.jpeg",
    title: "Transparent billing, zero surprises",
    subtitle:
      "Every charge was itemised clearly in my portal before discharge. That kind of transparency builds real trust. — James O.",
  },
];

function PatientSpeakCarousel() {
  const [current, setCurrent] = useState(0);
  const timerRef = useRef(null);
  const next = useCallback(
    () => setCurrent((c) => (c + 1) % SLIDES.length),
    [],
  );
  const prev = useCallback(
    () => setCurrent((c) => (c - 1 + SLIDES.length) % SLIDES.length),
    [],
  );

  useEffect(() => {
    timerRef.current = setInterval(next, 5000);
    return () => clearInterval(timerRef.current);
  }, [next]);

  const reset = (fn) => {
    clearInterval(timerRef.current);
    fn();
    timerRef.current = setInterval(next, 5000);
  };
  const slide = SLIDES[current];

  return (
    <section
      style={{
        padding: "0 40px 80px",
        maxWidth: 1200,
        margin: "0 auto",
        width: "100%",
        boxSizing: "border-box",
      }}
    >
      <div style={{ textAlign: "center", marginBottom: 32 }}>
        <span style={S.eyebrow}>Patient Stories</span>
        <h2 style={{ ...S.h2, color: "#1E3A8A" }}>Patients Speak</h2>
        <p style={S.sub}>
          Real experiences from those who trusted us with their care.
        </p>
      </div>
      <div
        style={{
          position: "relative",
          borderRadius: 20,
          overflow: "hidden",
          height: 440,
          userSelect: "none",
          boxShadow: "0 20px 60px rgba(37,99,235,.15)",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: `url(${slide.image})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundColor: "#1E3A8A",
            transition: "background-image .4s",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(135deg, rgba(30,58,138,.88) 0%, rgba(37,99,235,.6) 60%, rgba(0,0,0,.3) 100%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: 56,
            left: 48,
            right: 130,
            zIndex: 2,
          }}
        >
          <div
            style={{
              display: "inline-flex",
              background: "rgba(255,255,255,.15)",
              border: "1px solid rgba(255,255,255,.3)",
              color: "#fff",
              borderRadius: 99,
              padding: "4px 14px",
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: ".1em",
              textTransform: "uppercase",
              marginBottom: 14,
              backdropFilter: "blur(4px)",
            }}
          >
            Patient story
          </div>
          <h2
            style={{
              fontFamily: "var(--font-d)",
              fontSize: 32,
              fontWeight: 700,
              color: "#fff",
              margin: "0 0 12px",
              lineHeight: 1.2,
            }}
          >
            {slide.title}
          </h2>
          <p
            style={{
              fontSize: 15.5,
              color: "rgba(255,255,255,.85)",
              margin: 0,
              lineHeight: 1.7,
              maxWidth: 580,
            }}
          >
            {slide.subtitle}
          </p>
        </div>
        <button
          onClick={() => reset(prev)}
          aria-label="Previous"
          style={{
            position: "absolute",
            top: "50%",
            left: 18,
            transform: "translateY(-50%)",
            zIndex: 3,
            background: "rgba(255,255,255,.15)",
            border: "1px solid rgba(255,255,255,.25)",
            borderRadius: "50%",
            width: 44,
            height: 44,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#fff",
            cursor: "pointer",
            backdropFilter: "blur(4px)",
          }}
        >
          <ChevL />
        </button>
        <button
          onClick={() => reset(next)}
          aria-label="Next"
          style={{
            position: "absolute",
            top: "50%",
            right: 18,
            transform: "translateY(-50%)",
            zIndex: 3,
            background: "rgba(255,255,255,.15)",
            border: "1px solid rgba(255,255,255,.25)",
            borderRadius: "50%",
            width: 44,
            height: 44,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#fff",
            cursor: "pointer",
            backdropFilter: "blur(4px)",
          }}
        >
          <ChevR />
        </button>
        <div
          style={{
            position: "absolute",
            bottom: 18,
            left: 48,
            zIndex: 3,
            display: "flex",
            gap: 7,
            alignItems: "center",
          }}
        >
          {SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => reset(() => setCurrent(i))}
              aria-label={`Slide ${i + 1}`}
              style={{
                height: 8,
                width: i === current ? 28 : 8,
                borderRadius: 99,
                border: "none",
                cursor: "pointer",
                padding: 0,
                background: i === current ? "#fff" : "rgba(255,255,255,.38)",
                transition: "all .3s",
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

const EXCELLENCE = [
  {
    icon: "🩺",
    stat: "9+",
    title: "Specialist physicians across 3 departments",
  },
  { icon: "🏥", stat: "200+", title: "OPD consultations managed per month" },
  { icon: "⚕️", stat: "35+", title: "Rooms across 4 floors and 12 blocks" },
  { icon: "💊", stat: "5", title: "Medication types tracked and dispensed" },
  { icon: "🛏️", stat: "3", title: "Active inpatient stays at any time" },
  {
    icon: "📋",
    stat: "100%",
    title: "Paperless billing and prescription records",
  },
  { icon: "👨‍⚕️", stat: "25+", title: "Doctors and healthcare professionals" },
  { icon: "👩‍⚕️", stat: "40+", title: "Nurses and support staff" },
  { icon: "📅", stat: "500+", title: "Appointments scheduled every month" },
];

function ClinicalExcellence() {
  const trackRef = useRef(null);
  const [canL, setCanL] = useState(false);
  const [canR, setCanR] = useState(true);

  const check = () => {
    const el = trackRef.current;
    if (!el) return;
    setCanL(el.scrollLeft > 4);
    setCanR(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  };

  const scroll = (dir) => {
    trackRef.current?.scrollBy({ left: dir * 300, behavior: "smooth" });
    setTimeout(check, 350);
  };

  useEffect(() => {
    const el = trackRef.current;
    el?.addEventListener("scroll", check, { passive: true });
    return () => el?.removeEventListener("scroll", check);
  }, []);

  return (
    <section
      style={{
        background: "#F0F7FF",
        borderTop: "1px solid #DBEAFE",
        borderBottom: "1px solid #DBEAFE",
        padding: "72px 0",
      }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 40px" }}>
        <div style={{ textAlign: "center", marginBottom: 44 }}>
          <span style={S.eyebrow}>Our Impact</span>
          <h2 style={{ ...S.h2, color: "#1E3A8A" }}>Clinical Excellence</h2>
          <p style={S.sub}>
            Numbers that reflect our commitment to precision care and
            operational excellence.
          </p>
        </div>

        <div style={{ position: "relative" }}>
          {canL && (
            <button
              onClick={() => scroll(-1)}
              aria-label="Left"
              style={{
                position: "absolute",
                left: -22,
                top: "50%",
                transform: "translateY(-50%)",
                background: "#fff",
                border: "1px solid #DBEAFE",
                borderRadius: "50%",
                width: 42,
                height: 42,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#2563EB",
                cursor: "pointer",
                boxShadow: "0 2px 12px rgba(37,99,235,.15)",
                zIndex: 2,
              }}
            >
              <ChevL />
            </button>
          )}

          <div
            ref={trackRef}
            onScroll={check}
            style={{
              display: "flex",
              gap: 18,
              overflowX: "auto",
              paddingBottom: 8,
              scrollbarWidth: "none",
              msOverflowStyle: "none",
              cursor: "grab",
            }}
          >
            {EXCELLENCE.map((item, i) => (
              <div
                key={i}
                style={{
                  flex: "0 0 210px",
                  background: "#fff",
                  border: "1px solid #DBEAFE",
                  borderRadius: 16,
                  padding: "32px 24px",
                  textAlign: "center",
                  boxShadow: "0 4px 20px rgba(37,99,235,.07)",
                  transition: "transform .25s, box-shadow .25s",
                }}
                onMouseEnter={(e) => {
                  const card = e.currentTarget;

                  card.style.transform = "translateY(-4px)";
                  card.style.boxShadow = "0 8px 30px rgba(37,99,235,.14)";

                  const icon = card.querySelector(".icon-main");
                  const copy = card.querySelector(".icon-copy");

                  icon.style.transform = "translateY(-100%) scale(1.35)";
                  icon.style.opacity = "0";

                  copy.style.transform = "translateY(0) scale(1.35)";
                  copy.style.opacity = "1";
                }}
                onMouseLeave={(e) => {
                  const card = e.currentTarget;

                  card.style.transform = "";
                  card.style.boxShadow = "0 4px 20px rgba(37,99,235,.07)";

                  const icon = card.querySelector(".icon-main");
                  const copy = card.querySelector(".icon-copy");

                  icon.style.transform = "translateY(0) scale(1)";
                  icon.style.opacity = "1";

                  copy.style.transform = "translateY(100%) scale(1)";
                  copy.style.opacity = "0";
                }}
              >
                <div
                  style={{
                    position: "relative",
                    width: 48,
                    height: 48,
                    margin: "0 auto 14px",
                    overflow: "hidden",
                  }}
                >
                  <div
                    className="icon-main"
                    style={{
                      position: "absolute",
                      inset: 0,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 34,
                      transition: "all .35s ease",
                    }}
                  >
                    {item.icon}
                  </div>

                  <div
                    className="icon-copy"
                    style={{
                      position: "absolute",
                      inset: 0,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 34,
                      transform: "translateY(100%) scale(1)",
                      opacity: 0,
                      transition: "all .35s ease",
                    }}
                  >
                    {item.icon}
                  </div>
                </div>

                <div
                  style={{
                    fontFamily: "var(--font-d)",
                    fontSize: 42,
                    fontWeight: 800,
                    color: "#2563EB",
                    lineHeight: 1,
                    marginBottom: 10,
                  }}
                >
                  {item.stat}
                </div>

                <div
                  style={{
                    fontSize: 13.5,
                    color: "#64748B",
                    lineHeight: 1.55,
                  }}
                >
                  {item.title}
                </div>
              </div>
            ))}
          </div>

          {canR && (
            <button
              onClick={() => scroll(1)}
              aria-label="Right"
              style={{
                position: "absolute",
                right: -22,
                top: "50%",
                transform: "translateY(-50%)",
                background: "#fff",
                border: "1px solid #DBEAFE",
                borderRadius: "50%",
                width: 42,
                height: 42,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#2563EB",
                cursor: "pointer",
                boxShadow: "0 2px 12px rgba(37,99,235,.15)",
                zIndex: 2,
              }}
            >
              <ChevR />
            </button>
          )}
        </div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════
   FEATURES GRID
════════════════════════════════════════════ */
const FEATURES = [
  {
    icon: "🩺",
    title: "Doctor Portal",
    desc: "View patient lists, duty shifts, salary, commissions, and track operations vs checkups.",
  },
  {
    icon: "🛏️",
    title: "Patient Portal",
    desc: "Book or edit appointments, view your admission bill, prescriptions, and primary care physician.",
  },
  {
    icon: "💊",
    title: "Nurse Portal",
    desc: "See current assignments, the doctors you assist, your on-call blocks, and room details.",
  },
  {
    icon: "🔐",
    title: "Admin Panel",
    desc: "Full master control — add, edit, or remove any physician, nurse, patient, department, or procedure.",
  },
  {
    icon: "🏥",
    title: "OPD & Admissions",
    desc: "Patients can visit for a general checkup or get admitted for surgery and major treatment.",
  },
  {
    icon: "🌙",
    title: "Dark / Light Mode",
    desc: "Switch between dark and light themes at any time using the toggle in the top navigation bar.",
  },
];

/* ════════════════════════════════════════════
   FAQ ACCORDION
════════════════════════════════════════════ */
const FAQS = [
  {
    q: "Who can use Meridian HMS?",
    a: "Meridian HMS is designed for four types of users: administrators, physicians, nurses, and patients. Each role has a dedicated portal with tailored features and strict access controls.",
  },
  {
    q: "How does patient admission work?",
    a: "Patients can choose between an OPD visit for general checkups or an Admission for inpatient care, surgery, or major treatment. Admissions are linked to a room, stay duration, and a full itemised bill.",
  },
  {
    q: "Can a patient view their bill before discharge?",
    a: "Yes. Once a stay is recorded, the patient portal shows a full itemised bill including procedure costs, room charges, and medication costs, along with paid or unpaid status.",
  },
  {
    q: "How are doctor commissions calculated?",
    a: "Each physician has a base salary and a commission rate. Commission is calculated as a percentage of the total cost of all procedures performed. The doctor portal shows both figures and total compensation.",
  },
  {
    q: "What can a nurse see in their portal?",
    a: "Nurses can view assignments (appointment prep and operation assists), supervising doctors, room and block details, on-call schedule, and rotational duty shifts.",
  },
  {
    q: "Can the admin edit any record?",
    a: "Yes. The admin panel provides full create, edit, and delete access across physicians, nurses, patients, departments, procedures, and appointments.",
  },
  {
    q: "Is real authentication used?",
    a: "This is a demo system backed by json-server. For production use, replace the auth layer with JWT or a proper identity provider such as Auth0 or Firebase.",
  },
];

function FAQ() {
  const [open, setOpen] = useState(null);
  return (
    <section
      style={{
        padding: "80px 40px",
        maxWidth: 800,
        margin: "0 auto",
        width: "100%",
        boxSizing: "border-box",
      }}
    >
      <div style={{ textAlign: "center", marginBottom: 44 }}>
        <span style={S.eyebrow}>Got questions</span>
        <h2 style={{ ...S.h2, color: "#1E3A8A" }}>
          Frequently Asked Questions
        </h2>
        <p style={S.sub}>Everything you need to know about Meridian HMS.</p>
      </div>
      <div>
        {FAQS.map((item, i) => {
          const isOpen = open === i;
          return (
            <div
              key={i}
              style={{
                border: `1px solid ${isOpen ? "#2563EB" : "#E2E8F0"}`,
                borderRadius: 12,
                marginBottom: 10,
                overflow: "hidden",
                transition: "border-color .2s",
                background: "#fff",
              }}
            >
              <button
                onClick={() => setOpen(isOpen ? null : i)}
                aria-expanded={isOpen}
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 16,
                  padding: "18px 22px",
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  textAlign: "left",
                }}
              >
                <span
                  style={{
                    fontFamily: "var(--font-d)",
                    fontWeight: 600,
                    fontSize: 15.5,
                    color: "#1E293B",
                    flex: 1,
                    lineHeight: 1.4,
                  }}
                >
                  {item.q}
                </span>
                <span
                  style={{
                    fontSize: 22,
                    color: "#2563EB",
                    flexShrink: 0,
                    transition: "transform .25s ease",
                    transform: isOpen ? "rotate(45deg)" : "rotate(0deg)",
                    fontWeight: 300,
                    lineHeight: 1,
                  }}
                >
                  +
                </span>
              </button>
              <div
                style={{
                  overflow: "hidden",
                  maxHeight: isOpen ? 200 : 0,
                  opacity: isOpen ? 1 : 0,
                  transition: "max-height .3s ease, opacity .3s ease",
                  paddingBottom: isOpen ? 18 : 0,
                }}
              >
                <p
                  style={{
                    padding: "0 22px",
                    margin: 0,
                    fontSize: 14.5,
                    color: "#64748B",
                    lineHeight: 1.75,
                  }}
                >
                  {item.a}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════
   FOOTER — Apollo-style multi-column
════════════════════════════════════════════ */
const FOOTER_COLS = [
  {
    heading: "Discover Meridian",
    links: [
      "Our Story",
      "Vision & Mission",
      "Leadership Team",
      "Awards & Recognition",
      "Achievements",
      "Careers",
      "Press & Media",
      "Partner with Us",
    ],
  },
  {
    heading: "Portal Access",
    links: [
      "Admin Login",
      "Doctor Login",
      "Nurse Login",
      "Patient Login",
      "Book Appointment",
      "View My Bill",
      "Manage Profile",
      "Support",
    ],
  },
  {
    heading: "Departments",
    links: [
      "Cardiac Sciences",
      "Oncology",
      "Neurosciences",
      "Orthopaedics",
      "Psychiatry",
      "General Medicine",
      "Surgical Unit",
      "Emergency Medicine",
      "Paediatrics",
      "Gynaecology",
      "Urology",
      "Pulmonology",
    ],
  },
  {
    heading: "Medical Services",
    links: [
      "Find a Doctor",
      "Consult a Cardiologist",
      "Consult a Neurologist",
      "Consult a Surgeon",
      "Consult a Psychiatrist",
      "OPD Services",
      "Inpatient Admission",
      "ICU & Critical Care",
      "Diagnostic Lab",
      "Radiology & Imaging",
      "Pharmacy",
      "Health Packages",
    ],
  },
  {
    heading: "Health Resources",
    links: [
      "Health Articles",
      "Symptoms Guide",
      "Medication Directory",
      "Post-Op Care Tips",
      "Mental Health Support",
      "Diet & Nutrition",
      "Managing Chronic Illness",
      "Preventive Checkups",
      "Patient Rights",
      "FAQs",
    ],
  },
];

const SOCIAL = [
  {
    label: "Facebook",
    href: "#",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
      </svg>
    ),
  },
  {
    label: "Twitter",
    href: "#",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" />
      </svg>
    ),
  },
  {
    label: "LinkedIn",
    href: "#",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z" />
        <circle cx="4" cy="4" r="2" />
      </svg>
    ),
  },
  {
    label: "Instagram",
    href: "#",
    icon: (
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <rect x="2" y="2" width="20" height="20" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
];

function Footer() {
  return (
    <footer style={{ background: "#1E3A8A", color: "#CBD5E1" }}>
      {/* Top strip */}
      <div
        style={{
          background: "#2563EB",
          padding: "18px 40px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 12,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 9,
              background: "rgba(255,255,255,.2)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: "var(--font-d)",
              fontWeight: 800,
              fontSize: 20,
              color: "#fff",
            }}
          >
            +
          </div>
          <span
            style={{
              fontFamily: "var(--font-d)",
              fontWeight: 700,
              fontSize: 18,
              color: "#fff",
            }}
          >
            Meridian HMS
          </span>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          {SOCIAL.map((s) => (
            <a
              key={s.label}
              href={s.href}
              aria-label={s.label}
              style={{
                width: 36,
                height: 36,
                borderRadius: "50%",
                background: "rgba(255,255,255,.15)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#fff",
                transition: "background .15s",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "rgba(255,255,255,.3)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = "rgba(255,255,255,.15)")
              }
            >
              {s.icon}
            </a>
          ))}
        </div>
        <div style={{ fontSize: 13.5, color: "rgba(255,255,255,.8)" }}>
          Emergency helpline:{" "}
          <strong style={{ color: "#fff" }}>1800-MERIDIAN</strong>
        </div>
      </div>

      {/* Main link columns */}
      <div
        style={{
          maxWidth: 1300,
          margin: "0 auto",
          padding: "52px 40px 36px",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: "36px 24px",
        }}
      >
        {FOOTER_COLS.map((col) => (
          <div key={col.heading}>
            <div
              style={{
                fontFamily: "var(--font-d)",
                fontWeight: 700,
                fontSize: 13.5,
                color: "#fff",
                textTransform: "uppercase",
                letterSpacing: ".07em",
                marginBottom: 16,
                paddingBottom: 10,
                borderBottom: "2px solid #2563EB",
              }}
            >
              {col.heading}
            </div>
            <ul
              style={{
                listStyle: "none",
                margin: 0,
                padding: 0,
                display: "flex",
                flexDirection: "column",
                gap: 8,
              }}
            >
              {col.links.map((link) => (
                <li key={link}>
                  <a
                    href="#"
                    style={{
                      fontSize: 13,
                      color: "#94A3B8",
                      textDecoration: "none",
                      transition: "color .15s",
                      lineHeight: 1.5,
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "#fff")}
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.color = "#94A3B8")
                    }
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Accreditations */}
      <div style={{ maxWidth: 1300, margin: "0 auto", padding: "0 40px 32px" }}>
        <div
          style={{
            borderTop: "1px solid rgba(255,255,255,.1)",
            paddingTop: 28,
            display: "flex",
            flexWrap: "wrap",
            gap: 12,
            alignItems: "center",
          }}
        >
          <span
            style={{
              fontSize: 12,
              color: "#64748B",
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: ".08em",
              marginRight: 8,
            }}
          >
            Accredited by
          </span>
          {["X", "Y", "Z", "XYZ", "ABC Compliant"].map((badge) => (
            <span
              key={badge}
              style={{
                background: "rgba(37,99,235,.25)",
                border: "1px solid rgba(37,99,235,.4)",
                color: "#93C5FD",
                borderRadius: 6,
                padding: "4px 11px",
                fontSize: 12,
                fontWeight: 600,
              }}
            >
              {badge}
            </span>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div
        style={{
          background: "rgba(0,0,0,.25)",
          padding: "16px 40px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 10,
        }}
      >
        <p style={{ margin: 0, fontSize: 12.5, color: "#64748B" }}>
          &copy; {new Date().getFullYear()} Meridian Hospital Management System.
          All rights reserved.
        </p>
        <div style={{ display: "flex", gap: 20 }}>
          {[
            "Privacy Policy",
            "Terms of Use",
            "Cookie Policy",
            "Sitemap",
            "Accessibility",
          ].map((link) => (
            <a
              key={link}
              href="#"
              style={{
                fontSize: 12,
                color: "#64748B",
                textDecoration: "none",
                transition: "color .15s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#93C5FD")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#64748B")}
            >
              {link}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}

export default function Landing() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#F8FAFC",
        fontFamily: "var(--font-b)",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* ── Topbar ── */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 40px",
          height: 64,
          borderBottom: "1px solid #E2E8F0",
          background: "#fff",
          position: "sticky",
          top: 0,
          zIndex: 50,
          boxShadow: "0 1px 4px rgba(37,99,235,.06)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div
            style={{
              width: 34,
              height: 34,
              borderRadius: 8,
              background: "#2563EB",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 800,
              fontSize: 18,
              color: "#fff",
              fontFamily: "var(--font-d)",
            }}
          >
            +
          </div>
          <span
            style={{
              fontFamily: "var(--font-d)",
              fontWeight: 700,
              fontSize: 17,
              color: "#1E3A8A",
            }}
          >
            Meridian HMS
          </span>
        </div>
        <nav style={{ display: "flex", gap: 28, alignItems: "center" }}>
          {["About", "Departments", "Services", "Contact"].map((item) => (
            <a
              key={item}
              href="#"
              style={{
                fontSize: 14,
                fontWeight: 500,
                color: "#64748B",
                textDecoration: "none",
                transition: "color .15s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#2563EB")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#64748B")}
            >
              {item}
            </a>
          ))}
        </nav>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <Link
            to="/login"
            style={{
              padding: "8px 18px",
              borderRadius: 8,
              border: "1px solid #2563EB",
              color: "#2563EB",
              fontWeight: 600,
              fontSize: 13.5,
              background: "transparent",
              textDecoration: "none",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#EFF6FF")}
            onMouseLeave={(e) =>
              (e.currentTarget.style.background = "transparent")
            }
          >
            Sign in
          </Link>
          <Link
            to="/login"
            style={{
              padding: "8px 18px",
              borderRadius: 8,
              background: "#2563EB",
              color: "#fff",
              fontWeight: 600,
              fontSize: 13.5,
              textDecoration: "none",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#1E3A8A")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "#2563EB")}
          >
            Get started →
          </Link>
        </div>
      </div>

      {/* ── Hero ── */}
      <div
        style={{
          background:
            "linear-gradient(135deg, #1E3A8A 0%, #2563EB 50%, #3B82F6 100%)",
          padding: "90px 40px 100px",
          textAlign: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: -60,
            right: -60,
            width: 320,
            height: 320,
            borderRadius: "50%",
            background: "rgba(255,255,255,.05)",
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -80,
            left: -40,
            width: 260,
            height: 260,
            borderRadius: "50%",
            background: "rgba(255,255,255,.04)",
            pointerEvents: "none",
          }}
        />

        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            background: "rgba(255,255,255,.12)",
            border: "1px solid rgba(255,255,255,.25)",
            color: "#BFDBFE",
            borderRadius: 99,
            padding: "6px 16px",
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: ".1em",
            textTransform: "uppercase",
            marginBottom: 28,
            backdropFilter: "blur(4px)",
          }}
        >
          Hospital Management System
        </div>

        <h1
          style={{
            fontFamily: "var(--font-d)",
            fontSize: "clamp(36px,5.5vw,68px)",
            fontWeight: 800,
            color: "#fff",
            margin: "0 0 20px",
            lineHeight: 1.1,
            letterSpacing: "-.02em",
          }}
        >
          Modern care,
          <br />
          <span style={{ color: "#93C5FD" }}>smarter ops.</span>
        </h1>

        <p
          style={{
            fontSize: 18,
            color: "rgba(255,255,255,.8)",
            maxWidth: 560,
            margin: "0 auto 40px",
            lineHeight: 1.7,
          }}
        >
          Meridian HMS brings doctors, nurses, patients, and administrators into
          one unified platform — with role-based access, live billing, shift
          tracking, and more.
        </p>

        <div
          style={{
            display: "flex",
            gap: 14,
            justifyContent: "center",
            flexWrap: "wrap",
            marginBottom: 52,
          }}
        >
          <Link
            to="/login"
            style={{
              padding: "14px 32px",
              borderRadius: 10,
              background: "#fff",
              color: "#2563EB",
              fontWeight: 700,
              fontSize: 15,
              textDecoration: "none",
              boxShadow: "0 4px 16px rgba(0,0,0,.2)",
              transition: "transform .15s, box-shadow .15s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,.25)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "";
              e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,.2)";
            }}
          >
            Sign in to your portal →
          </Link>
          <a
            href="#features"
            style={{
              padding: "14px 32px",
              borderRadius: 10,
              background: "rgba(255,255,255,.12)",
              color: "#fff",
              fontWeight: 600,
              fontSize: 15,
              textDecoration: "none",
              border: "1px solid rgba(255,255,255,.25)",
              backdropFilter: "blur(4px)",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.background = "rgba(255,255,255,.22)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.background = "rgba(255,255,255,.12)")
            }
          >
            See what's inside
          </a>
        </div>

        {/* Demo credentials */}
        {/* <div style={{ display: 'inline-block', background: 'rgba(255,255,255,.1)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,.2)', borderRadius: 14, padding: '18px 28px', textAlign: 'left', maxWidth: 500, width: '100%' }}>
          <div style={{ fontSize: 10.5, fontFamily: 'var(--font-m)', textTransform: 'uppercase', letterSpacing: '.12em', color: 'rgba(255,255,255,.55)', marginBottom: 12 }}>Demo credentials</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '7px 24px' }}>
            {[
              ['Admin',   'admin',     'admin123',   '#F59E0B'],
              ['Doctor',  'jdorian',   'doctor123',  '#34D399'],
              ['Nurse',   'cespinosa', 'nurse123',   '#60A5FA'],
              ['Patient', 'jsmith',    'patient123', '#F87171'],
            ].map(([role, u, p, color]) => (
              <div key={u} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '5px 0', borderBottom: '1px solid rgba(255,255,255,.1)' }}>
                <span style={{ background: `${color}22`, border: `1px solid ${color}55`, color, borderRadius: 6, padding: '2px 9px', fontSize: 11, fontWeight: 700 }}>{role}</span>
                <span style={{ fontSize: 12, color: 'rgba(255,255,255,.7)', fontFamily: 'var(--font-m)' }}>{u} / {p}</span>
              </div>
            ))}
          </div>
        </div> */}
      </div>

      {/* ── Trust bar ── */}
      <div
        style={{
          background: "#fff",
          borderBottom: "1px solid #E2E8F0",
          padding: "16px 40px",
        }}
      >
        <div
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 40,
            flexWrap: "wrap",
          }}
        >
          {[
            ["X", "Accredited"],
            ["Y", "Certified"],
            ["Z", "Approved"],
            ["XYZ", "Certified"],
            ["ABC", "Compliant"],
          ].map(([badge, sub]) => (
            <div
              key={badge}
              style={{ display: "flex", alignItems: "center", gap: 8 }}
            >
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 8,
                  background: "#EFF6FF",
                  border: "1px solid #DBEAFE",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontFamily: "var(--font-d)",
                  fontWeight: 800,
                  fontSize: 10,
                  color: "#2563EB",
                  textAlign: "center",
                  lineHeight: 1.1,
                }}
              >
                {badge}
              </div>
              <span style={{ fontSize: 13, color: "#64748B", fontWeight: 500 }}>
                {sub}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ── 2-inch gap ── */}
      <div style={{ height: 96, background: "#F8FAFC" }} />

      {/* ── Patients Speak ── */}
      <PatientSpeakCarousel />

      {/* ── Clinical Excellence ── */}
      <ClinicalExcellence />

      {/* ── Features grid ── */}
      <div
        id="features"
        style={{ background: "#F8FAFC", padding: "80px 40px" }}
      >
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <span style={S.eyebrow}>What's inside</span>
            <h2 style={{ ...S.h2, color: "#1E3A8A" }}>
              Everything your hospital needs
            </h2>
            <p style={S.sub}>
              Purpose-built tools for every role in your care team.
            </p>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(280px,1fr))",
              gap: 20,
            }}
          >
            {FEATURES.map((f) => (
              <div
                key={f.title}
                style={{
                  background: "#fff",
                  border: "1px solid #E2E8F0",
                  borderRadius: 16,
                  padding: "28px 24px",
                  transition:
                    "border-color .15s, transform .15s, box-shadow .15s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "#2563EB";
                  e.currentTarget.style.transform = "translateY(-3px)";
                  e.currentTarget.style.boxShadow =
                    "0 8px 24px rgba(37,99,235,.1)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "#E2E8F0";
                  e.currentTarget.style.transform = "";
                  e.currentTarget.style.boxShadow = "";
                }}
              >
                <div
                  style={{
                    width: 46,
                    height: 46,
                    borderRadius: 12,
                    background: "#EFF6FF",
                    border: "1px solid #DBEAFE",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 22,
                    marginBottom: 16,
                  }}
                >
                  {f.icon}
                </div>
                <h3
                  style={{
                    fontFamily: "var(--font-d)",
                    fontSize: 16.5,
                    fontWeight: 700,
                    color: "#1E293B",
                    margin: "0 0 8px",
                  }}
                >
                  {f.title}
                </h3>
                <p
                  style={{
                    fontSize: 13.5,
                    color: "#64748B",
                    lineHeight: 1.65,
                    margin: 0,
                  }}
                >
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── CTA banner ── */}
      <div
        style={{
          background: "linear-gradient(135deg, #1E3A8A 0%, #2563EB 100%)",
          padding: "64px 40px",
          textAlign: "center",
        }}
      >
        <h2
          style={{
            fontFamily: "var(--font-d)",
            fontSize: 34,
            fontWeight: 800,
            color: "#fff",
            margin: "0 0 14px",
          }}
        >
          Ready to streamline your hospital?
        </h2>
        <p
          style={{
            fontSize: 17,
            color: "rgba(255,255,255,.78)",
            margin: "0 auto 34px",
            maxWidth: 480,
            lineHeight: 1.6,
          }}
        >
          Sign in to your role portal and experience Meridian HMS firsthand with
          demo data already loaded.
        </p>
        <Link
          to="/login"
          style={{
            display: "inline-block",
            padding: "14px 36px",
            borderRadius: 10,
            background: "#fff",
            color: "#2563EB",
            fontWeight: 700,
            fontSize: 15,
            textDecoration: "none",
            boxShadow: "0 4px 20px rgba(0,0,0,.2)",
          }}
        >
          Sign in now →
        </Link>
      </div>

      {/* ── FAQ ── */}
      <div style={{ background: "#F8FAFC" }}>
        <FAQ />
      </div>

      {/* ── Footer ── */}
      <Footer />
    </div>
  );
}

/* ─── SHARED STYLE TOKENS ─── */
const S = {
  eyebrow: {
    display: "block",
    fontFamily: "var(--font-m)",
    fontSize: 11.5,
    textTransform: "uppercase",
    letterSpacing: ".14em",
    color: "#2563EB",
    marginBottom: 10,
    fontWeight: 700,
  },
  h2: {
    fontFamily: "var(--font-d)",
    fontSize: 34,
    fontWeight: 800,
    margin: "0 0 12px",
    letterSpacing: "-.02em",
    color: "#1E293B",
  },
  sub: {
    fontSize: 15.5,
    color: "#64748B",
    maxWidth: 520,
    margin: "0 auto",
    lineHeight: 1.7,
  },
};
