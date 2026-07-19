import { Link } from "react-router-dom";
import { HeartPulse, Stethoscope, ArrowRight, ShieldCheck } from "lucide-react";

export default function SelectRole() {
  return (
    <div className="min-h-screen aurora-bg px-6 py-10">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center gap-2 text-slate-500 text-sm">
          <ShieldCheck className="w-4 h-4 text-teal-700" />
          <span>Secured with password-based authentication</span>
        </div>
        <h1 className="mt-4 text-4xl sm:text-5xl font-display tracking-tight text-slate-900 max-w-2xl">
          Who are you signing in as?
        </h1>
        <p className="mt-3 text-slate-600 max-w-xl">
          Choose your role to continue. Parents manage children and view vaccination history. Doctors update records after searching an Aadhaar.
        </p>

        <div className="grid md:grid-cols-2 gap-6 mt-10">
          <Link
            to="/parent/login"
            data-testid="role-parent-card"
            className="group card-soft hover-lift tap-scale p-8 block relative overflow-hidden"
          >
            <div className="absolute -top-8 -right-8 w-40 h-40 rounded-full bg-teal-100/60 blur-2xl" />
            <div className="relative">
              <div className="w-14 h-14 rounded-2xl bg-teal-700 text-white grid place-items-center">
                <HeartPulse className="w-7 h-7" strokeWidth={1.5} />
              </div>
              <h2 className="mt-6 text-2xl font-display tracking-tight text-slate-900">Continue as Parent</h2>
              <p className="mt-2 text-slate-600 text-sm leading-relaxed">
                Register your children, follow the UIP schedule, and access a lifelong vaccination record.
              </p>
              <div className="mt-6 inline-flex items-center gap-2 text-teal-700 font-medium">
                Get started <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </div>
            </div>
          </Link>

          <Link
            to="/doctor/login"
            data-testid="role-doctor-card"
            className="group card-soft hover-lift tap-scale p-8 block relative overflow-hidden"
          >
            <div className="absolute -top-8 -right-8 w-40 h-40 rounded-full bg-sky-100/60 blur-2xl" />
            <div className="relative">
              <div className="w-14 h-14 rounded-2xl bg-sky-600 text-white grid place-items-center">
                <Stethoscope className="w-7 h-7" strokeWidth={1.5} />
              </div>
              <h2 className="mt-6 text-2xl font-display tracking-tight text-slate-900">Continue as Doctor</h2>
              <p className="mt-2 text-slate-600 text-sm leading-relaxed">
                Search a child by Aadhaar, view due vaccines, and record vaccinations in seconds.
              </p>
              <div className="mt-6 inline-flex items-center gap-2 text-sky-700 font-medium">
                Get started <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </div>
            </div>
          </Link>
        </div>

        <p className="mt-10 text-center text-slate-400 text-xs">
          Medical records require an internet connection.
        </p>
      </div>
    </div>
  );
}
