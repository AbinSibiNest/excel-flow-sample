import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Download, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Cases = () => {
  const navigate = useNavigate();

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

  const handleViewCaseDetails = () => {
    navigate("/cases/details");
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
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="border-b border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-white">Cases</h1>
            <Button
              variant="outline"
              onClick={handleViewCaseDetails}
              className="bg-transparent border-cyan-600 text-cyan-400 hover:bg-cyan-600/20"
            >
              View Case Details
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-6">
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
                     <TableCell>
                       <div className="space-y-1">
                         <div className="text-cyan-400 cursor-pointer hover:underline font-medium">{row.case}</div>
                         <div 
                           className="text-xs text-blue-400 hover:underline cursor-pointer"
                           onClick={handleViewCaseDetails}
                         >
                           View Case Details →
                         </div>
                       </div>
                     </TableCell>
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
        </div>
      </div>
    </div>
  );
};

export default Cases;