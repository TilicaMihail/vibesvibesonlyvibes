// Hand-drawn stroke-style SVG doodles — fill="none", stroke-based, organic feel.
// Each accepts className and style for size + color control.

import React from 'react'

interface DoodleProps {
  className?: string
  style?: React.CSSProperties
}

export function BookDoodle({ className = '', style }: DoodleProps) {
  return (
    <svg viewBox="0 0 80 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} style={style}>
      <path d="M40 56 C40 56 8 52 6 10 C6 10 24 6 40 14" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M40 56 C40 56 72 52 74 10 C74 10 56 6 40 14" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M40 14 L40 56" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <path d="M16 22 C22 20 30 20 38 22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.6"/>
      <path d="M16 30 C22 28 30 28 38 30" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.6"/>
      <path d="M16 38 C22 36 30 36 38 38" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.6"/>
      <path d="M42 22 C50 20 58 20 64 22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.6"/>
      <path d="M42 30 C50 28 58 28 64 30" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.6"/>
      <path d="M42 38 C50 36 58 36 64 38" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.6"/>
    </svg>
  )
}

export function PencilDoodle({ className = '', style }: DoodleProps) {
  return (
    <svg viewBox="0 0 48 80" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} style={style}>
      <path d="M14 12 L34 12 L34 62 L24 74 L14 62 Z" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M14 62 L34 62" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <path d="M18 12 L18 62" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.4"/>
      <path d="M30 12 L30 62" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.4"/>
      <path d="M14 20 L34 20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.5"/>
      <rect x="16" y="8" width="16" height="6" rx="2" stroke="currentColor" strokeWidth="2" fill="none"/>
    </svg>
  )
}

export function StarDoodle({ className = '', style }: DoodleProps) {
  return (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} style={style}>
      <path d="M32 6 C32 6 34 22 48 22" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
      <path d="M32 6 C32 6 30 22 16 22" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
      <path d="M16 22 C16 22 26 32 20 46" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
      <path d="M20 46 C20 46 32 38 44 46" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
      <path d="M44 46 C44 46 38 32 48 22" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
    </svg>
  )
}

export function GradCapDoodle({ className = '', style }: DoodleProps) {
  return (
    <svg viewBox="0 0 80 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} style={style}>
      <path d="M40 12 L72 26 L40 40 L8 26 Z" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M20 33 L20 52 C20 52 30 60 40 60 C50 60 60 52 60 52 L60 33" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M72 26 L72 40" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
      <circle cx="72" cy="44" r="3" stroke="currentColor" strokeWidth="2"/>
    </svg>
  )
}

export function LightbulbDoodle({ className = '', style }: DoodleProps) {
  return (
    <svg viewBox="0 0 56 80" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} style={style}>
      <path d="M28 8 C16 8 8 18 8 28 C8 36 14 42 18 46 L18 56 L38 56 L38 46 C42 42 48 36 48 28 C48 18 40 8 28 8 Z" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M20 56 L36 56" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <path d="M22 62 L34 62" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <path d="M26 68 L30 68" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <path d="M22 34 C22 34 24 30 28 30 C32 30 34 34 34 34" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.6"/>
      <path d="M28 24 L28 20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.5"/>
      <path d="M18 30 L14 28" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.5"/>
      <path d="M38 30 L42 28" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.5"/>
    </svg>
  )
}

export function CheckDoodle({ className = '', style }: DoodleProps) {
  return (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} style={style}>
      <path d="M10 34 C10 34 22 46 26 50 C26 50 38 28 54 16" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

export function ArrowDoodle({ className = '', style }: DoodleProps) {
  return (
    <svg viewBox="0 0 80 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} style={style}>
      <path d="M8 30 C8 30 20 8 48 24 C56 28 60 32 68 24" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
      <path d="M60 16 L68 24 L58 30" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

export function CircleDoodle({ className = '', style }: DoodleProps) {
  return (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} style={style}>
      <path d="M32 8 C48 8 56 18 56 32 C56 46 46 56 32 56 C18 56 8 46 8 32 C8 20 16 10 28 8" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
    </svg>
  )
}
