import { useCallback, useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  Bell,
  CalendarDays,
  Check,
  ChevronRight,
  ClipboardCheck,
  HeartPulse,
  KeyRound,
  LockKeyhole,
  ShieldCheck,
  Stethoscope,
  Syringe,
  UserRound,
} from "lucide-react";
import "./onboarding.css";

export const ONBOARDING_STORAGE_KEY = "vardaan_onboarding_completed";

const pageCopy = [
  {
    eyebrow: "Vardaan+ care companion",
    title: "Welcome to Vardaan+",
    body: "Your child's vaccination records, organised in one place.",
  },
  {
    eyebrow: "Clear records",
    title: "Everything important, in one place.",
    body: "Keep your child's vaccination records clear, organised, and easy to access.",
  },
  {
    eyebrow: "Thoughtful reminders",
    title: "Never lose track of a vaccination.",
    body: "Stay aware of upcoming vaccinations and important reminders.",
  },
  {
    eyebrow: "Connected care",
    title: "Keep parents and doctors connected.",
    body: "Share the right information when your child's record needs an update.",
  },
];

const companionPoses = [
  { x: 0, y: 4, rotate: -3 },
  { x: -44, y: -21, rotate: -11 },
  { x: 42, y: 17, rotate: 7 },
  { x: 9, y: 29, rotate: 2 },
];

const reveal = (reduced, delay = 0) => ({
  initial: reduced ? false : { opacity: 0, y: 18, scale: 0.98 },
  animate: { opacity: 1, y: 0, scale: 1 },
  transition: {
    duration: reduced ? 0 : 0.6,
    delay,
    ease: [0.16, 1, 0.3, 1],
  },
});

function BrandMark() {
  return (
    <div className="onboarding-brand" aria-label="Vardaan+">
      <span className="onboarding-brand-mark">
        <HeartPulse size={16} strokeWidth={2.4} />
      </span>
      <span>
        Vardaan<span>+</span>
      </span>
    </div>
  );
}

/*
 * Intro screen:
 * - Nothing except "hello!"
 * - Uses SVG text instead of hand-written paths so the word is always correct.
 * - The stroke is animated from left to right.
 * - The intro does NOT fade into transparency, preventing the dashboard behind it
 *   from becoming visible.
 */

function HelloIntro({ reduced }) {
  return (
    <motion.main
      className="hello-intro"
      aria-label="hello!"
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Dancing+Script:wght@500&display=swap');

        .hello-writing-svg {
          width: min(86vw, 620px);
          height: auto;
          overflow: visible;
        }

        .hello-writing-stroke {
          font-family: "Dancing Script", "Segoe Script", "Brush Script MT", cursive;
          font-size: 108px;
          font-weight: 500;
          letter-spacing: 0;
          fill: transparent;
          stroke: currentColor;
          stroke-width: 2.5;
          stroke-linecap: round;
          stroke-linejoin: round;
          paint-order: stroke;
        }

        .hello-writing-fill {
          font-family: "Dancing Script", "Segoe Script", "Brush Script MT", cursive;
          font-size: 108px;
          font-weight: 500;
          letter-spacing: 0;
          fill: currentColor;
          stroke: none;
        }

        @media (max-width: 480px) {
          .hello-writing-stroke,
          .hello-writing-fill {
            font-size: 170px;
          }
        }
      `}</style>

      <svg
        className="hello-writing-svg"
        viewBox="0 0 430 150"
        role="img"
        aria-label="hello!"
      >
        {/* Filled word appears only after the handwriting stroke has completed. */}
        <motion.text
          x="215"
          y="103"
          textAnchor="middle"
          className="hello-writing-fill"
          initial={{ opacity: reduced ? 1 : 0 }}
          animate={{ opacity: 1 }}
          transition={{
            duration: reduced ? 0 : 0.35,
            delay: reduced ? 0 : 5.25,
            ease: [0.16, 1, 0.3, 1],
          }}
        >
          hello!
        </motion.text>

        {/* The visible stroke is traced progressively, giving a pen-writing effect. */}
        <motion.text
          x="215"
          y="103"
          textAnchor="middle"
          className="hello-writing-stroke"
          initial={
            reduced
              ? {
                  strokeDasharray: 1,
                  strokeDashoffset: 0,
                  opacity: 1,
                }
              : {
                  strokeDasharray: 1800,
                  strokeDashoffset: 1800,
                  opacity: 1,
                }
          }
          animate={{
            strokeDashoffset: 0,
            opacity: reduced ? 0 : 1,
          }}
          transition={{
            strokeDashoffset: {
              duration: reduced ? 0 : 5.25,
              ease: [0.65, 0, 0.35, 1],
            },
            opacity: {
              duration: reduced ? 0 : 0.2,
              delay: reduced ? 0 : 5.15,
            },
          }}
        >
          hello!
        </motion.text>
      </svg>
    </motion.main>
  );
}

function WelcomeVisual({ active, reduced }) {
  const [moment, setMoment] = useState(0);
  const pose = companionPoses[moment];

  useEffect(() => {
    if (!active || reduced) return undefined;

    const timer = window.setInterval(() => {
      setMoment((current) => (current + 1) % companionPoses.length);
    }, 3400);

    return () => window.clearInterval(timer);
  }, [active, reduced]);

  return (
    <div
      className={`onboarding-visual welcome-visual ${
        active ? "is-active" : ""
      }`}
      aria-hidden="true"
    >
      <div className="welcome-halo welcome-halo-one" />
      <div className="welcome-halo welcome-halo-two" />
      <span className="welcome-spark welcome-spark-one" />
      <span className="welcome-spark welcome-spark-two" />
      <span className="welcome-spark welcome-spark-three" />

      <motion.div
        className="welcome-word welcome-word-one"
        {...reveal(reduced, 0.08)}
        animate={
          active
            ? {
                opacity: 1,
                x: moment === 1 ? -5 : 0,
                y: moment === 1 ? 2 : 0,
                scale: moment === 1 ? 1.025 : 1,
              }
            : { opacity: 0.22, x: -10, y: 0, scale: 1 }
        }
      >
        care
      </motion.div>

      <motion.div
        className="welcome-word welcome-word-two"
        {...reveal(reduced, 0.18)}
        animate={
          active
            ? {
                opacity: 1,
                x: moment === 2 ? 5 : 0,
                y: moment === 2 ? -2 : 0,
                scale: moment === 2 ? 1.025 : 1,
              }
            : { opacity: 0.22, x: 10, y: 0, scale: 1 }
        }
      >
        protected
      </motion.div>

      <motion.div
        className="welcome-orbit"
        animate={
          active && !reduced
            ? { y: [0, -9, 0], rotate: [0, 5, 0] }
            : { y: 0, rotate: 0 }
        }
        transition={{
          duration: 4.2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <div className="welcome-sprout">
          <span />
          <span />
        </div>
      </motion.div>

      <motion.div
        className="welcome-shield"
        {...reveal(reduced, 0.28)}
        animate={
          active && !reduced
            ? {
                opacity: 1,
                scale: 1,
                x: pose.x,
                y: [pose.y, pose.y - 7, pose.y],
                rotate: pose.rotate,
              }
            : {
                opacity: active ? 1 : 0.3,
                scale: 1,
                x: 0,
                y: 0,
                rotate: 0,
              }
        }
        transition={{
          x: { duration: 1.15, ease: [0.16, 1, 0.3, 1] },
          y: {
            duration: 2.7,
            repeat: Infinity,
            ease: "easeInOut",
          },
          rotate: {
            duration: 1.15,
            ease: [0.16, 1, 0.3, 1],
          },
          opacity: { duration: 0.35 },
        }}
      >
        <span className="guardian-crown">
          <i />
          <i />
        </span>
        <span className="guardian-face">
          <i />
          <i />
        </span>
        <span className="guardian-core">
          <HeartPulse size={33} strokeWidth={1.7} />
        </span>
        <span className="shield-glint" />
      </motion.div>

      <motion.div
        className="welcome-plus"
        {...reveal(reduced, 0.38)}
      >
        +
      </motion.div>
    </div>
  );
}

function RecordsVisual({ active, reduced }) {
  return (
    <div
      className={`onboarding-visual records-visual ${
        active ? "is-active" : ""
      }`}
      aria-hidden="true"
    >
      <motion.span
        className="records-scan"
        animate={
          active && !reduced
            ? {
                x: ["-15%", "125%"],
                opacity: [0, 0.7, 0],
              }
            : {
                x: "-15%",
                opacity: 0,
              }
        }
        transition={{
          duration: 3.9,
          repeat: Infinity,
          repeatDelay: 1.8,
          ease: "easeInOut",
        }}
      />

      <motion.div
        className="records-profile"
        {...reveal(reduced, 0.08)}
        animate={
          active && !reduced
            ? {
                opacity: 1,
                y: [0, -2, 0],
              }
            : {
                opacity: active ? 1 : 0.3,
                y: active ? 0 : 14,
              }
        }
        transition={{
          y: {
            duration: 3.6,
            repeat: Infinity,
            ease: "easeInOut",
          },
        }}
      >
        <div className="records-avatar">
          <UserRound size={20} />
        </div>

        <div>
          <strong>Aria&apos;s record</strong>
          <span>Vaccination profile</span>
        </div>

        <Check className="records-confirm" size={15} />
      </motion.div>

      <motion.div
        className="records-progress"
        {...reveal(reduced, 0.2)}
        animate={{
          opacity: active ? 1 : 0.3,
          y: active ? 0 : 16,
        }}
      >
        <div className="records-progress-header">
          <span>Vaccination progress</span>
          <strong>8 of 10</strong>
        </div>

        <div className="records-progress-track">
          <motion.i
            animate={{
              width: active ? "80%" : "0%",
            }}
            transition={{
              duration: reduced ? 0 : 1.15,
              delay: 0.45,
              ease: [0.16, 1, 0.3, 1],
            }}
          />
        </div>
      </motion.div>

      <motion.div
        className="records-card records-card-back"
        {...reveal(reduced, 0.3)}
        animate={
          active && !reduced
            ? {
                opacity: 1,
                x: 0,
                y: [0, -2, 0],
              }
            : {
                opacity: active ? 1 : 0.25,
                x: active ? 0 : 15,
                y: 0,
              }
        }
        transition={{
          y: {
            duration: 3.8,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.5,
          },
        }}
      >
        <ClipboardCheck size={18} />
        <span>Hepatitis B</span>
        <Check size={16} />
      </motion.div>

      <motion.div
        className="records-card records-card-front"
        {...reveal(reduced, 0.42)}
        animate={
          active && !reduced
            ? {
                opacity: 1,
                x: 0,
                y: [0, -3, 0],
              }
            : {
                opacity: active ? 1 : 0.25,
                x: active ? 0 : 22,
                y: 0,
              }
        }
        transition={{
          y: {
            duration: 3.8,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          },
        }}
      >
        <div className="records-card-icon">
          <Syringe size={18} />
        </div>
        <span>Polio — Dose 3</span>
        <em>Upcoming</em>
      </motion.div>
    </div>
  );
}

function ScheduleVisual({ active, reduced }) {
  return (
    <div
      className={`onboarding-visual schedule-visual ${
        active ? "is-active" : ""
      }`}
      aria-hidden="true"
    >
      <motion.div
        className="schedule-calendar"
        {...reveal(reduced, 0.08)}
        animate={{
          opacity: active ? 1 : 0.3,
          scale: active ? 1 : 0.95,
        }}
      >
        <div className="calendar-top">
          <CalendarDays size={18} />
          <span>October</span>
          <b>2026</b>
        </div>

        <div className="calendar-grid">
          {["M", "T", "W", "T", "F", "S", "S"].map((day, index) => (
            <span key={`${day}-${index}`}>{day}</span>
          ))}

          {[12, 13, 14, 15, 16, 17, 18].map((day) => (
            <strong
              className={day === 15 ? "calendar-date-active" : ""}
              key={day}
            >
              {day}
            </strong>
          ))}
        </div>
      </motion.div>

      <motion.div
        className="schedule-line"
        initial={{ scaleY: 0 }}
        animate={{
          scaleY: active ? 1 : 0,
        }}
        transition={{
          duration: reduced ? 0 : 0.65,
          delay: 0.34,
        }}
      />

      <motion.div
        className="schedule-dot schedule-dot-one"
        {...reveal(reduced, 0.46)}
        animate={{
          opacity: active ? 1 : 0.25,
        }}
      >
        <Check size={13} />
      </motion.div>

      <motion.div
        className="schedule-dot schedule-dot-two"
        {...reveal(reduced, 0.56)}
        animate={{
          opacity: active ? 1 : 0.25,
        }}
      >
        <Syringe size={13} />
      </motion.div>

      <span className="schedule-ripple" />

      <motion.div
        className="schedule-reminder"
        {...reveal(reduced, 0.68)}
        animate={
          active && !reduced
            ? {
                opacity: 1,
                x: 0,
                y: [0, -3, 0],
              }
            : {
                opacity: active ? 1 : 0.22,
                x: 0,
                y: 0,
              }
        }
        transition={{
          duration: 0.55,
          delay: 0.68,
          y: {
            duration: 2.7,
            repeat: Infinity,
            ease: "easeInOut",
          },
        }}
      >
        <motion.span
          className="schedule-bell"
          animate={
            active && !reduced
              ? {
                  rotate: [0, -9, 8, -4, 0],
                  scale: [1, 1.08, 1],
                }
              : {
                  rotate: 0,
                  scale: 1,
                }
          }
          transition={{
            duration: 2.9,
            repeat: Infinity,
            repeatDelay: 1.3,
            ease: "easeInOut",
          }}
        >
          <Bell size={17} />
        </motion.span>

        <div>
          <b>Polio — Dose 3</b>
          <span>Due in 3 days</span>
        </div>

        <ChevronRight size={17} />
      </motion.div>
    </div>
  );
}

function ConnectedVisual({ active, reduced }) {
  return (
    <div
      className={`onboarding-visual connected-visual ${
        active ? "is-active" : ""
      }`}
      aria-hidden="true"
    >
      <motion.div
        className="care-node care-parent"
        {...reveal(reduced, 0.08)}
        animate={{
          opacity: active ? 1 : 0.25,
          x: active ? 0 : -20,
        }}
      >
        <span>
          <UserRound size={23} />
        </span>
        <b>Parent</b>
      </motion.div>

      <motion.div
        className="care-link care-link-left"
        initial={{ scaleX: 0 }}
        animate={{
          scaleX: active ? 1 : 0,
        }}
        transition={{
          duration: reduced ? 0 : 0.55,
          delay: 0.35,
        }}
      />

      <motion.div
        className="care-access"
        {...reveal(reduced, 0.43)}
        animate={{
          opacity: active ? 1 : 0.25,
          scale: active ? 1 : 0.88,
        }}
      >
        <KeyRound size={18} />
        <span>Secure access</span>
        <small>4F8K</small>
      </motion.div>

      <motion.div
        className="care-link care-link-right"
        initial={{ scaleX: 0 }}
        animate={{
          scaleX: active ? 1 : 0,
        }}
        transition={{
          duration: reduced ? 0 : 0.55,
          delay: 0.7,
        }}
      />

      <motion.div
        className="care-node care-doctor"
        {...reveal(reduced, 0.78)}
        animate={{
          opacity: active ? 1 : 0.25,
          x: active ? 0 : 20,
        }}
      >
        <span>
          <Stethoscope size={23} />
        </span>
        <b>Doctor</b>
      </motion.div>

      <motion.div
        className="care-record"
        {...reveal(reduced, 1.03)}
        animate={{
          opacity: active ? 1 : 0.25,
          y: active ? 0 : 15,
        }}
      >
        <ShieldCheck size={20} />

        <div>
          <b>Record updated</b>
          <span>Vaccination confirmed</span>
        </div>

        <Check size={16} />
      </motion.div>

      <span className="care-packet" />
      <LockKeyhole className="care-lock" size={13} />
    </div>
  );
}

const visuals = [
  WelcomeVisual,
  RecordsVisual,
  ScheduleVisual,
  ConnectedVisual,
];

export default function OnboardingExperience({ onComplete }) {
  const [page, setPage] = useState(0);
  const [isCompleting, setIsCompleting] = useState(false);
  const [showHelloIntro, setShowHelloIntro] = useState(true);
  const reduceMotion = useReducedMotion();

  const finish = useCallback(() => {
    if (isCompleting) return;

    try {
      localStorage.setItem(ONBOARDING_STORAGE_KEY, "true");
    } catch (_error) {
      /* storage may be disabled */
    }

    setIsCompleting(true);

    window.setTimeout(
      onComplete,
      reduceMotion ? 0 : 680
    );
  }, [isCompleting, onComplete, reduceMotion]);

  const moveTo = useCallback(
    (next) =>
      setPage(
        Math.max(
          0,
          Math.min(pageCopy.length - 1, next)
        )
      ),
    []
  );

  /*
   * Keyboard controls are disabled while the hello intro is showing.
   */
  useEffect(() => {
    const onKeyDown = (event) => {
      if (showHelloIntro) return;

      if (event.key === "ArrowRight") {
        event.preventDefault();
        moveTo(page + 1);
      }

      if (event.key === "ArrowLeft") {
        event.preventDefault();
        moveTo(page - 1);
      }

      if (event.key === "Escape") {
        finish();
      }
    };

    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [finish, moveTo, page, showHelloIntro]);

  /*
   * The hello screen stays completely opaque while visible.
   * This prevents the underlying dashboard from flashing through.
   */
  useEffect(() => {
    if (!showHelloIntro) return undefined;

    const timer = window.setTimeout(
      () => setShowHelloIntro(false),
      reduceMotion ? 500 : 5000
    );

    return () => window.clearTimeout(timer);
  }, [reduceMotion, showHelloIntro]);

  useEffect(() => {
    document.body.classList.add("onboarding-open");

    return () => {
      document.body.classList.remove("onboarding-open");
    };
  }, []);

  if (showHelloIntro) {
    return <HelloIntro reduced={reduceMotion} />;
  }

  return (
    <motion.main
      className={`onboarding-shell ${
        isCompleting ? "is-completing" : ""
      }`}
      aria-label="Vardaan+ welcome introduction"
      aria-busy={isCompleting}
      initial={{ opacity: 1, scale: 1 }}
      animate={
        isCompleting
          ? {
              opacity: 0,
              scale: 1.035,
              filter: "blur(5px)",
            }
          : {
              opacity: 1,
              scale: 1,
              filter: "blur(0px)",
            }
      }
      transition={{
        duration: reduceMotion ? 0 : 0.68,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      <div className="onboarding-ambient onboarding-ambient-one" />
      <div className="onboarding-ambient onboarding-ambient-two" />

      <motion.div
        className="onboarding-handoff-bloom"
        aria-hidden="true"
        animate={
          isCompleting
            ? {
                opacity: [0, 0.95, 0],
                scale: [0.55, 2.7, 4.6],
                x: "-50%",
                y: "-50%",
              }
            : {
                opacity: 0,
                scale: 0.55,
                x: "-50%",
                y: "-50%",
              }
        }
        transition={{
          duration: reduceMotion ? 0 : 0.68,
          ease: "easeOut",
        }}
      />

      <header className="onboarding-header">
        <BrandMark />

        {page < 3 && (
          <button
            className="onboarding-skip"
            type="button"
            onClick={finish}
            disabled={isCompleting}
          >
            Skip
          </button>
        )}
      </header>

      <motion.div
        className="onboarding-track"
        animate={{
          x: `-${page * 25}%`,
        }}
        transition={{
          type: "spring",
          stiffness: 260,
          damping: 32,
          mass: 0.85,
        }}
        drag={reduceMotion ? false : "x"}
        dragConstraints={{
          left: 0,
          right: 0,
        }}
        dragElastic={0.08}
        onDragEnd={(_, info) => {
          if (
            info.offset.x < -64 ||
            info.velocity.x < -450
          ) {
            moveTo(page + 1);
          }

          if (
            info.offset.x > 64 ||
            info.velocity.x > 450
          ) {
            moveTo(page - 1);
          }
        }}
      >
        {pageCopy.map((content, index) => {
          const Visual = visuals[index];
          const active = page === index;

          return (
            <section
              className="onboarding-page"
              aria-hidden={!active}
              key={content.title}
            >
              <div className="onboarding-page-inner">
                <Visual
                  active={active}
                  reduced={reduceMotion}
                />

                <motion.div
                  className="onboarding-copy"
                  initial={false}
                  animate={{
                    opacity: active ? 1 : 0.25,
                    y: active ? 0 : 12,
                  }}
                  transition={{
                    duration: 0.42,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                >
                  <p className="onboarding-eyebrow">
                    {content.eyebrow}
                  </p>

                  <h1>{content.title}</h1>

                  <p className="onboarding-body">
                    {content.body}
                  </p>
                </motion.div>
              </div>
            </section>
          );
        })}
      </motion.div>

      <footer className="onboarding-footer">
        <div
          className="onboarding-dots"
          role="tablist"
          aria-label="Introduction pages"
        >
          {pageCopy.map((item, index) => (
            <button
              key={item.title}
              className={`onboarding-dot ${
                page === index ? "is-active" : ""
              }`}
              type="button"
              onClick={() => moveTo(index)}
              role="tab"
              aria-selected={page === index}
              aria-label={`Go to page ${index + 1}`}
            />
          ))}
        </div>

        <button
          className="onboarding-next"
          type="button"
          onClick={() =>
            page === pageCopy.length - 1
              ? finish()
              : moveTo(page + 1)
          }
          disabled={isCompleting}
        >
          <span>
            {page === pageCopy.length - 1
              ? "Get Started"
              : "Next"}
          </span>

          <ArrowRight size={18} />
        </button>
      </footer>
    </motion.main>
  );
}