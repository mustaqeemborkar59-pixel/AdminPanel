
'use server';

import { initializeFirebase } from '@/firebase';
import { ref, set, get, push, remove, child } from 'firebase/database';
import type { Vendor } from '@/types';

// Action to save/update a vendor in Realtime Database
export async function saveVendorToRTDB(vendorData: Omit<Vendor, 'id'>, vendorId?: string): Promise<{ success: boolean; error?: string }> {
    const { rtdb } = initializeFirebase();
    if (!rtdb) {
        return { success: false, error: "Realtime Database is not configured." };
    }

    try {
        const vendorsRef = ref(rtdb, 'vendors');
        let vendorRef;

        if (vendorId) {
            // Updating an existing vendor
            vendorRef = child(vendorsRef, vendorId);
        } else {
            // Creating a new vendor, RTDB will generate a unique ID
            vendorRef = push(vendorsRef);
        }
        
        await set(vendorRef, vendorData);
        return { success: true };

    } catch (error: any) {
        console.error('Failed to save vendor to RTDB:', error);
        return { success: false, error: error.message || 'Failed to save vendor.' };
    }
}

// Action to get all vendors from Realtime Database
export async function getVendorsFromRTDB(): Promise<{ success: boolean; data?: Vendor[], error?: string }> {
    const { rtdb } = initializeFirebase();
    if (!rtdb) {
        return { success: false, error: "Realtime Database is not configured." };
    }

    try {
        const vendorsRef = ref(rtdb, 'vendors');
        const snapshot = await get(vendorsRef);

        if (snapshot.exists()) {
            const vendorsData = snapshot.val();
            const vendorsArray: Vendor[] = Object.keys(vendorsData).map(id => ({
                id,
                ...vendorsData[id]
            }));
            return { success: true, data: vendorsArray };
        }
        
        return { success: true, data: [] }; // No vendors found is not an error

    } catch (error: any) {
        console.error('Failed to get vendors from RTDB:', error);
        return { success: false, error: error.message || 'Failed to fetch vendors.' };
    }
}


// Action to delete a vendor from Realtime Database
export async function deleteVendorFromRTDB(vendorId: string): Promise<{ success: boolean; error?: string }> {
    const { rtdb } = initializeFirebase();
    if (!rtdb) {
        return { success: false, error: "Realtime Database is not configured." };
    }

    try {
        const vendorRef = ref(rtdb, `vendors/${vendorId}`);
        await remove(vendorRef);
        return { success: true };

    } catch (error: any) {
        console.error('Failed to delete vendor from RTDB:', error);
        return { success: false, error: error.message || 'Failed to delete vendor.' };
    }
}
