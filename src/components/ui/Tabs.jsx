import { useState } from "react";

export default function Tabs({ tabs, defaultTab, onChange }) {
    const [active, setActive] = useState(defaultTab || tabs[0]);

    const handleClick = (tab) => {
        setActive(tab);
        onChange?.(tab);
    };

    return (
        <div className="flex gap-1 bg-white/5 rounded-lg p-1 w-fit">
            {tabs.map((tab) => (
                <button
                    key={tab}
                    onClick={() => handleClick(tab)}
                    className={[
                        "px-4 py-2 rounded-md text-sm font-medium transition-all duration-200",
                        active === tab
                            ? "bg-primary text-white shadow-lg shadow-primary/25"
                            : "text-gray-400 hover:text-gray-200 hover:bg-white/5",
                    ].join(" ")}
                >
                    {tab}
                </button>
            ))}
        </div>
    );
}
