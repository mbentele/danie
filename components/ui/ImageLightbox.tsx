'use client'

import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import Image from 'next/image'
import { X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from 'lucide-react'

interface ImageLightboxProps {
  images: string[]
  isOpen: boolean
  currentIndex: number
  onClose: () => void
  onNavigate: (index: number) => void
  alt: string
}

export function ImageLightbox({
  images,
  isOpen,
  currentIndex,
  onClose,
  onNavigate,
  alt
}: ImageLightboxProps) {
  const [scale, setScale] = useState(1)
  const [isZoomed, setIsZoomed] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
      if (e.key === 'ArrowLeft' && currentIndex > 0) {
        onNavigate(currentIndex - 1)
        setScale(1)
        setIsZoomed(false)
      }
      if (e.key === 'ArrowRight' && currentIndex < images.length - 1) {
        onNavigate(currentIndex + 1)
        setScale(1)
        setIsZoomed(false)
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
      // Force highest z-index
      document.body.style.position = 'relative'
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
      document.body.style.position = ''
    }
  }, [isOpen, currentIndex, images.length, onClose, onNavigate])

  useEffect(() => {
    setScale(1)
    setIsZoomed(false)
  }, [currentIndex])

  if (!mounted || !isOpen) return null

  const currentImage = images[currentIndex]

  const handleZoomIn = () => {
    setScale(prev => Math.min(prev + 0.5, 3))
    setIsZoomed(true)
  }

  const handleZoomOut = () => {
    const newScale = Math.max(scale - 0.5, 1)
    setScale(newScale)
    if (newScale === 1) setIsZoomed(false)
  }

  const resetZoom = () => {
    setScale(1)
    setIsZoomed(false)
  }

  const lightboxContent = (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 2147483647, // Maximum possible z-index
        backgroundColor: 'rgba(0, 0, 0, 0.95)',
        backdropFilter: 'blur(8px)',
      }}
    >
      {/* Backdrop - Click to close */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          cursor: 'pointer'
        }}
        onClick={onClose}
      />

      {/* Lightbox Content */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '16px'
        }}
      >
        {/* Top Controls */}
        <div
          style={{
            position: 'absolute',
            top: '16px',
            left: 0,
            right: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingLeft: '24px',
            paddingRight: '24px',
            zIndex: 10
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            {/* Zoom Controls */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                backdropFilter: 'blur(8px)',
                borderRadius: '9999px',
                padding: '8px 16px'
              }}
            >
              <button
                onClick={handleZoomOut}
                disabled={scale <= 1}
                style={{
                  padding: '8px',
                  color: 'white',
                  backgroundColor: 'transparent',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: scale <= 1 ? 'not-allowed' : 'pointer',
                  opacity: scale <= 1 ? 0.5 : 1,
                  transition: 'color 0.2s'
                }}
                aria-label="Herauszoomen"
                onMouseOver={(e) => !e.currentTarget.disabled && (e.currentTarget.style.color = '#f9a8d4')}
                onMouseOut={(e) => !e.currentTarget.disabled && (e.currentTarget.style.color = 'white')}
              >
                <ZoomOut size={20} />
              </button>
              <span
                style={{
                  color: 'white',
                  fontSize: '14px',
                  fontWeight: 500,
                  minWidth: '48px',
                  textAlign: 'center'
                }}
              >
                {Math.round(scale * 100)}%
              </span>
              <button
                onClick={handleZoomIn}
                disabled={scale >= 3}
                style={{
                  padding: '8px',
                  color: 'white',
                  backgroundColor: 'transparent',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: scale >= 3 ? 'not-allowed' : 'pointer',
                  opacity: scale >= 3 ? 0.5 : 1,
                  transition: 'color 0.2s'
                }}
                aria-label="Hineinzoomen"
                onMouseOver={(e) => !e.currentTarget.disabled && (e.currentTarget.style.color = '#f9a8d4')}
                onMouseOut={(e) => !e.currentTarget.disabled && (e.currentTarget.style.color = 'white')}
              >
                <ZoomIn size={20} />
              </button>
            </div>
          </div>

          {/* Close Button */}
          <button
            onClick={onClose}
            style={{
              padding: '12px',
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              backdropFilter: 'blur(8px)',
              color: 'white',
              borderRadius: '9999px',
              border: 'none',
              cursor: 'pointer',
              transition: 'background-color 0.2s'
            }}
            aria-label="Schließen"
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.7)'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.5)'}
          >
            <X size={24} />
          </button>
        </div>

        {/* Navigation Buttons */}
        {images.length > 1 && currentIndex > 0 && (
          <button
            onClick={() => {
              onNavigate(currentIndex - 1)
              resetZoom()
            }}
            style={{
              position: 'absolute',
              left: '24px',
              top: '50%',
              transform: 'translateY(-50%)',
              zIndex: 10,
              padding: '12px',
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              backdropFilter: 'blur(8px)',
              color: 'white',
              borderRadius: '9999px',
              border: 'none',
              cursor: 'pointer',
              transition: 'background-color 0.2s'
            }}
            aria-label="Vorheriges Bild"
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.7)'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.5)'}
          >
            <ChevronLeft size={28} />
          </button>
        )}

        {images.length > 1 && currentIndex < images.length - 1 && (
          <button
            onClick={() => {
              onNavigate(currentIndex + 1)
              resetZoom()
            }}
            style={{
              position: 'absolute',
              right: '24px',
              top: '50%',
              transform: 'translateY(-50%)',
              zIndex: 10,
              padding: '12px',
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              backdropFilter: 'blur(8px)',
              color: 'white',
              borderRadius: '9999px',
              border: 'none',
              cursor: 'pointer',
              transition: 'background-color 0.2s'
            }}
            aria-label="Nächstes Bild"
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.7)'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.5)'}
          >
            <ChevronRight size={28} />
          </button>
        )}

        {/* Image Container */}
        <div
          style={{
            position: 'relative',
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: isZoomed ? 'zoom-out' : 'zoom-in'
          }}
          onClick={(e) => {
            e.stopPropagation()
            if (isZoomed) {
              resetZoom()
            } else {
              handleZoomIn()
            }
          }}
        >
          <div
            style={{
              position: 'relative',
              transform: `scale(${scale})`,
              maxWidth: '90vw',
              maxHeight: '80vh',
              transition: 'transform 0.3s ease-out'
            }}
          >
            <Image
              src={currentImage}
              alt={`${alt} - Bild ${currentIndex + 1}`}
              width={1200}
              height={1200}
              style={{
                maxWidth: '100%',
                maxHeight: '100%',
                objectFit: 'contain',
                borderRadius: '8px',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
              }}
              priority
            />
          </div>
        </div>

        {/* Bottom Info Bar */}
        <div
          style={{
            position: 'absolute',
            bottom: '24px',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 10
          }}
        >
          <div
            style={{
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              backdropFilter: 'blur(8px)',
              color: 'white',
              padding: '12px 24px',
              borderRadius: '9999px',
              display: 'flex',
              alignItems: 'center',
              gap: '16px'
            }}
          >
            {/* Image Counter */}
            {images.length > 1 && (
              <div style={{ fontSize: '14px', fontWeight: 500 }}>
                {currentIndex + 1} / {images.length}
              </div>
            )}

            {/* Image Title */}
            <div style={{ fontSize: '14px', color: '#d1d5db' }}>
              {alt}
            </div>
          </div>
        </div>

        {/* Thumbnail Strip for Multiple Images */}
        {images.length > 1 && (
          <div
            style={{
              position: 'absolute',
              bottom: '80px',
              left: '50%',
              transform: 'translateX(-50%)',
              zIndex: 10,
              maxWidth: '90vw',
              overflowX: 'auto'
            }}
          >
            <div
              style={{
                display: 'flex',
                gap: '8px',
                padding: '8px 16px',
                backgroundColor: 'rgba(0, 0, 0, 0.3)',
                backdropFilter: 'blur(8px)',
                borderRadius: '9999px'
              }}
            >
              {images.map((image, index) => (
                <button
                  key={index}
                  onClick={(e) => {
                    e.stopPropagation()
                    onNavigate(index)
                    resetZoom()
                  }}
                  style={{
                    position: 'relative',
                    width: '48px',
                    height: '48px',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    border: `2px solid ${
                      index === currentIndex ? '#f472b6' : 'rgba(255, 255, 255, 0.3)'
                    }`,
                    transform: index === currentIndex ? 'scale(1.1)' : 'scale(1)',
                    transition: 'all 0.2s',
                    cursor: 'pointer',
                    backgroundColor: 'transparent'
                  }}
                  onMouseOver={(e) => {
                    if (index !== currentIndex) {
                      e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.6)'
                    }
                  }}
                  onMouseOut={(e) => {
                    if (index !== currentIndex) {
                      e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.3)'
                    }
                  }}
                >
                  <Image
                    src={image}
                    alt={`Thumbnail ${index + 1}`}
                    fill
                    style={{ objectFit: 'cover' }}
                  />
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )

  // Use Portal to render at body level with maximum z-index
  return createPortal(lightboxContent, document.body)
}