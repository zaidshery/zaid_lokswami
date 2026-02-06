import { useState } from 'react';
import { Save, User, Bell, Shield, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';

export function SettingsPage() {
  const [saving, setSaving] = useState(false);

  // Profile settings
  const [name, setName] = useState('Admin User');
  const [email, setEmail] = useState('admin@lokswami.in');

  // Notification settings
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [articlePublished, setArticlePublished] = useState(true);
  const [newComment, setNewComment] = useState(false);

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      toast.success('सेटिंग्स सेव हो गईं!');
    }, 1000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold font-hindi">सेटिंग्स</h1>
        <p className="text-muted-foreground">
          अपनी प्राथमिकताएं प्रबंधित करें
        </p>
      </div>

      <Tabs defaultValue="profile">
        <TabsList className="grid w-full grid-cols-4 lg:w-auto">
          <TabsTrigger value="profile" className="gap-2">
            <User className="w-4 h-4" />
            <span className="hidden sm:inline">प्रोफाइल</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="gap-2">
            <Bell className="w-4 h-4" />
            <span className="hidden sm:inline">सूचनाएं</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="gap-2">
            <Shield className="w-4 h-4" />
            <span className="hidden sm:inline">सुरक्षा</span>
          </TabsTrigger>
          <TabsTrigger value="site" className="gap-2">
            <Globe className="w-4 h-4" />
            <span className="hidden sm:inline">साइट</span>
          </TabsTrigger>
        </TabsList>

        {/* Profile Settings */}
        <TabsContent value="profile" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="font-hindi">प्रोफाइल सेटिंग्स</CardTitle>
              <CardDescription>
                अपनी व्यक्तिगत जानकारी अपडेट करें
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>नाम</Label>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="font-hindi"
                />
              </div>
              <div className="space-y-2">
                <Label>ईमेल</Label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <Button onClick={handleSave} disabled={saving} className="gap-2">
                {saving ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    सेव हो रहा है...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    सेव करें
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notification Settings */}
        <TabsContent value="notifications" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="font-hindi">सूचना सेटिंग्स</CardTitle>
              <CardDescription>
                आप किन सूचनाओं को प्राप्त करना चाहते हैं
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">ईमेल सूचनाएं</p>
                  <p className="text-sm text-muted-foreground">
                    सभी सूचनाएं ईमेल पर प्राप्त करें
                  </p>
                </div>
                <Switch
                  checked={emailNotifications}
                  onCheckedChange={setEmailNotifications}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">लेख प्रकाशित</p>
                  <p className="text-sm text-muted-foreground">
                    जब कोई लेख प्रकाशित हो
                  </p>
                </div>
                <Switch
                  checked={articlePublished}
                  onCheckedChange={setArticlePublished}
                  disabled={!emailNotifications}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">नई टिप्पणी</p>
                  <p className="text-sm text-muted-foreground">
                    जब कोई नई टिप्पणी हो
                  </p>
                </div>
                <Switch
                  checked={newComment}
                  onCheckedChange={setNewComment}
                  disabled={!emailNotifications}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Settings */}
        <TabsContent value="security" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="font-hindi">सुरक्षा सेटिंग्स</CardTitle>
              <CardDescription>
                अपना पासवर्ड बदलें
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>वर्तमान पासवर्ड</Label>
                <Input type="password" placeholder="••••••••" />
              </div>
              <div className="space-y-2">
                <Label>नया पासवर्ड</Label>
                <Input type="password" placeholder="••••••••" />
              </div>
              <div className="space-y-2">
                <Label>नया पासवर्ड पुष्टि करें</Label>
                <Input type="password" placeholder="••••••••" />
              </div>
              <Button onClick={handleSave} disabled={saving}>
                पासवर्ड बदलें
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Site Settings */}
        <TabsContent value="site" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="font-hindi">साइट सेटिंग्स</CardTitle>
              <CardDescription>
                वेबसाइट की सामान्य सेटिंग्स
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>साइट का नाम</Label>
                <Input defaultValue="लोकस्वामी" className="font-hindi" />
              </div>
              <div className="space-y-2">
                <Label>साइट का विवरण</Label>
                <Input 
                  defaultValue="मध्य प्रदेश का विश्वसनीय समाचार स्रोत" 
                  className="font-hindi" 
                />
              </div>
              <div className="space-y-2">
                <Label>संपर्क ईमेल</Label>
                <Input defaultValue="editor@lokswami.in" />
              </div>
              <Button onClick={handleSave} disabled={saving}>
                सेव करें
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}