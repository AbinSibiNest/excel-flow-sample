import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronLeft, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Settlements() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-border bg-card">
        <div className="flex h-16 items-center px-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(-1)}
            className="mr-4"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            GO BACK
          </Button>
          <h1 className="text-xl font-semibold">Settlements</h1>
        </div>
      </div>

      <div className="p-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Settlements</CardTitle>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Settlement
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-muted-foreground">
              No settlements found. Click "Add Settlement" to create your first settlement.
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}