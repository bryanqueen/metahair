"use client"

import { useState, useRef } from "react"
import { Upload, X, Loader2 } from "lucide-react"

interface ImageUploadProps {
  value: string | string[]
  onChange: (value: string | string[]) => void
  multiple?: boolean
  folder?: string
}

export function ImageUpload({ value, onChange, multiple = false, folder = "metahair" }: ImageUploadProps) {
  const [previews, setPreviews] = useState<string[]>(Array.isArray(value) ? value : value ? [value] : [])
  const [uploading, setUploading] = useState(false)
  const [dragging, setDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = async (files: FileList | null) => {
    if (!files || files.length === 0) return

    setUploading(true)
    try {
      const uploadPromises = Array.from(files).map(async (file) => {
        const formData = new FormData()
        formData.append("file", file)
        formData.append("folder", folder)

        const response = await fetch("/api/products/upload", {
          method: "POST",
          body: formData,
        })

        if (!response.ok) {
          throw new Error("Upload failed")
        }

        const result = await response.json()
        return result.secure_url
      })

      const urls = await Promise.all(uploadPromises)
      
      if (multiple) {
        setPreviews((prev) => [...prev, ...urls])
        onChange([...previews, ...urls])
      } else {
        setPreviews([urls[0]])
        onChange(urls[0])
      }
    } catch (error) {
      console.error("Error uploading image:", error)
    } finally {
      setUploading(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragging(false)
    handleFileSelect(e.dataTransfer.files)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setDragging(true)
  }

  const handleDragLeave = () => {
    setDragging(false)
  }

  const removeImage = (index: number) => {
    if (!multiple && index === 0) {
      setPreviews([])
      onChange("")
    } else {
      const newPreviews = previews.filter((_, i) => i !== index)
      setPreviews(newPreviews)
      onChange(multiple ? newPreviews : newPreviews[0] || "")
    }
  }

  return (
    <div className="space-y-4">
      <div
        className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          dragging
            ? "border-[#D4A574] bg-[#D4A574]/10"
            : "border-gray-300 hover:border-gray-400"
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple={multiple}
          onChange={(e) => handleFileSelect(e.target.files)}
          className="hidden"
        />

        <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        
        <div className="space-y-2">
          <p className="font-sans text-sm text-gray-600">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="text-[#D4A574] hover:text-[#C49564] font-medium"
            >
              Click to upload
            </button>{" "}
            or drag and drop
          </p>
          <p className="font-sans text-xs text-gray-500">
            PNG, JPG, WEBP up to 10MB
          </p>
        </div>

        {uploading && (
          <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-[#D4A574]" />
          </div>
        )}
      </div>

      {previews.length > 0 && (
        <div className={`grid gap-4 ${multiple ? "grid-cols-2" : "grid-cols-1"}`}>
          {previews.map((preview, index) => (
            <div key={index} className="relative group">
              <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                <img
                  src={preview}
                  alt={`Preview ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

