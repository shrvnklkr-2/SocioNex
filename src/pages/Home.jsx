import { useState, useEffect, useMemo } from "react"
import { Link } from "react-router-dom"
import {
  ArrowRight,
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
import { LanguageSwitcher } from "../i18n/LanguageSwitcher"
import { useLanguage } from "../i18n/LanguageContext"

export default function Home() {
  useTitle("Home")
  const { t } = useLanguage()
  const [activeStep, setActiveStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(true)

  const steps = useMemo(
    () => [
      {
        step: "01",
        role: t("home.step1.role"),
        title: t("home.step1.title"),
        body: t("home.step1.body"),
        tag: t("home.step1.tag"),
        icon: User,
        color: "from-emerald-500 to-teal-600",
      },
      {
        step: "02",
        role: t("home.step2.role"),
        title: t("home.step2.title"),
        body: t("home.step2.body"),
        tag: t("home.step2.tag"),
        icon: Brain,
        color: "from-teal-500 to-emerald-700",
      },
      {
        step: "03",
        role: t("home.step3.role"),
        title: t("home.step3.title"),
        body: t("home.step3.body"),
        tag: t("home.step3.tag"),
        icon: GraduationCap,
        color: "from-emerald-600 to-teal-800",
      },
      {
        step: "04",
        role: t("home.step4.role"),
        title: t("home.step4.title"),
        body: t("home.step4.body"),
        tag: t("home.step4.tag"),
        icon: Building2,
        color: "from-teal-600 to-emerald-600",
      },
    ],
    [t],
  )

  const impactStats = useMemo(
    () => [
      { value: "1,280+", label: t("home.stat.reported"), icon: User },
      { value: "860+", label: t("home.stat.validated"), icon: Brain },
      { value: "320+", label: t("home.stat.launched"), icon: GraduationCap },
      { value: "12,500+", label: t("home.stat.reached"), icon: Building2 },
    ],
    [t],
  )

  useEffect(() => {
    if (!isPlaying) return undefined
    const timer = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % steps.length)
    }, 4000)
    return () => clearInterval(timer)
  }, [isPlaying, steps.length])

  const scrollToSection = (id) => {
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" })
    }
  }

  const current = steps[activeStep]

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-8">
      <section id="home" className="scroll-mt-20 py-4 sm:py-6 lg:py-8">
        <div className="grid items-center gap-8 lg:grid-cols-[1fr_1.1fr] lg:gap-12">
          <div className="rise space-y-5">
            <div className="flex flex-wrap items-center gap-3">
              <LanguageSwitcher size="md" />
              <span className="text-[11px] font-semibold tracking-[0.16em] text-muted uppercase">{t("nav.language")}</span>
            </div>

            <div className="flex flex-wrap items-center gap-2 text-[11px] font-bold tracking-[0.2em] text-emerald-800 uppercase dark:text-emerald-300">
              <span>{t("home.stakeholders.citizens")}</span>
              <span className="text-emerald-400 dark:text-emerald-600">×</span>
              <span>{t("home.stakeholders.universities")}</span>
              <span className="text-emerald-400 dark:text-emerald-600">×</span>
              <span>{t("home.stakeholders.government")}</span>
              <span className="text-emerald-400 dark:text-emerald-600">×</span>
              <span>{t("home.stakeholders.industry")}</span>
              <span className="text-emerald-400 dark:text-emerald-600">×</span>
              <span>{t("home.stakeholders.communities")}</span>
            </div>

            <h1 className="max-w-xl font-display text-4xl font-normal leading-[1.08] tracking-tight text-emerald-950 sm:text-5xl lg:text-6xl dark:text-white">
              {t("home.hero.titleBefore")}{" "}
              <span className="italic text-emerald-600 dark:text-emerald-400">{t("home.hero.titleAccent")}</span>
            </h1>

            <p className="max-w-xl text-base leading-relaxed text-slate-600 dark:text-slate-300">
              {t("home.hero.body")}
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-1">
              <Link
                to="/report"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-emerald-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-600/25 transition-all hover:bg-emerald-700 hover:shadow-emerald-600/35 active:scale-[0.98] dark:bg-emerald-500 dark:hover:bg-emerald-600"
              >
                {t("home.cta.report")}
                <ArrowRight className="h-4 w-4" />
              </Link>

              <button
                type="button"
                onClick={() => scrollToSection("how-it-works")}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-emerald-300 bg-white/90 px-6 py-3 text-sm font-semibold text-emerald-900 backdrop-blur-sm transition-all hover:border-emerald-400 hover:bg-emerald-50 dark:border-emerald-700 dark:bg-slate-900/80 dark:text-emerald-200 dark:hover:bg-slate-800"
              >
                {t("home.cta.explore")}
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="w-full">
            <EcosystemMap />
          </div>
        </div>
      </section>

      <section id="how-it-works" className="scroll-mt-20 py-4 sm:py-6">
        <div className="rounded-3xl border border-emerald-200/80 bg-white/90 p-6 shadow-sm backdrop-blur-md dark:border-emerald-800/80 dark:bg-slate-950/60 sm:p-8">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <div className="flex items-center gap-2 text-[11px] font-bold tracking-[0.2em] text-emerald-800 uppercase dark:text-emerald-400">
                <span>{t("home.how.eyebrow")}</span>
                <span className="h-0.5 w-8 bg-emerald-500/40" />
              </div>
              <h2 className="mt-1 font-display text-3xl font-normal text-slate-900 sm:text-4xl dark:text-white">
                {t("home.how.title")}
              </h2>
            </div>

            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => setIsPlaying(!isPlaying)}
                className="inline-flex items-center gap-2 rounded-full border border-emerald-300 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-emerald-50 dark:border-emerald-700 dark:bg-slate-900 dark:text-slate-200"
              >
                {isPlaying ? <Pause className="h-3.5 w-3.5 text-emerald-600" /> : <Play className="h-3.5 w-3.5 text-emerald-600" />}
                {isPlaying ? t("home.how.pause") : t("home.how.play")}
              </button>

              <Link
                to="/live-demo"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 hover:underline dark:text-emerald-400"
              >
                {t("home.how.demo")} <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>

          <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_1.2fr]">
            <div className="space-y-2.5">
              {steps.map((item, idx) => {
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
                    <p className="mt-1.5 text-xs text-slate-600 line-clamp-1 dark:text-slate-400">{item.title}</p>
                  </button>
                )
              })}
            </div>

            <div className="relative flex flex-col justify-between rounded-2xl border border-emerald-200/80 bg-gradient-to-br from-emerald-50/50 via-white to-emerald-50/20 p-5 shadow-inner dark:border-emerald-900/40 dark:from-slate-900 dark:via-slate-900/90 dark:to-emerald-950/40 sm:p-6">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold tracking-widest text-emerald-600 uppercase dark:text-emerald-400">
                    {t("home.how.stageOf", { step: current.step })}
                  </span>
                  <div className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${current.color} text-white shadow-md`}>
                    {(() => {
                      const Icon = current.icon
                      return <Icon className="h-5 w-5" />
                    })()}
                  </div>
                </div>

                <h3 className="mt-3 font-display text-2xl text-slate-900 dark:text-white">{current.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-300">{current.body}</p>
              </div>

              <div className="mt-6 flex items-center justify-between pt-4 border-t border-slate-200/80 dark:border-slate-800">
                <div className="flex gap-2">
                  {steps.map((_, idx) => (
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
                  onClick={() => setActiveStep((prev) => (prev + 1) % steps.length)}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 hover:text-emerald-600 dark:text-slate-300 dark:hover:text-emerald-400"
                >
                  {t("home.how.next")} <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="scroll-mt-20 py-4 sm:py-6">
        <div className="rounded-3xl border border-emerald-200/80 bg-white/90 p-6 shadow-sm backdrop-blur-md dark:border-emerald-800/80 dark:bg-slate-950/60 sm:p-8">
          <SpotlightCarousel />
        </div>
      </section>

      <section id="impact" className="scroll-mt-20 py-4 sm:py-6 space-y-6">
        <div className="relative overflow-hidden rounded-3xl border border-emerald-200/80 bg-gradient-to-br from-emerald-50/60 via-white to-teal-50/30 p-6 shadow-sm dark:border-emerald-800 dark:from-slate-950 dark:via-slate-900 dark:to-emerald-950/40 sm:p-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <span className="text-[11px] font-bold tracking-[0.2em] text-emerald-800 uppercase dark:text-emerald-400">
                {t("home.impact.eyebrow")}
              </span>
              <h2 className="mt-1 font-display text-3xl font-normal text-slate-900 sm:text-4xl dark:text-white">
                {t("home.impact.title")}
              </h2>
            </div>

            <Link
              to="/impact"
              className="inline-flex items-center gap-2 rounded-full border border-emerald-300 bg-white px-5 py-2 text-xs font-semibold text-slate-700 transition-colors hover:bg-emerald-50 dark:border-emerald-700 dark:bg-slate-900 dark:text-slate-200"
            >
              {t("home.impact.analytics")}
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {impactStats.map((stat) => {
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
                    <div className="font-display text-2xl font-bold text-slate-900 dark:text-white">{stat.value}</div>
                    <div className="text-xs font-medium text-slate-500 dark:text-slate-400">{stat.label}</div>
                  </div>
                </div>
              )
            })}
          </div>

          <div className="mt-8 pt-5 border-t border-slate-200/80 dark:border-slate-800">
            <div className="flex flex-col items-center justify-between gap-4 text-center sm:flex-row sm:text-left">
              <span className="text-[11px] font-bold tracking-[0.2em] text-slate-400 uppercase">
                {t("home.impact.together")}
              </span>

              <div className="flex flex-wrap items-center justify-center gap-6 text-xs font-medium text-slate-600 dark:text-slate-400">
                <span className="flex items-center gap-1.5"><Landmark className="h-4 w-4 text-emerald-600" /> {t("home.role.government")}</span>
                <span className="flex items-center gap-1.5"><GraduationCap className="h-4 w-4 text-teal-600" /> {t("home.role.universities")}</span>
                <span className="flex items-center gap-1.5"><User className="h-4 w-4 text-emerald-600" /> {t("home.role.citizens")}</span>
                <span className="flex items-center gap-1.5"><Users className="h-4 w-4 text-emerald-700" /> {t("home.role.ngos")}</span>
                <span className="flex items-center gap-1.5"><Building2 className="h-4 w-4 text-teal-700" /> {t("home.role.industry")}</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
