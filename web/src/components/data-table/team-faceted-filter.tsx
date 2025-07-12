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
import type { UserGetAllItem } from "@/types";

interface TeamFacetedFilterProps<TData, TValue> {
  table: Table<TData>;
  column?: Column<TData, TValue>;
  title: string;
}

interface TeamOption {
  label: string;
  value: string;
  id: string;
}

export function TeamFacetedFilter<TData, TValue>({
  table,
  column,
  title,
}: TeamFacetedFilterProps<TData, TValue>) {
  const t = useTranslations('TeamFacetedFilter');
  const router = useRouter();

  const [popoverOpen, setPopoverOpen] = useState(false);
  const [dropdownOptionsState, setDropdownOptionsState] = useState<Record<string, boolean>>({});
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);

  const [selectedValues, setSelectedValues] = useState<Set<string>>(new Set(column?.getFilterValue() as string[] || []));
  const [newTeamName, setNewTeamName] = useState("");
  const [editingTeam, setEditingTeam] = useState<TeamOption | null>(null);
  const [editingTeamName, setEditingTeamName] = useState("");
  const [teamToDelete, setTeamToDelete] = useState<TeamOption | null>(null);
  const [affectedUsersCount, setAffectedUsersCount] = useState(0);
  
  const utils = api.useUtils();
  const { data: teamsData, isLoading: isLoadingTeams, refetch: refetchTeams } = api.team.getAll.useQuery();

  const teamOptions = useMemo(() => {
    if (!teamsData) return [];
    return teamsData.map((team: { id: string; name: string }) => ({
      label: team.name,
      value: team.id, // Using ID as value for more reliable filtering
      id: team.id,
    }));
  }, [teamsData]);

  const createTeamMutation = api.team.create.useMutation({
    onSuccess: async () => {
      toast.success(t('toast.created'));
      await utils.team.getAll.invalidate();
      await refetchTeams();
      setNewTeamName("");
    },
    onError: (error: { message: string }) => {
      toast.error(t('toast.failedToCreate'), { description: error.message });
    },
  });

  const updateTeamMutation = api.team.updateOne.useMutation({
    onSuccess: async () => {
      toast.success(t('toast.updated'));
      await utils.team.getAll.invalidate();
      router.refresh();
      if (editingTeam) setDropdownOptionsState({...dropdownOptionsState, [editingTeam.id]: false});
      setEditingTeam(null);
      setEditingTeamName("");
    },
    onError: (error: { message: string }) => {
      toast.error(t('toast.failedToUpdate'), { description: error.message });
    },
  });

  const deleteTeamMutation = api.team.deleteOne.useMutation({
    onSuccess: async () => {
      toast.success(t('toast.deleted'));
      await utils.team.getAll.invalidate();
      await refetchTeams();
      if (teamToDelete && selectedValues.has(teamToDelete.value)) {
        const newSelectedValues = new Set(selectedValues);
        newSelectedValues.delete(teamToDelete.value);
        setSelectedValues(newSelectedValues);
        const filterValues = Array.from(newSelectedValues);
        column?.setFilterValue(filterValues.length ? filterValues : undefined);
      }
      setEditingTeam(null);
      setTeamToDelete(null);
    },
    onError: (error: { message: string }) => {
      toast.error(t('toast.failedToDelete'), { description: error.message });
    },
  });

  const handleCreateTeam = () => {
    if (newTeamName.trim() === "") {
      toast.error(t('toast.nameCannotBeEmpty'));
      return;
    }
    createTeamMutation.mutate({ name: newTeamName.trim() });
  };

  const handleEditTeam = (team: TeamOption) => {
    setEditingTeam(team);
    setEditingTeamName(team.label);
  };

  const handleSaveEdit = () => {
    if (!editingTeam || editingTeamName.trim() === "") {
      toast.error(t('toast.nameCannotBeEmpty'));
      return;
    }
    updateTeamMutation.mutate({ id: editingTeam.id, name: editingTeamName.trim() });
  };

  const handleDeleteTeam = (team: TeamOption) => {
    const allUsers = table.getCoreRowModel().rows.map(row => row.original as UserGetAllItem);
    const count = allUsers.filter(user => 
      user.teams?.some(t => t.name === team.label)
    ).length;
    setAffectedUsersCount(count);
    setTeamToDelete(team);
    setDropdownOptionsState({ ...dropdownOptionsState, [team.id]: false });
    setIsDeleteAlertOpen(true);
  };

  useEffect(() => {
    const filterValues = Array.from(selectedValues);
    if (filterValues.length > 0) {
      // Set the filter value as a stringified array of selected team IDs
      column?.setFilterValue(JSON.stringify(filterValues));
    } else {
      column?.setFilterValue(undefined);
    }
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
                    teamOptions
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
            <CommandInput placeholder={title ?? t('filterTeams')} />
            <CommandList>
              {isLoadingTeams ? (
                <CommandLoading>{t('loading')}</CommandLoading>
              ) : teamOptions.length === 0 ? (
                <CommandEmpty>{t('noResults')}</CommandEmpty>
              ) : null}

              <CommandGroup>
                {teamOptions.map((option) => {
                  const isSelected = selectedValues.has(option.value);
                  const isEditing = editingTeam?.id === option.id;

                  if (isEditing) {
                    return (
                      <CommandItem key={`${option.id}-editing`} className="flex flex-col items-start !bg-transparent !opacity-100 !cursor-default">
                        <div className="flex w-full items-center">
                          <Input
                            value={editingTeamName}
                            onChange={(e) => setEditingTeamName(e.target.value)}
                            className="mr-2 h-8 flex-grow"
                            autoFocus
                            onClick={(e) => e.stopPropagation()}
                          />
                          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={(e) => { e.stopPropagation(); handleSaveEdit(); }} disabled={updateTeamMutation.isPending || !editingTeamName.trim()}>
                            <Icons.check className="size-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={(e) => { e.stopPropagation(); setEditingTeam(null); setDropdownOptionsState({ ...dropdownOptionsState, [option.id]: false }); }}>
                            <Icons.x className="size-4" />
                          </Button>
                        </div>
                      </CommandItem>
                    );
                  }

                  return (
                    <CommandItem
                      key={option.id}
                      value={option.value}
                      onSelect={() => {
                        if (editingTeam && editingTeam.id !== option.id) return;
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
                              onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleEditTeam(option); }}
                              className="cursor-pointer"
                            >
                              <Icons.edit className="mr-2 size-3.5" />
                              {t('edit')}
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleDeleteTeam(option); }}
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

              <CommandGroup>
                <div className="flex items-center p-2">
                  <Input
                    placeholder={t('newTeamName')}
                    value={newTeamName}
                    onChange={(e) => setNewTeamName(e.target.value)}
                    className="mr-2 h-8 flex-grow"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleCreateTeam}
                    disabled={createTeamMutation.isPending || !newTeamName.trim()}
                    className="h-8 w-8"
                    aria-label={t('add')}
                  >
                    {createTeamMutation.isPending ? (
                      <Icons.loader className="size-4 animate-spin" />
                    ) : (
                      <PlusCircle className="size-4" />
                    )}
                  </Button>
                </div>
              </CommandGroup>

              {selectedValues.size > 0 && (
                <>
                  <CommandSeparator />
                  <CommandGroup>
                    <CommandItem
                      onSelect={() => setSelectedValues(new Set())}
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
              {t('alert.description', { teamName: String(teamToDelete?.label) })}
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
                if (teamToDelete) {
                  deleteTeamMutation.mutate({ id: teamToDelete.id });
                }
                setIsDeleteAlertOpen(false);
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