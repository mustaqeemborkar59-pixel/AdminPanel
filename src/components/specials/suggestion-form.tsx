
"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles, AlertTriangle, Loader2, Lightbulb } from 'lucide-react';
import { getSpecialSuggestions } from '@/app/specials/actions';
import type { SuggestDailySpecialOutput } from '@/ai/flows/suggest-daily-special';

export function SuggestionForm() {
  const [ingredients, setIngredients] = useState('');
  const [inventory, setInventory] = useState('{\n  "tomatoes": 10,\n  "basil": 5,\n  "pasta": 20\n}'); // Default example
  const [suggestions, setSuggestions] = useState<SuggestDailySpecialOutput | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuggestions(null);

    let parsedInventory = {};
    try {
      parsedInventory = JSON.parse(inventory);
    } catch (jsonError) {
      setError("Invalid JSON format for current inventory. Please check and try again.");
      setIsLoading(false);
      return;
    }

    const input = {
      availableIngredients: ingredients.split(',').map(s => s.trim()).filter(s => s),
      currentInventory: parsedInventory,
    };

    const result = await getSpecialSuggestions(input);

    if ('error' in result) {
      setError(result.error);
    } else {
      setSuggestions(result);
    }
    setIsLoading(false);
  };

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline flex items-center"><Lightbulb className="mr-2 h-5 w-5 text-primary" />Input Details</CardTitle>
          <CardDescription className="font-body">
            Enter your available ingredients and current stock levels to get AI-powered special suggestions.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="ingredients" className="font-body">Available Ingredients (comma-separated)</Label>
              <Textarea
                id="ingredients"
                value={ingredients}
                onChange={(e) => setIngredients(e.target.value)}
                placeholder="e.g., tomatoes, basil, chicken, pasta, olive oil"
                className="font-body mt-1"
                rows={3}
                required
              />
            </div>
            <div>
              <Label htmlFor="inventory" className="font-body">Current Inventory (JSON format)</Label>
              <Textarea
                id="inventory"
                value={inventory}
                onChange={(e) => setInventory(e.target.value)}
                placeholder='e.g., {"tomatoes": 10, "basil": 5, "pasta": 20}'
                className="font-body mt-1 font-code text-sm"
                rows={5}
                required
              />
              <p className="text-xs text-muted-foreground mt-1 font-body">Example: Quantity in units (e.g., kg, pieces).</p>
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={isLoading} className="w-full font-body">
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
              Get Suggestions
            </Button>
          </CardFooter>
        </form>
      </Card>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline flex items-center"><Sparkles className="mr-2 h-5 w-5 text-accent" />Suggested Specials</CardTitle>
          <CardDescription className="font-body">
            AI-generated specials based on your inputs, designed to minimize waste and maximize profit.
          </CardDescription>
        </CardHeader>
        <CardContent className="min-h-[200px]">
          {isLoading && (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
              <Loader2 className="h-8 w-8 animate-spin mb-2" />
              <p className="font-body">Generating suggestions...</p>
            </div>
          )}
          {error && (
            <div className="text-destructive bg-destructive/10 p-3 rounded-md">
              <div className="flex items-center">
                <AlertTriangle className="h-5 w-5 mr-2" />
                <strong className="font-body">Error</strong>
              </div>
              <p className="font-body text-sm mt-1">{error}</p>
            </div>
          )}
          {suggestions && !error && (
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold font-body text-foreground mb-1">Suggestions:</h3>
                {suggestions.suggestedSpecials.length > 0 ? (
                  <ul className="list-disc list-inside space-y-1 font-body text-sm text-muted-foreground pl-1">
                    {suggestions.suggestedSpecials.map((special, index) => (
                      <li key={index}>{special}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="font-body text-sm text-muted-foreground">No specific specials suggested with the current input.</p>
                )}
              </div>
              <div>
                <h3 className="font-semibold font-body text-foreground mb-1">Reasoning:</h3>
                <p className="font-body text-sm text-muted-foreground whitespace-pre-wrap">{suggestions.reasoning}</p>
              </div>
            </div>
          )}
          {!isLoading && !error && !suggestions && (
             <div className="flex items-center justify-center h-full text-muted-foreground">
                <p className="font-body">Enter ingredients and inventory to see suggestions.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
