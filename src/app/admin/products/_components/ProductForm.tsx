"use client"

import { formatCurrency } from "@/lib/formatters"
import { useState } from "react"
import { addProduct, updateProduct } from "../../_actions/product"
import { useFormState, useFormStatus } from "react-dom"
import { Button } from "@/components/ui/button"
import { Product } from "@prisma/client"
import Image from "next/image"

export function ProductForm({product}: {product?: Product | null}) {
    const [error, action] = useFormState(product == null ? addProduct : updateProduct.bind(null, product.id), {})
    const [priceInCents, setPriceInCents] = useState<number | undefined>(product?.priceInCents)
    return (
        <form action={action} className="space-y-8" >
            <div className="space-y-2" >
                <label htmlFor="name" className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" >Name</label>
                <input type="text" id="name" name="name" required defaultValue={product?.name || "" } className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white" />
                {error.name && <div className="text-destructive" >{error.name}</div>}
            </div>
            <div className="space-y-2" >
                <label htmlFor="priceInCents" className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" >Price In Cents</label>
                <input type="number" id="priceInCents" name="priceInCents" required value={priceInCents} onChange={e => setPriceInCents(Number(e.target.value) || undefined)} className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white" />
                {error.priceInCents && <div className="text-destructive" >{error.priceInCents}</div>}
            </div>
            <div className="text-muted-foreground" >
                {formatCurrency((priceInCents || 0) / 100)}
            </div>
            <div className="space-y-2" >
                <label htmlFor="description" className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" >Description</label>
                <textarea id="desription" name="description" required defaultValue={product?.description || "" } className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white" />
                {error.description && <div className="text-destructive" >{error.description}</div>}
            </div>
            <div className="space-y-2" >
                <label htmlFor="file" className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" >File</label>
                <input type="file" id="file" name="file" required={product == null} className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white" />
                {product != null && (
                    <div className="text-muted-foreground" >{product.filePath}</div>
                )}
                {error.file && <div className="text-destructive" >{error.file}</div>}
            </div>
            <div className="space-y-2" >
                <label htmlFor="image" className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" >Image</label>
                <input type="file" id="image" name="image" required={product == null} className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white" />
                {product != null && (
                    <Image
                        src={product.imagePath}
                        height={400}
                        width={500}
                        sizes="(min-width: 600px) 500px, calc(94.29vw - 47px)"
                        alt="product image"
                     />
                )}
                {error.image && <div className="text-destructive" >{error.image}</div>}
            </div>
            <SubmitButton/>
        </form>
    )
}

function SubmitButton() {
    const { pending } = useFormStatus()
  
    return (
      <Button type="submit" disabled={pending}>
        {pending ? "Saving..." : "Save"}
      </Button>
    )
  }