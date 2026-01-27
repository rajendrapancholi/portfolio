"use client";
import Link from 'next/link';

type props = {
    logoType?: "type1" | "type2" | "type3" | "mini";
    title?: string;
    firstText?: string;
    secondText?: string;
    path?: string;
};

const RajeBrandLogo = ({ logoType, title = "MERN Stack Architect", firstText = "rp", secondText = "dev", path = "/" }: props) => {
    const currYr = new Date().getFullYear();
    switch (logoType) {
        case "type1":
            return (
                <Link href={path} className="group relative flex items-center gap-6 py-2 px-4 rounded-2xl transition-all duration-500 hover:bg-slate-900/40">
                    <div className="relative">
                        <div className="absolute inset-0 rounded-full border-2 border-dashed border-cyan-500/20 group-hover:border-cyan-500/50 group-hover:rotate-180 transition-all duration-1000" />

                        <div className="relative w-14 h-14 flex items-center justify-center bg-slate-950 rounded-2xl border border-slate-800 shadow-2xl transition-all duration-500 group-hover:-translate-y-2 group-hover:shadow-cyan-500/20 group-hover:border-cyan-500/50">

                            <div className="absolute inset-0 rounded-2xl overflow-hidden">
                                <div className="absolute inset-0 bg-linear-to-tr from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                            </div>

                            <div className="relative z-10 flex items-center justify-center">
                                <div className="w-4 h-4 bg-cyan-500 rounded-full shadow-[0_0_20px_#22d3ee] animate-pulse" />

                                <div className="absolute w-8 h-8 border border-slate-700 rounded-full animate-[spin_4s_linear_infinite]" />
                                <div className="absolute top-0 w-2 h-2 bg-blue-500 rounded-full shadow-[0_0_8px_#3b82f6] animate-[ping_3s_ease-in-out_infinite]" />
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col">
                        <div className="flex items-center gap-1">
                            <span className="text-2xl font-black text-white tracking-tighter transition-all duration-500 group-hover:tracking-normal group-hover:text-cyan-400">
                                {firstText || "RAJENDRA"}
                            </span>
                            <span className="text-2xl font-light text-slate-500">
                                {secondText || "P"}.
                            </span>
                        </div>

                        <div className="mt-1 w-full h-1 bg-slate-800 rounded-full overflow-hidden">
                            <div className="h-full w-0 group-hover:w-full bg-linear-to-r from-cyan-500 via-blue-500 to-cyan-500 transition-all duration-700 ease-out" />
                        </div>

                        <span className="text-[10px] uppercase tracking-[0.3em] text-slate-500 mt-1.5 font-bold group-hover:text-slate-300 transition-colors">
                            {title}
                        </span>
                    </div>

                    <div className="absolute -inset-1 bg-linear-to-r from-cyan-500 to-blue-600 rounded-2xl blur-xl opacity-0 group-hover:opacity-10 transition-opacity duration-500" />
                </Link>
            );
        case "type2":
            return (
                <div className="flex items-center gap-4 group cursor-pointer">
                    <div className="relative">
                        <div className="w-9 h-9 rounded-full border-2 border-slate-800 flex items-center justify-center group-hover:border-cyan-500/50 transition-all duration-500 group-hover:rotate-180">

                            <div className="w-2 h-2 bg-cyan-500 rounded-full shadow-[0_0_15px_rgba(6,182,212,1)]" />
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-blue-500 rounded-full" />
                        </div>
                    </div >

                    <span className="font-extrabold text-2xl tracking-tighter text-white italic">
                        {firstText}<span className="text-cyan-500">.</span>{secondText}
                    </span>
                </div >
            );
        case "type3":
            return (
                <Link href={path} className="group relative flex items-center gap-8 py-2 px-4 rounded-[2.5rem] transition-all duration-700 hover:bg-slate-900/20">
                    <div className="relative h-16 w-20 perspective-distant shrink-0">
                        <div className="relative h-full w-full transform-3d transition-transform duration-1000 ease-out 
                        group-hover:rotate-x-12 group-hover:-rotate-y-12 group-hover:scale-110">
                            <div className="absolute inset-0 bg-emerald-500/10 border-2 border-emerald-500/20 rounded-2xl blur-[1px] 
                            -translate-z-10 group-hover:-translate-z-16 transition-all duration-700" />
                            <div className="absolute inset-0 bg-slate-950/80 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden
                            translate-z-4 group-hover:translate-z-8 transition-all duration-700 delay-75">
                                <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent,rgba(34,211,238,0.05)_50%,transparent)] group-hover:animate-[scan_3s_linear_infinite]" />
                                <div className="flex items-center justify-center h-full">
                                    <div className="w-10 h-px bg-slate-800 rotate-45 absolute" />
                                    <div className="w-10 h-px bg-slate-800 -rotate-45 absolute" />
                                </div>
                            </div>
                            <div className="absolute inset-2 bg-cyan-500/10 backdrop-blur-md border border-cyan-400/40 rounded-xl flex items-center justify-center
                            translate-z-16 group-hover:translate-z-24 transition-all duration-700 delay-150">
                                <div className="relative">
                                    <div className="w-4 h-4 bg-cyan-400 rounded-full shadow-[0_0_20px_rgba(34,211,238,0.8)] animate-pulse" />
                                    <div className="absolute -inset-2 border border-cyan-500/30 rounded-full animate-spin-slow" />
                                </div>
                            </div>
                        </div>
                        <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-16 h-4 bg-black/40 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                    </div>
                    <div className="flex flex-col relative">
                        <div className="flex items-center gap-2">
                            <h1 className="text-3xl uppercase font-black italic tracking-tighter text-white transition-all duration-500 group-hover:text-cyan-400 group-hover:-skew-x-6">
                                {firstText || "RP"}<span className="uppercase text-slate-600 group-hover:text-white">.</span>{secondText || "DEV"}
                            </h1>
                            <span className="bg-cyan-500/10 text-cyan-400 text-[10px] font-bold px-2 py-1 rounded-md border border-cyan-500/20 uppercase tracking-widest">
                                {currYr}
                            </span>
                        </div>
                        <div className="flex items-center gap-2 mt-2">
                            <div className="flex gap-1">
                                {[0, 1, 2].map((i) => (
                                    <div key={i} className="w-2 h-2 rounded-full bg-slate-800 group-hover:bg-cyan-500 transition-all duration-500"
                                        style={{ transitionDelay: `${i * 100}ms` }} />
                                ))}
                            </div>
                            <span className="text-[8px] font-mono font-bold text-slate-500 uppercase tracking-[0.3em] group-hover:text-slate-200 transition-colors">
                                {title || "MERN Stack Architect"}
                            </span>
                        </div>
                        <div className="mt-3 w-full h-0.5 bg-slate-800 rounded-full overflow-hidden">
                            <div className="h-full w-full bg-linear-to-r from-cyan-500 via-blue-500 to-emerald-500 -translate-x-full group-hover:translate-x-0 transition-transform duration-1000 ease-in-out" />
                        </div>
                    </div>
                </Link>
            );

        case "mini":
            return (
                <Link href={path} className="group relative flex items-center gap-3 py-1 px-2 rounded-lg transition-all duration-500 hover:bg-white/5 max-w-fit">
                    <div className="relative perspective-normal shrink-0">
                        <div className="relative w-8 h-8 transition-all duration-700 transform-3d group-hover:transform-[rotateX(20deg)_rotateY(-20deg)]">
                            <div className="absolute inset-0 bg-slate-900 border border-cyan-500/40 rounded-lg transform-[translateZ(10px)] flex items-center justify-center overflow-hidden">
                                <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full shadow-[0_0_8px_#22d3ee]" />
                            </div>
                            <div className="absolute inset-0 bg-slate-800 border border-slate-700 rounded-lg transform-[translateZ(-5px)_translateX(5px)_rotateY(90deg)]" />
                        </div>
                    </div>
                    <div className="flex flex-col -space-y-1">
                        <div className="flex items-center gap-1.5">
                            <span className="text-xl font-black text-white tracking-tighter group-hover:text-cyan-400 transition-colors uppercase">
                                {firstText}
                            </span>
                            <span className="text-[8px] font-mono font-bold text-cyan-500/70 uppercase">
                                v4.0
                            </span>
                        </div>
                        <span className="text-[6px] font-bold text-slate-500 uppercase tracking-widest group-hover:text-slate-300 transition-colors">
                            {title}
                        </span>
                    </div>
                </Link>
            );
        default:
            return (
                <Link href={path} className="group relative flex items-center gap-8 py-4 px-6 rounded-3xl transition-all duration-500 hover:bg-white/3">
                    <div className="relative perspective-[1000px] shrink-0">
                        <div className="relative w-14 h-14 transition-all duration-700 transform-3d group-hover:transform-[rotateX(25deg)_rotateY(-25deg)_rotateZ(10deg)]">
                            <div className="absolute inset-0 bg-slate-900 border border-cyan-500/30 rounded-xl transform-[translateZ(20px)] flex items-center justify-center overflow-hidden shadow-2xl">
                                <div className="w-6 h-6 bg-cyan-500 rounded-full blur-md animate-pulse opacity-50" />
                                <div className="absolute w-3 h-3 bg-cyan-400 rounded-full shadow-[0_0_15px_#22d3ee]" />
                                <div className="absolute top-0 left-0 w-full h-1 bg-cyan-500/50 -translate-y-full group-hover:animate-[scan_2s_linear_infinite]" />
                            </div>
                            <div className="absolute inset-0 bg-slate-800 border border-slate-700 rounded-xl transform-[translateZ(-10px)_translateX(10px)_rotateY(90deg)] shadow-inner" />
                            <div className="absolute inset-0 bg-black/40 blur-xl rounded-full transform-[translateZ(-30px)_translateY(20px)] opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                        </div>
                    </div>
                    <div className="flex flex-col gap-1">
                        <div className="flex items-baseline gap-2">
                            <h1 className="text-3xl font-black text-white tracking-tighter transition-all duration-500 group-hover:text-cyan-400">
                                {firstText}
                            </h1>
                            <span className="text-xs font-mono font-bold text-slate-500 uppercase tracking-widest bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                                v4.0
                            </span>
                        </div>

                        <div className="flex flex-col">
                            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.4em] group-hover:text-white transition-colors duration-500">
                                {title}
                            </span>
                            <div className="relative mt-2 h-1 w-48 bg-slate-800 rounded-full overflow-hidden">
                                <div className="absolute inset-y-0 left-0 w-full bg-linear-to-r from-cyan-500 via-blue-600 to-cyan-500 -translate-x-full group-hover:translate-x-0 transition-transform duration-1000 ease-in-out" />
                            </div>
                        </div>
                    </div>
                    <div className="absolute -right-2 top-0 opacity-0 group-hover:opacity-100 transition-all duration-1000 group-hover:translate-x-4">
                        <div className="flex flex-col gap-2">
                            <div className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-ping" />
                            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-ping [animation-delay:0.2s]" />
                            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping [animation-delay:0.4s]" />
                        </div>
                    </div>
                </Link>
            );
    }
};

export default RajeBrandLogo;
