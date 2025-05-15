"use client"

import { useMemo } from "react"
import { DataTable } from "./data-table"
import type { ColumnDef } from "@tanstack/react-table"
import { temporalTicketSampleData } from "./temporal-ticket-sample-data"

type tempColumDefType = typeof temporalTicketSampleData[0]

export function TicketDataTable() {
  const columns: ColumnDef<tempColumDefType>[] = useMemo(() => [
    {
      accessorKey: "id",
      header: "ID",
    }
  ], [])

  return (
    <DataTable
      columns={columns}
      data={temporalTicketSampleData}
    />
  )
}