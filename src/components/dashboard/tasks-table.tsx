
"use client"

import * as React from "react"
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { ArrowUpDown, ChevronDown, Bot, Download } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { JiraIssue } from "@/lib/types"
import { WorkloadPredictionDialog } from "./workload-prediction-dialog"

type TasksTableProps = {
  issues: JiraIssue[];
};

const priorityVariantMap: { [key: string]: "default" | "secondary" | "destructive" | "outline" } = {
    'Highest': 'destructive',
    'High': 'destructive',
    'Medium': 'secondary',
    'Low': 'outline',
    'Lowest': 'outline'
};

const getPriorityVariant = (priorityName?: string) => {
    return priorityName ? priorityVariantMap[priorityName] || 'outline' : 'outline';
};

export default function TasksTable({ issues }: TasksTableProps) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})
  const [selectedTask, setSelectedTask] = React.useState<JiraIssue | null>(null);

  const downloadAsCSV = (data: JiraIssue[]) => {
    if (!data.length) return;

    const headers = ["Key", "Summary", "Type", "Status", "Priority", "Created Date"];
    const csvContent = [
      headers.join(','),
      ...data.map(issue => [
        `"${issue.key}"`,
        `"${issue.fields.summary.replace(/"/g, '""')}"`,
        `"${issue.fields.issuetype.name}"`,
        `"${issue.fields.status.name}"`,
        `"${issue.fields.priority?.name || 'N/A'}"`,
        `"${new Date(issue.fields.created).toLocaleDateString()}"`
      ].join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", "pccps_tasks.csv");
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }

  const columns: ColumnDef<JiraIssue>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
        accessorKey: "key",
        header: "Key",
        cell: ({ row }) => (
          <div className="font-medium">{row.getValue("key")}</div>
        ),
    },
    {
      accessorKey: "fields.summary",
      header: "Summary",
      cell: ({ row }) => <div className="min-w-[250px]">{row.original.fields.summary}</div>,
    },
    {
        accessorKey: "fields.issuetype.name",
        header: "Type",
        cell: ({ row }) => <div>{row.original.fields.issuetype.name}</div>,
    },
    {
      accessorKey: "fields.status.name",
      header: "Status",
      cell: ({ row }) => <Badge variant="outline">{row.original.fields.status.name}</Badge>,
    },
    {
        accessorKey: "fields.priority.name",
        header: ({ column }) => {
            return (
              <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
              >
                Priority
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            )
          },
        cell: ({ row }) => <Badge variant={getPriorityVariant(row.original.fields.priority?.name)}>{row.original.fields.priority?.name || 'N/A'}</Badge>,
    },
    {
        accessorKey: "fields.created",
        header: ({ column }) => {
            return (
                <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                Created
                <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => <div>{new Date(row.original.fields.created).toLocaleDateString()}</div>,
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const task = row.original

        return (
          <>
            <Button variant="ghost" className="h-8 w-8 p-0" onClick={() => setSelectedTask(task)}>
              <span className="sr-only">Open prediction</span>
              <Bot className="h-4 w-4" />
            </Button>
          </>
        )
      },
    },
  ]


  const table = useReactTable({
    data: issues,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle>PCCPS Tasks</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="w-full">
          <div className="flex items-center py-4">
            <Input
              placeholder="Filter tasks by summary..."
              value={(table.getColumn("fields.summary")?.getFilterValue() as string) ?? ""}
              onChange={(event) =>
                table.getColumn("fields.summary")?.setFilterValue(event.target.value)
              }
              className="max-w-sm"
            />
            <div className="ml-auto flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={() => downloadAsCSV(table.getFilteredRowModel().rows.map(row => row.original))}>
                    <Download className="h-4 w-4" />
                    <span className="sr-only sm:not-sr-only sm:ml-2">Export</span>
                </Button>
                <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">
                    Columns <ChevronDown className="ml-2 h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    {table
                    .getAllColumns()
                    .filter((column) => column.getCanHide())
                    .map((column) => {
                        // a bit of a hack to show a friendlier name
                        const displayName = column.id.includes('.') ? column.id.split('.').pop() : column.id
                        return (
                        <DropdownMenuCheckboxItem
                            key={column.id}
                            className="capitalize"
                            checked={column.getIsVisible()}
                            onCheckedChange={(value) =>
                            column.toggleVisibility(!!value)
                            }
                        >
                            {displayName}
                        </DropdownMenuCheckboxItem>
                        )
                    })}
                </DropdownMenuContent>
                </DropdownMenu>
            </div>
          </div>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => {
                      return (
                        <TableHead key={header.id}>
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                        </TableHead>
                      )
                    })}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && "selected"}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-24 text-center"
                    >
                      No results.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          <div className="flex items-center justify-end space-x-2 py-4">
            <div className="flex-1 text-sm text-muted-foreground">
              {table.getFilteredSelectedRowModel().rows.length} of{" "}
              {table.getFilteredRowModel().rows.length} row(s) selected.
            </div>
            <div className="space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                Next
              </Button>
            </div>
          </div>
        </div>
        {selectedTask && (
            <WorkloadPredictionDialog
                isOpen={!!selectedTask}
                onClose={() => setSelectedTask(null)}
                task={selectedTask}
            />
        )}
      </CardContent>
    </Card>
  )
}
