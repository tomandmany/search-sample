import Link from "next/link";

export default function Header() {
    return (
        <header className="py-8 px-20 border-b-2 sticky top-0 bg-white space-x-10">
            <Link href={"/programs"} className="hover:bg-slate-200 p-2 rounded transition">
                企画管理テーブル
            </Link>
            <Link href={"/participants"} className="hover:bg-slate-200 p-2 rounded transition">
                団体管理テーブル
            </Link>
        </header>
    )
}