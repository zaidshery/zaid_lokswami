import { useState } from 'react';
import { Upload, Image as ImageIcon, FileText, X, Copy, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';

// Sample media data - in production, this would come from the API
const sampleImages = [
  { id: '1', url: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=400', name: 'news-1.jpg', size: '2.4 MB' },
  { id: '2', url: 'https://images.unsplash.com/photo-1495020689067-958852a7765e?w=400', name: 'news-2.jpg', size: '1.8 MB' },
  { id: '3', url: 'https://images.unsplash.com/photo-1523995462485-3d171b5c8fa9?w=400', name: 'news-3.jpg', size: '3.1 MB' },
  { id: '4', url: 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=400', name: 'news-4.jpg', size: '2.2 MB' },
];

const samplePDFs = [
  { id: '1', url: '#', name: 'epaper-2024-02-05.pdf', size: '5.2 MB', date: '2024-02-05' },
  { id: '2', url: '#', name: 'epaper-2024-02-04.pdf', size: '4.8 MB', date: '2024-02-04' },
];

export function MediaPage() {
  const [activeTab, setActiveTab] = useState('images');
  const [uploading, setUploading] = useState(false);

  const handleUpload = () => {
    setUploading(true);
    setTimeout(() => {
      setUploading(false);
      toast.success('फाइल अपलोड हो गई!');
    }, 2000);
  };

  const handleCopyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    toast.success('URL कॉपी हो गया!');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-hindi">मीडिया</h1>
          <p className="text-muted-foreground">
            छवियां और PDF प्रबंधित करें
          </p>
        </div>
        <Button onClick={handleUpload} disabled={uploading} className="gap-2">
          {uploading ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              अपलोड हो रहा है...
            </>
          ) : (
            <>
              <Upload className="w-4 h-4" />
              अपलोड करें
            </>
          )}
        </Button>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="images" className="gap-2">
            <ImageIcon className="w-4 h-4" />
            छवियां
          </TabsTrigger>
          <TabsTrigger value="pdfs" className="gap-2">
            <FileText className="w-4 h-4" />
            PDF
          </TabsTrigger>
        </TabsList>

        {/* Images Tab */}
        <TabsContent value="images" className="mt-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {sampleImages.map((image) => (
              <Card key={image.id} className="group overflow-hidden">
                <CardContent className="p-0">
                  <div className="relative aspect-square">
                    <img
                      src={image.url}
                      alt={image.name}
                      className="w-full h-full object-cover"
                    />
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <Button
                        variant="secondary"
                        size="icon"
                        onClick={() => handleCopyUrl(image.url)}
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                      <a href={image.url} target="_blank" rel="noopener noreferrer">
                        <Button variant="secondary" size="icon">
                          <ExternalLink className="w-4 h-4" />
                        </Button>
                      </a>
                    </div>
                  </div>
                  <div className="p-3">
                    <p className="text-sm font-medium truncate">{image.name}</p>
                    <p className="text-xs text-muted-foreground">{image.size}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* PDFs Tab */}
        <TabsContent value="pdfs" className="mt-6">
          <div className="space-y-2">
            {samplePDFs.map((pdf) => (
              <Card key={pdf.id}>
                <CardContent className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                      <FileText className="w-6 h-6 text-red-600" />
                    </div>
                    <div>
                      <p className="font-medium">{pdf.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {pdf.size} • {pdf.date}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleCopyUrl(pdf.url)}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                    <a href={pdf.url} target="_blank" rel="noopener noreferrer">
                      <Button variant="ghost" size="icon">
                        <ExternalLink className="w-4 h-4" />
                      </Button>
                    </a>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}