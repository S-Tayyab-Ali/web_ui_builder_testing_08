"use client";

import { useState } from 'react';
import Header from '@/components/header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { User, Save, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

export default function ProfilePage() {
  const [username, setUsername] = useState('Player123');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [hasProfile, setHasProfile] = useState(true);

  const handleSaveProfile = () => {
    toast.success('Profile saved successfully!');
  };

  const handleDeleteProfile = () => {
    const confirmed = window.confirm('Are you sure you want to delete your profile? This action cannot be undone.');
    if (confirmed) {
      setHasProfile(false);
      setUsername('');
      toast.success('Profile deleted successfully');
    }
  };

  const handleCreateProfile = () => {
    if (username.length < 3) {
      toast.error('Username must be at least 3 characters long');
      return;
    }
    setHasProfile(true);
    toast.success('Profile created successfully!');
  };

  if (!hasProfile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <Header />
        
        <main className="container px-4 py-8 max-w-2xl">
          <Card>
            <CardHeader className="text-center">
              <div className="mx-auto w-20 h-20 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mb-4">
                <User className="w-10 h-10 text-purple-600 dark:text-purple-400" />
              </div>
              <CardTitle>Create Your Profile</CardTitle>
              <CardDescription>
                Set up a profile to save your progress and preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  minLength={3}
                  maxLength={20}
                />
                <p className="text-xs text-muted-foreground">
                  3-20 characters, no special characters
                </p>
              </div>

              <Button onClick={handleCreateProfile} className="w-full">
                Create Profile
              </Button>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Header />
      
      <main className="container px-4 py-8 max-w-2xl">
        <h2 className="text-4xl font-bold mb-8">Your Profile</h2>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>
                Manage your username and account settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  minLength={3}
                  maxLength={20}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Sound Effects</Label>
                  <p className="text-sm text-muted-foreground">
                    Enable or disable game sounds
                  </p>
                </div>
                <Switch
                  checked={soundEnabled}
                  onCheckedChange={setSoundEnabled}
                />
              </div>

              <Button onClick={handleSaveProfile} className="w-full">
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Statistics</CardTitle>
              <CardDescription>
                Your gaming activity
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Games Played</p>
                  <p className="text-2xl font-bold">0</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Total Score</p>
                  <p className="text-2xl font-bold">0</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">High Scores</p>
                  <p className="text-2xl font-bold">0</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Member Since</p>
                  <p className="text-sm font-medium">Just now</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-red-200 dark:border-red-900">
            <CardHeader>
              <CardTitle className="text-red-600 dark:text-red-400">Danger Zone</CardTitle>
              <CardDescription>
                Permanently delete your profile and all associated data
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={handleDeleteProfile} variant="destructive" className="w-full">
                <Trash2 className="w-4 h-4 mr-2" />
                Delete Profile
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
