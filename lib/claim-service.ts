import { db } from "./firebase"
import { doc, getDoc, runTransaction, collection, serverTimestamp } from "firebase/firestore"

export interface QRData {
  amount: number
  wasteType: "dry" | "wet"
  claimed: boolean
  claimedBy: string | null
}

export async function claimQRCode(
  qrId: string,
  userId: string,
): Promise<{
  success: boolean
  message: string
  amount?: number
}> {
  try {
    // Use transaction to ensure atomicity - prevents double-claiming
    const result = await runTransaction(db, async (transaction) => {
      const qrRef = doc(db, "qr_codes", qrId)
      const userRef = doc(db, "users", userId)

      // Read QR code
      const qrSnapshot = await transaction.get(qrRef)

      if (!qrSnapshot.exists()) {
        throw new Error("Invalid QR code")
      }

      const qrData = qrSnapshot.data() as QRData
      console.log("[v0] QR data retrieved:", qrData)

      // Check if already claimed
      if (qrData.claimed) {
        if (qrData.claimedBy === userId) {
          return {
            success: true,
            amount: qrData.amount,
            wasteType: qrData.wasteType,
            alreadyClaimed: true
          }
        }
        throw new Error("This reward has already been claimed")
      }

      // Read user data
      const userSnapshot = await transaction.get(userRef)
      if (!userSnapshot.exists()) {
        throw new Error("User not found")
      }

      const currentWallet = userSnapshot.data().wallet || 0
      const newWallet = currentWallet + qrData.amount

      // Update QR code to mark as claimed
      transaction.update(qrRef, {
        claimed: true,
        claimedBy: userId,
        claimedAt: new Date(),
      })
      console.log("[v0] QR marked as claimed")

      // Update user wallet
      transaction.update(userRef, {
        wallet: newWallet,
      })
      console.log("[v0] Wallet updated to:", newWallet)

      // Record transaction
      const txRef = doc(collection(db, "transactions"))
      transaction.set(txRef, {
        userId: userId,
        amount: qrData.amount,
        type: 'claim',
        status: 'completed',
        createdAt: serverTimestamp(),
        description: `Claimed ${qrData.wasteType} waste reward`
      })
      console.log("[v0] Transaction recorded")

      return {
        success: true,
        amount: qrData.amount,
        wasteType: qrData.wasteType,
      }
    })

    return {
      success: true,
      message: `Successfully claimed ₹${result.amount.toFixed(2)}!`,
      amount: result.amount,
    }
  } catch (error: any) {
    console.error("[v0] Claim error:", error.message)
    return {
      success: false,
      message: error.message || "Failed to claim reward",
    }
  }
}

export async function getQRCodeInfo(qrId: string): Promise<QRData | null> {
  try {
    const qrRef = doc(db, "qr_codes", qrId)
    const snapshot = await getDoc(qrRef)

    if (snapshot.exists()) {
      return snapshot.data() as QRData
    }
    return null
  } catch (error) {
    console.error("Error fetching QR code:", error)
    return null
  }
}
