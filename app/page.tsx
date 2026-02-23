import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { SignInButton, SignUpButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Link2, BarChart3, Shield, Zap, Globe, Share2 } from "lucide-react";

const features = [
  {
    icon: Link2,
    title: "Shorten Any URL",
    description:
      "Instantly turn long, unwieldy URLs into clean, shareable short links.",
  },
  {
    icon: BarChart3,
    title: "Track Analytics",
    description:
      "Monitor click counts and usage stats for every link you create.",
  },
  {
    icon: Shield,
    title: "Secure & Reliable",
    description:
      "Your links are protected and always available when you need them.",
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    description:
      "Redirects happen in milliseconds so your audience never waits.",
  },
  {
    icon: Globe,
    title: "Share Anywhere",
    description:
      "Works across social media, email, messaging apps, and more.",
  },
  {
    icon: Share2,
    title: "Manage All Links",
    description:
      "View, edit, and organize all your shortened links in one place.",
  },
];

export default async function Home() {
  const { userId } = await auth();

  if (userId) {
    redirect("/dashboard");
  }

  return (
    <main className="flex flex-col items-center">
      {/* Hero */}
      <section className="flex flex-col items-center gap-8 px-6 py-24 text-center max-w-3xl">
        <h1 className="text-5xl font-bold tracking-tight leading-tight">
          Shorten links.{" "}
          <span className="text-[#6c47ff]">Track results.</span>
        </h1>
        <p className="text-lg text-muted-foreground max-w-xl">
          The simplest way to create short, memorable links and understand how
          your audience engages with your content.
        </p>
        <div className="flex gap-3 flex-wrap justify-center">
          <SignUpButton mode="modal">
            <Button
              size="lg"
              className="bg-[#6c47ff] hover:bg-[#5a3ad9] text-white rounded-full px-8"
            >
              Get started for free
            </Button>
          </SignUpButton>
          <SignInButton mode="modal">
            <Button size="lg" variant="outline" className="rounded-full px-8">
              Sign in
            </Button>
          </SignInButton>
        </div>
      </section>

      {/* Features */}
      <section className="w-full max-w-5xl px-6 pb-24">
        <h2 className="text-3xl font-semibold text-center mb-12">
          Everything you need
        </h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map(({ icon: Icon, title, description }) => (
            <Card key={title}>
              <CardHeader>
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#6c47ff]/10 mb-2">
                  <Icon className="h-5 w-5 text-[#6c47ff]" />
                </div>
                <CardTitle>{title}</CardTitle>
                <CardDescription>{description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="w-full max-w-3xl px-6 pb-24 text-center">
        <div className="rounded-2xl border bg-card p-12 flex flex-col items-center gap-6">
          <h2 className="text-3xl font-semibold">Ready to get started?</h2>
          <p className="text-muted-foreground max-w-md">
            Create your free account today and start shortening links in
            seconds.
          </p>
          <SignUpButton mode="modal">
            <Button
              size="lg"
              className="bg-[#6c47ff] hover:bg-[#5a3ad9] text-white rounded-full px-8"
            >
              Create free account
            </Button>
          </SignUpButton>
        </div>
      </section>
    </main>
  );
}
