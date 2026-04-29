"use client";

import React from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { Form } from "@/components/ui/form";
import {
  Field,
  FieldLabel,
  FieldDescription,
  FieldError,
} from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DateTimePicker } from "@/components/datetime-picker";
import { Plus, Trash } from "lucide-react";

const formSchema = z.object({
  name: z.string().min(1),
  options: z
    .array(
      z.object({
        name: z.string().min(1),
      }),
    )
    .min(2),
  endDate: z.date(),
});

type Topic = z.infer<typeof formSchema>;

const Page = () => {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      options: [],
      endDate: new Date(),
    },
  });

  const { fields, append, remove } = useFieldArray({
    name: "options",
    control: form.control,
  });

  function onSubmit(values: Topic) {
    try {
      const setOptions = new Set(values.options.map((item) => item.name));
      if (setOptions.size !== values.options.length) {
        toast.error("Duplicate options");
        console.error(
          "Duplicate options",

          values.options.length,
          setOptions,
        );
        return;
      }

      toast(
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(values, null, 2)}</code>
        </pre>,
      );
    } catch (error) {
      console.error("Form submission error", error);
      toast.error("Failed to submit the form. Please try again.");
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8 max-w-3xl mx-auto py-10"
      >
        <Field>
          <FieldLabel htmlFor="name">Poll name</FieldLabel>
          <Input
            id="name"
            placeholder="What to eat for lunch"
            {...form.register("name")}
          />
          <FieldError>{form.formState.errors.name?.message}</FieldError>
        </Field>
        <Field>
          <FieldLabel htmlFor="endDate">End Date</FieldLabel>
          <Controller
            name="endDate"
            control={form.control}
            render={({ field }) => (
              <DateTimePicker
                {...field}
                onChange={(value) => {
                  field.onChange(value);
                }}
                value={field.value}
              />
            )}
          />

          <FieldDescription>
            Add the end date. After end date. the poll will delete after 24
            hours.
          </FieldDescription>
          <FieldError>{form.formState.errors.endDate?.message}</FieldError>
        </Field>
        <div className="flex flex-col gap-1">
          {fields.map((item, index) => {
            const registerProps = form.register(`options.${index}.name`);

            return (
              <div key={item.id} className="mt-0.5 flex">
                <Field>
                  <FieldLabel htmlFor="name">Option #{index + 1}</FieldLabel>
                  <Input
                    {...registerProps}
                    // onBlur={(e) => {
                    //   const lastValue = e.target.value;
                    //   if (lastValue === "") {
                    //     remove(index);
                    //   }
                    // }}
                  />

                  <FieldError>
                    {form.formState.errors.options?.at?.(index)?.message}
                  </FieldError>
                </Field>
                <Button
                  variant={"ghost"}
                  className="w-fit mt-auto"
                  type={`button`}
                  onClick={() => {
                    append({
                      name: "",
                    });
                  }}
                >
                  <Trash className="w-4 h-4" />
                </Button>
              </div>
            );
          })}
        </div>

        <div className="flex flex-col gap-1">
          <Button
            variant={"ghost"}
            className="w-fit"
            type={`button`}
            onClick={() => {
              append({
                name: "",
              });
            }}
          >
            <Plus className="w-4 h-4" />
          </Button>

          <Button type="submit" className="w-fit">
            Submit
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default Page;
