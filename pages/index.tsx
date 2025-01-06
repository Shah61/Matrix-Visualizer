// pages/index.tsx
'use client'

import MatrixVisualizer from '@/components/MatrixVisualizer'

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <MatrixVisualizer />
    </main>
  )
}