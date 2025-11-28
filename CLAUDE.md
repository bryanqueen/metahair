# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

METAHAIR is a Next.js 15 e-commerce application for luxury wigs built with TypeScript, MongoDB, and Cloudinary for image management. The application uses the App Router architecture and includes both customer-facing pages and an admin dashboard.

## Development Commands

```bash
# Development server with Turbopack
npm run dev

# Build for production (with Turbopack)
npm run build

# Start production server
npm start
```

## Required Environment Variables

Create a `.env.local` file with the following variables:

```
MONGODB_URI=mongodb://localhost:27017/metahair  # or MongoDB Atlas URI
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

## Architecture Overview

### Database Layer
- **MongoDB with Mongoose**: Connection management in `lib/db.ts` uses a cached connection pattern to prevent connection pool exhaustion in serverless environments
- **Models** (`models/`): Product, Order, Category, ShippingMethod, AdminSettings
- Products have references to Categories via ObjectId
- Orders contain embedded product snapshots to preserve historical data

### Application Structure

**App Router Pages** (`app/`):
- Customer pages: `/`, `/shop`, `/product/[id]`, `/cart`, `/checkout`, `/checkout/success`
- Admin pages: `/admin/dashboard`, `/admin/products`, `/admin/shipping`, `/admin/settings`
- All admin routes are protected by `app/admin/layout.tsx` which checks authentication

**API Routes** (`app/api/`):
- RESTful endpoints for products, orders, categories, and shipping methods
- Admin authentication endpoints: `/api/admin/login`, `/api/admin/logout`, `/api/admin/session`
- Image upload: `/api/products/upload` (uses Cloudinary)
- Payment verification: `/api/paystack/verify`

### State Management

**Context Providers** (both wrapped in root layout):
- `CartProvider` (`lib/cart-context.tsx`): Client-side cart with localStorage persistence
- `AdminProvider` (`lib/admin-context.tsx`): Admin session management with cookie-based authentication

### Key Architectural Patterns

1. **Server/Client Component Split**: Server components handle data fetching and DB operations; client components handle interactivity
   - Example: `app/product/[id]/page.tsx` (server) fetches data and passes to `product-details-client.tsx` (client)

2. **Dynamic Route Params in Next.js 15**: All dynamic route params must be awaited:
   ```typescript
   export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
     const { id } = await params  // Must await params
     // ...
   }
   ```

3. **MongoDB ObjectId Validation**: Always validate ObjectId format before querying:
   ```typescript
   if (!mongoose.Types.ObjectId.isValid(id)) {
     notFound();
   }
   ```

4. **Lean Objects for Client Components**: When passing MongoDB documents to client components, use `.lean()` and JSON.parse/stringify to create plain objects

5. **Image Management**: Cloudinary handles all product images via `lib/cloudinary.ts` with upload and delete helpers

### Component Organization

- `components/`: Shared UI components (Navbar, Footer, Modals, etc.)
- `components/ui/`: Reusable UI primitives (Button, Modal, ImageUpload, etc.)
- Uses Tailwind CSS with custom font variables (Playfair Display, Inter, Geist Mono)

### Authentication

Admin authentication uses a PIN-based system:
- Default PIN: "123456" (should be changed in production)
- Session managed via cookies through API routes
- Protected routes check authentication in `app/admin/layout.tsx`

## Common Patterns

### Creating New API Routes
```typescript
import { connectDB } from "@/lib/db"
import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    await connectDB()
    // Your logic here
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error: "Message" }, { status: 500 })
  }
}
```

### Working with Products
- Products have optional sale pricing (isOnSale, discountPercent, salePrice, saleStart, saleEnd)
- Images array stores Cloudinary URLs
- Always populate category when fetching products: `.populate("category")`

### Import Alias
Path alias `@/*` maps to the root directory (configured in tsconfig.json)
