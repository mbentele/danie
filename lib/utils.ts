import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Clean WordPress shortcodes from text content
 */
export function cleanWordPressShortcodes(text: string | null | undefined): string {
  if (!text || typeof text !== 'string') return ''

  let cleaned = text

  // Remove et_pb shortcodes (Divi builder)
  cleaned = cleaned.replace(/\[et_pb_[^\]]*\]/g, '')
  cleaned = cleaned.replace(/\[\/et_pb_[^\]]*\]/g, '')

  // Remove other common WordPress shortcodes
  cleaned = cleaned.replace(/\[[^\]]+\]/g, '')

  // Remove HTML tags
  cleaned = cleaned.replace(/<[^>]*>/g, '')

  // Remove inline CSS styles and HTML artifacts
  cleaned = cleaned.replace(/\d+px;">/g, '')
  cleaned = cleaned.replace(/px;">/g, '')
  cleaned = cleaned.replace(/em;">/g, '')
  cleaned = cleaned.replace(/%;">/g, '')
  cleaned = cleaned.replace(/rem;">/g, '')
  cleaned = cleaned.replace(/style="[^"]*"/g, '')
  cleaned = cleaned.replace(/class="[^"]*"/g, '')

  // Remove HTML entities
  cleaned = cleaned.replace(/&nbsp;/g, ' ')
  cleaned = cleaned.replace(/&amp;/g, '&')
  cleaned = cleaned.replace(/&lt;/g, '<')
  cleaned = cleaned.replace(/&gt;/g, '>')
  cleaned = cleaned.replace(/&quot;/g, '"')
  cleaned = cleaned.replace(/&#\d+;/g, '')

  // Remove leftover HTML/CSS artifacts
  cleaned = cleaned.replace(/[>;"]/g, ' ')

  // Remove redundant/promotional phrases
  cleaned = cleaned.replace(/\bRezept von Danie\b/gi, '')
  cleaned = cleaned.replace(/\bvon Danie\b/gi, '')
  cleaned = cleaned.replace(/\bDanies?\s*(Rezept|Kitchen|Küche)\b/gi, '')
  cleaned = cleaned.replace(/\bein\s*(super|tolles|leckeres)\s*Rezept\s*von\s*Danie\b/gi, '')

  // Clean up extra whitespace and newlines
  cleaned = cleaned.replace(/\s+/g, ' ')
  cleaned = cleaned.replace(/\n\s*\n/g, '\n')
  cleaned = cleaned.trim()

  // Remove empty parentheses and brackets that might be left
  cleaned = cleaned.replace(/\(\s*\)/g, '')
  cleaned = cleaned.replace(/\[\s*\]/g, '')

  return cleaned
}

/**
 * Clean array of strings from WordPress shortcodes
 */
export function cleanArrayFromShortcodes(items: string[]): string[] {
  return items
    .map(item => cleanWordPressShortcodes(item))
    .filter(item => {
      const trimmed = item.trim()
      // Filter out empty items and items that are just single words or very short
      return trimmed.length > 0 &&
             trimmed.length > 10 &&
             !trimmed.match(/^(Tipp:?|Hinweis:?|Info:?|Anmerkung:?)$/i)
    })
}

/**
 * Extract nutrition information from recipe instructions
 */
export interface NutritionFacts {
  calories?: number
  protein?: number
  carbs?: number
  fat?: number
  servingNote?: string
}

export function extractNutritionFacts(instructions: string[]): {
  cleanInstructions: string[]
  nutrition: NutritionFacts
} {
  const cleanInstructions: string[] = []
  const nutrition: NutritionFacts = {}

  for (const instruction of instructions) {
    const cleanInstruction = instruction.toLowerCase().trim()
    let isNutritionInfo = false

    // Check for nutrition information
    if (cleanInstruction.includes('nährwerte') ||
        cleanInstruction.includes('pro portion') ||
        cleanInstruction.includes('pro stück')) {
      isNutritionInfo = true
      if (cleanInstruction.includes('pro portion')) {
        nutrition.servingNote = 'pro Portion'
      } else if (cleanInstruction.includes('pro stück')) {
        nutrition.servingNote = 'pro Stück'
      }
    }

    // Extract specific nutrition values
    if (cleanInstruction.includes('kalorien:') || cleanInstruction.includes('kcal')) {
      const calorieMatch = instruction.match(/(\d+)\s*kcal/i)
      if (calorieMatch) {
        nutrition.calories = parseInt(calorieMatch[1])
        isNutritionInfo = true
      }
    }

    if (cleanInstruction.includes('eiweiß:')) {
      const proteinMatch = instruction.match(/eiweiß:\s*(\d+(?:[.,]\d+)?)\s*g/i)
      if (proteinMatch) {
        nutrition.protein = parseFloat(proteinMatch[1].replace(',', '.'))
        isNutritionInfo = true
      }
    }

    if (cleanInstruction.includes('kohlenhydrate:')) {
      const carbsMatch = instruction.match(/kohlenhydrate:\s*(\d+(?:[.,]\d+)?)\s*g/i)
      if (carbsMatch) {
        nutrition.carbs = parseFloat(carbsMatch[1].replace(',', '.'))
        isNutritionInfo = true
      }
    }

    if (cleanInstruction.includes('fett:')) {
      const fatMatch = instruction.match(/fett:\s*(\d+(?:[.,]\d+)?)\s*g/i)
      if (fatMatch) {
        nutrition.fat = parseFloat(fatMatch[1].replace(',', '.'))
        isNutritionInfo = true
      }
    }

    // If not nutrition info and not empty, keep as instruction
    if (!isNutritionInfo && cleanInstruction.length > 0) {
      cleanInstructions.push(instruction)
    }
  }

  return { cleanInstructions, nutrition }
}