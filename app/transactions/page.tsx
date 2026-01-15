"use client"

import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { db } from "@/lib/firebase"
import { collection, query, where, orderBy, onSnapshot, doc } from "firebase/firestore"
import { ChevronLeft, ChevronRight, ArrowUpRight, ArrowDownLeft, Wallet, Landmark, RefreshCw, Calendar, Search } from "lucide-react"
import Link from "next/link"

interface Transaction {
    id: string
    amount: number
    type: 'claim' | 'withdrawal'
    status: 'completed' | 'pending' | 'failed'
    createdAt: any
    description?: string
    upiId?: string
}

export default function TransactionsPage() {
    const { user, loading } = useAuth()
    const router = useRouter()
    const [transactions, setTransactions] = useState<Transaction[]>([])
    const [balance, setBalance] = useState(0)
    const [loadingData, setLoadingData] = useState(true)

    useEffect(() => {
        if (!loading && !user) {
            router.push("/")
        }
    }, [user, loading, router])

    useEffect(() => {
        if (!user) return

        // Sync Balance
        const userRef = doc(db, "users", user.uid)
        const unsubBalance = onSnapshot(userRef, (doc) => {
            if (doc.exists()) {
                setBalance(doc.data().wallet || 0)
            }
        })

        // Sync Transactions
        const q = query(
            collection(db, "transactions"),
            where("userId", "==", user.uid),
            orderBy("createdAt", "desc")
        )

        const unsubTransactions = onSnapshot(q, (snapshot) => {
            const txs = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as Transaction[]
            setTransactions(txs)
            setLoadingData(false)
        })

        return () => {
            unsubBalance()
            unsubTransactions()
        }
    }, [user])

    if (loading || !user) {
        return (
            <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center">
                <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin mb-6" />
                <h2 className="text-xl font-bold tracking-tight text-foreground/80">Loading history...</h2>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-[#F5F7F9] dark:bg-black pb-24 md:pb-12">
            {/* PhonePe Style Header */}
            <div className="bg-primary pt-12 pb-20 px-6 rounded-b-[2.5rem] shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -z-0" />

                <div className="relative z-10 flex items-center justify-between mb-8">
                    <Link href="/dashboard" className="p-2 bg-white/20 backdrop-blur-md rounded-xl text-white">
                        <ChevronLeft className="w-6 h-6" />
                    </Link>
                    <h1 className="text-white font-black uppercase tracking-widest text-lg">Transactions</h1>
                    <button className="p-2 bg-white/20 backdrop-blur-md rounded-xl text-white">
                        <RefreshCw className="w-5 h-5" />
                    </button>
                </div>

                <div className="relative z-10 text-center space-y-2">
                    <p className="text-white/70 text-xs font-bold uppercase tracking-widest">Total Balance</p>
                    <div className="flex items-center justify-center gap-2">
                        <span className="text-white/60 text-2xl font-bold">₹</span>
                        <span className="text-5xl font-black text-white tracking-tighter">
                            {balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </span>
                    </div>
                </div>
            </div>

            <div className="px-4 -mt-10 relative z-20">
                {/* Main Action Buttons */}
                <div className="grid grid-cols-1 gap-4 mb-8">
                    <Link
                        href="/transactions/withdraw"
                        className="flex items-center justify-between p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-xl active:scale-[0.98] transition-all group"
                    >
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center group-hover:bg-primary transition-colors">
                                <Landmark className="w-6 h-6 text-primary group-hover:text-white" />
                            </div>
                            <div className="space-y-0.5 text-left">
                                <p className="font-black text-foreground uppercase tracking-tight">Withdraw to Bank</p>
                                <p className="text-xs text-muted-foreground font-medium">Transfer funds via UPI ID</p>
                            </div>
                        </div>
                        <ChevronRight className="w-5 h-5 text-muted-foreground" />
                    </Link>
                </div>

                {/* Transaction History */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between px-2">
                        <h2 className="text-sm font-black text-foreground uppercase tracking-[0.2em]">History</h2>
                        <div className="p-2 bg-muted border border-border rounded-lg">
                            <Search className="w-4 h-4 text-muted-foreground" />
                        </div>
                    </div>

                    {loadingData ? (
                        <div className="space-y-3">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="h-24 bg-card/50 animate-pulse rounded-3xl border border-border" />
                            ))}
                        </div>
                    ) : transactions.length === 0 ? (
                        <div className="bg-card border border-border border-dashed rounded-[2.5rem] p-12 text-center space-y-4">
                            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto opacity-50">
                                <Wallet className="w-8 h-8" />
                            </div>
                            <p className="text-muted-foreground font-bold uppercase tracking-widest text-xs">No transactions yet</p>
                        </div>
                    ) : (
                        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2.5rem] overflow-hidden shadow-xl">
                            {transactions.map((tx, idx) => (
                                <div
                                    key={tx.id}
                                    className={`p-5 flex items-center justify-between ${idx !== transactions.length - 1 ? 'border-b border-slate-100 dark:border-slate-800' : ''}`}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${tx.type === 'claim' ? 'bg-green-500/10 text-green-500' : 'bg-primary/10 text-primary'
                                            }`}>
                                            {tx.type === 'claim' ? <ArrowDownLeft className="w-6 h-6" /> : <ArrowUpRight className="w-6 h-6" />}
                                        </div>
                                        <div className="space-y-0.5">
                                            <p className="font-black text-foreground uppercase tracking-tight text-sm">
                                                {tx.type === 'claim' ? 'Reward Claimed' : 'Withdrawal'}
                                            </p>
                                            <div className="flex items-center gap-2 text-[10px] text-muted-foreground font-bold uppercase tracking-tighter">
                                                <Calendar className="w-3 h-3" />
                                                {new Date(tx.createdAt?.toDate?.() || tx.createdAt).toLocaleDateString()}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className={`text-lg font-black tracking-tighter ${tx.type === 'claim' ? 'text-green-500' : 'text-foreground'
                                            }`}>
                                            {tx.type === 'claim' ? '+' : '-'}₹{tx.amount.toLocaleString()}
                                        </p>
                                        <p className={`text-[10px] font-black uppercase tracking-widest ${tx.status === 'completed' ? 'text-green-500/60' :
                                            tx.status === 'pending' ? 'text-amber-500/60' : 'text-red-500/60'
                                            }`}>
                                            {tx.status}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
