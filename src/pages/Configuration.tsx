import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Save,
  Upload,
  History,
  CheckCircle,
  AlertCircle,
  FileText,
  Code,
  RefreshCw,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Configuration = () => {
  const [config, setConfig] = useState(`{
  "mappings": {
    "customers": {
      "source_table": "bronze_customers",
      "target_table": "silver_customers",
      "transformations": {
        "customer_id": "id",
        "first_name": "firstName",
        "last_name": "lastName",
        "email": "emailAddress",
        "phone": "phoneNumber",
        "created_at": {
          "field": "registrationDate",
          "type": "datetime",
          "format": "ISO_8601"
        }
      },
      "validation_rules": {
        "email": {
          "type": "email",
          "required": true
        },
        "phone": {
          "type": "phone",
          "required": false
        }
      }
    },
    "orders": {
      "source_table": "bronze_orders",
      "target_table": "silver_orders",
      "transformations": {
        "order_id": "id",
        "customer_id": "customerId",
        "order_date": {
          "field": "orderDate",
          "type": "datetime",
          "format": "YYYY-MM-DD"
        },
        "total_amount": {
          "field": "totalAmount",
          "type": "decimal",
          "precision": 2
        },
        "status": "orderStatus"
      },
      "validation_rules": {
        "customer_id": {
          "type": "foreign_key",
          "reference_table": "customers",
          "reference_field": "id",
          "required": true
        },
        "total_amount": {
          "type": "positive_number",
          "required": true
        }
      }
    }
  },
  "global_settings": {
    "batch_size": 1000,
    "retry_attempts": 3,
    "dead_letter_queue": "migration-dlq",
    "logging_level": "INFO"
  }
}`);

  const [isValidJson, setIsValidJson] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  // Mock version history
  const versionHistory = [
    {
      version: "v1.3.2",
      date: "2024-01-15 14:30:00",
      author: "admin@company.com",
      description: "Added validation rules for customer emails",
      status: "Current",
    },
    {
      version: "v1.3.1",
      date: "2024-01-14 16:45:00",
      author: "admin@company.com",
      description: "Updated batch size configuration",
      status: "Previous",
    },
    {
      version: "v1.3.0",
      date: "2024-01-13 09:15:00",
      author: "admin@company.com",
      description: "Added orders table mapping",
      status: "Previous",
    },
  ];

  const validateJson = (jsonString: string) => {
    try {
      JSON.parse(jsonString);
      setIsValidJson(true);
      return true;
    } catch (error) {
      setIsValidJson(false);
      return false;
    }
  };

  const handleConfigChange = (value: string) => {
    setConfig(value);
    validateJson(value);
  };

  const handleSave = async () => {
    if (!isValidJson) {
      toast({
        title: "Invalid JSON",
        description: "Please fix the JSON syntax errors before saving.",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));

    setIsSaving(false);
    toast({
      title: "Configuration Saved",
      description:
        "The mapping configuration has been successfully deployed to S3.",
    });
  };

  const handleDeploy = async () => {
    if (!isValidJson) {
      toast({
        title: "Invalid JSON",
        description: "Please fix the JSON syntax errors before deploying.",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 3000));

    setIsSaving(false);
    toast({
      title: "Configuration Deployed",
      description:
        "The new configuration is now active and will be used for future migrations.",
    });
  };

  const restoreVersion = (version: string) => {
    toast({
      title: "Version Restored",
      description: `Configuration restored to ${version}. Don't forget to deploy the changes.`,
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-100">
          Configuration Management
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Configuration Editor */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-gray-100 flex items-center">
                    <Code className="h-5 w-5 mr-2" />
                    Mapping Configuration
                  </CardTitle>
                </div>
                <div className="flex items-center space-x-2">
                  {isValidJson ? (
                    <Badge className="bg-green-900/50 text-green-400 border-green-600">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Valid JSON
                    </Badge>
                  ) : (
                    <Badge className="bg-red-900/50 text-red-400 border-red-600">
                      <AlertCircle className="h-3 w-3 mr-1" />
                      Invalid JSON
                    </Badge>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Textarea
                  value={config}
                  onChange={(e) => handleConfigChange(e.target.value)}
                  className={`h-96 font-mono text-sm bg-gray-800 border-gray-700 text-gray-100 ${
                    !isValidJson ? "border-red-600" : ""
                  }`}
                  placeholder="Enter your JSON configuration..."
                />

                {!isValidJson && (
                  <Alert className="bg-red-900/20 border-red-600">
                    <AlertCircle className="h-4 w-4 text-red-400" />
                    <AlertDescription className="text-red-300">
                      Invalid JSON syntax. Please check your configuration for
                      errors.
                    </AlertDescription>
                  </Alert>
                )}

                <div className="flex space-x-3">
                  <Button
                    onClick={handleSave}
                    disabled={isSaving || !isValidJson}
                    className="bg-cyan-600 hover:bg-cyan-700 text-white"
                  >
                    {isSaving ? (
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Save className="h-4 w-4 mr-2" />
                    )}
                    Save Configuration
                  </Button>
                  <Button
                    onClick={handleDeploy}
                    disabled={isSaving || !isValidJson}
                    variant="outline"
                    className="border-gray-700 text-gray-300 hover:bg-gray-800"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Deploy to S3
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Configuration Guidelines */}
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="text-gray-100">
                Configuration Guidelines
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-gray-300">
                <div className="flex items-start space-x-2">
                  <Badge className="bg-blue-900/50 text-blue-400 border-blue-600 mt-0.5">
                    MAPPING
                  </Badge>
                  <span>
                    Define source to target field mappings for each table
                  </span>
                </div>
                <div className="flex items-start space-x-2">
                  <Badge className="bg-green-900/50 text-green-400 border-green-600 mt-0.5">
                    TRANSFORM
                  </Badge>
                  <span>
                    Specify data transformations like type conversions and
                    formatting
                  </span>
                </div>
                <div className="flex items-start space-x-2">
                  <Badge className="bg-cyan-900/50 text-cyan-400 border-cyan-600 mt-0.5">
                    VALIDATE
                  </Badge>
                  <span>
                    Set validation rules to ensure data quality and integrity
                  </span>
                </div>
                <div className="flex items-start space-x-2">
                  <Badge className="bg-orange-900/50 text-orange-400 border-orange-600 mt-0.5">
                    GLOBAL
                  </Badge>
                  <span>
                    Configure global settings like batch size and retry attempts
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Version History Sidebar */}
        <div className="space-y-6">
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="text-gray-100 flex items-center">
                <History className="h-5 w-5 mr-2" />
                Version History
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {versionHistory.map((version, index) => (
                  <div
                    key={version.version}
                    className="p-3 bg-gray-800/50 rounded-lg border border-gray-700"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-gray-100">
                        {version.version}
                      </span>
                      {version.status === "Current" ? (
                        <Badge className="bg-green-900/50 text-green-400 border-green-600">
                          Current
                        </Badge>
                      ) : (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => restoreVersion(version.version)}
                          className="text-cyan-400 hover:text-cyan-300"
                        >
                          Restore
                        </Button>
                      )}
                    </div>
                    <p className="text-sm text-gray-300 mb-1">
                      {version.description}
                    </p>
                    <p className="text-xs text-gray-400">{version.date}</p>
                    <p className="text-xs text-gray-400">by {version.author}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Configuration;
