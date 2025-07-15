# JSON Data Documentation

This document contains sample JSON responses for all pages in the Migration Application.

## Table of Contents
- [Dashboard](#dashboard)
- [Migration History](#migration-history)
- [Configuration](#configuration)
- [Record Detail](#record-detail)
- [Run Detail](#run-detail)
- [Pending Migration](#pending-migration)
- [File Upload](#file-upload)

## Dashboard

### GET /api/dashboard/metrics
```json
{
  "metrics": {
    "filesProcessed24h": 127,
    "recordsMigrated": 45231,
    "successRate": 94.2,
    "failedRecords": 287
  }
}
```

### GET /api/dashboard/recent-runs
```json
{
  "recentRuns": [
    {
      "id": "run-001",
      "filename": "customers_batch_1.csv",
      "status": "Success",
      "records": 1250,
      "time": "2 hours ago"
    },
    {
      "id": "run-002",
      "filename": "products_update.csv",
      "status": "In Progress",
      "records": 890,
      "time": "30 min ago"
    },
    {
      "id": "run-003",
      "filename": "orders_export.csv",
      "status": "Failed",
      "records": 2100,
      "time": "1 hour ago"
    }
  ]
}
```

## Migration History

### GET /api/migration-history
```json
{
  "migrationRuns": [
    {
      "id": "run-001",
      "filename": "customers_batch_1.csv",
      "status": "Success",
      "startTime": "2024-01-15 14:30:00",
      "endTime": "2024-01-15 14:32:15",
      "recordsProcessed": 1250,
      "recordsFailed": 0,
      "duration": "2m 15s"
    },
    {
      "id": "run-002",
      "filename": "products_update.csv",
      "status": "Pending Migration",
      "startTime": "2024-01-15 15:00:00",
      "endTime": null,
      "recordsProcessed": 890,
      "recordsFailed": 0,
      "duration": "30m 45s"
    },
    {
      "id": "run-003",
      "filename": "orders_export.csv",
      "status": "Failed",
      "startTime": "2024-01-15 13:15:00",
      "endTime": "2024-01-15 13:18:30",
      "recordsProcessed": 1875,
      "recordsFailed": 225,
      "duration": "3m 30s"
    },
    {
      "id": "run-004",
      "filename": "inventory_sync.csv",
      "status": "Success",
      "startTime": "2024-01-15 12:00:00",
      "endTime": "2024-01-15 12:05:45",
      "recordsProcessed": 3200,
      "recordsFailed": 15,
      "duration": "5m 45s"
    },
    {
      "id": "run-005",
      "filename": "user_profiles.csv",
      "status": "Pending Migration",
      "startTime": "2024-01-15 11:30:00",
      "endTime": null,
      "recordsProcessed": 567,
      "recordsFailed": 0,
      "duration": "1m 20s"
    }
  ]
}
```

## Configuration

### GET /api/configuration
```json
{
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
}
```

### GET /api/configuration/version-history
```json
{
  "versionHistory": [
    {
      "version": "v1.3.2",
      "date": "2024-01-15 14:30:00",
      "author": "admin@company.com",
      "description": "Added validation rules for customer emails",
      "status": "Current"
    },
    {
      "version": "v1.3.1",
      "date": "2024-01-14 16:45:00",
      "author": "admin@company.com",
      "description": "Updated batch size configuration",
      "status": "Previous"
    },
    {
      "version": "v1.3.0",
      "date": "2024-01-13 09:15:00",
      "author": "admin@company.com",
      "description": "Added orders table mapping",
      "status": "Previous"
    }
  ]
}
```

## Record Detail

### GET /api/records/:id
```json
{
  "record": {
    "id": 1,
    "referenceId": "REF-001",
    "firmId": "FIRM-001",
    "trustAccountId": "TRUST-001",
    "grossSettlementAmount": 25000,
    "clientFullName": "John Smith",
    "clientEmail": "john.smith@email.com",
    "clientPhone": "+1-555-0101",
    "clientBirthdate": "1985-03-15",
    "clientAddress": "123 Main St, New York, NY 10001",
    "settledAmount": 15000,
    "lienAmount": 7500,
    "advanceAmount": 2500,
    "defendantName": "XYZ Corporation",
    "defendantFirm": "Corporate Legal LLC",
    "firmName": "Anderson & Associates",
    "firmRole": "co counsel"
  }
}
```

### PUT /api/records/:id
Request Body:
```json
{
  "id": 1,
  "referenceId": "REF-001",
  "firmId": "FIRM-001",
  "trustAccountId": "TRUST-001",
  "grossSettlementAmount": 25000,
  "clientFullName": "John Smith",
  "clientEmail": "john.smith@email.com",
  "clientPhone": "+1-555-0101",
  "clientBirthdate": "1985-03-15",
  "clientAddress": "123 Main St, New York, NY 10001",
  "settledAmount": 15000,
  "lienAmount": 7500,
  "advanceAmount": 2500,
  "defendantName": "XYZ Corporation",
  "defendantFirm": "Corporate Legal LLC",
  "firmName": "Anderson & Associates",
  "firmRole": "co counsel"
}
```

Response:
```json
{
  "success": true,
  "message": "Record updated successfully",
  "record": {
    "id": 1,
    "referenceId": "REF-001",
    "firmId": "FIRM-001",
    "trustAccountId": "TRUST-001",
    "grossSettlementAmount": 25000,
    "clientFullName": "John Smith",
    "clientEmail": "john.smith@email.com",
    "clientPhone": "+1-555-0101",
    "clientBirthdate": "1985-03-15",
    "clientAddress": "123 Main St, New York, NY 10001",
    "settledAmount": 15000,
    "lienAmount": 7500,
    "advanceAmount": 2500,
    "defendantName": "XYZ Corporation",
    "defendantFirm": "Corporate Legal LLC",
    "firmName": "Anderson & Associates",
    "firmRole": "co counsel"
  }
}
```

## Run Detail

### GET /api/runs/:id
```json
{
  "runDetails": {
    "id": "run-003",
    "filename": "orders_export.csv",
    "status": "Failed",
    "startTime": "2024-01-15 13:15:00",
    "endTime": "2024-01-15 13:18:30",
    "duration": "3m 30s",
    "recordsProcessed": 1875,
    "recordsFailed": 225,
    "successRate": 89.2,
    "stepFunctionUrl": "https://console.aws.amazon.com/states/home#/executions/details/arn:aws:states:us-east-1:123456789012:execution:MyStateMachine:run-003"
  }
}
```

### GET /api/runs/:id/logs
```json
{
  "logs": [
    {
      "timestamp": "13:15:01",
      "level": "INFO",
      "message": "Migration started for orders_export.csv"
    },
    {
      "timestamp": "13:15:15",
      "level": "INFO",
      "message": "Processing batch 1-500: 500 records"
    },
    {
      "timestamp": "13:16:02",
      "level": "WARN",
      "message": "Invalid date format in row 345: '2024-13-01'"
    },
    {
      "timestamp": "13:16:30",
      "level": "INFO",
      "message": "Processing batch 501-1000: 500 records"
    },
    {
      "timestamp": "13:17:15",
      "level": "ERROR",
      "message": "Foreign key constraint violation in batch 1001-1500"
    },
    {
      "timestamp": "13:17:45",
      "level": "INFO",
      "message": "Processing batch 1501-2000: 375 records"
    },
    {
      "timestamp": "13:18:30",
      "level": "ERROR",
      "message": "Migration completed with errors: 225 failed records"
    }
  ]
}
```

### GET /api/runs/:id/failed-records
```json
{
  "failedRecords": [
    {
      "row": 345,
      "data": {
        "order_id": "ORD-12345",
        "customer_id": "CUST-001",
        "order_date": "2024-13-01",
        "amount": "150.00"
      },
      "error": "Invalid date format: '2024-13-01' is not a valid date"
    },
    {
      "row": 1123,
      "data": {
        "order_id": "ORD-67890",
        "customer_id": "CUST-999",
        "order_date": "2024-01-15",
        "amount": "75.50"
      },
      "error": "Foreign key constraint violation: customer_id 'CUST-999' does not exist"
    },
    {
      "row": 1876,
      "data": {
        "order_id": "ORD-11111",
        "customer_id": "CUST-002",
        "order_date": "2024-01-14",
        "amount": "abc"
      },
      "error": "Invalid amount format: 'abc' is not a valid number"
    }
  ]
}
```

## Pending Migration

### GET /api/pending-migration
```json
{
  "pendingData": [
    {
      "id": 1,
      "referenceId": "REF-001",
      "plaintiff": "John Smith",
      "caseType": "Personal Injury",
      "createDate": "2024-01-15",
      "settledAmount": 15000,
      "status": "NEW"
    },
    {
      "id": 2,
      "referenceId": "REF-002",
      "plaintiff": "Jane Doe",
      "caseType": "Medical Malpractice",
      "createDate": "2024-01-14",
      "settledAmount": 22500,
      "status": "IN_PROGRESS"
    },
    {
      "id": 3,
      "referenceId": "REF-003",
      "plaintiff": "Bob Johnson",
      "caseType": "Worker's Compensation",
      "createDate": "2024-01-13",
      "settledAmount": null,
      "status": "NEW"
    },
    {
      "id": 4,
      "referenceId": "REF-004",
      "plaintiff": "Alice Williams",
      "caseType": "Auto Accident",
      "createDate": "2024-01-12",
      "settledAmount": 18750,
      "status": "COMPLETED"
    },
    {
      "id": 5,
      "referenceId": "REF-005",
      "plaintiff": "Charlie Brown",
      "caseType": "Slip & Fall",
      "createDate": "2024-01-11",
      "settledAmount": 12000,
      "status": "NEW"
    }
  ]
}
```

## File Upload

### POST /api/upload
Request (multipart/form-data):
```
file: [CSV file]
```

Response:
```json
{
  "success": true,
  "message": "File uploaded successfully",
  "fileId": "file-123",
  "filename": "data.csv",
  "uploadTime": "2024-01-15T10:30:00Z",
  "recordCount": 1250,
  "estimatedProcessingTime": "2-3 minutes"
}
```

### GET /api/upload/status/:fileId
```json
{
  "fileId": "file-123",
  "filename": "data.csv",
  "status": "processing",
  "progress": 45,
  "recordsProcessed": 562,
  "totalRecords": 1250,
  "estimatedTimeRemaining": "1m 30s"
}
```

### GET /api/upload/preview/:fileId
```json
{
  "fileId": "file-123",
  "filename": "data.csv",
  "headers": [
    "reference_id",
    "client_name",
    "client_email",
    "settled_amount",
    "case_type"
  ],
  "preview": [
    {
      "reference_id": "REF-001",
      "client_name": "John Smith",
      "client_email": "john.smith@email.com",
      "settled_amount": "15000",
      "case_type": "Personal Injury"
    },
    {
      "reference_id": "REF-002",
      "client_name": "Jane Doe",
      "client_email": "jane.doe@email.com",
      "settled_amount": "22500",
      "case_type": "Medical Malpractice"
    }
  ],
  "totalRecords": 1250,
  "validationIssues": [
    {
      "row": 15,
      "column": "client_email",
      "issue": "Invalid email format",
      "severity": "warning"
    },
    {
      "row": 23,
      "column": "settled_amount",
      "issue": "Non-numeric value",
      "severity": "error"
    }
  ]
}
```

## Common Status Values

### Migration Run Status
- `"Success"` - Migration completed successfully
- `"In Progress"` - Migration currently running
- `"Failed"` - Migration failed with errors
- `"Pending Migration"` - Migration queued for processing

### Record Status
- `"NEW"` - New record awaiting processing
- `"IN_PROGRESS"` - Record currently being processed
- `"COMPLETED"` - Record successfully processed
- `"FAILED"` - Record processing failed

### Log Levels
- `"INFO"` - Informational messages
- `"WARN"` - Warning messages
- `"ERROR"` - Error messages

### Firm Roles
- `"co counsel"` - Co-counsel role
- `"referring counsel"` - Referring counsel role

### Case Types
- `"Personal Injury"`
- `"Medical Malpractice"`
- `"Worker's Compensation"`
- `"Auto Accident"`
- `"Slip & Fall"`

## Error Responses

### Standard Error Response
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": [
      {
        "field": "email",
        "message": "Invalid email format"
      },
      {
        "field": "settledAmount",
        "message": "Must be a positive number"
      }
    ]
  }
}
```

### Common Error Codes
- `"VALIDATION_ERROR"` - Input validation failed
- `"NOT_FOUND"` - Resource not found
- `"UNAUTHORIZED"` - Authentication required
- `"FORBIDDEN"` - Access denied
- `"INTERNAL_ERROR"` - Server error
- `"RATE_LIMIT_EXCEEDED"` - Too many requests