
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
import type { JiraIssue, Project } from "@/lib/types"
import { WorkloadPredictionDialog } from "./workload-prediction-dialog"

type TasksTableProps = {
  issues: JiraIssue[];
  project: Project;
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

const statusVariantMap: { [key: string]: "default" | "secondary" | "destructive" | "outline" } = {
    'Выполнено': 'default',
    'In Progress': 'secondary',
    'Настройка': 'secondary',
    'В разработке': 'secondary',
    'Тестирование': 'secondary',
    'Аналитика': 'secondary',
    'Done': 'default',
};

const getStatusVariant = (statusName?: string) => {
    if (!statusName) return 'outline';
    // Handle Russian and English variants of status categories
    if (statusName.toLowerCase().includes('done') || statusName.toLowerCase().includes('выполнено')) {
        return 'default';
    }
    if (['in progress', 'настройка', 'в разработке', 'тестирование', 'аналитика'].includes(statusName.toLowerCase())) {
        return 'secondary';
    }
    return statusVariantMap[statusName] || 'outline';
};

export default function TasksTable({ issues, project }: TasksTableProps) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})
  const [selectedTask, setSelectedTask] = React.useState<JiraIssue | null>(null);

  const downloadAsCSV = (data: JiraIssue[]) => {
    if (!data.length) return;

    const headers = ["Ключ", "Название", "Тип", "Статус", "Приоритет", "Дата создания"];
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
    
    const blob = new Blob(["\ufeff" + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", `${project.name}_задачи.csv`);
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
          aria-label="Выбрать все"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Выбрать строку"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
        accessorKey: "key",
        header: "Ключ",
        cell: ({ row }) => (
          <div className="font-medium">{row.getValue("key")}</div>
        ),
    },
    {
      accessorKey: "fields.summary",
      header: "Название",
      cell: ({ row }) => <div className="min-w-[250px]">{row.original.fields.summary}</div>,
    },
    {
        accessorKey: "fields.issuetype.name",
        header: "Тип",
        cell: ({ row }) => <Badge variant="outline">{row.original.fields.issuetype.name}</Badge>,
    },
    {
      accessorKey: "fields.status.name",
      header: "Статус",
      cell: ({ row }) => <Badge variant={getStatusVariant(row.original.fields.status.name)}>{row.original.fields.status.name}</Badge>,
    },
    {
        accessorKey: "fields.priority.name",
        header: ({ column }) => {
            return (
              <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
              >
                Приоритет
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
                Создана
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
              <span className="sr-only">Открыть прогноз</span>
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
        <CardTitle>Задачи проекта {project.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="w-full">
          <div className="flex items-center py-4">
            <Input
              placeholder="Фильтр по названию..."
              value={(table.getColumn("fields.summary")?.getFilterValue() as string) ?? ""}
              onChange={(event) =>
                table.getColumn("fields.summary")?.setFilterValue(event.target.value)
              }
              className="max-w-sm"
            />
            <div className="ml-auto flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={() => downloadAsCSV(table.getFilteredRowModel().rows.map(row => row.original))}>
                    <Download className="h-4 w-4" />
                    <span className="sr-only sm:not-sr-only sm:ml-2">Экспорт</span>
                </Button>
                <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">
                    Столбцы <ChevronDown className="ml-2 h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    {table
                    .getAllColumns()
                    .filter((column) => column.getCanHide())
                    .map((column) => {
                        // a bit of a hack to show a friendlier name
                        let displayName = column.id.includes('.') ? column.id.split('.').pop() : column.id
                        if (displayName === 'summary') displayName = 'Название';
                        if (displayName === 'name') displayName = 'Тип';
                        if (displayName === 'status') displayName = 'Статус';
                        if (displayName === 'priority') displayName = 'Приоритет';
                        if (displayName === 'created') displayName = 'Создана';

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
                      Нет данных.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          <div className="flex items-center justify-end space-x-2 py-4">
            <div className="flex-1 text-sm text-muted-foreground">
              Выбрано {table.getFilteredSelectedRowModel().rows.length} из{" "}
              {table.getFilteredRowModel().rows.length} строк(и).
            </div>
            <div className="space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                Назад
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                Вперед
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
