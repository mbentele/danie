'use client'

import { useState } from 'react'
import Image from 'next/image'
import { ImageLightbox } from '@/components/ui/ImageLightbox'

interface RecipeImagesProps {
  featuredImage?: string
  additionalImages: string[]
  title: string
}

export function RecipeImages({ featuredImage, additionalImages, title }: RecipeImagesProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  // Combine all images for the lightbox
  const allImages = featuredImage ? [featuredImage, ...additionalImages] : additionalImages

  const openLightbox = (index: number) => {
    setCurrentImageIndex(index)
    setLightboxOpen(true)
  }

  // Get the main image to display (featured image takes priority)
  const mainImage = featuredImage || (additionalImages.length > 0 ? additionalImages[0] : null)

  // Get remaining additional images (excluding the one used as main if featuredImage is missing)
  const remainingAdditionalImages = featuredImage
    ? additionalImages
    : additionalImages.slice(1)

  return (
    <>
      <div className="space-y-4">
        {/* Main Featured Image */}
        <div
          className="relative h-80 rounded-2xl overflow-hidden cursor-pointer group"
          onClick={() => {
            if (mainImage) {
              openLightbox(0)
            }
          }}
        >
          {mainImage ? (
            <Image
              src={mainImage}
              alt={title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-pink-100 to-orange-100 flex items-center justify-center">
              <div className="text-center">
                <p className="text-lg text-gray-600 font-hoss">
                  Kein Bild verfügbar
                </p>
              </div>
            </div>
          )}
          <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
        </div>

        {/* Additional Images */}
        {remainingAdditionalImages.length > 0 && (
          <div className="grid grid-cols-2 gap-4">
            {remainingAdditionalImages.slice(0, 2).map((imageUrl, index) => (
              <div
                key={index}
                className="relative h-32 rounded-xl overflow-hidden cursor-pointer group"
                onClick={() => {
                  const lightboxIndex = featuredImage ? index + 1 : index + 1
                  openLightbox(lightboxIndex)
                }}
              >
                <Image
                  src={imageUrl}
                  alt={`${title} - Bild ${index + 2}`}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  sizes="(max-width: 768px) 50vw, 25vw"
                />
                <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      <ImageLightbox
        images={allImages}
        isOpen={lightboxOpen}
        currentIndex={currentImageIndex}
        onClose={() => setLightboxOpen(false)}
        onNavigate={setCurrentImageIndex}
        alt={title}
      />
    </>
  )
}