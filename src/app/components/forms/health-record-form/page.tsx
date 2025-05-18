"use client";

import React from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { format } from "date-fns";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormDescription,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Check, ChevronsUpDown } from "lucide-react";
// Import the Checkbox component
import { Checkbox } from "@/components/ui/checkbox";


// Define the possible medical history options based on the image
const medicalHistoryOptions = [
  { label: "Measles", value: "Measles" },
  { label: "Mumps", value: "Mumps" },
  { label: "German Measles", value: "German Measles" },
  { label: "Chicken Pox", value: "Chicken Pox" },
  { label: "Hepatitis", value: "Hepatitis" },
  { label: "Allergies", value: "Allergies" },
  { label: "Bronchial Asthma", value: "Bronchial Asthma" },
  { label: "Heart Disorder", value: "Heart Disorder" },
  { label: "Kidney Disorder", value: "Kidney Disorder" },
  { label: "Convulsions", value: "Convulsions" },
  { label: "Epilepsy", value: "Epilepsy" },
  { label: "Psychoneurosis", value: "Psychoneurosis" },
  { label: "Bleeding Tendency", value: "Bleeding Tendency" },
  { label: "Others", value: "Others" },
];


const formSchema = z.object({
  student_name: z.string().min(1, "Student name is required."),
  roll_number: z.string().min(1, "Roll number is required."),
  date_of_birth: z.coerce.date().nullable().optional(),
  sex: z.string().min(1, "Sex is required."),
  home_address: z.string().min(1, "Home address is required."),
  student_contact: z.string().min(1, "Student contact is required."),

  academic_level: z.string({ required_error: "Academic level is required." }).min(1, "Academic level is required."),
  year_level: z.string().optional(),
  academic_program: z.string().optional(),

  father_name: z.string().min(1, "Father's name is required."),
  father_contact: z.string().optional(),
  father_email: z.string().email("Invalid email address.").min(1, "Father's email is required."),
  mother_name: z.string().min(1, "Mother's name is required."),
  mother_contact: z.string().optional(),
  mother_email: z.string().email("Invalid email address.").min(1, "Mother's email is required."),

  allergies: z.string().optional(),

  // Field for Past Medical History (array of strings)
  past_medical_history: z.array(z.string()).optional(),
  
});

const academicLevels = [
  { label: "Junior High School", value: "Junior High School" },
  { label: "Senior High School", value: "Senior High School" },
  { label: "College", value: "College" },
  { label: "Graduate School", value: "Graduate School" },
];

const yearLevelsByAcademicLevel: Record<string, { label: string; value: string }[]> = {
  "Junior High School": [
    { label: "Grade 7", value: "Grade 7" },
    { label: "Grade 8", value: "Grade 8" },
    { label: "Grade 9", value: "Grade 9" },
    { label: "Grade 10", value: "Grade 10" },
  ],
  "Senior High School": [
    { label: "Grade 11", value: "Grade 11" },
    { label: "Grade 12", value: "Grade 12" },
  ],
  "College": [
    { label: "1st year", value: "1st year" },
    { label: "2nd year", value: "2nd year" },
    { label: "3rd year", value: "3rd year" },
    { label: "4th year", value: "4th year" },
  ],
  "Graduate School": [
    { label: "1st year", value: "1st year" },
    { label: "2nd year", value: "2nd year" },
  ],
};

const academicProgramsByAcademicLevel: Record<string, { label: string; value: string }[]> = {
  "Senior High School": [
    { label: "STEM", value: "STEM" },
    { label: "ABM", value: "ABM" },
    { label: "HUMSS", value: "HUMSS" },
    { label: "GA", value: "GA" },
    { label: "TVL-ICT-CSS", value: "TVL-ICT-CSS" },
    { label: "TVL-HE-Cookery", value: "TVL-HE-Cookery" },
    { label: "TVL-HE-Caregiving", value: "TVL-HE-Caregiving" },
  ],
  "College": [
    { label: "SLG - Juris Doctor", value: "SLG - Juris Doctor" },
    { label: "SLG - AB Political Science", value: "SLG - AB Political Science" },
    { label: "COED - BEEd (Major in General Education)", value: "COED - BEEd (Major in General Education)" },
    { label: "COED - BEEd (Major in English)", value: "COED - BEEd (Major in English)" },
    { label: "COED - BSEd (Major in English)", value: "COED - BSEd (Major in English)" },
    { label: "COED - BSEd (Major in Filipino)", value: "COED - BSEd (Major in Filipino)" },
    { label: "CICTE - BSCpE", value: "CICTE - BSCpE" },
    { label: "CICTE - BSCS", value: "CICTE - BSCS" },
    { label: "CICTE - BSIT", value: "CICTE - BSIT" },
    { label: "CICTE - ACT (Major in Application Development)", value: "CICTE - ACT (Major in Application Development)" },
    { label: "CICTE - ACT (Major in Multimedia)", value: "CICTE - ACT (Major in Multimedia)" },
    { label: "CICTE - ACT (Major in Networking)", value: "CICTE - ACT (Major in Networking)" },
    { label: "CICTE - ACT (Major in Service Management)", value: "CICTE - ACT (Major in Service Management)" },
    { label: "CICTE - ACT (Major in Robotics Process Automation)", value: "CICTE - ACT (Major in Robotics Process Automation)" },
    { label: "CONAHS - BSN", value: "CONAHS - BSN" },
    { label: "CONAHS - 2-Year Professional Health Care Program", value: "CONAHS - 2-Year Professional Health Care Program" },
    { label: "CONAHS - 2-Year Diploma in Midwifery", value: "CONAHS - 2-Year Diploma in Midwifery" },
    { label: "COAB - BSA", value: "COAB - BSA" },
    { label: "COAB - BSAIS", value: "COAB - BSAIS" },
    { label: "COAB - BSBA (Major in Financial Management)", value: "COAB - BSBA (Major in Financial Management)" },
    { label: "COAB - BSBA (Major in Human Resource Management)", value: "COAB - BSBA (Major in Human Resource Management)" },
    { label: "COAB - BSEntrep", value: "BSEntrep" },
    { label: "CHM - BSHM", value: "BSHM" },
  ],
};


export default function HealthRecordForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      student_name: "",
      roll_number: "",
      date_of_birth: undefined,
      sex: undefined,
      home_address: "",
      student_contact: "",
      academic_level: "",
      year_level: "",
      academic_program: "",
      father_name: "",
      father_contact: "",
      father_email: "",
      mother_name: "",
      mother_contact: "",
      mother_email: "",
      allergies: "",
      // Initialize past_medical_history as an empty array
      past_medical_history: [],
    },
  });

  const watchedAcademicLevel = form.watch("academic_level");

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    try {
      console.log(values);
      toast.success("Form submitted successfully!");
      form.reset();
    } catch (error) {
      console.error("Form submission error", error);
      toast.error("Failed to submit the form.");
    }
  };


  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8 max-w-4xl mx-auto py-3"
      >
        {/* Personal Information Section */}
        <h3 className="text-lg font-bold text-gray-800">Personal Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="student_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name of Student</FormLabel>
                <FormControl>
                  <Input placeholder="Full Name" {...field} />
                </FormControl>
                <FormDescription>
                  Student's full name.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="date_of_birth"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Date of Birth</FormLabel>
                <FormControl>
                  <Input
                    type="date"
                    className="w-full"
                    value={field.value instanceof Date ? format(new Date(field.value), "yyyy-MM-dd") : ""}
                    onChange={(e) => field.onChange(e.target.value ? new Date(e.target.value) : null)}
                  />
                </FormControl>
                <FormDescription>
                  This is used to calculate the age.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="sex"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Sex</FormLabel>
                <RadioGroup onValueChange={field.onChange} value={field.value} className="flex flex-col gap-2 pt-2">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="male" id="male" />
                    <FormLabel htmlFor="male" className="font-normal">Male</FormLabel>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="female" id="female" />
                    <FormLabel htmlFor="female" className="font-normal">Female</FormLabel>
                  </div>
                </RadioGroup>
                <FormDescription>
                  Assigned sex at birth.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="home_address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Home Address</FormLabel>
              <FormControl>
                <Textarea rows={2} placeholder="Building/House No., Street, Barangay, City/Municipality, Province, Zip Code" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* Student Contact and Roll Number Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="roll_number"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Roll Number / Student ID</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="e.g., 0123" {...field} />
                </FormControl>
                <FormDescription>
                  Student's 4-digit unique identification number.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="student_contact"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Student's Contact Number</FormLabel>
                <FormControl>
                  <Input type="tel" placeholder="09XXXXXXXXX" {...field} />
                </FormControl>
                <FormDescription>
                  Student's mobile number.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Academic Information Section */}
        <h3 className="text-lg font-bold text-gray-800 pt-4">Academic Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="academic_level"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Academic Level</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        role="combobox"
                        className={cn(
                          "w-full justify-between",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value
                          ? academicLevels.find(
                              (level) => level.value === field.value
                            )?.label
                          : "Select academic level"}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                    <Command>
                      <CommandInput placeholder="Search academic level..." />
                      <CommandList>
                        <CommandEmpty>No academic level found.</CommandEmpty>
                        <CommandGroup>
                          {academicLevels.map((level) => (
                            <CommandItem
                              value={level.label}
                              key={level.value}
                              onSelect={() => {
                                form.setValue("academic_level", level.value);
                                form.setValue("year_level", "");
                                form.setValue("academic_program", "");
                              }}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  level.value === field.value
                                    ? "opacity-100"
                                    : "opacity-0"
                                )}
                              />
                              {level.label}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="year_level"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Year Level</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        role="combobox"
                        disabled={!watchedAcademicLevel || !(yearLevelsByAcademicLevel[watchedAcademicLevel]?.length > 0)}
                        className={cn(
                          "w-full justify-between",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value
                          ? (yearLevelsByAcademicLevel[watchedAcademicLevel] || []).find(
                              (year) => year.value === field.value
                            )?.label
                          : "Select year level"}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                    <Command>
                      <CommandInput placeholder="Search year level..." />
                      <CommandList>
                        <CommandEmpty>No year level found for selected academic level.</CommandEmpty>
                        <CommandGroup>
                          {(yearLevelsByAcademicLevel[watchedAcademicLevel] || []).map((year) => (
                            <CommandItem
                              value={year.label}
                              key={year.value}
                              onSelect={() => {
                                form.setValue("year_level", year.value);
                              }}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  year.value === field.value
                                    ? "opacity-100"
                                    : "opacity-0"
                                )}
                              />
                              {year.label}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="academic_program"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Academic Program</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        role="combobox"
                        disabled={!watchedAcademicLevel || !(academicProgramsByAcademicLevel[watchedAcademicLevel]?.length > 0)}
                        className={cn(
                          "w-full justify-between",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value
                          ? (academicProgramsByAcademicLevel[watchedAcademicLevel] || []).find(
                              (program) => program.value === field.value
                            )?.label
                          : "Select academic program"}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                    <Command>
                      <CommandInput placeholder="Search academic program..." />
                      <CommandList>
                        <CommandEmpty>No program found or applicable for selected academic level.</CommandEmpty>
                        <CommandGroup>
                          {(academicProgramsByAcademicLevel[watchedAcademicLevel] || []).map((program) => (
                            <CommandItem
                              value={program.label}
                              key={program.value}
                              onSelect={() => {
                                form.setValue("academic_program", program.value);
                              }}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  program.value === field.value
                                    ? "opacity-100"
                                    : "opacity-0"
                                )}
                              />
                              {program.label}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
                <FormDescription>
                  Only applicable for SHS or College.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>


        {/* Parent/Guardian Information Section */}
        <h3 className="text-lg font-bold text-gray-800 pt-4">Parent/Guardian Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="father_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Father's Name</FormLabel>
                <FormControl>
                  <Input placeholder="Father's Full Name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="father_contact"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Father's Contact Number</FormLabel>
                <FormControl>
                  <Input type="tel" placeholder="09XXXXXXXXX" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="father_email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Father's Email</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="example@mail.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="mother_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mother's Name</FormLabel>
                <FormControl>
                  <Input placeholder="Mother's Full Name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="mother_contact"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mother's Contact Number</FormLabel>
                <FormControl>
                  <Input type="tel" placeholder="09XXXXXXXXX" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="mother_email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mother's Email</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="example@mail.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Medical Information Section */}
        <h3 className="text-lg font-bold text-gray-800 pt-4">Medical Information</h3>

        {/* Allergies Textarea (kept as is, but now grouped under Medical Info) */}
        <FormField
          control={form.control}
          name="allergies"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Allergies</FormLabel>
              <FormControl>
                <Textarea placeholder="E.g., penicillin, peanuts. If none, indicate 'None'." {...field} />
              </FormControl>
              <FormDescription>
                Comma-separated list of allergies, if any. If none, please indicate "None".
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Past Medical History Checkboxes */}
        <FormField
          control={form.control}
          name="past_medical_history"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>Past Medical History: Check if the student has/had:</FormLabel>
              {/* Added grid classes for 3 columns on medium and larger screens */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {medicalHistoryOptions.map((item) => (
                  <FormField
                    key={item.value}
                    control={form.control}
                    name="past_medical_history"
                    render={({ field: checkboxField }) => {
                      return (
                        <FormItem key={item.value} className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={checkboxField.value?.includes(item.value)}
                              onCheckedChange={(checked) => {
                                return checked
                                  ? checkboxField.onChange([...(checkboxField.value || []), item.value])
                                  : checkboxField.onChange(
                                      checkboxField.value?.filter(
                                        (value) => value !== item.value
                                      )
                                    );
                              }}
                            />
                          </FormControl>
                          <FormLabel className="font-normal">
                            {item.label}
                          </FormLabel>
                        </FormItem>
                      );
                    }}
                  />
                ))}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />


        <div className="flex justify-end pt-4">
          <Button type="submit">Submit</Button>
        </div>
      </form>
    </Form>
  );
}
