// 'use client'

// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "components/components/ui/table"
// import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "components/components/ui/dropdown-menu"
// import { Button } from "components/components/ui/button"
// import { EllipsisVertical, Pencil, Trash2 } from 'lucide-react';

// type Child = {
//     id: string
//     name: string
//     age: number
//     vaccine: string
//     vaccinationDate: string
//     isVaccinated: boolean
//     guardianName: string;  // New field
// }

// type ChildrenListProps = {
//   children: Child[]
//   onEdit: (child: Child) => void
//   onDelete: (child: Child) => void
// }

// export function ChildrenList({ children, onEdit, onDelete }: ChildrenListProps) {
//   return (
//     <div className="w-full overflow-x-auto">
//       <Table>
//         <TableHeader>
//           <TableRow>
//             <TableHead>Name</TableHead>
//             <TableHead>Age</TableHead>
//             <TableHead>Vaccine</TableHead>
//             <TableHead>Vaccination Date</TableHead>
//             <TableHead>Vaccinated</TableHead>
//             <TableHead className="w-[100px]">Actions</TableHead>
//           </TableRow>
//         </TableHeader>
//         <TableBody>
//           {children.map((child) => (
//             <TableRow key={child.id}>
//               <TableCell>{child.name}</TableCell>
//               <TableCell>{child.age}</TableCell>
//               <TableCell>{child.vaccine}</TableCell>
//               <TableCell>{child.vaccinationDate}</TableCell>
//               <TableCell>{child.isVaccinated ? "Yes" : "No"}</TableCell>
//               <TableCell>
//                 <DropdownMenu>
//                   <DropdownMenuTrigger asChild>
//                     <Button variant="ghost" className="h-8 w-8 p-0">
//                       <span className="sr-only">Open menu</span>
//                       <EllipsisVertical className="h-4 w-4" />
//                     </Button>
//                   </DropdownMenuTrigger>
//                   <DropdownMenuContent align="end">
//                     <DropdownMenuItem onClick={() => onEdit(child)}>
//                       <Pencil className="mr-2 h-4 w-4" />
//                       <span>Edit</span>
//                     </DropdownMenuItem>
//                     <DropdownMenuItem onClick={() => onDelete(child)}>
//                       <Trash2 className="mr-2 h-4 w-4" />
//                       <span>Delete</span>
//                     </DropdownMenuItem>
//                   </DropdownMenuContent>
//                 </DropdownMenu>
//               </TableCell>
//             </TableRow>
//           ))}
//         </TableBody>
//       </Table>
//     </div>
//   )
// }

"use client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "components/components/ui/dropdown-menu";
import { Button } from "components/components/ui/button";
import { Card, CardContent } from "components/components/ui/card";
import { Avatar, AvatarFallback } from "components/components/ui/avatar";
import { Badge } from "components/components/ui/badge";
import {
  EllipsisVertical,
  Pencil,
  Trash2,
  Calendar,
  Syringe,
  User,
  CheckCircle,
  MapPin,
} from "lucide-react";

type Child = {
  id: string;
  name: string;
  age: number;
  vaccine: string;
  vaccinationDate: string;
  isVaccinated: boolean;
  guardianName: string; // New field
  previousVaccines?: string;
  sex: string;
  location: string; // Added this field
};

type ChildrenListProps = {
  children: Child[];
  onEdit: (child: Child) => void;
  onDelete: (child: Child) => void;
};

export function ChildrenList({
  children,
  onEdit,
  onDelete,
}: ChildrenListProps) {
  // Get initials from name
  const getInitials = (name: string) => {
    if (!name) return "??";
    return name
      .split(" ")
      .slice(0, 2)
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  // Get color based on vaccine type
  const getVaccineColor = (vaccine: string) => {
    const colors = {
      Polio: "bg-blue-500",
      MMR: "bg-green-500",
      "Hepatitis B": "bg-yellow-500",
      DTaP: "bg-purple-500",
      Influenza: "bg-pink-500",
      default: "bg-teal-500",
    };

    return colors[vaccine as keyof typeof colors] || colors.default;
  };

  // Get avatar background color based on first letter of name
  const getAvatarColor = (name: string) => {
    const colors = [
      "bg-red-500",
      "bg-pink-500",
      "bg-purple-500",
      "bg-indigo-500",
      "bg-blue-500",
      "bg-cyan-500",
      "bg-teal-500",
      "bg-green-500",
      "bg-yellow-500",
      "bg-orange-500",
    ];

    const firstLetter = name.charAt(0).toUpperCase();
    const index = firstLetter.charCodeAt(0) % colors.length;
    return colors[index];
  };

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {children.map((child) => (
          <Card
            key={child.id}
            className="overflow-hidden hover:shadow-lg transition-all duration-300 border-t-4"
          >
            <CardContent className="p-0">
              {/* Card Header with Color */}
              <div
                className={`p-4 flex justify-between items-start } bg-opacity-90`}
              >
                <Avatar className="h-16 w-16 ring-2 ring-white">
                  <AvatarFallback
                    className={`${getAvatarColor(
                      child.name
                    )} text-white text-lg`}
                  >
                    {getInitials(child.name)}
                  </AvatarFallback>
                </Avatar>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="secondary"
                      size="icon"
                      className="h-8 w-8 p-0 text-stone-950"
                    >
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
              </div>

              {/* Card Content */}
              <div className="p-4">
                <h3 className="font-bold text-lg mb-3">{child.name}</h3>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-gray-500" />
                    <span className="text-sm">
                      <span className="font-medium">
                        Age: {child.age} | Sex: {child.sex}
                      </span>
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Syringe className="h-4 w-4 text-gray-500" />
                    <span className="text-sm">
                      <Badge
                        variant="outline"
                        className={`${getVaccineColor(
                          child.vaccine
                        )} text-white`}
                      >
                        {child.vaccine}
                      </Badge>
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <span className="text-sm">
                      <span className="font-medium">Date:</span>{" "}
                      {child.vaccinationDate}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-gray-500" />
                    <span className="text-sm">
                      <span className="font-medium">Location:</span>{" "}
                      {child.location}
                    </span>
                  </div>

                  {child.guardianName && (
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-gray-500" />
                      <span className="text-sm">
                        <span className="font-medium">Guardian:</span>{" "}
                        {child.guardianName}
                      </span>
                    </div>
                  )}

                  <div className="flex gap-2 mt-2 pt-2  flex-col items-start">
                    <span className="text-sm">
                      <span className="font-medium">Vaccinated:</span>{" "}
                      <Badge
                        variant={child.isVaccinated ? "success" : "secondary"}
                      >
                        {child.isVaccinated ? "Yes" : "No"}
                      </Badge>
                    </span>
                  </div>

                  {/* {child.previousVaccines && ( */}
                  <div className="pt-2 border-t mt-2">
                    <div className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-gray-500 mt-0.5" />
                      <div>
                        <span className="text-sm font-medium">
                          Previous Vaccines:
                        </span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {child.previousVaccines?.trim() ? (
                            child.previousVaccines
                              .split(",")
                              .map((vaccine, index) => (
                                <Badge
                                  key={index}
                                  variant="secondary"
                                  className="text-xs"
                                >
                                  {vaccine.trim()}
                                </Badge>
                              ))
                          ) : (
                            <span className="text-sm text-gray-500">
                              No previous vaccines
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* )} */}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
