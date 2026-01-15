"use client"

import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { db } from "@/lib/firebase"
import { doc, getDoc, updateDoc, collection, addDoc, serverTimestamp } from "firebase/firestore"
import { ChevronLeft, Landmark, ShieldCheck, ArrowRight, AlertCircle, CheckCircle2, Loader2 } from "lucide-react"
import Link from "next/link"

export default function WithdrawalPage() {
    const { user, loading } = useAuth()
    const router = useRouter()
    const [balance, setBalance] = useState(0)
    const [amount, setAmount] = useState("")
    const [upiId, setUpiId] = useState("")
    const [isProcessing, setIsProcessing] = useState(false)
    const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')
    const [errorMessage, setErrorMessage] = useState("")

    useEffect(() => {
        if (!loading && !user) {
            router.push("/")
        }
    }, [user, loading, router])

    useEffect(() => {
        const fetchBalance = async () => {
            if (!user) return
            const userRef = doc(db, "users", user.uid)
            const userDoc = await getDoc(userRef)
            if (userDoc.exists()) {
                setBalance(userDoc.data().wallet || 0)
            }
        }
        fetchBalance()
    }, [user])

    const handleWithdraw = async () => {
        if (!user || isProcessing) return

        const withdrawAmount = parseFloat(amount)

        if (isNaN(withdrawAmount) || withdrawAmount <= 0) {
            setErrorMessage("Please enter a valid amount")
            setStatus('error')
            return
        }

        if (withdrawAmount > balance) {
            setErrorMessage("Insufficient balance")
            setStatus('error')
            return
        }

        if (!upiId.includes('@')) {
            setErrorMessage("Invalid UPI ID")
            setStatus('error')
            return
        }

        setIsProcessing(true)
        setStatus('idle')

        try {
            const userRef = doc(db, "users", user.uid)

            // Atomic deduction (simple version for this demo context)
            // Note: In real production, use a Firestore transaction or Cloud Function
            await updateDoc(userRef, {
                wallet: balance - withdrawAmount
            })

            // Add transaction record
            await addDoc(collection(db, "transactions"), {
                userId: user.uid,
                amount: withdrawAmount,
                type: 'withdrawal',
                status: 'completed',
                upiId: upiId,
                createdAt: serverTimestamp(),
                description: `Withdrawn to ${upiId}`
            })

            setStatus('success')
            setBalance(prev => prev - withdrawAmount)
        } catch (error) {
            console.error("Withdrawal error:", error)
            setErrorMessage("Transaction failed. Please try again.")
            setStatus('error')
        } finally {
            setIsProcessing(false)
        }
    }

    if (loading || !user) {
        return (
            <div className="min-h-screen bg-background flex flex-col items-center justify-center">
                <Loader2 className="w-12 h-12 text-primary animate-spin" />
            </div>
        )
    }

    if (status === 'success') {
        return (
            <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center animate-in zoom-in-95 duration-500">
                <div className="w-24 h-24 bg-green-500/10 rounded-full flex items-center justify-center mb-8">
                    <CheckCircle2 className="w-16 h-16 text-green-500" />
                </div>
                <h1 className="text-3xl font-black text-foreground uppercase tracking-tight mb-4">Transfer Successful</h1>
                <p className="text-muted-foreground font-medium mb-12 max-w-sm">
                    ₹{parseFloat(amount).toLocaleString()} has been sent to <br />
                    <span className="text-foreground font-bold">{upiId}</span>
                </p>
                <Link
                    href="/transactions"
                    className="w-full max-w-xs p-4 bg-primary text-primary-foreground font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
                >
                    Back to Wallet
                </Link>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-[#F5F7F9] dark:bg-black pb-12">
            {/* Header */}
            <div className="bg-white dark:bg-slate-900 px-6 pt-12 pb-6 border-b border-slate-200 dark:border-slate-800 flex items-center gap-4">
                <Link href="/transactions" className="p-2 bg-muted rounded-xl">
                    <ChevronLeft className="w-6 h-6 text-foreground" />
                </Link>
                <h1 className="font-black uppercase tracking-widest text-lg">Money Transfer</h1>
            </div>

            <div className="max-w-xl mx-auto p-4 sm:p-6 space-y-6">
                {/* Balance Display */}
                <div className="bg-primary p-6 rounded-[2rem] shadow-xl relative overflow-hidden">
                    <div className="relative z-10 flex items-center justify-between">
                        <div className="space-y-1">
                            <p className="text-white/70 text-[10px] font-black uppercase tracking-[0.2em]">Available Balance</p>
                            <p className="text-3xl font-black text-white tracking-tighter">₹{balance.toLocaleString()}</p>
                        </div>
                        <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
                            <Landmark className="w-6 h-6 text-white" />
                        </div>
                    </div>
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
                </div>

                {/* Input Form */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2.5rem] p-6 sm:p-8 shadow-xl space-y-8">
                    <div className="space-y-4">
                        <label className="block text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-2">Enter Amount</label>
                        <div className="relative">
                            <span className="absolute left-6 top-1/2 -translate-y-1/2 text-2xl font-black text-muted-foreground">₹</span>
                            <input
                                type="number"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                placeholder="0.00"
                                className="w-full bg-muted/50 border-2 border-transparent focus:border-primary focus:bg-white dark:focus:bg-black rounded-3xl p-6 pl-12 text-3xl font-black transition-all outline-none tracking-tighter"
                            />
                        </div>
                    </div>

                    <div className="space-y-4">
                        <label className="block text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-2">UPI ID (VPA)</label>
                        <div className="relative group">
                            <input
                                type="text"
                                value={upiId}
                                onChange={(e) => setUpiId(e.target.value)}
                                placeholder="username@bank"
                                className="w-full bg-muted/50 border-2 border-transparent focus:border-primary focus:bg-white dark:focus:bg-black rounded-3xl p-6 text-xl font-bold transition-all outline-none"
                            />
                            <div className="absolute right-6 top-1/2 -translate-y-1/2 w-8 h-8 bg-green-500/10 rounded-full flex items-center justify-center opacity-0 group-focus-within:opacity-100 transition-opacity">
                                <ShieldCheck className="w-5 h-5 text-green-500" />
                            </div>
                        </div>
                    </div>

                    {status === 'error' && (
                        <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
                            <AlertCircle className="w-5 h-5 text-red-500" />
                            <p className="text-sm font-bold text-red-500">{errorMessage}</p>
                        </div>
                    )}

                    <button
                        onClick={handleWithdraw}
                        disabled={isProcessing || !amount || !upiId}
                        className="w-full group relative flex items-center justify-between p-6 bg-primary disabled:bg-muted disabled:opacity-50 text-primary-foreground rounded-3xl shadow-xl shadow-primary/20 active:scale-[0.98] transition-all overflow-hidden"
                    >
                        <div className="flex flex-col items-start gap-1">
                            <span className="text-lg font-black uppercase tracking-widest">
                                {isProcessing ? "Processing..." : "Withdraw Funds"}
                            </span>
                            <span className="text-[10px] font-medium opacity-70">Instant Bank Transfer</span>
                        </div>
                        {isProcessing ? (
                            <Loader2 className="w-6 h-6 animate-spin" />
                        ) : (
                            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center transition-transform group-hover:translate-x-1">
                                <ArrowRight className="w-6 h-6" />
                            </div>
                        )}
                    </button>
                </div>

                {/* Info Card */}
                <div className="flex items-start gap-4 p-6 bg-amber-500/10 border border-amber-500/20 rounded-3xl">
                    <AlertCircle className="w-6 h-6 text-amber-500 flex-shrink-0" />
                    <div className="space-y-1">
                        <p className="text-sm font-black text-amber-600 dark:text-amber-400 uppercase tracking-tight">Security Alert</p>
                        <p className="text-xs text-muted-foreground font-medium leading-relaxed">
                            Ensure your UPI ID is correct. Funds transferred to a wrong ID cannot be recovered. EcoReward never asks for your PIN.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
