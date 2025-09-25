#!/usr/bin/env node

/**
 * Quick fix for broken featured images
 */

require('dotenv').config({ path: '.env.local' })
const { neon } = require('@neondatabase/serverless')

const sql = neon(process.env.DATABASE_URL)

// Working images from our validation
const WORKING_IMAGES = [
  "https://www.danie.de/wp-content/uploads/2021/01/IMG_2415-scaled.jpeg",
  "https://www.danie.de/wp-content/uploads/2020/07/4B3A1358-7014-48C7-9CB5-D22894D85567.jpeg",
  "https://www.danie.de/wp-content/uploads/2020/07/F9342A8A-4339-4854-AC19-B50CDA9B3D13.jpeg",
  "https://www.danie.de/wp-content/uploads/2021/09/IMG_2367-scaled-e1632937427342.jpeg",
  "https://www.danie.de/wp-content/uploads/2020/07/7A8200CF-79F9-4AF1-ABE1-83A286494769.jpeg",
  "https://www.danie.de/wp-content/uploads/2021/05/IMG_1351-scaled.jpeg",
  "https://www.danie.de/wp-content/uploads/2020/11/IMG_9789-scaled.jpg",
  "https://www.danie.de/wp-content/uploads/2021/08/IMG_0828-scaled.jpeg",
  "https://www.danie.de/wp-content/uploads/2020/06/84EDAAC5-B7FB-41F2-80BE-C7F8B6E20610.jpeg",
  "https://www.danie.de/wp-content/uploads/2022/03/IMG_1362-scaled.jpeg",
  "https://www.danie.de/wp-content/uploads/2021/01/IMG_3780-scaled.jpeg",
  "https://www.danie.de/wp-content/uploads/2020/05/5FE2F328-3DAE-4D22-859A-BDE48158C072.jpeg",
  "https://www.danie.de/wp-content/uploads/2021/03/IMG_7120-1024x1024.jpeg",
  "https://www.danie.de/wp-content/uploads/2020/11/A6025993-A651-4EE0-BBBB-A5C2264575B6.jpg",
  "https://www.danie.de/wp-content/uploads/2021/11/IMG_4363-scaled.jpeg",
  "https://www.danie.de/wp-content/uploads/2020/05/1AFC900A-6B81-4BD6-A368-338954101507.jpeg",
  "https://www.danie.de/wp-content/uploads/2020/06/FA83365B-DB86-45D5-B25C-AF5DAA642F6A.jpeg",
  "https://www.danie.de/wp-content/uploads/2022/03/IMG_1375-scaled.jpeg",
  "https://www.danie.de/wp-content/uploads/2021/01/IMG_2959-scaled.jpeg",
  "https://www.danie.de/wp-content/uploads/2020/09/1F946D52-1DD8-42B4-89A0-C7D1D61914FD.jpeg",
  "https://www.danie.de/wp-content/uploads/2020/05/30B74292-02FD-4F39-8B26-F5A517FCBFBB.jpeg",
  "https://www.danie.de/wp-content/uploads/2020/07/2F7C6B4A-6B87-43A0-AF12-1D80DCFED0DB.jpeg",
  "https://www.danie.de/wp-content/uploads/2020/12/IMG_1008-1024x1024.jpg",
  "https://www.danie.de/wp-content/uploads/2021/02/IMG_5015-scaled.jpeg",
  "https://www.danie.de/wp-content/uploads/2021/06/IMG_4414-scaled.jpeg",
  "https://www.danie.de/wp-content/uploads/2021/07/IMG_6910-scaled.jpeg",
  "https://www.danie.de/wp-content/uploads/2020/05/B2EAE478-22B4-4F0A-98CE-3990FEFF67EC.jpeg",
  "https://www.danie.de/wp-content/uploads/2020/05/3C119236-D2F8-4869-AE29-A6F409E18C5F.jpeg",
  "https://www.danie.de/wp-content/uploads/2020/10/30A9FA38-495B-43CC-8EAF-F1DD64FA7921.jpeg",
  "https://www.danie.de/wp-content/uploads/2020/05/0AB671D4-06C3-471B-AB12-04B40B248D1E.jpeg",
  "https://www.danie.de/wp-content/uploads/2022/05/IMG_5833-scaled.jpeg",
  "https://www.danie.de/wp-content/uploads/2020/11/IMG_9789-1024x1024.jpg",
  "https://www.danie.de/wp-content/uploads/2021/11/IMG_4918-scaled.jpeg",
  "https://www.danie.de/wp-content/uploads/2023/03/IMG_5934-scaled.jpeg",
  "https://www.danie.de/wp-content/uploads/2021/04/IMG_9542-1024x1024.jpeg",
  "https://www.danie.de/wp-content/uploads/2020/10/17CA3BDA-23F2-47AD-B9AB-93CBCAA2BABA.jpeg",
  "https://www.danie.de/wp-content/uploads/2024/03/IMG_6658-scaled-e1709460313781-1024x1024.jpg",
  "https://www.danie.de/wp-content/uploads/2021/11/IMG_4524-scaled.jpeg",
  "https://www.danie.de/wp-content/uploads/2020/11/7120DB03-048A-4D6B-B5C2-72714F56BC55.jpg",
  "https://www.danie.de/wp-content/uploads/2020/05/22985162-B3C4-47C7-A095-90D349FC61BB.jpeg",
  "https://www.danie.de/wp-content/uploads/2020/06/62DB93D1-426A-43E3-83D8-100C604F75D3.jpeg",
  "https://www.danie.de/wp-content/uploads/2022/07/IMG_0387-1024x1024.jpeg",
  "https://www.danie.de/wp-content/uploads/2021/09/IMG_2027-scaled.jpeg",
  "https://www.danie.de/wp-content/uploads/2023/11/IMG_0465-1024x1024.jpeg",
  "https://www.danie.de/wp-content/uploads/2022/11/IMG_9502-scaled.jpeg",
  "https://www.danie.de/wp-content/uploads/2020/08/EA210C71-0A84-44DB-89DE-743DAE4F36E8.jpeg",
  "https://www.danie.de/wp-content/uploads/2020/06/273F8E19-9B3B-4087-A3C5-0D8E1409E5D3.jpeg",
  "https://www.danie.de/wp-content/uploads/2021/07/IMG_7470-1024x1024.jpeg",
  "https://www.danie.de/wp-content/uploads/2020/05/F3BA5BA5-21D5-437D-9224-D24E5262CAB2.jpeg"
]

// Known broken images
const BROKEN_IMAGES = [
  "https://www.danie.de/wp-content/uploads/2020/05/IMG_4792-scaled.jpeg",
  "https://www.danie.de/wp-content/uploads/2020/05/IMG_5757-scaled.jpeg",
  "https://www.danie.de/wp-content/uploads/2020/05/IMG_4936-scaled.jpeg"
]

async function quickFixBrokenImages() {
  console.log('🔧 Quick Fix: Replacing Broken Images')
  console.log('====================================')

  let fixedCount = 0

  // Fix recipes with broken featured images
  for (const brokenUrl of BROKEN_IMAGES) {
    const recipesWithBrokenImage = await sql`
      SELECT id, title FROM recipes
      WHERE featured_image = ${brokenUrl}
    `

    if (recipesWithBrokenImage.length > 0) {
      const randomWorkingImage = WORKING_IMAGES[Math.floor(Math.random() * WORKING_IMAGES.length)]

      await sql`
        UPDATE recipes
        SET featured_image = ${randomWorkingImage}
        WHERE featured_image = ${brokenUrl}
      `

      fixedCount += recipesWithBrokenImage.length
      console.log(`✅ Fixed ${recipesWithBrokenImage.length} recipes with broken image: ${brokenUrl}`)
    }
  }

  // Also clear out any broken images in the images JSON field
  await sql`
    UPDATE recipes
    SET images = '[]'
    WHERE images LIKE '%IMG_4792-scaled.jpeg%'
    OR images LIKE '%IMG_5757-scaled.jpeg%'
    OR images LIKE '%IMG_4936-scaled.jpeg%'
  `

  console.log(`\n🎉 Quick fix completed!`)
  console.log(`🔧 Fixed ${fixedCount} recipes`)
  console.log(`✅ ${WORKING_IMAGES.length} working images available`)

  return fixedCount
}

async function main() {
  try {
    await quickFixBrokenImages()

    // Final verification
    const recipesWithBrokenImages = await sql`
      SELECT COUNT(*) as count FROM recipes
      WHERE featured_image IN (${BROKEN_IMAGES.join("', '")})
    `

    console.log(`\n📊 Verification: ${recipesWithBrokenImages[0].count} recipes still have broken images`)

  } catch (error) {
    console.error('❌ Process failed:', error)
    process.exit(1)
  }
}

if (require.main === module) {
  main()
}