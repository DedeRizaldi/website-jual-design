import React from 'react';
import { ShoppingCart } from 'lucide-react';

interface Order {
    id: string;
    date: string;
    total: number;
    status: 'Paid' | 'Pending' | 'Cancelled';
}

const MOCK_ORDERS: Order[] = [
    { id: 'ORD-001', date: '2025-12-17', total: 49.99, status: 'Paid' },
    { id: 'ORD-002', date: '2025-12-16', total: 12.99, status: 'Paid' },
    { id: 'ORD-003', date: '2025-12-16', total: 89.99, status: 'Paid' },
    { id: 'ORD-004', date: '2025-12-15', total: 25.00, status: 'Paid' },
    { id: 'ORD-005', date: '2025-12-15', total: 15.00, status: 'Paid' },
    { id: 'ORD-006', date: '2025-12-14', total: 7.99, status: 'Paid' },
    { id: 'ORD-007', date: '2025-12-14', total: 29.00, status: 'Paid' },
    { id: 'ORD-008', date: '2025-12-13', total: 49.00, status: 'Paid' },
    { id: 'ORD-009', date: '2025-12-13', total: 18.00, status: 'Paid' },
    { id: 'ORD-010', date: '2025-12-12', total: 10.00, status: 'Paid' },
    { id: 'ORD-011', date: '2025-12-12', total: 8.00, status: 'Paid' },
    { id: 'ORD-012', date: '2025-12-11', total: 24.99, status: 'Paid' },
];

const Orders: React.FC = () => {
    const getStatusColor = (status: Order['status']) => {
        switch (status) {
            case 'Paid':
                return 'bg-green-600/20 text-green-400 border-green-600/30';
            case 'Pending':
                return 'bg-yellow-600/20 text-yellow-400 border-yellow-600/30';
            case 'Cancelled':
                return 'bg-red-600/20 text-red-400 border-red-600/30';
            default:
                return 'bg-slate-600/20 text-slate-400 border-slate-600/30';
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const totalRevenue = MOCK_ORDERS.reduce((sum, order) => sum + order.total, 0);

    return (
        <div>
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Orders</h1>
                    <p className="text-slate-400">View all customer orders</p>
                </div>
                <div className="bg-slate-800 border border-slate-700 rounded-xl px-6 py-3">
                    <p className="text-slate-400 text-xs mb-1">Total Revenue</p>
                    <p className="text-white text-2xl font-bold">${totalRevenue.toFixed(2)}</p>
                </div>
            </div>

            {/* Table */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-slate-950 text-slate-300 uppercase text-xs font-medium">
                            <tr>
                                <th className="px-6 py-4">Order ID</th>
                                <th className="px-6 py-4">Date</th>
                                <th className="px-6 py-4">Total Price</th>
                                <th className="px-6 py-4">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800">
                            {MOCK_ORDERS.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="px-6 py-12 text-center">
                                        <div className="flex flex-col items-center justify-center space-y-3">
                                            <ShoppingCart className="w-12 h-12 text-slate-600" />
                                            <p className="text-slate-500">No orders yet</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                MOCK_ORDERS.map((order) => (
                                    <tr key={order.id} className="hover:bg-slate-800/50 transition-colors">
                                        <td className="px-6 py-4 text-white font-mono font-medium">
                                            {order.id}
                                        </td>
                                        <td className="px-6 py-4 text-slate-300">
                                            {formatDate(order.date)}
                                        </td>
                                        <td className="px-6 py-4 text-white font-semibold">
                                            ${order.total.toFixed(2)}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span
                                                className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                                                    order.status
                                                )}`}
                                            >
                                                {order.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Info Note */}
            <div className="mt-4 p-4 bg-slate-800/50 border border-slate-700 rounded-lg">
                <p className="text-sm text-slate-400">
                    <span className="font-semibold text-slate-300">Note:</span> Orders are read-only.
                    You can view order details but cannot edit or delete them.
                </p>
            </div>
        </div>
    );
};

export default Orders;
