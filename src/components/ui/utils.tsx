import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export const Button = ({ className, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) => (
    <button
        className={cn(
            "px-4 py-2 rounded-lg font-medium transition-all duration-200 active:scale-95",
            "bg-blue-600 text-white hover:bg-blue-700 shadow-md hover:shadow-lg",
            "disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100",
            className
        )}
        {...props}
    />
);

export const Card = ({ className, children }: { className?: string, children: React.ReactNode }) => (
    <div className={cn("bg-white rounded-xl border border-slate-200 shadow-sm", className)}>
        {children}
    </div>
);
