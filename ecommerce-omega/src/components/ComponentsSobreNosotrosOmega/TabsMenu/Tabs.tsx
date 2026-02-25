"use client";

import { cn } from "@/utils/cn";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

type Tab = {
    title: string;
    value: string;
    link: string;
    logo: string;
    src: string;
    alt: string;
};

export const Tabs = ({
    tabs: propTabs,
    containerClassName,
    activeTabClassName,
    tabClassName,
    contentClassName,
}: {
    tabs: Tab[];
    containerClassName?: string;
    activeTabClassName?: string;
    tabClassName?: string;
    contentClassName?: string;
}) => {
    const [active, setActive] = useState<Tab>(propTabs[0]);
    const [tabs, setTabs] = useState<Tab[]>(propTabs);

    const moveSelectedTabToTop = (idx: number) => {
        const newTabs = [...propTabs];
        const selectedTab = newTabs.splice(idx, 1);
        newTabs.unshift(selectedTab[0]);
        setTabs(newTabs);
        setActive(newTabs[0]);
    };

    const [hovering, setHovering] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    // Detectar si la pantalla es móvil
    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth <= 768);
        checkMobile();
        window.addEventListener("resize", checkMobile);
        return () => window.removeEventListener("resize", checkMobile);
    }, []);

    return (
        <>
            <div
                className={cn(
                    "flex sm:flex-row items-center justify-center relative overflow-auto sm:overflow-visible  no-visible-scrollbar max-w-full w-full ",
                    containerClassName
                )}
            >
                {propTabs.map((tab, idx) => (
                    <button
                        key={idx}
                        onClick={() => {
                            moveSelectedTabToTop(idx);
                        }}
                        onMouseEnter={() => !isMobile && setHovering(true)}
                        onMouseLeave={() => !isMobile && setHovering(false)}
                        className={cn(
                            "relative px-4  rounded-full",
                            tabClassName
                        )}
                        style={{ transformStyle: "preserve-3d" }}
                    >
                        {active.value === tab.value && (
                            <motion.div
                                layoutId="clickedbutton"
                                transition={{
                                    type: "spring",
                                    bounce: 0.3,
                                    duration: 0.6,
                                }}
                                className={cn(
                                    "absolute inset-0 border-orange-500 rounded-full ",
                                    activeTabClassName
                                )}
                            />
                        )}
                        <span className="relative block">
                            <img
                                className="cursor-pointer justify-center align-middle h-[4rem] w-[4rem] sm:w-[6rem] sm:h-[6rem] rounded-full"
                                src={tab.logo}
                                alt={tab.title}
                            />
                        </span>
                    </button>
                ))}
            </div>
            <FadeInDiv
                tabs={tabs}
                active={active}
                hovering={!isMobile && hovering}
                className={cn("mt-[3rem] sm:mt-[7rem]", contentClassName)}
            />
        </>
    );
};

export const FadeInDiv = ({
    className,
    tabs,
    hovering,
}: {
    className?: string;
    key?: string;
    tabs: Tab[];
    active: Tab;
    hovering?: boolean;
}) => {
    const isActive = (tab: Tab) => {
        return tab.value === tabs[0].value;
    };

    return (
        <div>
            {tabs.map((tab, idx) => (
                <motion.div
                    key={tab.value}
                    layoutId={tab.value}
                    style={{
                        scale: 1 - idx * 0.1,
                        top: hovering ? idx * -50 : 0,
                        zIndex: -idx,
                        opacity: idx < 3 ? 1 - idx * 0.1 : 0,
                    }}
                    animate={{
                        y: isActive(tab) ? [0, 40, 0] : 0,
                    }}
                    className={cn(
                        "w-full h-full absolute top-0 left-0 ",
                        className
                    )}
                >
                    <div className="flex items-center justify-center w-full h-[29rem]">
                        <img
                            src={tab.src}
                            alt={tab.alt}
                            title={tab.title}
                            className="rounded-[2.5rem] sm:w-[80%]"
                        />
                    </div>
                </motion.div>
            ))}
        </div>
    );
};
