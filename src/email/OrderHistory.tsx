import {
    Body,
    Container,
    Head,
    Heading,
    Hr,
    Html,
    Preview,
    Tailwind,
  } from "@react-email/components"
  import { OrderInformation } from "./components/OrderInformation"
  import React from "react"
  
  type OrderHistoryEmailProps = {
    orders: {
      id: string
      pricePaidInCents: number
      createdAt: Date
      downloadVerificationId: string
      product: {
        name: string
        imagePath: string
        description: string
      }
    }[]
  }
  
  OrderHistoryEmail.PreviewProps = {
    orders: [
      {
        id: crypto.randomUUID(),
        createdAt: new Date(),
        pricePaidInCents: 10000,
        downloadVerificationId: crypto.randomUUID(),
        product: {
          name: "Product name",
          description: "Some description",
          imagePath:
            "/products/0dfd358f-abc8-48f2-abeb-a69496bd1f48-1.png",
        },
      },
      {
        id: crypto.randomUUID(),
        createdAt: new Date(),
        pricePaidInCents: 2000,
        downloadVerificationId: crypto.randomUUID(),
        product: {
          name: "Product name 2",
          description: "Some other desc",
          imagePath:
            "/products/c9012fcf-4490-4abf-81c7-670178c23b9e-2.png",
        },
      },
    ],
  } satisfies OrderHistoryEmailProps
  
  export default function OrderHistoryEmail({ orders }: OrderHistoryEmailProps) {
    return (
      <Html>
        <Preview>Order History & Downloads</Preview>
        <Tailwind>
          <Head />
          <Body className="font-sans bg-white">
            <Container className="max-w-xl">
              <Heading>Order History</Heading>
              {orders.map((order, index) => (
                <React.Fragment key={order.id}>
                  <OrderInformation
                    order={order}
                    product={order.product}
                    downloadVerificationId={order.downloadVerificationId}
                  />
                  {index < orders.length - 1 && <Hr />}
                </React.Fragment>
              ))}
            </Container>
          </Body>
        </Tailwind>
      </Html>
    )
  }