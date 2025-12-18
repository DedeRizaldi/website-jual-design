import { supabase } from '../lib/supabase';
import { Product } from '../types';

export interface Order {
    id: string;
    user_id: string;
    total: number;
    status: string;
    created_at: string;
}

export interface OrderItem {
    id: string;
    order_id: string;
    product_id: string;
    product_title: string;
    product_price: number;
    product_image_url: string | null;
    created_at: string;
}

export interface OrderWithItems extends Order {
    items: OrderItem[];
}

// Create new order
export const createOrder = async (
    userId: string,
    items: Product[],
    total: number
): Promise<{ data: Order | null; error: string | null }> => {
    try {
        // 1. Create order
        const { data: order, error: orderError } = await supabase
            .from('orders')
            .insert([
                {
                    user_id: userId,
                    total: total,
                    status: 'completed',
                },
            ])
            .select()
            .single();

        if (orderError) throw orderError;
        if (!order) throw new Error('Failed to create order');

        // 2. Create order items
        const orderItems = items.map((item) => ({
            order_id: order.id,
            product_id: item.id,
            product_title: item.title,
            product_price: item.price,
            product_image_url: item.imageUrl,
        }));

        const { error: itemsError } = await supabase
            .from('order_items')
            .insert(orderItems);

        if (itemsError) throw itemsError;

        return { data: order, error: null };
    } catch (error: any) {
        console.error('Error creating order:', error);
        return {
            data: null,
            error: error.message || 'Failed to create order',
        };
    }
};

// Fetch user's orders with items
export const fetchUserOrders = async (
    userId: string
): Promise<{ data: OrderWithItems[] | null; error: string | null }> => {
    try {
        // 1. Fetch orders
        const { data: orders, error: ordersError } = await supabase
            .from('orders')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false });

        if (ordersError) throw ordersError;
        if (!orders) return { data: [], error: null };

        // 2. Fetch items for each order
        const ordersWithItems: OrderWithItems[] = await Promise.all(
            orders.map(async (order) => {
                const { data: items, error: itemsError } = await supabase
                    .from('order_items')
                    .select('*')
                    .eq('order_id', order.id);

                if (itemsError) {
                    console.error('Error fetching order items:', itemsError);
                    return { ...order, items: [] };
                }

                return { ...order, items: items || [] };
            })
        );

        return { data: ordersWithItems, error: null };
    } catch (error: any) {
        console.error('Error fetching orders:', error);
        return {
            data: null,
            error: error.message || 'Failed to fetch orders',
        };
    }
};

// Fetch single order by ID
export const fetchOrderById = async (
    orderId: string
): Promise<{ data: OrderWithItems | null; error: string | null }> => {
    try {
        const { data: order, error: orderError } = await supabase
            .from('orders')
            .select('*')
            .eq('id', orderId)
            .single();

        if (orderError) throw orderError;
        if (!order) throw new Error('Order not found');

        const { data: items, error: itemsError } = await supabase
            .from('order_items')
            .select('*')
            .eq('order_id', orderId);

        if (itemsError) throw itemsError;

        return {
            data: { ...order, items: items || [] },
            error: null,
        };
    } catch (error: any) {
        console.error('Error fetching order:', error);
        return {
            data: null,
            error: error.message || 'Order not found',
        };
    }
};
