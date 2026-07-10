import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import SectionTitle from "../common/SectionTitle";
import Button from "../common/Button";
import Container from "../layout/Container";

// ── Social links ──────────────────────────────────────────────────────────────
// Replace hrefs with your real profile URLs

const socials = [
  {
    name: "GitHub",
    href: "https://github.com/SHUJAN23",
    icon: <GitHubIcon />,
  },
  {
    name: "LinkedIn",
    href: "https://www.linkedin.com/in/shujandv/",
    icon: <LinkedInIcon />,
  },
  {
    name: "Email",
    href: "mailto:shujand13@email.com",
    icon: <MailIcon />,
  },
];

// ── Field config ──────────────────────────────────────────────────────────────

const fields = [
  { id: "name",    label: "Name",    type: "text",  placeholder: "Your name",          required: true },
  { id: "email",   label: "Email",   type: "email", placeholder: "your@email.com",     required: true },
  { id: "subject", label: "Subject", type: "text",  placeholder: "What's this about?", required: false },
];

const initialForm = { name: "", email: "", subject: "", message: "" };

// ── Component ─────────────────────────────────────────────────────────────────

export default function Contact() {
  const [form, setForm]       = useState(initialForm);
  const [errors, setErrors]   = useState({});
  const [status, setStatus]   = useState("idle"); // idle | sending | success | error

  const validate = useCallback(() => {
    const next = {};
    if (!form.name.trim())                        next.name    = "Name is required.";
    if (!form.email.trim())                       next.email   = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
                                                  next.email   = "Enter a valid email.";
    if (!form.message.trim())                     next.message = "Message is required.";
    return next;
  }, [form]);

  const handleChange = useCallback((e) => {
    const { id, value } = e.target;
    setForm((prev) => ({ ...prev, [id]: value }));
    // Clear error on change
    if (errors[id]) setErrors((prev) => ({ ...prev, [id]: undefined }));
  }, [errors]);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    const validation = validate();
    if (Object.keys(validation).length > 0) {
      setErrors(validation);
      return;
    }

    setStatus("sending");

    // ── Replace this with your actual form endpoint (Formspree, EmailJS, etc.) ──
    // For now we simulate a successful send after 1.2s
    await new Promise((res) => setTimeout(res, 1200));
    setStatus("success");
    setForm(initialForm);
  }, [form, validate]);

  return (
    <section
      id="contact"
      aria-labelledby="contact-heading"
      className="py-20 lg:py-32 bg-[#000000]"
    >
      {/* Section divider */}
      <div
        aria-hidden="true"
        className="w-full border-t border-[rgba(225,220,201,0.06)] mb-20 lg:mb-32"
      />

      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">

          {/* ── Left: heading + socials ── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5 }}
            className="flex flex-col gap-8"
          >
            <SectionTitle
              label="Get In Touch"
              title="Contact"
              subtitle="Have a project in mind, or just want to talk games and tech? I'm always open to new collaborations."
              align="left"
            />

            {/* Info cards */}
            <div className="flex flex-col gap-3">
              {[
                { label: "Response time",  value: "Within 24 hours" },
               // { label: "Available for",  value: "Freelance · Full-time · Collabs" },
                { label: "Based in",       value: "India" },
              ].map((item) => (
                <div
                  key={item.label}
                  className="flex items-center justify-between px-4 py-3 rounded-xl bg-[#1F150C] border border-[rgba(225,220,201,0.1)]"
                >
                  <span className="text-xs text-[#E1DCC9]/35 font-[Inter]">{item.label}</span>
                  <span className="text-sm text-[#E1DCC9]/70 font-[Inter]">{item.value}</span>
                </div>
              ))}
            </div>

            {/* Social links */}
            <div>
              <p className="text-xs font-semibold tracking-[0.15em] uppercase text-[#E1DCC9]/25 font-[Inter] mb-4">
                Find me on
              </p>
              <div className="flex gap-3">
                {socials.map((s) => (
                  <a
                    key={s.name}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.name}
                    className="w-10 h-10 rounded-xl bg-[#1F150C] border border-[rgba(225,220,201,0.12)] flex items-center justify-center text-[#E1DCC9]/40 hover:text-[#E1DCC9] hover:border-[rgba(225,220,201,0.3)] transition-all duration-200"
                  >
                    {s.icon}
                  </a>
                ))}
              </div>
            </div>
          </motion.div>

          {/* ── Right: form ── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5, delay: 0.15 }}
          >
            {status === "success" ? (
              <SuccessState onReset={() => setStatus("idle")} />
            ) : (
              <form
                onSubmit={handleSubmit}
                noValidate
                className="flex flex-col gap-5"
                aria-label="Contact form"
              >
                {/* Text fields */}
                {fields.map((field) => (
                  <FormField
                    key={field.id}
                    field={field}
                    value={form[field.id]}
                    error={errors[field.id]}
                    onChange={handleChange}
                  />
                ))}

                {/* Message textarea */}
                <div className="flex flex-col gap-1.5">
                  <label
                    htmlFor="message"
                    className="text-xs font-medium text-[#E1DCC9]/45 font-[Inter] tracking-wide"
                  >
                    Message <span className="text-[#E1DCC9]/25">*</span>
                  </label>
                  <textarea
                    id="message"
                    value={form.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    placeholder="Tell me about your project or idea..."
                    aria-invalid={!!errors.message}
                    aria-describedby={errors.message ? "message-error" : undefined}
                    className={`
                      w-full px-4 py-3 rounded-xl resize-none
                      bg-[#1F150C] border text-sm text-[#E1DCC9] font-[Inter]
                      placeholder-[rgba(225,220,201,0.2)]
                      focus:outline-none focus:ring-1 focus:ring-[rgba(225,220,201,0.35)]
                      transition-colors duration-200
                      ${errors.message
                        ? "border-red-800/60"
                        : "border-[rgba(225,220,201,0.12)] focus:border-[rgba(225,220,201,0.3)]"
                      }
                    `}
                  />
                  {errors.message && (
                    <p id="message-error" role="alert" className="text-xs text-red-400/80 font-[Inter] mt-0.5">
                      {errors.message}
                    </p>
                  )}
                </div>

                {/* Submit */}
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  disabled={status === "sending"}
                  className={`mt-1 w-full ${status === "sending" ? "opacity-60 cursor-not-allowed" : ""}`}
                >
                  {status === "sending" ? (
                    <>
                      <SpinnerIcon />
                      Sending...
                    </>
                  ) : (
                    <>
                      Send Message
                      <SendIcon />
                    </>
                  )}
                </Button>

                {status === "error" && (
                  <p role="alert" className="text-xs text-red-400/80 text-center font-[Inter]">
                    Something went wrong. Please try again or email me directly.
                  </p>
                )}
              </form>
            )}
          </motion.div>
        </div>
      </Container>
    </section>
  );
}

// ── Sub-components ────────────────────────────────────────────────────────────

function FormField({ field, value, error, onChange }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={field.id}
        className="text-xs font-medium text-[#E1DCC9]/45 font-[Inter] tracking-wide"
      >
        {field.label}{" "}
        {field.required && <span className="text-[#E1DCC9]/25">*</span>}
      </label>
      <input
        id={field.id}
        type={field.type}
        value={value}
        onChange={onChange}
        required={field.required}
        placeholder={field.placeholder}
        aria-invalid={!!error}
        aria-describedby={error ? `${field.id}-error` : undefined}
        className={`
          w-full px-4 py-3 rounded-xl
          bg-[#1F150C] border text-sm text-[#E1DCC9] font-[Inter]
          placeholder-[rgba(225,220,201,0.2)]
          focus:outline-none focus:ring-1 focus:ring-[rgba(225,220,201,0.35)]
          transition-colors duration-200
          ${error
            ? "border-red-800/60"
            : "border-[rgba(225,220,201,0.12)] focus:border-[rgba(225,220,201,0.3)]"
          }
        `}
      />
      {error && (
        <p id={`${field.id}-error`} role="alert" className="text-xs text-red-400/80 font-[Inter] mt-0.5">
          {error}
        </p>
      )}
    </div>
  );
}

function SuccessState({ onReset }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col items-center justify-center gap-6 py-16 px-8 text-center bg-[#1F150C] border border-[rgba(225,220,201,0.15)] rounded-2xl"
    >
      <div className="w-14 h-14 rounded-full bg-[#412D15]/60 border border-[rgba(225,220,201,0.2)] flex items-center justify-center text-[#E1DCC9]/70">
        <CheckIcon />
      </div>
      <div>
        <h3 className="text-lg font-semibold text-[#E1DCC9] font-[Space_Grotesk] mb-2">
          Message sent
        </h3>
        <p className="text-sm text-[#E1DCC9]/45 font-[Inter]">
          Thanks for reaching out. I'll get back to you within 24 hours.
        </p>
      </div>
      <button
        onClick={onReset}
        className="text-xs text-[#E1DCC9]/35 hover:text-[#E1DCC9]/60 transition-colors font-[Inter] cursor-pointer"
      >
        Send another message
      </button>
    </motion.div>
  );
}

// ── Icons ─────────────────────────────────────────────────────────────────────

function SendIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <line x1="22" y1="2" x2="11" y2="13" />
      <polygon points="22 2 15 22 11 13 2 9 22 2" />
    </svg>
  );
}

function SpinnerIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
      className="animate-spin" aria-hidden="true">
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function GitHubIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
      fill="currentColor" aria-hidden="true">
      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
      fill="currentColor" aria-hidden="true">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
      <polyline points="22,6 12,13 2,6" />
    </svg>
  );
}
