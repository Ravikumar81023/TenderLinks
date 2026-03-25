//@ts-nocheck

import { useState } from "react";
import { useForm } from "@formspree/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Phone, Send } from "lucide-react";

const ContactForm = () => {
  const [state, handleSubmit] = useForm("mzzdlodr"); // Replace with your Formspree form ID
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (state.succeeded) {
    return (
      <div className="p-6 bg-green-50 rounded-lg text-center">
        <h3 className="text-xl font-semibold text-green-700 mb-2">
          Thank You!
        </h3>
        <p className="text-green-600">
          We'll get back to you as soon as possible.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <label
          htmlFor="name"
          className="block text-sm font-medium text-gray-700"
        >
          Full Name
        </label>
        <Input
          id="name"
          name="name"
          type="text"
          required
          className="w-full"
          placeholder="John Doe"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700"
          >
            Email
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              id="email"
              name="email"
              type="email"
              required
              className="pl-10"
              placeholder="john@example.com"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label
            htmlFor="phone"
            className="block text-sm font-medium text-gray-700"
          >
            Phone Number
          </label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              id="phone"
              name="phone"
              type="tel"
              className="pl-10"
              placeholder="+1 (555) 000-0000"
            />
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <label
          htmlFor="subject"
          className="block text-sm font-medium text-gray-700"
        >
          Subject
        </label>
        <Input
          id="subject"
          name="subject"
          type="text"
          required
          className="w-full"
          placeholder="How can we help you?"
        />
      </div>

      <div className="space-y-2">
        <label
          htmlFor="message"
          className="block text-sm font-medium text-gray-700"
        >
          Message
        </label>
        <Textarea
          id="message"
          name="message"
          required
          className="w-full min-h-[150px]"
          placeholder="Your message here..."
        />
      </div>

      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg transition-colors duration-200"
      >
        {isSubmitting ? (
          "Sending..."
        ) : (
          <>
            Send Message
            <Send className="ml-2 h-5 w-5" />
          </>
        )}
      </Button>
    </form>
  );
};

export default ContactForm;
