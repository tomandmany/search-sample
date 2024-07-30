// app/components/TableColumn.tsx
import { ReactNode } from "react";

type TableColumnProps = {
    children: ReactNode;
    className?: string;
}

export default function TableColumn({ children, className }: TableColumnProps) {
    return (
        <div className={`min-w-max border-r last:border-r-0 ${className}`}>
            {children}
        </div>
    )
}
