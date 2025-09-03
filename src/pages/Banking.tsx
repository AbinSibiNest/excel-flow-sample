import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChevronLeft, Plus, MoreHorizontal, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Banking() {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="p-6 bg-background min-h-screen">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" size="sm" onClick={handleGoBack} className="text-muted-foreground hover:text-foreground">
          <ChevronLeft className="h-4 w-4 mr-1" />
          GO BACK
        </Button>
      </div>

      {/* Navigation Tabs */}
      <div className="flex gap-6 mb-8 border-b border-border">
        {['HOME', 'USERS', 'BANKING', 'CASE TYPES', 'QUESTIONNAIRES', 'SNIPPETS', 'CASES', 'CLIENTS', 'DEFENDANTS', 'DOCUMENT REQUESTS', 'SIGNATURE REQUESTS', 'DATA REQUESTS', 'DEDUCTIONS', 'SETTLEMENTS'].map((tab) => (
          <button
            key={tab}
            className={`pb-3 px-1 text-sm font-medium border-b-2 transition-colors ${
              tab === 'BANKING' 
                ? 'border-primary text-foreground' 
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Integration Details */}
        <div className="lg:col-span-1">
          <Card className="bg-card">
            <CardHeader>
              <CardTitle className="text-foreground">Integration Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-foreground">Provisioning</span>
                <span className="bg-green-600 text-white px-2 py-1 rounded text-xs">COMPLETED</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-foreground">OFAC</span>
                <span className="bg-green-600 text-white px-2 py-1 rounded text-xs">VERIFIED</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* System Accounts */}
        <div className="lg:col-span-3">
          <Card className="bg-card">
            <CardHeader>
              <CardTitle className="text-foreground">System Accounts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Revenue Recognition */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium text-foreground">Revenue Recognition</h3>
                    <span className="bg-green-600 text-white px-2 py-1 rounded text-xs">ACTIVE</span>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">Account Number</div>
                    <div className="text-sm text-foreground">76650000022367</div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">Routing Number (ABA)</div>
                    <div className="text-sm text-foreground">053101561</div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">Current Balance</div>
                    <div className="text-2xl font-bold text-foreground">$880.00</div>
                  </div>
                  <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90">
                    $ WITHDRAW FUNDS
                  </Button>
                </div>

                {/* Expense Reimbursement */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium text-foreground">Expense Reimbursement</h3>
                    <span className="bg-green-600 text-white px-2 py-1 rounded text-xs">ACTIVE</span>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">Account Number</div>
                    <div className="text-sm text-foreground">76650000022368</div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">Routing Number (ABA)</div>
                    <div className="text-sm text-foreground">053101561</div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">Current Balance</div>
                    <div className="text-2xl font-bold text-foreground">$0.00</div>
                  </div>
                  <Button size="sm" variant="secondary" disabled className="opacity-50">
                    $ WITHDRAW FUNDS
                  </Button>
                </div>

                {/* Lien Resolution */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium text-foreground">Lien Resolution</h3>
                    <span className="bg-green-600 text-white px-2 py-1 rounded text-xs">ACTIVE</span>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">Account Number</div>
                    <div className="text-sm text-foreground">76650000022357</div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">Routing Number (ABA)</div>
                    <div className="text-sm text-foreground">053101561</div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">Current Balance</div>
                    <div className="text-2xl font-bold text-foreground">$0.00</div>
                  </div>
                  <Button size="sm" variant="secondary" disabled className="opacity-50">
                    $ WITHDRAW FUNDS
                  </Button>
                </div>

                {/* Case Clearing */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium text-foreground">Case Clearing</h3>
                    <span className="bg-green-600 text-white px-2 py-1 rounded text-xs">ACTIVE</span>
                  </div>
                  <div className="text-muted-foreground text-center py-8">
                    No information about this account, or it has not been created yet.
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Unrestricted Accounts */}
      <Card className="mt-6 bg-card">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-foreground">Unrestricted Accounts</CardTitle>
          <Button variant="outline" size="sm" className="text-primary border-primary hover:bg-primary hover:text-primary-foreground">
            <Plus className="h-4 w-4 mr-2" />
            ADD UNRESTRICTED ACCOUNT
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-border">
                <TableHead className="text-muted-foreground">Created ↑</TableHead>
                <TableHead className="text-muted-foreground">Name</TableHead>
                <TableHead className="text-muted-foreground">Account Type</TableHead>
                <TableHead className="text-muted-foreground">Account Number</TableHead>
                <TableHead className="text-muted-foreground">Routing Number</TableHead>
                <TableHead className="text-muted-foreground">Account Status</TableHead>
                <TableHead className="text-muted-foreground">Verification Status</TableHead>
                <TableHead className="text-muted-foreground"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow className="border-border">
                <TableCell className="text-foreground">3/12/2025</TableCell>
                <TableCell className="text-foreground">Operating</TableCell>
                <TableCell className="text-foreground">Checking</TableCell>
                <TableCell className="text-foreground">8771615402</TableCell>
                <TableCell className="text-foreground">021000021</TableCell>
                <TableCell className="text-foreground">Active</TableCell>
                <TableCell className="text-foreground">Verified</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" className="text-xs">
                      ➜ MORE
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Trash2 className="h-4 w-4" />
                      DELETE
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Rows per page:</span>
              <Select defaultValue="20">
                <SelectTrigger className="w-16 h-8">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="20">20</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                  <SelectItem value="100">100</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground">1-1 of 1</span>
              <div className="flex gap-1">
                <Button variant="outline" size="sm" disabled>←</Button>
                <Button variant="outline" size="sm" className="bg-primary text-primary-foreground">1</Button>
                <Button variant="outline" size="sm" disabled>→</Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Trust Accounts */}
      <Card className="mt-6 bg-card">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-foreground">Trust Accounts</CardTitle>
          <Button variant="outline" size="sm" className="text-primary border-primary hover:bg-primary hover:text-primary-foreground">
            <Plus className="h-4 w-4 mr-2" />
            ADD TRUST ACCOUNT
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-border">
                <TableHead className="text-muted-foreground">Created ↑</TableHead>
                <TableHead className="text-muted-foreground">Name</TableHead>
                <TableHead className="text-muted-foreground">Account Type</TableHead>
                <TableHead className="text-muted-foreground">Account Number</TableHead>
                <TableHead className="text-muted-foreground">Routing Number</TableHead>
                <TableHead className="text-muted-foreground">Account Status</TableHead>
                <TableHead className="text-muted-foreground">Verification Status</TableHead>
                <TableHead className="text-muted-foreground"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow className="border-border">
                <TableCell className="text-foreground">3/12/2025</TableCell>
                <TableCell className="text-foreground">IOLTA 2025</TableCell>
                <TableCell className="text-foreground">Checking</TableCell>
                <TableCell className="text-foreground">1122334455</TableCell>
                <TableCell className="text-foreground">021000021</TableCell>
                <TableCell className="text-foreground">Active</TableCell>
                <TableCell className="text-foreground">Verified</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" className="text-xs">
                      ➜ MORE
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Trash2 className="h-4 w-4" />
                      DELETE
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Rows per page:</span>
              <Select defaultValue="20">
                <SelectTrigger className="w-16 h-8">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="20">20</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                  <SelectItem value="100">100</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground">1-1 of 1</span>
              <div className="flex gap-1">
                <Button variant="outline" size="sm" disabled>←</Button>
                <Button variant="outline" size="sm" className="bg-primary text-primary-foreground">1</Button>
                <Button variant="outline" size="sm" disabled>→</Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}