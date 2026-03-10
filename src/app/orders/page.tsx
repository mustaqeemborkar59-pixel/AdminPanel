
"use client";
import { useState, useEffect } from 'react';
import { PageHeader } from '@/components/page-header';
import { getOrdersFromWooCommerce } from './actions';
import { useToast } from '@/hooks/use-toast';
import { Loader2, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function OrdersPage() {
  const [rawData, setRawData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchRawData = async () => {
    setIsLoading(true);
    setError(null);
    const result = await getOrdersFromWooCommerce();
    if (result.success) {
      setRawData(result.data);
      toast({
        title: "Data Fetched Successfully",
        description: "Raw JSON data from WooCommerce is displayed below.",
      });
    } else {
      setError(result.error || "An unknown error occurred.");
      toast({
        variant: "destructive",
        title: "Failed to Fetch Data",
        description: result.error || "Could not fetch data from WooCommerce.",
      });
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchRawData();
  }, [toast]);

  return (
    <div className="flex flex-col h-full">
      <PageHeader
        title="Raw Order Data Viewer"
        description="Displaying raw, unmapped JSON data directly from the WooCommerce API."
        actions={
          <Button onClick={fetchRawData} disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Refresh Data
          </Button>
        }
      />
      <div className="flex-1 p-4 md:p-6 overflow-auto">
        {isLoading ? (
          <div className="flex justify-center items-center h-full">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="ml-4 text-muted-foreground">Fetching data from WooCommerce...</p>
          </div>
        ) : error ? (
          <Card className="border-destructive bg-destructive/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-destructive">
                <AlertTriangle /> Fetch Error
              </CardTitle>
              <CardDescription className="text-destructive/80">
                There was a problem communicating with the WooCommerce server.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="font-semibold">Error Details:</p>
              <pre className="mt-2 p-3 bg-destructive/10 border border-destructive/20 rounded-md text-sm text-destructive font-mono">
                {error}
              </pre>
            </CardContent>
          </Card>
        ) : (
          <Card>
             <CardHeader>
              <CardTitle>Raw JSON Response</CardTitle>
               <CardDescription>
                This is the actual data received from the server, before any processing or mapping.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <pre className="p-4 bg-muted rounded-lg text-xs overflow-auto max-h-[60vh]">
                {JSON.stringify(rawData, null, 2)}
              </pre>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
