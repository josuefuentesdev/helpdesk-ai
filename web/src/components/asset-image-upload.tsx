"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Icons } from "@/components/icons"
import { useTranslations } from "next-intl"
import { toast } from "sonner"

interface AssetImageUploadProps {
  value?: string
  onChange: (url: string | undefined) => void
  disabled?: boolean
}

export function AssetImageUpload({ value, onChange, disabled }: AssetImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const t = useTranslations("AssetImageUpload")

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error(t("toast.fileSizeError"))
      return
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      toast.error(t("toast.fileTypeError"))
      return
    }

    setIsUploading(true)

    try {
      const response = await fetch(`/api/upload/asset-image?filename=${encodeURIComponent(file.name)}`, {
        method: 'POST',
        headers: {
          'Content-Type': file.type,
        },
        body: file,
      })

      if (!response.ok) {
        const error = await response.json() as { error?: string }
        throw new Error(error.error ?? 'Upload failed')
      }

      const result = await response.json() as { url: string }
      onChange(result.url)
      toast.success(t("toast.uploadSuccess"))
    } catch (error) {
      console.error('Upload error:', error)
      toast.error(error instanceof Error ? error.message : t("toast.uploadError"))
    } finally {
      setIsUploading(false)
      // Reset the input
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const handleRemove = () => {
    onChange(undefined)
    toast.success(t("toast.removeSuccess"))
  }

  const handleUploadClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    console.log('Upload click triggered', fileInputRef.current)

    if (disabled || isUploading) {
      console.log('Upload disabled or in progress')
      return
    }

    if (fileInputRef.current) {
      console.log('Triggering file input click')
      fileInputRef.current.click()
    } else {
      console.error('File input ref is null')
    }
  }

  return (
    <div className="space-y-4">
      <Label>{t("label")}</Label>

      {value ? (
        <div className="space-y-4">
          <div className="relative inline-block">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={value}
              alt={t("altText")}
              className="h-32 w-32 rounded-lg border border-border object-cover"
            />
          </div>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleUploadClick}
              disabled={disabled ?? isUploading}
            >
              {isUploading ? (
                <>
                  <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                  {t("uploading")}
                </>
              ) : (
                <>
                  <Icons.upload className="mr-2 h-4 w-4" />
                  {t("replaceImage")}
                </>
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleRemove}
              disabled={disabled ?? isUploading}
            >
              <Icons.trash className="mr-2 h-4 w-4" />
              {t("remove")}
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div
            className="flex h-32 w-32 cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-border bg-muted/50 hover:bg-muted"
            onClick={handleUploadClick}
          >
            {isUploading ? (
              <Icons.spinner className="h-8 w-8 animate-spin text-muted-foreground" />
            ) : (
              <div className="text-center">
                <Icons.imageIcon className="mx-auto h-8 w-8 text-muted-foreground" />
                <p className="mt-2 text-sm text-muted-foreground">{t("clickToUpload")}</p>
              </div>
            )}
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleUploadClick}
            disabled={disabled ?? isUploading}
          >
            {isUploading ? (
              <>
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                {t("uploading")}
              </>
            ) : (
              <>
                <Icons.upload className="mr-2 h-4 w-4" />
                {t("uploadImage")}
              </>
            )}
          </Button>
        </div>
      )}

      <Input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/webp"
        onChange={handleFileSelect}
        className="hidden"
        disabled={disabled ?? isUploading}
      />

      <p className="text-sm text-muted-foreground">
        {t("supportedFormats")}
      </p>
    </div>
  )
}