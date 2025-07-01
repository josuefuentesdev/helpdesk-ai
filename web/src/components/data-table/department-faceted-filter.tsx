import { Check, MoreHorizontal, PlusCircle } from "lucide-react";
import React, { useState, useEffect, useMemo } from "react";


import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandLoading,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Icons } from "@/components/icons";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { api } from "@/trpc/react";
import { useRouter } from "next/navigation";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import type { Table, Column } from "@tanstack/react-table";
import type { UserGetAllItem } from "@/types"; // Import UserGetAllItem

interface DepartmentFacetedFilterProps<TData, TValue> {
  table: Table<TData>;
  column?: Column<TData, TValue>;
  title: string;
}

interface DepartmentOption {
  label: string;
  value: string;
  id: string;
}

export function DepartmentFacetedFilter<TData, TValue>({
  table,
  column,
  title,
}: DepartmentFacetedFilterProps<TData, TValue>) {
  const t = useTranslations('DepartmentFacetedFilter');
  const router = useRouter();

  const [popoverOpen, setPopoverOpen] = useState(false);
  const [dropdownOptionsState, setDropdownOptionsState] = useState<Record<string, boolean>>({});
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);

  const [selectedValues, setSelectedValues] = useState(new Set(column?.getFilterValue() as string[]));
  const [newDepartmentName, setNewDepartmentName] = useState("");
  const [editingDepartment, setEditingDepartment] = useState<DepartmentOption | null>(null);
  const [editingDepartmentName, setEditingDepartmentName] = useState("");

  const [departmentToDelete, setDepartmentToDelete] = useState<DepartmentOption | null>(null);
  const [affectedUsersCount, setAffectedUsersCount] = useState(0);
  const utils = api.useUtils();

  const { data: departmentsData, isLoading: isLoadingDepartments, refetch: refetchDepartments } = api.department.getAll.useQuery();

  const departmentOptions = useMemo(() => {
    if (!departmentsData) return [];
    return departmentsData.map((dep: { id: string; name: string }) => ({
      label: dep.name,
      value: dep.name,
      id: dep.id,
    }));
  }, [departmentsData]);

  const createDepartmentMutation = api.department.create.useMutation({
    onSuccess: async () => {
      toast.success(t('toast.created'));
      await utils.department.getAll.invalidate();
      await refetchDepartments();
      setNewDepartmentName("");
    },
    onError: (error: { message: string }) => {
      toast.error(t('toast.failedToCreate'), { description: error.message });
    },
  });

  const updateDepartmentMutation = api.department.updateOne.useMutation({
    onSuccess: async () => {
      toast.success(t('toast.updated'));
      await utils.department.getAll.invalidate();
      // refresh all to show the changes in the upper table
      router.refresh();
      if (editingDepartment) setDropdownOptionsState({...dropdownOptionsState, [editingDepartment.id]: false});
      setEditingDepartment(null);
      setEditingDepartmentName("");
    },
      onError: (error: { message: string }) => {
      toast.error(t('toast.failedToUpdate'), { description: error.message });
    },
  });

  const deleteDepartmentMutation = api.department.deleteOne.useMutation({
    onSuccess: async () => {
      toast.success(t('toast.deleted'));
      await utils.department.getAll.invalidate();
      await refetchDepartments();
      // If the deleted department was selected, remove it from filter
      if (departmentToDelete && selectedValues.has(departmentToDelete.value)) {
        const newSelectedValues = new Set(selectedValues);
        newSelectedValues.delete(departmentToDelete.value);
        setSelectedValues(newSelectedValues);
        const filterValues = Array.from(newSelectedValues);
        column?.setFilterValue(filterValues.length ? filterValues : undefined);
      }
      setEditingDepartment(null); // Clear editing state if it was the one deleted
      setDepartmentToDelete(null); // Clear the department marked for deletion
    },
    onError: (error: { message: string }) => {
      toast.error(t('toast.failedToDelete'), { description: error.message });
    },
  });

  const handleCreateDepartment = () => {
    if (newDepartmentName.trim() === "") {
      toast.error(t('toast.nameCannotBeEmpty'));
      return;
    }
    createDepartmentMutation.mutate({ name: newDepartmentName.trim() });
  };

  const handleEditDepartment = (department: DepartmentOption) => {
    setEditingDepartment(department);
    setEditingDepartmentName(department.label);
  };

  const handleSaveEdit = () => {
    if (!editingDepartment || editingDepartmentName.trim() === "") {
      toast.error(t('toast.nameCannotBeEmpty'));
      return;
    }
    updateDepartmentMutation.mutate({ id: editingDepartment.id, name: editingDepartmentName.trim() });
  };

  const handleDeleteDepartment = (department: DepartmentOption) => {
    const allUsers = table.getCoreRowModel().rows.map(row => row.original as UserGetAllItem);
    const count = allUsers.filter(user => user.department?.name === department.label).length;
    setAffectedUsersCount(count);
    setDepartmentToDelete(department);
    setDropdownOptionsState({ ...dropdownOptionsState, [department.id]: false });
    setIsDeleteAlertOpen(true);
  };

  // Update column filter when selectedValues change
  useEffect(() => {
    const filterValues = Array.from(selectedValues);
    column?.setFilterValue(filterValues.length ? filterValues : undefined);
  }, [selectedValues, column]);

  return (
    <>
      <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm" className="h-8 border-dashed">
            <PlusCircle className="mr-2 size-4" />
            {title}
            {selectedValues?.size > 0 && (
              <>
                <Separator orientation="vertical" className="mx-2 h-4" />
                <Badge
                  variant="secondary"
                  className="rounded-sm px-1 font-normal lg:hidden"
                >
                  {selectedValues.size}
                </Badge>
                <div className="hidden gap-1 lg:flex">
                  {selectedValues.size > 2 ? (
                    <Badge
                      variant="secondary"
                      className="rounded-sm px-1 font-normal"
                    >
                      {selectedValues.size} {t('selected')}
                    </Badge>
                  ) : (
                    departmentOptions
                      .filter((option) => selectedValues.has(option.value))
                      .map((option) => (
                        <Badge
                          variant="secondary"
                          key={option.value}
                          className="rounded-sm px-1 font-normal"
                        >
                          {option.label}
                        </Badge>
                      ))
                  )}
                </div>
              </>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[250px] p-0 z-50" align="start">
          <Command>
            <CommandInput placeholder={title ?? t('filterDepartments')} />
            <CommandList>
              {isLoadingDepartments ? (
                <CommandLoading>{t('loading')}</CommandLoading>
              ) : departmentOptions.length === 0 ? (
                <CommandEmpty>{t('noResults')}</CommandEmpty>
              ) : null}


              {/* Departments List Section */}
              <CommandGroup>
                {departmentOptions.map((option) => {
                  const isSelected = selectedValues.has(option.value);
                  const isEditing = editingDepartment?.id === option.id;

                  if (isEditing) {
                    return (
                      <CommandItem key={`${option.id}-editing`} className="flex flex-col items-start !bg-transparent !opacity-100 !cursor-default">
                        <div className="flex w-full items-center">
                          <Input
                            value={editingDepartmentName}
                            onChange={(e) => setEditingDepartmentName(e.target.value)}
                            className="mr-2 h-8 flex-grow"
                            autoFocus
                            onClick={(e) => e.stopPropagation()} // Prevent CommandItem onSelect
                          />
                          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={(e) => { e.stopPropagation(); handleSaveEdit(); }} disabled={updateDepartmentMutation.isPending || !editingDepartmentName.trim()}>
                            <Icons.check className="size-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={(e) => { e.stopPropagation(); setEditingDepartment(null); setDropdownOptionsState({ ...dropdownOptionsState, [option.id]: false }); }}>
                            <Icons.x className="size-4" />
                          </Button>
                        </div>
                      </CommandItem>
                    );
                  }

                  return (
                    <CommandItem
                      key={option.id}
                      value={option.value} // for CommandInput filtering
                      onSelect={() => {
                        // Prevent selection if an item is being edited elsewhere or if dropdown is interacted with
                        if (editingDepartment && editingDepartment.id !== option.id) return;
                        const newSelectedValues = new Set(selectedValues);
                        if (isSelected) {
                          newSelectedValues.delete(option.value);
                        } else {
                          newSelectedValues.add(option.value);
                        }
                        setSelectedValues(newSelectedValues);
                      }}
                      className="group justify-between"
                    >
                      <div className="flex items-center flex-grow mr-2">
                        <div
                          className={cn(
                            "mr-2 flex size-4 items-center justify-center rounded-[4px] border",
                            isSelected
                              ? "bg-primary border-primary text-primary-foreground"
                              : "opacity-50 [&_svg]:invisible"
                          )}
                        >
                          <Check className="size-3.5" />
                        </div>
                        <span className="truncate flex-grow select-none">{option.label}</span>
                      </div>
                      <div className="flex items-center opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 focus-within:opacity-100 transition-opacity ml-auto pl-1 flex-shrink-0">
                        <DropdownMenu open={!!dropdownOptionsState[option.id]} onOpenChange={(open) => setDropdownOptionsState({ ...dropdownOptionsState, [option.id]: open })}>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-7 w-7">
                              <MoreHorizontal className="size-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent className="z-60" sideOffset={5} align="end" onCloseAutoFocus={(e) => e.preventDefault()}>
                            <DropdownMenuItem
                              onClick={(e) => { e.preventDefault();e.stopPropagation(); handleEditDepartment(option); }}
                              className="cursor-pointer"
                            >
                              <Icons.edit className="mr-2 size-3.5" />
                              {t('edit')}
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleDeleteDepartment(option); }}
                              className="cursor-pointer text-destructive focus:text-destructive"
                            >
                              <Icons.trash className="mr-2 size-3.5" />
                              {t('delete')}
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </CommandItem>
                  );
                })}
              </CommandGroup>

              {/* Create Department Section */}
              <CommandGroup>
                <div className="flex items-center p-2">
                  <Input
                    placeholder={t('newDepartmentName')}
                    value={newDepartmentName}
                    onChange={(e) => setNewDepartmentName(e.target.value)}
                    className="mr-2 h-8 flex-grow"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleCreateDepartment}
                    disabled={createDepartmentMutation.isPending || !newDepartmentName.trim()}
                    className="h-8 w-8"
                    aria-label={t('add')}
                  >
                    {createDepartmentMutation.isPending ? (
                      <Icons.loader className="size-4 animate-spin" />
                    ) : (
                      <PlusCircle className="size-4" />
                    )}
                  </Button>
                </div>
              </CommandGroup>
              {/* End Create Department Section */}

              {selectedValues.size > 0 && (
                <>
                  <CommandSeparator />
                  <CommandGroup>
                    <CommandItem
                      onSelect={() => setSelectedValues(new Set())} // Clears local selection, useEffect handles column filter
                      className="justify-center text-center"
                    >
                      {t('clearFilters')}
                    </CommandItem>
                  </CommandGroup>
                </>
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      <AlertDialog open={isDeleteAlertOpen} onOpenChange={setIsDeleteAlertOpen}>
        <AlertDialogContent className="w-[425px] z-70">
          <AlertDialogHeader>
            <AlertDialogTitle>{t('alert.title')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('alert.description', { departmentName: String(departmentToDelete?.label) })}
              <br />
              {affectedUsersCount > 0
                ? t('alert.affectedUsersWarning', { count: affectedUsersCount })
                : t('alert.noAffectedUsers')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>
              {t('alert.cancel')}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (departmentToDelete) { // Ensure departmentToDelete is still valid
                  deleteDepartmentMutation.mutate({ id: departmentToDelete.id });
                }
                setIsDeleteAlertOpen(false); // Close alert after action initiated
              }}
            >
              {t('alert.delete')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
