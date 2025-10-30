import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { ChevronLeft, ChevronRight, ShoppingCart } from "lucide-react"
import { HomeClient } from "./home-client"
import { connectDB } from "@/lib/db"
import { Product } from "@/models/product"
import { Category } from "@/models/category"

interface ProductData {
  _id: string
  name: string
  price: number
  category: {
    _id: string
    name: string
    image: string
  }
  images: string[]
  stock: number
  featured: boolean
  createdAt: string
}

interface Collection {
  _id: string
  name: string
  image: string
  productCount: number
}

const heroImages = [
  "/metamodel3.jpeg",
  "/metamodel4.jpeg",
  "/meta-model1.jpeg",
  "/metamodel2.jpeg",
]

// Export the revalidation time for this page
export const revalidate = 60 // Revalidate every 60 seconds

export default async function Home() {
  // Fetch data on the server
  await connectDB()
        
        // Fetch new arrivals (latest products)
  const newArrivalsData = await Product.find()
    .sort({ createdAt: -1 })
    .limit(4)
    .populate("category", "name image")
    .lean()

        // Fetch featured products
  const featuredData = await Product.find({ featured: true })
    .sort({ createdAt: -1 })
    .limit(4)
    .populate("category", "name image")
    .lean()

  // Fetch categories
  const categoriesData = await Category.find().lean()
        
        // Get product count for each category
        const collectionsWithCounts = await Promise.all(
          categoriesData.map(async (category: any) => {
      const categoryId = typeof category._id === 'string' ? category._id : category._id.toString()
      const count = await Product.countDocuments({ category: categoryId })
            return {
        _id: categoryId,
              name: category.name,
              image: category.image,
        productCount: count,
      }
    })
  )

  const newArrivalsProducts = JSON.parse(JSON.stringify(newArrivalsData))
  const featuredProducts = JSON.parse(JSON.stringify(featuredData))
  const collections = JSON.parse(JSON.stringify(collectionsWithCounts))

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero Section with Morphing Background */}
      <section className="relative h-[60vh] md:h-[80vh] overflow-hidden">
        {/* Background Images with Morphing Effect */}
        {heroImages.map((image, index) => (
          <div
            key={index}
            data-hero-image={index}
            className="absolute inset-0 transition-opacity duration-2000"
            style={{ opacity: index === 0 ? 1 : 0 }}
          >
            <img src={image || "/placeholder.svg"} alt={`Hero ${index + 1}`} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/40" />
          </div>
        ))}

        {/* Hero Image Indicators */}
        <div className="absolute bottom-6 md:bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {heroImages.map((_, index) => (
            <button
              key={index}
              data-hero-indicator={index}
              className="w-2 h-2 transition-all bg-white/50 hover:bg-white"
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

        {/* Hero Content */}
        <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-4">
          <h1 className="font-serif text-4xl md:text-7xl text-white mb-4 md:mb-6 text-balance">Slay Beyond Limit</h1>
          <Link href="/shop">
            <Button className="bg-[#D4A574] text-black hover:bg-[#C49564] px-8 md:px-12 py-4 md:py-6 text-sm md:text-lg font-sans">
              Shop Now
            </Button>
          </Link>
        </div>
      </section>

      {/* Client component handles all the dynamic parts */}
      <HomeClient 
        newArrivalsProducts={newArrivalsProducts}
        featuredProducts={featuredProducts}
        collections={collections}
      />
    </div>
  )
}