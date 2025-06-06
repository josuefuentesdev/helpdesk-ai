import '@tanstack/react-table'

export type DataTableMeta = {
  title: string
  csv?: boolean
}

declare module '@tanstack/react-table' {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type, @typescript-eslint/no-unused-vars
  interface ColumnMeta<TData extends RowData, TValue> extends DataTableMeta {}
}