# Bulk Status Update Feature

This feature allows users to select multiple tickets and update their status in bulk from the tickets page.

## Features

- **Multi-select**: Checkboxes in the ticket table allow selecting multiple tickets
- **Bulk Status Update**: A dropdown button appears in the toolbar when tickets are selected
- **Status Options**: All available ticket statuses (OPEN, IN_PROGRESS, RESOLVED, CLOSED) are available
- **Success Feedback**: Toast notifications confirm successful updates
- **Error Handling**: Error messages are displayed if updates fail
- **Automatic Refresh**: The page refreshes after successful updates to show the new statuses

## Implementation Details

### Components Added

1. **TicketBulkStatusUpdate** (`src/components/ticket-table/ticket-bulk-status-update.tsx`)
   - Dropdown component for selecting new status
   - Handles API calls to update multiple tickets
   - Shows success/error notifications

2. **Checkbox Component** (`src/components/ui/checkbox.tsx`)
   - Radix UI-based checkbox component
   - Used for row selection in the data table

### API Endpoint Added

- **updateStatusBulk** (`src/server/api/routers/ticket.ts`)
  - Accepts array of ticket IDs and new status
  - Updates all tickets in a single database transaction
  - Handles closedAt timestamp logic (sets when status is CLOSED, clears otherwise)

### UI Changes

1. **Ticket Data Table** (`src/components/ticket-table/ticket-data-table.tsx`)
   - Added selection column with checkboxes
   - Enabled row selection in the data table

2. **Ticket Data Table Toolbar** (`src/components/ticket-table/ticket-data-table-toolbar.tsx`)
   - Added bulk status update component
   - Shows selected ticket count in the update button

### Translations

Added translation keys for:
- English (`messages/en.json`)
- Spanish (`messages/es.json`)

Keys added:
- `TicketBulkStatusUpdate.updateStatus`
- `TicketBulkStatusUpdate.statusUpdateSuccess`
- `TicketBulkStatusUpdate.statusUpdateError`

## Usage

1. Navigate to the tickets page
2. Select one or more tickets using the checkboxes
3. Click the "Update Status (X)" button in the toolbar
4. Choose the new status from the dropdown
5. The status will be updated for all selected tickets

## Dependencies Added

- `@radix-ui/react-checkbox` - For the checkbox component