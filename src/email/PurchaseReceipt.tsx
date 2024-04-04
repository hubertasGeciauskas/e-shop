import { Body, Head, Html, Preview, Tailwind, Container, Heading } from "@react-email/components"
import { OrderInformation } from "./components/OrderInformation"

type PurchaseReceiptEmailProps = {
    product: {
        name: string,
        imagePath: string
        description: string
    }
    order: {id: string, 
        createdAt: Date,
        pricePaidInCents: number}
        downloadVerificationId: string
}

PurchaseReceiptEmail.PreviewProps = {
    product: { 
        name: "Product name",
        imagePath: "/products/0dfd358f-abc8-48f2-abeb-a69496bd1f48-1.png",
        description: "Some description"
    },
    order: {
        id: crypto.randomUUID(),
        createdAt: new Date(),
        pricePaidInCents: 10000,
    },
    downloadVerificationId: crypto.randomUUID(),
} satisfies PurchaseReceiptEmailProps

export default function PurchaseReceiptEmail({ 
    product,
    order,
    downloadVerificationId
}
    : PurchaseReceiptEmailProps) {
    return (
        <Html>
            <Preview>Download {product.name} and view Receipt</Preview>
                <Tailwind>
                <Head/>
                <Body className="font sans bg-white" >
                    <Container className="max-w-xl" >
                        <Heading>Purchase Receipt</Heading>
                        <OrderInformation order={order} product={product} downloadVerificationId={downloadVerificationId} />
                    </Container>
                </Body>
            
            </Tailwind>
        </Html>
    )
}