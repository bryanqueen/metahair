import { connectDB } from "@/lib/db"
import { Category } from "@/models/category"
import { type NextRequest, NextResponse } from "next/server"

export async function GET() {
  try {
    await connectDB()
    const categories = await Category.find().sort({ createdAt: -1 }).lean()
    return NextResponse.json(categories)
  } catch (error) {
    console.error('Error fetching categories:', error)
    return NextResponse.json(
      { error: "Failed to fetch categories", details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB()
    const data = await request.json()

    const category = new Category({
      name: data.name,
      image: data.image,
      // description: data.description,
    })

    await category.save()
    return NextResponse.json(category, { status: 201 })
  } catch (error) {
    console.error('Error creating category:', error)
    const errorMessage = error instanceof Error 
      ? `Failed to create category: ${error.message}`
      : "Failed to create category"
    return NextResponse.json(
      { error: errorMessage, details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
