import { connectDB } from "@/lib/db"
import { Product } from "@/models/product"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    await connectDB()

    const searchParams = request.nextUrl.searchParams
    const category = searchParams.get("category")
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "12")
    const sortParam = searchParams.get("sort") || "-createdAt"  // Default to newest first

    const query: any = {}
    if (category) {
      query.category = category
    }

    // Parse sort option with explicit typing
    let sortOptions: { [key: string]: 1 | -1 } = { createdAt: -1 }  // Default
    if (sortParam) {
      const field = sortParam.startsWith('-') ? sortParam.slice(1) : sortParam
      const order: 1 | -1 = sortParam.startsWith('-') ? -1 : 1
      sortOptions = { [field]: order }
    }

    const skip = (page - 1) * limit
    const products = await Product.find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(limit)
      .populate("category")
    const total = await Product.countDocuments(query)

    return NextResponse.json({
      products,
      total,
      pages: Math.ceil(total / limit),
      currentPage: page,
    })
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB()
    const data = await request.json()

    const product = new Product({
      name: data.name,
      description: data.description,
      shortDescription: data.shortDescription,
      price: data.price,
      category: data.category,
      images: data.images,
      stock: data.stock,
      featured: data.featured,
      isOnSale: !!data.isOnSale,
      discountPercent: data.discountPercent || 0,
      salePrice: data.salePrice,
      saleStart: data.saleStart,
      saleEnd: data.saleEnd,
    })

    await product.save()
    await product.populate("category")

    return NextResponse.json(product, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 })
  }
}