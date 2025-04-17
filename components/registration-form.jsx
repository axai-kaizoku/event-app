"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import { useUser } from "@/context/user-context"
import { registerForEvent } from "@/lib/api"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/hooks/use-toast"

const schema = yup
  .object({
    fullName: yup.string().required("Full name is required"),
    email: yup
      .string()
      .email("Please enter a valid email")
      .required("Email is required"),
    phone: yup.string().required("Phone number is required"),
    dietaryRequirements: yup.string(),
    agreeToTerms: yup
      .boolean()
      .oneOf([true], "You must agree to the terms and conditions"),
  })
  .required()

export default function RegistrationForm({ event }) {
  const router = useRouter()
  const { user, updateUser } = useUser()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      fullName: user?.name || "",
      email: user?.email || "",
      phone: "",
      dietaryRequirements: "",
      agreeToTerms: false,
    },
  })

  const onSubmit = async (data) => {
    if (!user || !event) return

    setIsSubmitting(true)

    try {
      await registerForEvent({
        userId: user.id,
        eventId: event.id,
        registrationData: data,
      })

      // Update user context with new registration
      updateUser({
        ...user,
        registeredEvents: [...(user.registeredEvents || []), event.id],
      })

      toast({
        title: "Registration successful!",
        description: `You've successfully registered for ${event.title}`,
      })

      // Redirect to event page
      router.push(`/events/${event.id}`)
    } catch (error) {
      toast({
        title: "Registration failed",
        description:
          "There was an error processing your registration. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="fullName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <Input placeholder="John Doe" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="john@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone Number</FormLabel>
              <FormControl>
                <Input
                  placeholder="+1 (555) 123-4567"
                  {...field}
                  onChange={(e) => {
                    const cleaned = e.target.value.replace(/[^\d+]/g, "")
                    field.onChange(cleaned)
                  }}
                  max={15}
                  type="tel"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="dietaryRequirements"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Dietary Requirements (Optional)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Please list any dietary restrictions or allergies"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Let us know if you have any special dietary needs or allergies
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="agreeToTerms"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>I agree to the terms and conditions</FormLabel>
                <FormDescription>
                  By checking this box, you agree to our Terms of Service and
                  Privacy Policy.
                </FormDescription>
                <FormMessage />
              </div>
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Complete Registration"}
        </Button>
      </form>
    </Form>
  )
}
