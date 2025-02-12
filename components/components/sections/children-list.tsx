'use client'

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "components/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "components/components/ui/dropdown-menu"
import { Button } from "components/components/ui/button"
import { EllipsisVertical, Pencil, Trash2 } from 'lucide-react';

type Child = {
    id: string
    name: string
    age: number
    vaccine: string
    vaccinationDate: string
    isVaccinated: boolean
    guardianName: string;  // New field
}

type ChildrenListProps = {
  children: Child[]
  onEdit: (child: Child) => void
  onDelete: (child: Child) => void
}

export function ChildrenList({ children, onEdit, onDelete }: ChildrenListProps) {
  return (
    <div className="w-full overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Age</TableHead>
            <TableHead>Vaccine</TableHead>
            <TableHead>Vaccination Date</TableHead>
            <TableHead>Vaccinated</TableHead>
            <TableHead className="w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {children.map((child) => (
            <TableRow key={child.id}>
              <TableCell>{child.name}</TableCell>
              <TableCell>{child.age}</TableCell>
              <TableCell>{child.vaccine}</TableCell>
              <TableCell>{child.vaccinationDate}</TableCell>
              <TableCell>{child.isVaccinated ? "Yes" : "No"}</TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <span className="sr-only">Open menu</span>
                      <EllipsisVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onEdit(child)}>
                      <Pencil className="mr-2 h-4 w-4" />
                      <span>Edit</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onDelete(child)}>
                      <Trash2 className="mr-2 h-4 w-4" />
                      <span>Delete</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

