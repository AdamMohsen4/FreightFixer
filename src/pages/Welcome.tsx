import { useNavigate } from "react-router";
import { Button } from "../components/ui/button";

export default function Welcome() {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate("/dashboard");
  };

  // This is a simple get started screen at the moment
  // You can add a login screen here if you want
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background">
      <div className="flex flex-col items-center space-y-6 text-center">
        <h1 className="text-4xl font-bold tracking-tight">
          Welcome to FreightFixer
        </h1>
        <p className="text-muted-foreground">
          Your all-in-one solution for freight management
        </p>
        <Button size="lg" onClick={handleGetStarted}>
          Get Started
        </Button>
      </div>
    </div>
  );
}
