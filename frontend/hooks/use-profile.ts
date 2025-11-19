"use client";

import { useState, useEffect } from 'react';
import { UserProfile } from '@/lib/types';
import { getProfile, saveProfile, deleteProfile as deleteProfileStorage } from '@/lib/storage';

export function useProfile() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadedProfile = getProfile();
    setProfile(loadedProfile);
    setLoading(false);
  }, []);

  const createProfile = (username: string) => {
    const newProfile: UserProfile = {
      profile_id: `profile_${Date.now()}`,
      username,
      created_date: new Date().toISOString(),
      last_active: new Date().toISOString(),
      sound_enabled: true
    };
    
    saveProfile(newProfile);
    setProfile(newProfile);
    return newProfile;
  };

  const updateProfile = (updates: Partial<UserProfile>) => {
    if (!profile) return;
    
    const updatedProfile = {
      ...profile,
      ...updates,
      last_active: new Date().toISOString()
    };
    
    saveProfile(updatedProfile);
    setProfile(updatedProfile);
  };

  const deleteProfile = () => {
    deleteProfileStorage();
    setProfile(null);
  };

  return {
    profile,
    loading,
    createProfile,
    updateProfile,
    deleteProfile
  };
}
