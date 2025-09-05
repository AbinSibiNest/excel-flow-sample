import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Settlements() {
  const navigate = useNavigate();

  // Mock data for payments
  const paymentsData = {
    liens: [
      {
        id: 1,
        vendor: "Medical Lien LLC",
        lineItem: "Hospital treatment for case #12345",
        amount: "$15,000.00",
        preferredMethod: "ACH",
        accountHint: "****1234",
        status: "To Be Paid"
      },
      {
        id: 2,
        vendor: "Legal Services Corp",
        lineItem: "Attorney fees - settlement negotiation",
        amount: "$8,500.00",
        preferredMethod: "Check",
        accountHint: "New York, NY 10001",
        status: "Queued"
      }
    ],
    expenses: [
      {
        id: 3,
        vendor: "Expert Witness Co",
        lineItem: "Medical expert testimony",
        amount: "$3,200.00",
        preferredMethod: "ACH",
        accountHint: "****5678",
        status: "Sent"
      },
      {
        id: 4,
        vendor: "Court Filing Services",
        lineItem: "Document filing fees",
        amount: "$450.00",
        preferredMethod: "Check",
        accountHint: "Chicago, IL 60601",
        status: "Failed"
      }
    ]
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "To Be Paid": return "secondary";
      case "Queued": return "default";
      case "Sent": return "default";
      case "Failed": return "destructive";
      default: return "secondary";
    }
  };

  const PaymentTable = ({ data, title }: { data: any[], title: string }) => (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <Checkbox />
              </TableHead>
              <TableHead>Vendor</TableHead>
              <TableHead>Line Item</TableHead>
              <TableHead>Amount (Remaining)</TableHead>
              <TableHead>Preferred Method</TableHead>
              <TableHead>Payee Account</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((item) => (
              <TableRow key={item.id}>
                <TableCell>
                  <Checkbox />
                </TableCell>
                <TableCell className="font-medium">{item.vendor}</TableCell>
                <TableCell>{item.lineItem}</TableCell>
                <TableCell>{item.amount}</TableCell>
                <TableCell>
                  <Select defaultValue={item.preferredMethod}>
                    <SelectTrigger className="w-24">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ACH">ACH</SelectItem>
                      <SelectItem value="Check">Check</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell className="text-muted-foreground">{item.accountHint}</TableCell>
                <TableCell>
                  <Badge variant={getStatusVariant(item.status)}>{item.status}</Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );

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
              <CardTitle>Settlement Details</CardTitle>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Settlement
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="home" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="home">HOME</TabsTrigger>
                <TabsTrigger value="details">DETAILS</TabsTrigger>
                <TabsTrigger value="payments">PAYMENTS</TabsTrigger>
                <TabsTrigger value="timeline">TIMELINE</TabsTrigger>
              </TabsList>
              
              <TabsContent value="home" className="mt-6">
                <div className="text-center py-8 text-muted-foreground">
                  Settlement overview and summary information will be displayed here.
                </div>
              </TabsContent>
              
              <TabsContent value="details" className="mt-6">
                <div className="text-center py-8 text-muted-foreground">
                  Detailed settlement information and documentation will be displayed here.
                </div>
              </TabsContent>
              
              <TabsContent value="payments" className="mt-6">
                <div className="space-y-6">
                  <PaymentTable data={paymentsData.liens} title="Liens" />
                  <PaymentTable data={paymentsData.expenses} title="Expenses" />
                </div>
              </TabsContent>
              
              <TabsContent value="timeline" className="mt-6">
                <div className="text-center py-8 text-muted-foreground">
                  Settlement timeline and milestones will be displayed here.
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}