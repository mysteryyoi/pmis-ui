import { useEffect, useRef } from "react";
import { X } from "lucide-react";

export default function Modal({ open, onClose, title, children, wide = false }) {
    const overlayRef = useRef(null);

    useEffect(() => {
        const handleEsc = (e) => e.key === "Escape" && onClose?.();
        if (open) document.addEventListener("keydown", handleEsc);
        return () => document.removeEventListener("keydown", handleEsc);
    }, [open, onClose]);

    if (!open) return null;

    return (
        <div
            ref={overlayRef}
            onClick={(e) => e.target === overlayRef.current && onClose?.()}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in"
        >
            <div className={`bg-panel border border-white/10 rounded-2xl shadow-2xl shadow-black/40
                       ${wide ? "w-[90vw] max-w-5xl" : "w-full max-w-2xl"} max-h-[85vh] flex flex-col
                       animate-slide-up`}>
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
                    <h2 className="text-lg font-semibold">{title}</h2>
                    <button onClick={onClose} className="p-1 rounded-lg hover:bg-white/10 transition-colors">
                        <X size={18} className="text-gray-400" />
                    </button>
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto p-6">{children}</div>
            </div>
        </div>
    );
}
