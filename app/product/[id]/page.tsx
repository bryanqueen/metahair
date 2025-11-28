import { connectDB } from "@/lib/db"
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
  params: {
    id: string
  }
}

// Revalidate the page every 60 seconds
export const revalidate = 60

export default async function ProductPage({ params }: ProductPageProps) {
  await connectDB()

  let product: IPopulatedProduct | null = null
  try {
    product = await Product.findById(params.id).populate("category").lean() as unknown as IPopulatedProduct
  } catch (error) {
    // This can happen if the ID is not a valid MongoDB ObjectId
    notFound()
  }

  if (!product) {
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
