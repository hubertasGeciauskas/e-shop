
import db from "@/db/db";
import { PageHeader } from "../_components/PageHeader";
import Link from "next/link";
import { formatCurrency, formatNumber } from "@/lib/formatters";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { ActiveToggleDropdownItem, DeleteDropdownItem } from "./_components/ProductActions";



export default function AdminProductsPage() {
    return(
        <>
        <div className="flex justify-between items-center gap-4" >
            <PageHeader>Products</PageHeader>
            <Button asChild>
                <Link href="/admin/products/new">Add Product</Link>
            </Button>
        </div>
        <ProductsTable/>
        
             </>
    ) 
}

async function ProductsTable() {
    const products = await db.product.findMany({
      select: {
        id: true,
        name: true,
        priceInCents: true,
        isAvailableForPurchase: true,
        _count: { select: { orders: true } },
      },
      orderBy: { name: "asc" },
    })
    if (products.length === 0) return <p>No products found</p>

    return (
        <table className="container mx-auto px-4 w-5/6" >
           
            <thead >
                <tr>
                    <th className="w-0" >
                         <span className="sr-only">Available For Purchase</span>
                    </th>
                    <th>Name</th>
                    <th>Price</th>
                    <th>Orders</th>
                    <th className="w-0" >
                         <span className="sr-only">Actions</span>
                    </th>
                </tr>
            </thead>
            <tbody>
               {products.map(product => (
                <tr key={product.id}>
                    {product.isAvailableForPurchase === true ? 
                    <th>
                        <span className="sr-only">Available</span>
                        <svg xmlns="http://www.w3.org/2000/svg" width="2em" height="2em" viewBox="0 0 48 48">
                            <g fill="none" stroke="currentColor" stroke-linejoin="round" stroke-width="4">
                                <path d="M24 44a19.937 19.937 0 0 0 14.142-5.858A19.937 19.937 0 0 0 44 24a19.938 19.938 0 0 0-5.858-14.142A19.937 19.937 0 0 0 24 4A19.938 19.938 0 0 0 9.858 9.858A19.938 19.938 0 0 0 4 24a19.937 19.937 0 0 0 5.858 14.142A19.938 19.938 0 0 0 24 44Z"/>
                                <path stroke-linecap="round" d="m16 24l6 6l12-12"/>
                            </g>
                        </svg>
                    </th> 
                    : 
                    <th>
                        <span className="sr-only">Unavailable</span>
                        <svg xmlns="http://www.w3.org/2000/svg" width="2em" height="2em" viewBox="0 0 256 256">
                            <path fill="currentColor" d="M165.66 101.66L139.31 128l26.35 26.34a8 8 0 0 1-11.32 11.32L128 139.31l-26.34 26.35a8 8 0 0 1-11.32-11.32L116.69 128l-26.35-26.34a8 8 0 0 1 11.32-11.32L128 116.69l26.34-26.35a8 8 0 0 1 11.32 11.32M232 128A104 104 0 1 1 128 24a104.11 104.11 0 0 1 104 104m-16 0a88 88 0 1 0-88 88a88.1 88.1 0 0 0 88-88"/>
                        </svg>
                    </th>
                    }
                    <th>{product.name}</th>
                    <th>{formatCurrency(product.priceInCents / 100)}</th>
                    <th>{formatNumber(product._count.orders)}</th>
                    <th>
                        <DropdownMenu>
                            <DropdownMenuTrigger>
                            <svg xmlns="http://www.w3.org/2000/svg" width="2em" height="2em" viewBox="0 0 20 20">
                                <path fill="currentColor" d="M9 15.25a1.25 1.25 0 1 1 2.5 0a1.25 1.25 0 0 1-2.5 0m0-5a1.25 1.25 0 1 1 2.5 0a1.25 1.25 0 0 1-2.5 0m0-5a1.249 1.249 0 1 1 2.5 0a1.25 1.25 0 1 1-2.5 0"/>
                            </svg> 
                            <span className="sr-only" >Actions</span>
                            </DropdownMenuTrigger> 
                            <DropdownMenuContent>
                                <DropdownMenuItem asChild >
                                    <a download href={`/admin/products/${product.id}/download`}>
                                    Download
                                    </a>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild  >
                                    <Link href={`/admin/products/${product.id}/edit`}>
                                    Edit
                                    </Link>
                                </DropdownMenuItem>
                                <ActiveToggleDropdownItem id={product.id} isAvailableForPurchase={product.isAvailableForPurchase} />
                                <DropdownMenuSeparator/>
                                <DeleteDropdownItem id={product.id} disabled={product._count.orders > 0} />
                            </DropdownMenuContent>
                        </DropdownMenu>
                        
                    </th>
                </tr>
               ))}
            </tbody>
        </table>
    )
}
