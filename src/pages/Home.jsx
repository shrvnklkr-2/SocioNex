import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  User,
  Brain,
  GraduationCap,
  Landmark,
  Users,
  Building2,
  Pause,
  Play,
  ArrowUpRight,
} from "lucide-react"
import { EcosystemMap } from "../components/EcosystemMap"
import { SpotlightCarousel } from "../components/SpotlightCarousel"
import { useTitle } from "../components/ui"

const HOW_IT_WORKS_STEPS = [
  {
    step: "01",
    role: "Citizen",
    title: "A citizen reports a challenge",
    body: "A handpump failure or water shortage is reported in Palkot. The submission includes geo-tagged coordinates, local context photos, and urgency details.",
    tag: "Reported in field",
    icon: User,
    color: "from-emerald-500 to-teal-600",
  },
  {
    step: "02",
    role: "AI Validation",
    title: "AI sorts & validates the queue",
    body: "AI algorithms group similar reports, score urgency, filter duplicate submissions, and categorize issues before human review.",
    tag: "Urgency scored: High",
    icon: Brain,
    color: "from-teal-500 to-emerald-700",
  },
  {
    step: "03",
    role: "University",
    title: "A campus department is matched",
    body: "Birsa Agricultural University's Rural Engineering department is matched based on expertise, faculty research, and student lab availability.",
    tag: "Campus assigned",
    icon: GraduationCap,
    color: "from-emerald-600 to-teal-800",
  },
  {
    step: "04",
    role: "Industry & Govt",
    title: "Industry joins field pilot",
    body: "An industry partner supplies sensor hardware and mentorship. District authorities, campus teams, and citizens track real-time milestones together.",
    tag: "Pilot in progress",
    icon: Building2,
    color: "from-teal-600 to-emerald-600",
  },
]

const IMPACT_STATS = [
  { value: "1,280+", label: "Problems reported", icon: User },
  { value: "860+", label: "Ideas validated", icon: Brain },
  { value: "320+", label: "Projects launched", icon: GraduationCap },
  { value: "12,500+", label: "Communities reached", icon: Building2 },
]

export default function Home() {
  useTitle("Home")
  const [activeStep, setActiveStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(true)

  // Auto cycle how it works steps
  useEffect(() => {
    if (!isPlaying) return undefined
    const timer = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % HOW_IT_WORKS_STEPS.length)
    }, 4000)
    return () => clearInterval(timer)
  }, [isPlaying])

  const scrollToSection = (id) => {
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" })
    }
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-8">
      {/* ---------------------------------------------------- */}
      {/* SECTION 1: HERO SECTION (#home) */}
      {/* ---------------------------------------------------- */}
      <section
        id="home"
        className="scroll-mt-20 py-4 sm:py-6 lg:py-8"
      >
        <div className="grid items-center gap-8 lg:grid-cols-[1fr_1.1fr] lg:gap-12">
          <div className="rise space-y-5">
            {/* Stakeholders tag line */}
            <div className="flex flex-wrap items-center gap-2 text-[11px] font-bold tracking-[0.2em] text-emerald-800 uppercase dark:text-emerald-300">
              <span>CITIZENS</span>
              <span className="text-emerald-400 dark:text-emerald-600">×</span>
              <span>UNIVERSITIES</span>
              <span className="text-emerald-400 dark:text-emerald-600">×</span>
              <span>GOVERNMENT</span>
              <span className="text-emerald-400 dark:text-emerald-600">×</span>
              <span>INDUSTRY</span>
              <span className="text-emerald-400 dark:text-emerald-600">×</span>
              <span>COMMUNITIES</span>
            </div>

            {/* Main Title */}
            <h1 className="max-w-xl font-display text-4xl font-normal leading-[1.08] tracking-tight text-emerald-950 sm:text-5xl lg:text-6xl dark:text-white">
              Transform challenges into <span className="italic text-emerald-600 dark:text-emerald-400">real solutions.</span>
            </h1>

            {/* Subheading */}
            <p className="max-w-xl text-base leading-relaxed text-slate-600 dark:text-slate-300">
              People already know what is breaking. We connect citizens, academic minds, government and industry to turn local observations into validated, real-world solutions.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-1">
              <Link
                to="/report"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-emerald-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-600/25 transition-all hover:bg-emerald-700 hover:shadow-emerald-600/35 active:scale-[0.98] dark:bg-emerald-500 dark:hover:bg-emerald-600"
              >
                Report a problem
                <ArrowRight className="h-4 w-4" />
              </Link>

              <button
                type="button"
                onClick={() => scrollToSection("how-it-works")}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-emerald-300 bg-white/90 px-6 py-3 text-sm font-semibold text-emerald-900 backdrop-blur-sm transition-all hover:border-emerald-400 hover:bg-emerald-50 dark:border-emerald-700 dark:bg-slate-900/80 dark:text-emerald-200 dark:hover:bg-slate-800"
              >
                Explore the process
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* HERO CONNECTED ECOSYSTEM GRAPHIC */}
          <div className="w-full">
            <EcosystemMap />
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------- */}
      {/* SECTION 2: HOW IT WORKS SECTION (#how-it-works) */}
      {/* ---------------------------------------------------- */}
      <section
        id="how-it-works"
        className="scroll-mt-20 py-4 sm:py-6"
      >
        <div className="rounded-3xl border border-emerald-200/80 bg-white/90 p-6 shadow-sm backdrop-blur-md dark:border-emerald-800/80 dark:bg-slate-950/60 sm:p-8">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <div className="flex items-center gap-2 text-[11px] font-bold tracking-[0.2em] text-emerald-800 uppercase dark:text-emerald-400">
                <span>HOW IT WORKS</span>
                <span className="h-0.5 w-8 bg-emerald-500/40" />
              </div>
              <h2 className="mt-1 font-display text-3xl font-normal text-slate-900 sm:text-4xl dark:text-white">
                One report, four desks.
              </h2>
            </div>

            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => setIsPlaying(!isPlaying)}
                className="inline-flex items-center gap-2 rounded-full border border-emerald-300 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-emerald-50 dark:border-emerald-700 dark:bg-slate-900 dark:text-slate-200"
              >
                {isPlaying ? <Pause className="h-3.5 w-3.5 text-emerald-600" /> : <Play className="h-3.5 w-3.5 text-emerald-600" />}
                {isPlaying ? "Pause autoplay" : "Play walkthrough"}
              </button>

              <Link
                to="/live-demo"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 hover:underline dark:text-emerald-400"
              >
                Full demo <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>

          {/* Interactive Steps Grid */}
          <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_1.2fr]">
            {/* Step Selection List */}
            <div className="space-y-2.5">
              {HOW_IT_WORKS_STEPS.map((item, idx) => {
                const isCurrent = activeStep === idx

                return (
                  <button
                    key={item.step}
                    type="button"
                    onClick={() => {
                      setActiveStep(idx)
                      setIsPlaying(false)
                    }}
                    className={`w-full text-left rounded-2xl p-3.5 transition-all duration-300 ${
                      isCurrent
                        ? "border-2 border-emerald-500 bg-emerald-50/70 shadow-md dark:border-emerald-400 dark:bg-emerald-950/40"
                        : "border border-slate-200/80 bg-white hover:border-emerald-300 dark:border-slate-800 dark:bg-slate-900/40"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className={`text-xs font-bold ${isCurrent ? "text-emerald-700 dark:text-emerald-400" : "text-slate-400"}`}>
                          {item.step}
                        </span>
                        <h3 className={`text-sm font-bold ${isCurrent ? "text-slate-900 dark:text-white" : "text-slate-700 dark:text-slate-300"}`}>
                          {item.role}
                        </h3>
                      </div>
                      <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-[10px] font-semibold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                        {item.tag}
                      </span>
                    </div>
                    <p className="mt-1.5 text-xs text-slate-600 line-clamp-1 dark:text-slate-400">
                      {item.title}
                    </p>
                  </button>
                )
              })}
            </div>

            {/* Step Focus Content Display */}
            <div className="relative flex flex-col justify-between rounded-2xl border border-emerald-200/80 bg-gradient-to-br from-emerald-50/50 via-white to-emerald-50/20 p-5 shadow-inner dark:border-emerald-900/40 dark:from-slate-900 dark:via-slate-900/90 dark:to-emerald-950/40 sm:p-6">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold tracking-widest text-emerald-600 uppercase dark:text-emerald-400">
                    STAGE {HOW_IT_WORKS_STEPS[activeStep].step} OF 04
                  </span>
                  <div className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${HOW_IT_WORKS_STEPS[activeStep].color} text-white shadow-md`}>
                    {(() => {
                      const Icon = HOW_IT_WORKS_STEPS[activeStep].icon
                      return <Icon className="h-5 w-5" />
                    })()}
                  </div>
                </div>

                <h3 className="mt-3 font-display text-2xl text-slate-900 dark:text-white">
                  {HOW_IT_WORKS_STEPS[activeStep].title}
                </h3>

                <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                  {HOW_IT_WORKS_STEPS[activeStep].body}
                </p>
              </div>

              {/* Progress Dots */}
              <div className="mt-6 flex items-center justify-between pt-4 border-t border-slate-200/80 dark:border-slate-800">
                <div className="flex gap-2">
                  {HOW_IT_WORKS_STEPS.map((_, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setActiveStep(idx)
                        setIsPlaying(false)
                      }}
                      className={`h-2 rounded-full transition-all ${
                        activeStep === idx ? "w-8 bg-emerald-600 dark:bg-emerald-400" : "w-2 bg-slate-300 dark:bg-slate-700"
                      }`}
                      aria-label={`Go to stage ${idx + 1}`}
                    />
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => setActiveStep((prev) => (prev + 1) % HOW_IT_WORKS_STEPS.length)}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 hover:text-emerald-600 dark:text-slate-300 dark:hover:text-emerald-400"
                >
                  Next step <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------- */}
      {/* SECTION 3: FEATURES SECTION (#features) */}
      {/* ---------------------------------------------------- */}
      <section
        id="features"
        className="scroll-mt-20 py-4 sm:py-6"
      >
        <div className="rounded-3xl border border-emerald-200/80 bg-white/90 p-6 shadow-sm backdrop-blur-md dark:border-emerald-800/80 dark:bg-slate-950/60 sm:p-8">
          <SpotlightCarousel />
        </div>
      </section>

      {/* ---------------------------------------------------- */}
      {/* SECTION 4: IMPACT SECTION (#impact) */}
      {/* ---------------------------------------------------- */}
      <section
        id="impact"
        className="scroll-mt-20 py-4 sm:py-6 space-y-6"
      >
        {/* Main Impact Card */}
        <div className="relative overflow-hidden rounded-3xl border border-emerald-200/80 bg-gradient-to-br from-emerald-50/60 via-white to-teal-50/30 p-6 shadow-sm dark:border-emerald-800 dark:from-slate-950 dark:via-slate-900 dark:to-emerald-950/40 sm:p-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <span className="text-[11px] font-bold tracking-[0.2em] text-emerald-800 uppercase dark:text-emerald-400">
                IMPACT
              </span>
              <h2 className="mt-1 font-display text-3xl font-normal text-slate-900 sm:text-4xl dark:text-white">
                Real progress. Measured together.
              </h2>
            </div>

            <Link
              to="/impact"
              className="inline-flex items-center gap-2 rounded-full border border-emerald-300 bg-white px-5 py-2 text-xs font-semibold text-slate-700 transition-colors hover:bg-emerald-50 dark:border-emerald-700 dark:bg-slate-900 dark:text-slate-200"
            >
              Full analytics
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          {/* Metric Stats Cards Bar */}
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {IMPACT_STATS.map((stat) => {
              const Icon = stat.icon
              return (
                <div
                  key={stat.label}
                  className="flex items-center gap-4 rounded-2xl border border-emerald-100 bg-white/95 p-4 shadow-sm backdrop-blur-md dark:border-emerald-900/50 dark:bg-slate-900/80"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="font-display text-2xl font-bold text-slate-900 dark:text-white">
                      {stat.value}
                    </div>
                    <div className="text-xs font-medium text-slate-500 dark:text-slate-400">
                      {stat.label}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Bottom Landscape Skyline & Stakeholders Footer Bar */}
          <div className="mt-8 pt-5 border-t border-slate-200/80 dark:border-slate-800">
            <div className="flex flex-col items-center justify-between gap-4 text-center sm:flex-row sm:text-left">
              <span className="text-[11px] font-bold tracking-[0.2em] text-slate-400 uppercase">
                WORKING TOGETHER FOR BETTER COMMUNITIES
              </span>

              <div className="flex flex-wrap items-center justify-center gap-6 text-xs font-medium text-slate-600 dark:text-slate-400">
                <span className="flex items-center gap-1.5"><Landmark className="h-4 w-4 text-emerald-600" /> Government</span>
                <span className="flex items-center gap-1.5"><GraduationCap className="h-4 w-4 text-teal-600" /> Universities</span>
                <span className="flex items-center gap-1.5"><User className="h-4 w-4 text-emerald-600" /> Citizens</span>
                <span className="flex items-center gap-1.5"><Users className="h-4 w-4 text-emerald-700" /> NGOs / Communities</span>
                <span className="flex items-center gap-1.5"><Building2 className="h-4 w-4 text-teal-700" /> Industry</span>
              </div>
            </div>
          </div>
        </div>


      </section>
    </div>
  )
}
