import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Download, Upload, ArrowLeft } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

const Cases = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("cases");

  useEffect(() => {
    if (location.state?.activeTab) {
      setActiveTab(location.state.activeTab);
    }
  }, [location.state]);

  // Mock data for cases table
  const casesData = [
    {
      case: "Kenneth v. ...",
      leadCounsel: "Andrews ...",
      plaintiff: "Brian Kenn...",
      defendant: "Star Insura...",
      caseType: "Stryker Hip...",
      created: "7/14/2025",
      filed: "7/15/2025",
      sol: "7/31/2025",
      status: "Active",
      grossSettlement: "$25,000.00"
    },
    {
      case: "Clarke v. A...",
      leadCounsel: "Kirkland & ...",
      plaintiff: "Ashlyn Cla...",
      defendant: "Amelia Oli...",
      caseType: "MVA Injury",
      created: "7/10/2025",
      filed: "7/10/2024",
      sol: "1/15/2026",
      status: "Active",
      grossSettlement: "$985,000.00"
    },
    {
      case: "Clarke v. Li...",
      leadCounsel: "Norton Ro...",
      plaintiff: "Ashlyn Cla...",
      defendant: "Liam Olivia",
      caseType: "MVA Injury",
      created: "7/10/2025",
      filed: "-",
      sol: "-",
      status: "Draft",
      grossSettlement: "$800,000.00"
    }
  ];

  // Mock data for settlements table
  const settlementsData = [
    {
      case: "John v. Fas-duval",
      entryDate: "4/21/2025",
      settledAmount: "$1,000.00",
      attorneysFees: "-",
      deductions: "-",
      netSettlement: "-",
      status: "Draft",
      paymentDate: "-"
    },
    {
      case: "Smith v. Uber Tech",
      entryDate: "3/12/2025",
      settledAmount: "$200,000.00",
      attorneysFees: "$66,666.67",
      deductions: "$5,000.00",
      netSettlement: "$128,333.33",
      status: "Paid",
      paymentDate: "3/15/2025"
    },
    {
      case: "Myers v. CooperSur",
      entryDate: "4/7/2025",
      settledAmount: "$100,000.00",
      attorneysFees: "$33,333.33",
      deductions: "$2,500.00",
      netSettlement: "$64,166.67",
      status: "Active",
      paymentDate: "-"
    }
  ];

  const handleUploadSettlement = () => {
    navigate("/cases/upload-settlement", { state: { returnTab: "settlements" } });
  };

  return (
    <div className="flex h-screen bg-[#1a1f26] text-gray-100">
      {/* Left Sidebar Filters */}
      <div className="w-80 bg-[#1e2328] border-r border-gray-700 p-6">
        <div className="space-y-6">
          {/* Search */}
          <div>
            <input
              type="text"
              placeholder="Search"
              className="w-full px-3 py-2 bg-[#2a2f36] border border-gray-600 rounded-md text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>

          {/* Firm Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              🏢 FIRM
            </label>
            <select className="w-full px-3 py-2 bg-[#2a2f36] border border-gray-600 rounded-md text-gray-100 focus:outline-none focus:ring-2 focus:ring-cyan-500">
              <option>Firm</option>
            </select>
          </div>

          {/* Client Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              👤 CLIENT
            </label>
            <select className="w-full px-3 py-2 bg-[#2a2f36] border border-gray-600 rounded-md text-gray-100 focus:outline-none focus:ring-2 focus:ring-cyan-500">
              <option>Client</option>
            </select>
          </div>

          {/* Defendant Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              🏛️ DEFENDANT
            </label>
            <select className="w-full px-3 py-2 bg-[#2a2f36] border border-gray-600 rounded-md text-gray-100 focus:outline-none focus:ring-2 focus:ring-cyan-500">
              <option>Defendant</option>
            </select>
          </div>

          {/* Case Type Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              ⚖️ CASE TYPE
            </label>
            <select className="w-full px-3 py-2 bg-[#2a2f36] border border-gray-600 rounded-md text-gray-100 focus:outline-none focus:ring-2 focus:ring-cyan-500">
              <option>Case Type</option>
            </select>
          </div>

          {/* Created Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              🕐 CREATED
            </label>
            <div className="space-y-2">
              <div className="text-sm text-gray-400 hover:text-white cursor-pointer">Today</div>
              <div className="text-sm text-gray-400 hover:text-white cursor-pointer">This Week</div>
              <div className="text-sm text-gray-400 hover:text-white cursor-pointer">Last Week</div>
              <div className="text-sm text-gray-400 hover:text-white cursor-pointer">This Month</div>
              <div className="text-sm text-gray-400 hover:text-white cursor-pointer">Last Month</div>
              <div className="text-sm text-gray-400 hover:text-white cursor-pointer">Earlier</div>
            </div>
          </div>

          {activeTab === "settlements" && (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                📊 STATUS
              </label>
              <div className="space-y-2">
                <div className="text-sm text-gray-400 hover:text-white cursor-pointer">Draft</div>
                <div className="text-sm text-gray-400 hover:text-white cursor-pointer">Unpaid</div>
                <div className="text-sm text-gray-400 hover:text-white cursor-pointer">Initiating Funding</div>
                <div className="text-sm text-gray-400 hover:text-white cursor-pointer">Waiting Funds</div>
                <div className="text-sm text-gray-400 hover:text-white cursor-pointer">Distributing Atty Fees</div>
                <div className="text-sm text-gray-400 hover:text-white cursor-pointer">Distributing Deductions</div>
                <div className="text-sm text-gray-400 hover:text-white cursor-pointer">Distributing Net Settlement</div>
                <div className="text-sm text-gray-400 hover:text-white cursor-pointer">Paid</div>
                <div className="text-sm text-gray-400 hover:text-white cursor-pointer">Error</div>
                <div className="text-sm text-gray-400 hover:text-white cursor-pointer">Critical Error</div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="border-b border-gray-700 p-6">
          <h1 className="text-2xl font-bold text-white">Cases</h1>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
          <div className="border-b border-gray-700">
            <TabsList className="bg-transparent h-auto p-0">
              <TabsTrigger
                value="cases"
                className="px-6 py-3 text-gray-400 data-[state=active]:text-white data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-cyan-500 rounded-none"
              >
                HOME
              </TabsTrigger>
              <TabsTrigger
                value="attorneys-fees"
                className="px-6 py-3 text-gray-400 data-[state=active]:text-white data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-cyan-500 rounded-none"
              >
                ATTORNEYS' FEES
              </TabsTrigger>
              <TabsTrigger
                value="document-requests"
                className="px-6 py-3 text-gray-400 data-[state=active]:text-white data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-cyan-500 rounded-none"
              >
                DOCUMENT REQUESTS
              </TabsTrigger>
              <TabsTrigger
                value="signature-requests"
                className="px-6 py-3 text-gray-400 data-[state=active]:text-white data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-cyan-500 rounded-none"
              >
                SIGNATURE REQUESTS
              </TabsTrigger>
              <TabsTrigger
                value="data-requests"
                className="px-6 py-3 text-gray-400 data-[state=active]:text-white data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-cyan-500 rounded-none"
              >
                DATA REQUESTS
              </TabsTrigger>
              <TabsTrigger
                value="deductions"
                className="px-6 py-3 text-gray-400 data-[state=active]:text-white data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-cyan-500 rounded-none"
              >
                DEDUCTIONS
              </TabsTrigger>
              <TabsTrigger
                value="settlements"
                className="px-6 py-3 text-gray-400 data-[state=active]:text-white data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-cyan-500 rounded-none"
              >
                SETTLEMENTS
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Tab Content */}
          <div className="flex-1 flex flex-col">
            <TabsContent value="cases" className="flex-1 m-0 p-6">
              {/* Action Buttons */}
              <div className="flex justify-end gap-3 mb-6">
                <Button variant="outline" className="bg-transparent border-gray-600 text-gray-300 hover:bg-gray-700">
                  <Download className="h-4 w-4 mr-2" />
                  EXPORT
                </Button>
                <Button className="bg-green-600 hover:bg-green-700 text-white">
                  <Plus className="h-4 w-4 mr-2" />
                  CREATE
                </Button>
              </div>

              {/* Cases Table */}
              <div className="bg-[#1e2328] rounded-lg border border-gray-700">
                <Table>
                  <TableHeader>
                    <TableRow className="border-gray-700">
                      <TableHead className="text-gray-300">Case</TableHead>
                      <TableHead className="text-gray-300">Lead Counsel</TableHead>
                      <TableHead className="text-gray-300">Plaintiff</TableHead>
                      <TableHead className="text-gray-300">Defendant</TableHead>
                      <TableHead className="text-gray-300">Case Type</TableHead>
                      <TableHead className="text-gray-300">Created</TableHead>
                      <TableHead className="text-gray-300">Filed</TableHead>
                      <TableHead className="text-gray-300">SOL</TableHead>
                      <TableHead className="text-gray-300">Status</TableHead>
                      <TableHead className="text-gray-300">Gross Settlement</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {casesData.map((row, index) => (
                      <TableRow key={index} className="border-gray-700 hover:bg-gray-800/50">
                        <TableCell className="text-cyan-400 cursor-pointer hover:underline">{row.case}</TableCell>
                        <TableCell className="text-gray-300">{row.leadCounsel}</TableCell>
                        <TableCell className="text-gray-300">{row.plaintiff}</TableCell>
                        <TableCell className="text-gray-300">{row.defendant}</TableCell>
                        <TableCell className="text-gray-300">{row.caseType}</TableCell>
                        <TableCell className="text-gray-300">{row.created}</TableCell>
                        <TableCell className="text-gray-300">{row.filed}</TableCell>
                        <TableCell className="text-gray-300">{row.sol}</TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded text-xs ${
                            row.status === "Active" ? "bg-green-600/20 text-green-400" : "bg-gray-600/20 text-gray-400"
                          }`}>
                            {row.status}
                          </span>
                        </TableCell>
                        <TableCell className="text-gray-300">{row.grossSettlement}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            <TabsContent value="settlements" className="flex-1 m-0 p-6">
              {/* Action Buttons */}
              <div className="flex justify-end gap-3 mb-6">
                <Button variant="outline" className="bg-transparent border-gray-600 text-gray-300 hover:bg-gray-700">
                  <Download className="h-4 w-4 mr-2" />
                  EXPORT
                </Button>
                <Button 
                  variant="outline" 
                  className="bg-transparent border-blue-600 text-blue-400 hover:bg-blue-600/20"
                  onClick={handleUploadSettlement}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  UPLOAD SETTLEMENT DOCUMENT
                </Button>
                <Button className="bg-green-600 hover:bg-green-700 text-white">
                  <Plus className="h-4 w-4 mr-2" />
                  CREATE
                </Button>
              </div>

              {/* Settlements Table */}
              <div className="bg-[#1e2328] rounded-lg border border-gray-700">
                <Table>
                  <TableHeader>
                    <TableRow className="border-gray-700">
                      <TableHead className="text-gray-300">Case</TableHead>
                      <TableHead className="text-gray-300">Entry Date</TableHead>
                      <TableHead className="text-gray-300">Settled Amount</TableHead>
                      <TableHead className="text-gray-300">Attorneys' Fees</TableHead>
                      <TableHead className="text-gray-300">Deductions</TableHead>
                      <TableHead className="text-gray-300">Net Settlement</TableHead>
                      <TableHead className="text-gray-300">Status</TableHead>
                      <TableHead className="text-gray-300">Payment Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {settlementsData.map((row, index) => (
                      <TableRow key={index} className="border-gray-700 hover:bg-gray-800/50">
                        <TableCell className="text-cyan-400 cursor-pointer hover:underline">{row.case}</TableCell>
                        <TableCell className="text-gray-300">{row.entryDate}</TableCell>
                        <TableCell className="text-gray-300">{row.settledAmount}</TableCell>
                        <TableCell className="text-gray-300">{row.attorneysFees}</TableCell>
                        <TableCell className="text-gray-300">{row.deductions}</TableCell>
                        <TableCell className="text-gray-300">{row.netSettlement}</TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded text-xs ${
                            row.status === "Paid" ? "bg-green-600/20 text-green-400" :
                            row.status === "Active" ? "bg-green-600/20 text-green-400" :
                            "bg-gray-600/20 text-gray-400"
                          }`}>
                            {row.status}
                          </span>
                        </TableCell>
                        <TableCell className="text-gray-300">{row.paymentDate}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              <div className="flex items-center justify-end gap-4 mt-6">
                <span className="text-gray-400 text-sm">Rows per page: 20</span>
                <span className="text-gray-400 text-sm">1-1 of 1</span>
                <div className="flex gap-1">
                  <Button variant="outline" size="sm" className="bg-transparent border-gray-600 text-gray-400">
                    &lt;
                  </Button>
                  <Button variant="outline" size="sm" className="bg-cyan-600/20 border-cyan-600 text-cyan-400">
                    1
                  </Button>
                  <Button variant="outline" size="sm" className="bg-transparent border-gray-600 text-gray-400">
                    &gt;
                  </Button>
                </div>
              </div>
            </TabsContent>

            {/* Placeholder tabs */}
            <TabsContent value="attorneys-fees" className="flex-1 m-0 p-6">
              <div className="text-center text-gray-400 mt-20">
                <h3 className="text-lg font-medium">Attorneys' Fees</h3>
                <p>Content coming soon...</p>
              </div>
            </TabsContent>

            <TabsContent value="document-requests" className="flex-1 m-0 p-6">
              <div className="text-center text-gray-400 mt-20">
                <h3 className="text-lg font-medium">Document Requests</h3>
                <p>Content coming soon...</p>
              </div>
            </TabsContent>

            <TabsContent value="signature-requests" className="flex-1 m-0 p-6">
              <div className="text-center text-gray-400 mt-20">
                <h3 className="text-lg font-medium">Signature Requests</h3>
                <p>Content coming soon...</p>
              </div>
            </TabsContent>

            <TabsContent value="data-requests" className="flex-1 m-0 p-6">
              <div className="text-center text-gray-400 mt-20">
                <h3 className="text-lg font-medium">Data Requests</h3>
                <p>Content coming soon...</p>
              </div>
            </TabsContent>

            <TabsContent value="deductions" className="flex-1 m-0 p-6">
              <div className="text-center text-gray-400 mt-20">
                <h3 className="text-lg font-medium">Deductions</h3>
                <p>Content coming soon...</p>
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
};

export default Cases;