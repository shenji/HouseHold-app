"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { collection, addDoc, onSnapshot, deleteDoc, doc, updateDoc } from "firebase/firestore"
import { db } from "@/src/firebase"
import type { Transaction } from "@/src/lib/types"

interface TransactionContextType {
  transactions: Transaction[]
  addTransaction: (transaction: Omit<Transaction, "id">) => Promise<void>
  deleteTransaction: (id: string) => Promise<void>
  updateTransaction: (id: string, transaction: Partial<Transaction>) => Promise<void>
  loading: boolean
}

const TransactionContext = createContext<TransactionContextType | undefined>(undefined)

export function TransactionProvider({ children }: { children: React.ReactNode }) {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)

  // Firestoreからリアルタイムでデータを取得
  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "transactions"),
      (snapshot) => {
        const transactionData: Transaction[] = []
        snapshot.forEach((doc) => {
          const data = doc.data()
          transactionData.push({
            id: doc.id,
            date: data.date.toDate(), // FirestoreのTimestampをDateに変換
            type: data.type,
            category: data.category,
            amount: data.amount,
            memo: data.memo
          })
        })
        setTransactions(transactionData)
        setLoading(false)
      },
      (error) => {
        console.error("Error fetching transactions:", error)
        setLoading(false)
      }
    )

    return () => unsubscribe()
  }, [])

  // Firestoreに新しいトランザクションを追加
  const addTransaction = async (transaction: Omit<Transaction, "id">) => {
    try {
      await addDoc(collection(db, "transactions"), {
        ...transaction,
        date: transaction.date // FirestoreはDate型を自動的にTimestampに変換
      })
    } catch (error) {
      console.error("Error adding transaction:", error)
      throw error
    }
  }

  // Firestoreからトランザクションを削除
  const deleteTransaction = async (id: string) => {
    try {
      await deleteDoc(doc(db, "transactions", id))
    } catch (error) {
      console.error("Error deleting transaction:", error)
      throw error
    }
  }

  // Firestoreのトランザクションを更新
  const updateTransaction = async (id: string, transaction: Partial<Transaction>) => {
    try {
      const docRef = doc(db, "transactions", id)
      const updateData: any = { ...transaction }
      if (transaction.date) {
        updateData.date = transaction.date
      }
      await updateDoc(docRef, updateData)
    } catch (error) {
      console.error("Error updating transaction:", error)
      throw error
    }
  }

  return (
    <TransactionContext.Provider 
      value={{ 
        transactions, 
        addTransaction, 
        deleteTransaction, 
        updateTransaction,
        loading 
      }}
    >
      {children}
    </TransactionContext.Provider>
  )
}

export function useTransactions() {
  const context = useContext(TransactionContext)
  if (!context) {
    throw new Error("useTransactions must be used within a TransactionProvider")
  }
  return context
}
