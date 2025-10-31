'use client';

import { useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import type { Database } from '@/lib/supabase';

type OrderRow = Database['public']['Tables']['orders']['Row'];

type NewOrderCallback = (order: OrderRow) => void;

export function useOrderRealtime(onNewOrder: NewOrderCallback | undefined) {
	 const subscribedRef = useRef(false);

	 useEffect(() => {
		 if (subscribedRef.current) return;
		 subscribedRef.current = true;

		 const channel = supabase
			 .channel('orders-realtime')
			 .on(
				 'postgres_changes',
				 { event: 'INSERT', schema: 'public', table: 'orders' },
				 (payload) => {
					 const row = (payload?.new || {}) as OrderRow;
					 if (!row?.id) return;
					 if (typeof onNewOrder === 'function') {
						 onNewOrder(row);
					 }
				 }
			 )
			 .subscribe((status) => {
				 if (status === 'SUBSCRIBED') {
					 // Subscribed successfully
				 }
			 });

		 return () => {
			 try {
				 supabase.removeChannel(channel);
			 } catch {
				 // ignore
			 }
		 };
	 }, [onNewOrder]);
}

export default useOrderRealtime;


