"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { collection, addDoc, onSnapshot, deleteDoc, doc, updateDoc } from "firebase/firestore"
import { db } from "@/src/firebase"
import type { StudySession } from "@/src/lib/types"

interface StudyContextType {
  studySessions: StudySession[]
  addStudySession: (studySession: Omit<StudySession, "id">) => Promise<void>
  deleteStudySession: (id: string) => Promise<void>
  updateStudySession: (id: string, studySession: Partial<StudySession>) => Promise<void>
  loading: boolean
}

const StudyContext = createContext<StudyContextType | undefined>(undefined)

export function StudyProvider({ children }: { children: React.ReactNode }) {
  const [studySessions, setStudySessions] = useState<StudySession[]>([])
  const [loading, setLoading] = useState(true)

  // Firestoreからリアルタイムでデータを取得
  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "studySessions"),
      (snapshot) => {
        const studySessionData: StudySession[] = []
        snapshot.forEach((doc) => {
          const data = doc.data()
          studySessionData.push({
            id: doc.id,
            date: data.date.toDate(), // FirestoreのTimestampをDateに変換
            type: data.type,
            subject: data.subject,
            nickname: data.nickname,
            studyMinutes: data.studyMinutes,
            memo: data.memo
          })
        })
        setStudySessions(studySessionData)
        setLoading(false)
      },
      (error) => {
        console.error("Error fetching study sessions:", error)
        setLoading(false)
      }
    )

    return () => unsubscribe()
  }, [])

  // Firestoreに新しい勉強セッションを追加
  const addStudySession = async (studySession: Omit<StudySession, "id">) => {
    try {
      console.log("Adding study session:", studySession);
      const docRef = await addDoc(collection(db, "studySessions"), {
        ...studySession,
        date: studySession.date // FirestoreはDate型を自動的にTimestampに変換
      });
      console.log("Study session added successfully with ID:", docRef.id);
    } catch (error) {
      console.error("Error adding study session:", error);
      console.error("Error details:", {
        message: error instanceof Error ? error.message : "Unknown error",
        code: (error as any)?.code,
        stack: error instanceof Error ? error.stack : undefined
      });
      throw error;
    }
  }

  // Firestoreから勉強セッションを削除
  const deleteStudySession = async (id: string) => {
    try {
      await deleteDoc(doc(db, "studySessions", id))
    } catch (error) {
      console.error("Error deleting study session:", error)
      throw error
    }
  }

  // Firestoreの勉強セッションを更新
  const updateStudySession = async (id: string, studySession: Partial<StudySession>) => {
    try {
      await updateDoc(doc(db, "studySessions", id), studySession)
    } catch (error) {
      console.error("Error updating study session:", error)
      throw error
    }
  }

  return (
    <StudyContext.Provider
      value={{
        studySessions,
        addStudySession,
        deleteStudySession,
        updateStudySession,
        loading,
      }}
    >
      {children}
    </StudyContext.Provider>
  )
}

export function useStudySessions() {
  const context = useContext(StudyContext)
  if (context === undefined) {
    throw new Error("useStudySessions must be used within a StudyProvider")
  }
  return context
}
