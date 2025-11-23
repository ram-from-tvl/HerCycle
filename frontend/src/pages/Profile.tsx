import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { GlassCard } from "@/components/GlassCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, User, Edit, Save, X } from "lucide-react";
import { api, UserProfile } from "@/lib/api";
import { motion } from "framer-motion";

export default function Profile() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [editData, setEditData] = useState<Partial<UserProfile>>({});
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const response = await api.getProfile();
      setProfile(response.profile);
      setEditData(response.profile);
    } catch (error) {
      console.error("Failed to load profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.updateProfile(editData);
      setProfile({ ...profile, ...editData } as UserProfile);
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to update profile:", error);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setEditData(profile || {});
    setIsEditing(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-primary-glow/10 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-primary-glow/10 pb-8">
      {/* Header */}
      <div className="sticky top-0 z-10 backdrop-blur-lg bg-background/80 border-b border-border/50 px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="rounded-full">
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-xl font-bold">Profile Settings</h1>
          </div>
          
          {!isEditing ? (
            <Button onClick={() => setIsEditing(true)} className="rounded-full">
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </Button>
          ) : (
            <div className="flex space-x-2">
              <Button onClick={handleSave} disabled={saving} className="rounded-full">
                <Save className="w-4 h-4 mr-2" />
                {saving ? "Saving..." : "Save"}
              </Button>
              <Button variant="outline" onClick={handleCancel} className="rounded-full">
                <X className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        {/* Profile Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <GlassCard className="bg-gradient-to-br from-primary/20 to-primary-glow/30 text-center">
            <div className="space-y-4">
              <div className="w-20 h-20 bg-primary/30 rounded-full flex items-center justify-center mx-auto">
                <User className="w-10 h-10 text-primary" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Your Profile</h2>
                <p className="text-muted-foreground">Personalize your HerCycle experience</p>
              </div>
            </div>
          </GlassCard>
        </motion.div>

        {/* Basic Information */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <GlassCard>
            <h3 className="text-lg font-semibold mb-4">Basic Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Age</label>
                {isEditing ? (
                  <Input
                    type="number"
                    value={editData.age || ""}
                    onChange={(e) => setEditData(prev => ({ ...prev, age: parseInt(e.target.value) }))}
                    className="rounded-lg"
                  />
                ) : (
                  <p className="py-2">{profile?.age || "Not set"} years</p>
                )}
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Height (cm)</label>
                {isEditing ? (
                  <Input
                    type="number"
                    value={editData.height_cm || ""}
                    onChange={(e) => setEditData(prev => ({ ...prev, height_cm: parseFloat(e.target.value) }))}
                    className="rounded-lg"
                  />
                ) : (
                  <p className="py-2">{profile?.height_cm || "Not set"} cm</p>
                )}
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Weight (kg)</label>
                {isEditing ? (
                  <Input
                    type="number"
                    value={editData.weight_kg || ""}
                    onChange={(e) => setEditData(prev => ({ ...prev, weight_kg: parseFloat(e.target.value) }))}
                    className="rounded-lg"
                  />
                ) : (
                  <p className="py-2">{profile?.weight_kg || "Not set"} kg</p>
                )}
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Region</label>
                {isEditing ? (
                  <Input
                    value={editData.region || ""}
                    onChange={(e) => setEditData(prev => ({ ...prev, region: e.target.value }))}
                    className="rounded-lg"
                    placeholder="e.g., India"
                  />
                ) : (
                  <p className="py-2">{profile?.region || "Not set"}</p>
                )}
              </div>
            </div>
          </GlassCard>
        </motion.div>

        {/* Lifestyle Preferences */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <GlassCard>
            <h3 className="text-lg font-semibold mb-4">Lifestyle Preferences</h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Diet Type</label>
                {isEditing ? (
                  <div className="grid grid-cols-2 gap-2">
                    {['vegetarian', 'non_vegetarian', 'vegan', 'eggetarian'].map(diet => (
                      <Button
                        key={diet}
                        variant={editData.diet_type === diet ? "default" : "outline"}
                        onClick={() => setEditData(prev => ({ ...prev, diet_type: diet as any }))}
                        className="capitalize"
                      >
                        {diet.replace('_', ' ')}
                      </Button>
                    ))}
                  </div>
                ) : (
                  <p className="py-2 capitalize">{profile?.diet_type?.replace('_', ' ') || "Not set"}</p>
                )}
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Budget Level</label>
                {isEditing ? (
                  <div className="grid grid-cols-3 gap-2">
                    {['low', 'medium', 'high'].map(budget => (
                      <Button
                        key={budget}
                        variant={editData.budget_level === budget ? "default" : "outline"}
                        onClick={() => setEditData(prev => ({ ...prev, budget_level: budget as any }))}
                        className="capitalize"
                      >
                        {budget}
                      </Button>
                    ))}
                  </div>
                ) : (
                  <p className="py-2 capitalize">{profile?.budget_level || "Not set"}</p>
                )}
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Food Access</label>
                {isEditing ? (
                  <div className="grid grid-cols-2 gap-2">
                    {['cook', 'mess', 'delivery', 'mixed'].map(access => (
                      <Button
                        key={access}
                        variant={editData.food_access === access ? "default" : "outline"}
                        onClick={() => setEditData(prev => ({ ...prev, food_access: access as any }))}
                        className="capitalize"
                      >
                        {access}
                      </Button>
                    ))}
                  </div>
                ) : (
                  <p className="py-2 capitalize">{profile?.food_access || "Not set"}</p>
                )}
              </div>
            </div>
          </GlassCard>
        </motion.div>

        {/* Wellness Preferences */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <GlassCard>
            <h3 className="text-lg font-semibold mb-4">Wellness & Activity</h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Movement Space</label>
                {isEditing ? (
                  <div className="grid grid-cols-2 gap-2">
                    {['room', 'home', 'gym', 'outdoors'].map(space => (
                      <Button
                        key={space}
                        variant={editData.movement_space === space ? "default" : "outline"}
                        onClick={() => setEditData(prev => ({ ...prev, movement_space: space as any }))}
                        className="capitalize"
                      >
                        {space}
                      </Button>
                    ))}
                  </div>
                ) : (
                  <p className="py-2 capitalize">{profile?.movement_space || "Not set"}</p>
                )}
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Activity Background</label>
                {isEditing ? (
                  <div className="grid grid-cols-3 gap-2">
                    {['beginner', 'intermediate', 'advanced'].map(level => (
                      <Button
                        key={level}
                        variant={editData.activity_background === level ? "default" : "outline"}
                        onClick={() => setEditData(prev => ({ ...prev, activity_background: level as any }))}
                        className="capitalize"
                      >
                        {level}
                      </Button>
                    ))}
                  </div>
                ) : (
                  <p className="py-2 capitalize">{profile?.activity_background || "Not set"}</p>
                )}
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Time Availability</label>
                {isEditing ? (
                  <div className="grid grid-cols-3 gap-2">
                    {['5-10min', '15-20min', '30min+'].map(time => (
                      <Button
                        key={time}
                        variant={editData.time_availability === time ? "default" : "outline"}
                        onClick={() => setEditData(prev => ({ ...prev, time_availability: time as any }))}
                      >
                        {time}
                      </Button>
                    ))}
                  </div>
                ) : (
                  <p className="py-2">{profile?.time_availability || "Not set"}</p>
                )}
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Preferred Period Product</label>
                {isEditing ? (
                  <div className="grid grid-cols-2 gap-2">
                    {['pads', 'tampons', 'menstrual_cup', 'cloth', 'period_underwear'].map(product => (
                      <Button
                        key={product}
                        variant={editData.preferred_product === product ? "default" : "outline"}
                        onClick={() => setEditData(prev => ({ ...prev, preferred_product: product as any }))}
                        className="capitalize text-xs"
                      >
                        {product.replace('_', ' ')}
                      </Button>
                    ))}
                  </div>
                ) : (
                  <p className="py-2 capitalize">{profile?.preferred_product?.replace('_', ' ') || "Not set"}</p>
                )}
              </div>
            </div>
          </GlassCard>
        </motion.div>

        {/* Data & Privacy */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <GlassCard className="border-l-4 border-primary">
            <h4 className="font-semibold mb-2">🔒 Your Data is Safe</h4>
            <p className="text-sm text-muted-foreground mb-4">
              Your profile information is stored locally and used only to personalize your AI recommendations. 
              We never share your data with third parties.
            </p>
            
            <div className="pt-4 border-t border-border">
              <h5 className="font-medium text-sm mb-2">Fresh Start</h5>
              <p className="text-xs text-muted-foreground mb-3">
                Want to start over? This will clear all your data including cycle history and preferences.
              </p>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={async () => {
                  if (confirm('Are you sure? This will delete all your data and cannot be undone.')) {
                    await api.resetProfile();
                    navigate('/onboarding');
                  }
                }}
                className="text-red-600 border-red-200 hover:bg-red-50"
              >
                Reset All Data
              </Button>
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </div>
  );
}