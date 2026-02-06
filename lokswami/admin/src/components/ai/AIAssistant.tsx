import { useState } from 'react';
import { Sparkles, Check, X, Loader2, Wand2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { aiAPI } from '@/services/api';
import { AIOutput } from '@/types';
import { toast } from 'sonner';

interface AIAssistantProps {
  title: string;
  content: string;
  onApply: (data: Partial<AIOutput>) => void;
}

export function AIAssistant({ title, content, onApply }: AIAssistantProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AIOutput | null>(null);

  const handleGenerate = async () => {
    if (!title || !content) {
      toast.error('कृपया पहले शीर्षक और सामग्री दर्ज करें');
      return;
    }

    try {
      setLoading(true);
      const response = await aiAPI.completeAssist(title, content);
      setResult(response.data);
      toast.success('AI विश्लेषण पूरा हुआ!');
    } catch (error) {
      console.error('AI assist failed:', error);
      toast.error('AI सहायक विफल हुआ');
    } finally {
      setLoading(false);
    }
  };

  const handleApplyAll = () => {
    if (result) {
      onApply(result);
      toast.success('सभी सुझाव लागू किए गए!');
      setIsOpen(false);
    }
  };

  const handleApplySection = (section: keyof AIOutput) => {
    if (result) {
      onApply({ [section]: result[section] });
      toast.success(`${section} लागू किया गया!`);
    }
  };

  return (
    <div className="space-y-4">
      {/* AI Button */}
      <Button
        type="button"
        variant="outline"
        onClick={() => {
          setIsOpen(!isOpen);
          if (!isOpen && !result) {
            handleGenerate();
          }
        }}
        disabled={loading}
        className="w-full gap-2 border-dashed border-2 hover:border-maroon hover:bg-maroon/5"
      >
        {loading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <Sparkles className="w-4 h-4 text-saffron" />
        )}
        <span className="font-hindi">✨ AI सहायक</span>
      </Button>

      {/* AI Results Panel */}
      {isOpen && (
        <Card className="border-saffron/30">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-hindi flex items-center gap-2">
                <Wand2 className="w-4 h-4 text-saffron" />
                AI सुझाव
              </CardTitle>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setIsOpen(false)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-4">
            {!result ? (
              <div className="text-center py-8">
                <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2 text-saffron" />
                <p className="text-sm text-muted-foreground font-hindi">
                  विश्लेषण हो रहा है...
                </p>
              </div>
            ) : (
              <>
                {/* Summary Section */}
                {result.summary.length > 0 && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-medium font-hindi">सारांश</h4>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleApplySection('summary')}
                      >
                        <Check className="w-4 h-4 mr-1" />
                        लागू करें
                      </Button>
                    </div>
                    <ul className="space-y-1 bg-muted/50 rounded-lg p-3">
                      {result.summary.map((point, index) => (
                        <li key={index} className="text-sm flex gap-2">
                          <span className="text-saffron font-bold">•</span>
                          <span className="font-hindi">{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Tags Section */}
                {result.tags.length > 0 && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-medium font-hindi">टैग्स</h4>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleApplySection('tags')}
                      >
                        <Check className="w-4 h-4 mr-1" />
                        लागू करें
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {result.tags.map((tag, index) => (
                        <Badge key={index} variant="secondary" className="font-hindi">
                          #{tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* SEO Section */}
                {result.seo && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-medium font-hindi">SEO</h4>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleApplySection('seo')}
                      >
                        <Check className="w-4 h-4 mr-1" />
                        लागू करें
                      </Button>
                    </div>
                    <div className="bg-muted/50 rounded-lg p-3 space-y-2">
                      <div>
                        <span className="text-xs text-muted-foreground">Title:</span>
                        <p className="text-sm font-hindi">{result.seo.title}</p>
                      </div>
                      <div>
                        <span className="text-xs text-muted-foreground">Meta Description:</span>
                        <p className="text-sm font-hindi">{result.seo.metaDescription}</p>
                      </div>
                      <div>
                        <span className="text-xs text-muted-foreground">Keywords:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {result.seo.keywords.map((kw, index) => (
                            <Badge key={index} variant="outline" className="text-xs font-hindi">
                              {kw}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Apply All Button */}
                <Button
                  onClick={handleApplyAll}
                  className="w-full gap-2"
                >
                  <Check className="w-4 h-4" />
                  सभी लागू करें
                </Button>
              </>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}