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
                <Link href={path} className="group relative flex items-center gap-6 py-2 px-4 rounded-2xl transition-all duration-500 hover:bg-muted">
                    <div className="relative">
                        <div className="absolute inset-0 rounded-full border-2 border-dashed border-brand/20 group-hover:border-brand/50 group-hover:rotate-180 transition-all duration-1000" />

                        <div className="relative w-14 h-14 flex items-center justify-center bg-card rounded-2xl border border-border shadow-2xl transition-all duration-500 group-hover:-translate-y-2 group-hover:shadow-brand/20 group-hover:border-brand/50">

                            <div className="absolute inset-0 rounded-2xl overflow-hidden">
                                <div className="absolute inset-0 bg-linear-to-tr from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                            </div>

                            <div className="relative z-10 flex items-center justify-center">
                                <div className="w-4 h-4 bg-brand rounded-full shadow-[0_0_20px_var(--color-brand)] animate-pulse" />

                                <div className="absolute w-8 h-8 border border-border rounded-full animate-[spin_4s_linear_infinite]" />
                                <div className="absolute top-0 w-2 h-2 bg-info rounded-full shadow-[0_0_8px_var(--color-info)] animate-[ping_3s_ease-in-out_infinite]" />
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col">
                        <div className="flex items-center gap-1">
                            <span className="text-2xl font-black text-foreground tracking-tighter transition-all duration-500 group-hover:tracking-normal group-hover:text-brand">
                                {firstText || "RAJENDRA"}
                            </span>
                            <span className="text-2xl font-light text-muted-foreground">
                                {secondText || "P"}.
                            </span>
                        </div>

                        <div className="mt-1 w-full h-1 bg-muted rounded-full overflow-hidden">
                            <div className="h-full w-0 group-hover:w-full bg-linear-to-r from-brand via-info to-brand transition-all duration-700 ease-out" />
                        </div>

                        <span className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground mt-1.5 font-bold group-hover:text-foreground transition-colors">
                            {title}
                        </span>
                    </div>

                    <div className="absolute -inset-1 bg-linear-to-r from-brand to-info rounded-2xl blur-xl opacity-0 group-hover:opacity-10 transition-opacity duration-500" />
                </Link>
            );
        case "type2":
            return (
                <div className="flex items-center gap-4 group cursor-pointer">
                    <div className="relative">
                        <div className="w-9 h-9 rounded-full border-2 border-border flex items-center justify-center group-hover:border-brand/50 transition-all duration-500 group-hover:rotate-180">

                            <div className="w-2 h-2 bg-brand rounded-full shadow-[0_0_15px_var(--color-brand)]" />
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-info rounded-full" />
                        </div>
                    </div >

                    <span className="font-extrabold text-2xl tracking-tighter text-foreground italic">
                        {firstText}<span className="text-brand">.</span>{secondText}
                    </span>
                </div >
            );
        case "type3":
            return (
                <Link href={path} className="group relative flex items-center gap-8 py-2 px-4 rounded-[2.5rem] transition-all duration-700 hover:bg-muted/60">
                    <div className="relative h-16 w-20 perspective-distant shrink-0">
                        <div className="relative h-full w-full transform-3d transition-transform duration-1000 ease-out 
                        group-hover:rotate-x-12 group-hover:-rotate-y-12 group-hover:scale-110">
                            <div className="absolute inset-0 bg-success/10 border-2 border-success/20 rounded-2xl blur-[1px] 
                            -translate-z-10 group-hover:-translate-z-16 transition-all duration-700" />
                            <div className="absolute inset-0 bg-card/90 border border-border rounded-2xl shadow-2xl overflow-hidden
                            translate-z-4 group-hover:translate-z-8 transition-all duration-700 delay-75">
                                <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent,color-mix(in_oklab,var(--color-brand)_5%,transparent)_50%,transparent)] group-hover:animate-[scan_3s_linear_infinite]" />
                                <div className="flex items-center justify-center h-full">
                                    <div className="w-10 h-px bg-border rotate-45 absolute" />
                                    <div className="w-10 h-px bg-border -rotate-45 absolute" />
                                </div>
                            </div>
                            <div className="absolute inset-2 bg-brand/10 backdrop-blur-md border border-brand/40 rounded-xl flex items-center justify-center
                            translate-z-16 group-hover:translate-z-24 transition-all duration-700 delay-150">
                                <div className="relative">
                                    <div className="w-4 h-4 bg-brand rounded-full shadow-[0_0_20px_var(--color-brand)] animate-pulse" />
                                    <div className="absolute -inset-2 border border-brand/30 rounded-full animate-spin-slow" />
                                </div>
                            </div>
                        </div>
                        <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-16 h-4 bg-foreground/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                    </div>
                    <div className="flex flex-col relative">
                        <div className="flex items-center gap-2">
                            <h1 className="text-3xl uppercase font-black italic tracking-tighter text-foreground transition-all duration-500 group-hover:text-brand group-hover:-skew-x-6">
                                {firstText || "RP"}<span className="uppercase text-muted-foreground group-hover:text-foreground">.</span>{secondText || "DEV"}
                            </h1>
                            <span className="bg-brand/10 text-brand text-[10px] font-bold px-2 py-1 rounded-md border border-brand/20 uppercase tracking-widest">
                                {currYr}
                            </span>
                        </div>
                        <div className="flex items-center gap-2 mt-2">
                            <div className="flex gap-1">
                                {[0, 1, 2].map((i) => (
                                    <div key={i} className="w-2 h-2 rounded-full bg-muted group-hover:bg-brand transition-all duration-500"
                                        style={{ transitionDelay: `${i * 100}ms` }} />
                                ))}
                            </div>
                            <span className="text-[8px] font-mono font-bold text-muted-foreground uppercase tracking-[0.3em] group-hover:text-foreground transition-colors">
                                {title || "MERN Stack Architect"}
                            </span>
                        </div>
                        <div className="mt-3 w-full h-0.5 bg-muted rounded-full overflow-hidden">
                            <div className="h-full w-full bg-linear-to-r from-brand via-info to-success -translate-x-full group-hover:translate-x-0 transition-transform duration-1000 ease-in-out" />
                        </div>
                    </div>
                </Link>
            );

        case "mini":
            return (
                <Link href={path} className="group relative flex items-center gap-3 py-1 px-2 rounded-lg transition-all duration-500 hover:bg-muted max-w-fit">
                    <div className="relative perspective-normal shrink-0">
                        <div className="relative w-8 h-8 transition-all duration-700 transform-3d group-hover:transform-[rotateX(20deg)_rotateY(-20deg)]">
                            <div className="absolute inset-0 bg-muted border border-brand/40 rounded-lg transform-[translateZ(10px)] flex items-center justify-center overflow-hidden">
                                <div className="w-1.5 h-1.5 bg-brand rounded-full shadow-[0_0_8px_var(--color-brand)]" />
                            </div>
                            <div className="absolute inset-0 bg-muted border border-border rounded-lg transform-[translateZ(-5px)_translateX(5px)_rotateY(90deg)]" />
                        </div>
                    </div>
                    <div className="flex flex-col -space-y-1">
                        <div className="flex items-center gap-1.5">
                            <span className="text-xl font-black text-foreground tracking-tighter group-hover:text-brand transition-colors uppercase">
                                {firstText}
                            </span>
                            <span className="text-[8px] font-mono font-bold text-brand/70 uppercase">
                                v4.0
                            </span>
                        </div>
                        <span className="text-[6px] font-bold text-muted-foreground uppercase tracking-widest group-hover:text-foreground transition-colors">
                            {title}
                        </span>
                    </div>
                </Link>
            );
        default:
            return (
                <Link href={path} className="group relative flex items-center gap-8 py-4 px-6 rounded-3xl transition-all duration-500 hover:bg-muted/40">
                    <div className="relative perspective-[1000px] shrink-0">
                        <div className="relative w-14 h-14 transition-all duration-700 transform-3d group-hover:transform-[rotateX(25deg)_rotateY(-25deg)_rotateZ(10deg)]">
                            <div className="absolute inset-0 bg-card border border-brand/30 rounded-xl transform-[translateZ(20px)] flex items-center justify-center overflow-hidden shadow-2xl">
                                <div className="w-6 h-6 bg-brand rounded-full blur-md animate-pulse opacity-50" />
                                <div className="absolute w-3 h-3 bg-brand rounded-full shadow-[0_0_15px_var(--color-brand)]" />
                                <div className="absolute top-0 left-0 w-full h-1 bg-brand/50 -translate-y-full group-hover:animate-[scan_2s_linear_infinite]" />
                            </div>
                            <div className="absolute inset-0 bg-muted border border-border rounded-xl transform-[translateZ(-10px)_translateX(10px)_rotateY(90deg)] shadow-inner" />
                            <div className="absolute inset-0 bg-foreground/20 blur-xl rounded-full transform-[translateZ(-30px)_translateY(20px)] opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                        </div>
                    </div>
                    <div className="flex flex-col gap-1">
                        <div className="flex items-baseline gap-2">
                            <h1 className="text-3xl font-black text-foreground tracking-tighter transition-all duration-500 group-hover:text-brand">
                                {firstText}
                            </h1>
                            <span className="text-xs font-mono font-bold text-muted-foreground uppercase tracking-widest bg-muted px-2 py-0.5 rounded border border-border">
                                v4.0
                            </span>
                        </div>

                        <div className="flex flex-col">
                            <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-[0.4em] group-hover:text-foreground transition-colors duration-500">
                                {title}
                            </span>
                            <div className="relative mt-2 h-1 w-48 bg-muted rounded-full overflow-hidden">
                                <div className="absolute inset-y-0 left-0 w-full bg-linear-to-r from-brand via-info to-brand -translate-x-full group-hover:translate-x-0 transition-transform duration-1000 ease-in-out" />
                            </div>
                        </div>
                    </div>
                    <div className="absolute -right-2 top-0 opacity-0 group-hover:opacity-100 transition-all duration-1000 group-hover:translate-x-4">
                        <div className="flex flex-col gap-2">
                            <div className="w-1.5 h-1.5 bg-brand rounded-full animate-ping" />
                            <div className="w-1.5 h-1.5 bg-info rounded-full animate-ping [animation-delay:0.2s]" />
                            <div className="w-1.5 h-1.5 bg-success rounded-full animate-ping [animation-delay:0.4s]" />
                        </div>
                    </div>
                </Link>
            );
    }
};

export default RajeBrandLogo;
