"use client";

import React, { useEffect, useState } from 'react';
import { useForm } from "react-hook-form";
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
import { Textarea } from "@/components/ui/textarea";

const formSchema = z.object({
  preferred_date: z.coerce.date().refine(date => !!date, { message: "Date is required." }),
  reason: z.string().min(1, "Please state reason for consultation."),
  additional_notes: z.string().optional(),
});

export default function ConsultationForm() {
  const [studentId, setStudentId] = useState<string | null>(null);
  const [rollNumber, setRollNumber] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      preferred_date: undefined,
      reason: "",
      additional_notes: "",
    },
  });

  useEffect(() => {
    const fetchStudent = async () => {
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError || !user) {
        toast.error("User not authenticated.");
        return;
        }

        const { data: student, error: studentError } = await supabase
        .from("students")
        .select("id, roll_number")
        .eq("profile_id", user.id)
        .single();

        if (studentError || !student) {
        toast.error("Student record not found.");
        return;
        }

        setStudentId(student.id); // formerly student.student_id
        setRollNumber(student.roll_number);
        setLoading(false);
      };

      fetchStudent();
  }, []);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!studentId) {
      toast.error("Student ID is missing.");
      return;
    }

    const { error } = await supabase.from("consultations").insert({
      student_id: studentId,
      preferred_date: values.preferred_date,
      reason: values.reason,
      additional_notes: values.additional_notes || null,
      status: "Pending",
    });

    if (error) {
      toast.error("Failed to submit consultation.");
      console.error(error);
    } else {
      toast.success("Consultation request submitted.");
      form.reset();
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8 max-w-4xl mx-auto py-3"
      >
        <div className="flex flex-col md:flex-row gap-4">
            {rollNumber && (
              <div className="w-full md:w-1/2">
                <FormLabel className="mb-2">Roll Number / Student ID</FormLabel>
                <Input value={rollNumber} disabled />
              </div>
            )}

            <div className="w-full md:w-1/2">
              <FormField
                control={form.control}
                name="preferred_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Preferred Date</FormLabel>
                    <FormControl>
                      <Input
                        type="date"
                        value={
                          field.value instanceof Date
                            ? format(new Date(field.value), "yyyy-MM-dd")
                            : ""
                        }
                        onChange={(e) =>
                          field.onChange(e.target.value ? new Date(e.target.value) : null)
                        }
                      />
                    </FormControl>
                    <FormDescription>
                      Choose your preferred date for the consultation.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
        </div>


        <FormField
          control={form.control}
          name="reason"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Reason for consultation</FormLabel>
              <FormControl>
                <Textarea placeholder="" {...field} />
              </FormControl>
              <FormDescription>
                Describe the reason for your consultation.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="additional_notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Additional Notes</FormLabel>
              <FormControl>
                <Textarea placeholder="" {...field} />
              </FormControl>
              <FormDescription>
                Any other information the clinic should know.
              </FormDescription>
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
