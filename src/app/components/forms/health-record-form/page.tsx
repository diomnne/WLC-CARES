"use client";

import { useForm, UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { format } from "date-fns";
import { createClient } from "@/utils/supabase/client";

const supabase = createClient();

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
import { Checkbox } from "@/components/ui/checkbox";
import { useState, useEffect } from "react";

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
  past_medical_history: z.array(z.string()).optional(),
});

const medicalHistoryOptions = [
  "Measles", "Mumps", "German Measles", "Chicken Pox", "Hepatitis",
  "Allergies", "Bronchial Asthma", "Heart Disorder", "Kidney Disorder",
  "Convulsions", "Epilepsy", "Psychoneurosis", "Bleeding Tendency", "Others"
].map((v) => ({ label: v, value: v }));

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
  "Graduate School": [
    { label: "MAEd (Major in Filipino)", value: "MAEd (Major in Filipino)" },
    { label: "MAEd (Major in Elementary Education)", value: "MAEd (Major in Elementary Education)" },
    { label: "MAEd (Major in Administration and Supervision)", value: "MAEd (Major in Administration and Supervision)" },
  ],
};

export default function HealthRecordForm() {
  const [loading, setLoading] = useState(true);
  const [studentId, setStudentId] = useState<string | null>(null); // PK from 'students' table
  const [profileId, setProfileId] = useState<string | null>(null); // PK from 'profiles' table (user.id)
  const [isEditMode, setIsEditMode] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      student_name: "",
      roll_number: "",
      date_of_birth: undefined,
      sex: undefined,
      home_address: "",
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
      past_medical_history: [],
    },
  });

  const watchedAcademicLevel = form.watch("academic_level");

  useEffect(() => {
    const fetchInitialData = async () => {
      setLoading(true);
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        toast.error("User not authenticated.");
        setLoading(false);
        return;
      }
      setProfileId(user.id);

      // Fetch student data including profile name
      const { data: studentData, error: studentError } = await supabase
        .from("students")
        .select(`
          *,
          profile:profile_id (full_name)
        `)
        .eq("profile_id", user.id)
        .single();

      if (studentError || !studentData) {
        // If no student record, try to get name from profile for new student entry
        const { data: userProfile, error: profileError } = await supabase
          .from("profiles")
          .select("full_name")
          .eq("id", user.id)
          .single();

        if (userProfile) {
          form.setValue("student_name", userProfile.full_name || "");
        } else {
            console.error("Profile not found for new student setup:", profileError)
        }
        // Roll number might be something they need to input if it's a new student not yet in 'students'
        // Or it's assigned upon creation of student record. Assuming for now it might be blank or they enter it.
        toast.info("No existing student record found. Some fields may need to be entered manually if creating a new record, or pre-filled if an admin creates the student entry first.");
        //setIsEditMode(true); // Optionally enable edit mode if no student data
      } else {
        setStudentId(studentData.id);
        form.setValue("student_name", studentData.profile?.full_name || studentData.student_name || ""); // Prioritize profile.full_name
        form.setValue("roll_number", studentData.roll_number || "");
        form.setValue("date_of_birth", studentData.date_of_birth ? new Date(studentData.date_of_birth) : null);
        form.setValue("sex", studentData.sex || undefined);
        form.setValue("home_address", studentData.home_address || "");
        form.setValue("student_contact", studentData.contact_number || "");
        form.setValue("academic_level", studentData.academic_level || "");
        form.setValue("year_level", studentData.year_level || "");
        form.setValue("academic_program", studentData.academic_program || "");

        // Fetch guardians
        const { data: studentGuardians, error: sgError } = await supabase
          .from("student_guardians")
          .select(`
            relationship,
            guardian:guardian_id (id, full_name, contact_number, email)
          `)
          .eq("student_id", studentData.id);

        if (sgError) {
          toast.error("Failed to fetch guardian information.");
        } else if (studentGuardians) {
          studentGuardians.forEach(sg => {
            if (sg.guardian) {
              if (Array.isArray(sg.guardian) && sg.guardian.length > 0) {
                const guardian = sg.guardian[0];
                if (sg.relationship === "Father") {
                  form.setValue("father_name", guardian.full_name || "");
                  form.setValue("father_contact", guardian.contact_number || "");
                  form.setValue("father_email", guardian.email || "");
                } else if (sg.relationship === "Mother") {
                  form.setValue("mother_name", guardian.full_name || "");
                  form.setValue("mother_contact", guardian.contact_number || "");
                  form.setValue("mother_email", guardian.email || "");
                }
              }
            }
          });
        }

        // Fetch latest health record to pre-fill allergies and medical history
        const { data: healthRecord, error: hrError } = await supabase
          .from("health_records")
          .select("id, allergies")
          .eq("student_id", studentData.id)
          .order("created_at", { ascending: false }) // Assuming you have created_at
          .limit(1)
          .single();

        if (healthRecord) {
          form.setValue("allergies", healthRecord.allergies || "");
          const { data: medHistory, error: mhError } = await supabase
            .from("medical_histories")
            .select("condition")
            .eq("health_record_id", healthRecord.id)
            .eq("had_condition", true);

          if (medHistory) {
            form.setValue("past_medical_history", medHistory.map(mh => mh.condition));
          }
        }
      }
      setLoading(false);
    };

    fetchInitialData();
  }, [form]);


  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!profileId) {
      toast.error("User profile ID is missing. Cannot submit.");
      return;
    }

    setLoading(true);

    try {
        // --- 1. Upsert Student Data ---
        let currentStudentId = studentId;
        const studentPayload = {
            profile_id: profileId,
            student_name: values.student_name, // student_name in students table
            roll_number: values.roll_number,
            date_of_birth: values.date_of_birth ? format(values.date_of_birth, "yyyy-MM-dd") : null,
            sex: values.sex,
            home_address: values.home_address,
            contact_number: values.student_contact,
            academic_level: values.academic_level,
            year_level: values.year_level || null,
            academic_program: values.academic_program || null,
            updated_at: new Date().toISOString(),
        };

        if (currentStudentId) { // Update existing student
            const { data: updatedStudent, error: studentUpdateError } = await supabase
                .from("students")
                .update(studentPayload)
                .eq("id", currentStudentId)
                .select("id")
                .single();
            if (studentUpdateError) throw new Error(`Failed to update student record: ${studentUpdateError.message}`);
            if (!updatedStudent) throw new Error("Student update returned no data.");
        } else { // Insert new student
            const { data: newStudent, error: studentInsertError } = await supabase
                .from("students")
                .insert({...studentPayload, created_at: new Date().toISOString()})
                .select("id")
                .single();
            if (studentInsertError) throw new Error(`Failed to create student record: ${studentInsertError.message}`);
            if (!newStudent) throw new Error("Student insert returned no data.");
            currentStudentId = newStudent.id;
            setStudentId(newStudent.id); // Update state with new student ID
        }

        if (!currentStudentId) {
            throw new Error("Student ID is missing after student data operation.");
        }

        // --- 2. Upsert Guardians and Student-Guardian Relationships ---
        const guardianUpserts = async (guardianName: string, guardianContact: string | undefined, guardianEmail: string, relationship: "Father" | "Mother") => {
            if (!guardianName || !guardianEmail) return null; // Basic validation

            // Check if guardian exists for this student with this relationship
            const { data: existingStudentGuardian, error: sgQueryError } = await supabase
                .from("student_guardians")
                .select("guardian_id, guardian:guardian_id(*)")
                .eq("student_id", currentStudentId!)
                .eq("relationship", relationship)
                .single();

            let guardianIdToLink: string;

            if (sgQueryError && sgQueryError.code !== 'PGRST116') { // PGRST116 is ' exactamente una fila (o ninguna)'
                 console.error(`Error querying student_guardian for ${relationship}:`, sgQueryError);
            }


            if (existingStudentGuardian && existingStudentGuardian.guardian) {
                // Guardian link exists, update guardian info
                const { data: updatedGuardian, error: guardianUpdateError } = await supabase
                    .from("guardians")
                    .update({
                        full_name: guardianName,
                        contact_number: guardianContact || null,
                        email: guardianEmail,
                    })
                    .eq("id", existingStudentGuardian.guardian_id)
                    .select("id")
                    .single();
                if (guardianUpdateError) throw new Error(`Failed to update ${relationship}: ${guardianUpdateError.message}`);
                if (!updatedGuardian) throw new Error(`${relationship} update returned no data.`);
                guardianIdToLink = updatedGuardian.id;
            } else {
                // No existing link for this relationship, or guardian doesn't exist.
                // Try to find guardian by email first (assuming email is unique for guardians)
                let { data: existingGuardianByEmail, error: emailQueryError } = await supabase
                    .from("guardians")
                    .select("id")
                    .eq("email", guardianEmail)
                    .single();

                if (emailQueryError && emailQueryError.code !== 'PGRST116') {
                    console.error(`Error querying guardian by email for ${relationship}:`, emailQueryError);
                }

                if (existingGuardianByEmail) {
                    guardianIdToLink = existingGuardianByEmail.id;
                     // Optionally update this guardian's info if names/contacts differ
                    const { error: guardianContactUpdateError } = await supabase
                        .from("guardians")
                        .update({ full_name: guardianName, contact_number: guardianContact || null })
                        .eq("id", guardianIdToLink);
                    if (guardianContactUpdateError) console.warn(`Could not update contact for existing guardian ${guardianEmail}: ${guardianContactUpdateError.message}`);
                } else {
                    // Guardian does not exist, insert new guardian
                    const { data: newGuardian, error: guardianInsertError } = await supabase
                        .from("guardians")
                        .insert({
                            full_name: guardianName,
                            contact_number: guardianContact || null,
                            email: guardianEmail,
                            created_at: new Date().toISOString(),
                        })
                        .select("id")
                        .single();
                    if (guardianInsertError) throw new Error(`Failed to insert ${relationship}: ${guardianInsertError.message}`);
                    if (!newGuardian) throw new Error(`${relationship} insert returned no data.`);
                    guardianIdToLink = newGuardian.id;
                }

                // Create student_guardian link if it didn't exist for this relationship
                if (!existingStudentGuardian) {
                    const { error: sgInsertError } = await supabase
                        .from("student_guardians")
                        .insert({
                            student_id: currentStudentId!,
                            guardian_id: guardianIdToLink,
                            relationship: relationship,
                            is_primary: false,
                        });
                    if (sgInsertError) throw new Error(`Failed to link ${relationship} to student: ${sgInsertError.message}`);
                }
            }
        };

        await guardianUpserts(values.father_name, values.father_contact, values.father_email, "Father");
        await guardianUpserts(values.mother_name, values.mother_contact, values.mother_email, "Mother");

        // --- 3. Insert Health Record ---
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error("User not available for submission.");

        const { data: healthRecord, error: hrInsertError } = await supabase
            .from("health_records")
            .insert({
                student_id: currentStudentId!,
                allergies: values.allergies || null,
                notes: "",
                submitted_by: user.id,
                status: "Pending",
            })
            .select("id")
            .single();

        if (hrInsertError) throw new Error(`Failed to submit health record: ${hrInsertError.message}`);
        if (!healthRecord) throw new Error("Health record insert returned no data.");

        // --- 4. Insert Medical History ---
        if (values.past_medical_history && values.past_medical_history.length > 0) {
            const medicalHistoriesToInsert = values.past_medical_history.map((condition) => ({
                health_record_id: healthRecord.id,
                condition: condition,
                had_condition: true,
            }));

            const { error: mhInsertError } = await supabase
                .from("medical_histories")
                .insert(medicalHistoriesToInsert);

            if (mhInsertError) throw new Error(`Failed to save medical history: ${mhInsertError.message}`);
        }

        toast.success("Health record submitted successfully!");
        setIsEditMode(false);
        // form.reset(); // Decide if you want to reset or keep pre-filled data
        // Re-fetch data to show the latest saved info, including the new health record details
         const { data: studentData } = await supabase.from("students").select(`*, profile:profile_id (full_name)`).eq("id", currentStudentId!).single();
         if (studentData) {
             form.setValue("student_name", studentData.profile?.full_name || studentData.student_name || "");
             // ... (re-set other student fields if needed, or rely on a full fetchInitialData call)
         }
         const { data: hrData } = await supabase.from("health_records").select("id, allergies").eq("id", healthRecord.id).single();
         if (hrData) {
            form.setValue("allergies", hrData.allergies || "");
         }
         // ... re-fetch and set medical history if needed

    } catch (error: any) {
        console.error("Submission error:", error);
        toast.error(error.message || "An unexpected error occurred during submission.");
    } finally {
        setLoading(false);
    }
};

  if (loading) return <p className="text-center py-4">Loading...</p>;

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8 max-w-4xl mx-auto py-3"
      >
        <div className="flex justify-start">
          <Button
            type="button"
            onClick={() => setIsEditMode(!isEditMode)}
            className="bg-[#009da2] hover:bg-[#28b1b5]"
          >
            {isEditMode ? "Cancel Edit" : "Update Record"}
          </Button>
        </div>

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
                  {/* Student name is fetched and should generally not be editable by the student directly if it comes from an official profile */}
                  <Input placeholder="Full Name" {...field} disabled />
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
                    value={field.value instanceof Date ? format(field.value, "yyyy-MM-dd") : ""}
                    onChange={(e) => field.onChange(e.target.value ? new Date(e.target.value) : null)}
                    disabled={!isEditMode}
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
                <RadioGroup onValueChange={field.onChange} value={field.value} className="flex flex-col gap-2 pt-2" disabled={!isEditMode}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Male" id="male" /> {/* Value matches typical DB entries */}
                    <FormLabel htmlFor="male" className="font-normal">Male</FormLabel>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Female" id="female" /> {/* Value matches typical DB entries */}
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
                <Textarea rows={2} placeholder="Building/House No., Street, Barangay, City/Municipality, Province, Zip Code" {...field} disabled={!isEditMode} />
              </FormControl>
              <FormDescription>
                  e.g., 123 ABC Road, Brgy Southwest, Ormoc City, Leyte, 6541
                </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="roll_number"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Roll Number / Student ID</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="e.g., 0123" {...field} disabled />
                </FormControl>
                <FormDescription>
                  Student's unique identification number.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="student_contact" // Updated name
            render={({ field }) => (
              <FormItem>
                <FormLabel>Student's Contact Number</FormLabel>
                <FormControl>
                  <Input type="tel" placeholder="09XXXXXXXXX" {...field} disabled={!isEditMode} />
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
                        disabled={!isEditMode}
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
                        disabled={!isEditMode || !watchedAcademicLevel || !(yearLevelsByAcademicLevel[watchedAcademicLevel]?.length > 0)}
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
                        disabled={!isEditMode || !watchedAcademicLevel || !(academicProgramsByAcademicLevel[watchedAcademicLevel]?.length > 0)}
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
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Parent/Guardian Information Section */}
        <h3 className="text-lg font-bold text-gray-800 pt-4">Parent/Guardian Information</h3>
        {/* Father */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="father_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Father's Name</FormLabel>
                <FormControl>
                  <Input placeholder="Father's Full Name" {...field} disabled={!isEditMode} />
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
                  <Input type="tel" placeholder="09XXXXXXXXX" {...field} disabled={!isEditMode} />
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
                  <Input type="email" placeholder="example@mail.com" {...field} disabled={!isEditMode} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        {/* Mother */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="mother_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mother's Name</FormLabel>
                <FormControl>
                  <Input placeholder="Mother's Full Name" {...field} disabled={!isEditMode} />
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
                  <Input type="tel" placeholder="09XXXXXXXXX" {...field} disabled={!isEditMode} />
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
                  <Input type="email" placeholder="example@mail.com" {...field} disabled={!isEditMode} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Medical Information Section */}
        <h3 className="text-lg font-bold text-gray-800 pt-4">Medical Information</h3>
        <FormField
          control={form.control}
          name="allergies"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Allergies</FormLabel>
              <FormControl>
                <Textarea placeholder="E.g., penicillin, peanuts. If none, indicate 'None'." {...field} disabled={!isEditMode} />
              </FormControl>
              <FormDescription>
                Comma-separated list of allergies, if any. If none, please indicate "None".
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="past_medical_history"
          render={() => ( // Main field render doesn't need 'field' if using individual checkbox fields
            <FormItem className="space-y-3">
              <FormLabel>Past Medical History: Check if the student has/had:</FormLabel>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {medicalHistoryOptions.map((item) => (
                  <FormField
                    key={item.value}
                    control={form.control}
                    name="past_medical_history" // Each checkbox still manipulates this array
                    render={({ field: checkboxField }) => { // 'field' here is for the array
                      return (
                        <FormItem key={item.value} className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              className="border-gray-400 data-[state=checked]:bg-[#009da2] data-[state=checked]:border-[#009da2]"
                              checked={checkboxField.value?.includes(item.value)}
                              onCheckedChange={(checked) => {
                                const currentValue = checkboxField.value || [];
                                return checked
                                  ? checkboxField.onChange([...currentValue, item.value])
                                  : checkboxField.onChange(
                                      currentValue.filter(
                                        (value) => value !== item.value
                                      )
                                    );
                              }}
                              disabled={!isEditMode}
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

        {isEditMode && (
          <div className="flex justify-end pt-4">
            <Button type="submit" className="bg-[#009da2] hover:bg-[#28b1b5]" disabled={loading}>
              {loading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        )}
      </form>
    </Form>
  );
}


