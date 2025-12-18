import { supabase } from '../lib/supabase';

export interface UserProfile {
    id: string;
    user_id: string;
    full_name: string | null;
    phone: string | null;
    address: string | null;
    city: string | null;
    postal_code: string | null;
    country: string;
    avatar_url: string | null;
    created_at: string;
    updated_at: string;
}

// Get user profile
export const fetchUserProfile = async (
    userId: string
): Promise<{ data: UserProfile | null; error: string | null }> => {
    try {
        const { data, error } = await supabase
            .from('user_profiles')
            .select('*')
            .eq('user_id', userId)
            .single();

        if (error && error.code !== 'PGRST116') throw error; // PGRST116 = no rows

        return { data, error: null };
    } catch (error: any) {
        console.error('Error fetching profile:', error);
        return {
            data: null,
            error: error.message || 'Failed to fetch profile',
        };
    }
};

// Create or update user profile
export const upsertUserProfile = async (
    userId: string,
    profileData: Partial<UserProfile>
): Promise<{ data: UserProfile | null; error: string | null }> => {
    try {
        const { data, error } = await supabase
            .from('user_profiles')
            .upsert(
                {
                    user_id: userId,
                    ...profileData,
                },
                { onConflict: 'user_id' }
            )
            .select()
            .single();

        if (error) throw error;

        return { data, error: null };
    } catch (error: any) {
        console.error('Error upserting profile:', error);
        return {
            data: null,
            error: error.message || 'Failed to update profile',
        };
    }
};

// Update user password (via Supabase Auth)
export const updateUserPassword = async (
    newPassword: string
): Promise<{ error: string | null }> => {
    try {
        const { error } = await supabase.auth.updateUser({
            password: newPassword,
        });

        if (error) throw error;

        return { error: null };
    } catch (error: any) {
        console.error('Error updating password:', error);
        return {
            error: error.message || 'Failed to update password',
        };
    }
};

// Upload avatar image
export const uploadAvatar = async (
    userId: string,
    file: File
): Promise<{ data: string | null; error: string | null }> => {
    try {
        const fileExt = file.name.split('.').pop();
        const fileName = `${userId}-${Date.now()}.${fileExt}`;
        const filePath = `avatars/${fileName}`;

        const { error: uploadError } = await supabase.storage
            .from('avatars')
            .upload(filePath, file, {
                upsert: true,
            });

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
            .from('avatars')
            .getPublicUrl(filePath);

        return { data: publicUrl, error: null };
    } catch (error: any) {
        console.error('Error uploading avatar:', error);
        return {
            data: null,
            error: error.message || 'Failed to upload avatar',
        };
    }
};
