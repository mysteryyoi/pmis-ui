import { Search } from "lucide-react";

export default function FilterBar({ filters = [], searchPlaceholder = "Search...", searchValue, onSearchChange }) {
    return (
        <div className="flex flex-wrap items-center gap-3">
            {/* Search */}
            <div className="relative flex-1 min-w-[220px] max-w-sm">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                    type="text"
                    value={searchValue || ""}
                    onChange={(e) => onSearchChange?.(e.target.value)}
                    placeholder={searchPlaceholder}
                    className="w-full pl-9 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-gray-200 placeholder-gray-500
                     focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/25 transition-colors"
                />
            </div>

            {/* Dropdowns */}
            {filters.map(({ label, value, options, onChange }) => (
                <select
                    key={label}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className="px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-gray-200
                     focus:outline-none focus:border-primary/50 cursor-pointer appearance-none
                     bg-[url('data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2212%22%20height%3D%2212%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%239ca3af%22%20stroke-width%3D%222%22%3E%3Cpath%20d%3D%22m6%209%206%206%206-6%22%2F%3E%3C%2Fsvg%3E')]
                     bg-no-repeat bg-[center_right_0.5rem] pr-7"
                >
                    <option value="" className="bg-gray-900">{label}</option>
                    {options.map((opt) => (
                        <option key={opt} value={opt} className="bg-gray-900">{opt}</option>
                    ))}
                </select>
            ))}
        </div>
    );
}
