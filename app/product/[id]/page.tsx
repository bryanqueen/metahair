import { connectDB } from "@/lib/db"
import mongoose from "mongoose"
import { Product } from "@/models/product"
import { notFound } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { ProductDetailsClient } from "./product-details-client"

interface IPopulatedProduct {
  _id: string;
  name: string;
  price: number;
  description: string;
  images: string[];
  stock: number;
  category: {
    _id: string;
    name: string;
  };
}

interface ProductPageProps {
  params: Promise<{
    id: string
  }>
}

// Use dynamic rendering for this page
export const dynamic = 'force-dynamic'

export default async function ProductPage(props: ProductPageProps) {
  try {
    await connectDB()
  } catch (error) {
    console.error('Database connection failed:', error)
    notFound()
  }

  const params = await props.params
  const productId = params.id

  // Add a guard clause to check for valid ObjectId format
  if (!mongoose.Types.ObjectId.isValid(productId)) {
    console.error('Invalid ObjectId format:', productId)
    notFound()
  }

  let product: IPopulatedProduct | null = null
  try {
    product = await Product.findById(productId).populate("category").lean() as unknown as IPopulatedProduct
  } catch (error) {
    console.error('Error fetching product:', error)
    notFound()
  }

  if (!product) {
    console.error('Product not found:', productId)
    notFound()
  }

  const relatedProducts = await Product.find({
    category: product.category._id,
    _id: { $ne: product._id }, // Exclude the current product
  })
    .limit(4)
    .populate("category")
    .lean()
  
  // Thelean object needs to be stringified and parsed to be passed to the client component
  const plainProduct = JSON.parse(JSON.stringify(product))
  const plainRelatedProducts = JSON.parse(JSON.stringify(relatedProducts))

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <ProductDetailsClient product={plainProduct} relatedProducts={plainRelatedProducts} />
      <Footer />
    </div>
  )
}
