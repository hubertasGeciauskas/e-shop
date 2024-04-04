import db from "@/db/db";
import { formatCurrency, formatNumber } from "@/lib/formatters";

async function getSalesData() {
const data = await db.order.aggregate({
    _sum: {pricePaidInCents: true},
    _count: true
})
    return {
        amount: (data._sum.pricePaidInCents || 0) / 100,
        numberOfSales: data._count
    }
}
async function getUserData() {
    const [userCount, orderData] = await Promise.all([
        db.user.count(),
        db.order.aggregate({
            _sum: {pricePaidInCents: true}
        }),
    ])
    
    return {
        userCount,
        averageValuePerPerson: userCount === 0? 0 : (orderData._sum.pricePaidInCents || 0) / userCount / 100
    } 
}
async function getProductData() {
    const [activeCount, inactiveCount] = await Promise.all([
        db.product.count({where: {isAvailableForPurchase: true}}),
        db.product.count({where: {isAvailableForPurchase: false}})
    ])
    return {
        activeCount, inactiveCount
    }
}

export default async function AdminDashboard() {
    const [salesData, userData, productData] = await Promise.all([getSalesData(), getUserData(), getProductData()])
    
    return (
      <div className="grid grid-column-1 md:grid-column-2 lg:grid-column-3 gap-4">
        <DashboardCard 
            title={"Sales"} 
            subtitle={`${formatNumber(salesData.numberOfSales)} Orders`} 
            body={formatCurrency(salesData.amount)}/>
            <DashboardCard 
            title={"Customers"} 
            subtitle={`${formatCurrency(userData.averageValuePerPerson)} Average Value`} 
            body={formatNumber(userData.userCount)}/>
            <DashboardCard 
            title={"Active Products"} 
            subtitle={`${formatNumber(productData.inactiveCount)} Inactive `} 
            body={formatNumber(productData.activeCount)}/>
      </div>
    );
  }

  type DashboardCardProps = {
    title: String,
    subtitle: String,
    body: String,
  }
  function DashboardCard({ title, subtitle, body }: DashboardCardProps) {
    return (
      <a href="#" className="block max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
        <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{title}</h5>
        <h6 className="mb-2 text-2xl font-bold tracking-tight text-gray-600 dark:text-white">{subtitle}</h6>
        <p className="font-normal text-gray-700 dark:text-gray-400">{body}</p>
      </a>
    );
  }