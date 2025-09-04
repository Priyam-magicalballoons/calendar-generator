import { UserDetailsForm } from "@/components/user-details-form";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground">
            Custom Calendar Generator
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground mt-2">
            Create personalized calendars with your photos and important dates
          </p>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <UserDetailsForm />
      </div>

      {/* Footer */}
      <footer className="border-t border-border bg-card/30 mt-8 sm:mt-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <div className="text-center text-muted-foreground">
            <p className="text-sm sm:text-base">
              &copy; 2024 Custom Calendar Generator. Create beautiful
              personalized calendars.
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}
