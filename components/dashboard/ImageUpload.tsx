'use client'

import { useState, useRef } from 'react'

interface ImageUploadProps {
    value: string[]
    onChange: (urls: string[]) => void
    maxImages?: number
}

export default function ImageUpload({ value, onChange, maxImages = 10 }: ImageUploadProps) {
    const [uploading, setUploading] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files
        if (!files || files.length === 0) return

        setUploading(true)
        try {
            const newUrls = [...value]

            for (let i = 0; i < files.length; i++) {
                if (newUrls.length >= maxImages) break

                const formData = new FormData()
                formData.append('file', files[i])

                const response = await fetch('/api/upload', {
                    method: 'POST',
                    body: formData
                })

                const data = await response.json()
                if (response.ok && data.url) {
                    newUrls.push(data.url)
                } else {
                    console.error('Upload failed:', data.error)
                    alert(`Failed to upload ${files[i].name}: ${data.error}`)
                }
            }

            onChange(newUrls)
        } catch (error) {
            console.error('Upload error:', error)
            alert('An error occurred during upload')
        } finally {
            setUploading(false)
            if (fileInputRef.current) fileInputRef.current.value = ''
        }
    }

    const removeImage = (index: number) => {
        const newUrls = value.filter((_, i) => i !== index)
        onChange(newUrls)
    }

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {value.map((url, index) => (
                    <div key={index} className="relative group aspect-square rounded-2xl overflow-hidden border border-slate-800 bg-slate-900">
                        <img
                            src={url}
                            alt={`Upload ${index + 1}`}
                            className="w-full h-full object-cover transition-transform group-hover:scale-110"
                        />
                        <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute top-2 right-2 p-1.5 bg-red-500/80 hover:bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-all transform translate-y-[-10px] group-hover:translate-y-0"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                ))}

                {value.length < maxImages && (
                    <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploading}
                        className="aspect-square rounded-2xl border-2 border-dashed border-slate-800 hover:border-emerald-500/50 hover:bg-emerald-500/5 transition-all flex flex-col items-center justify-center gap-2 text-slate-500 hover:text-emerald-400 group"
                    >
                        {uploading ? (
                            <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                            <>
                                <div className="p-3 bg-slate-800 rounded-full group-hover:bg-emerald-500/20 transition-colors">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                    </svg>
                                </div>
                                <span className="text-xs font-bold uppercase tracking-wider">Upload</span>
                            </>
                        )}
                    </button>
                )}
            </div>

            <input
                type="file"
                ref={fileInputRef}
                onChange={handleUpload}
                accept="image/*"
                multiple
                className="hidden"
            />

            <p className="text-xs text-slate-500 flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Upload up to {maxImages} high-quality photos (JPEG, PNG, WebP. Max 5MB each).
            </p>
        </div>
    )
}
