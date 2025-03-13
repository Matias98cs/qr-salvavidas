import { Button } from "@/components/ui/button";
import "./App.css";

function App() {
  return (
    <div>
      <h1 className="text-center text-3xl font-bold">Hello, Tailwind CSS!</h1>
      <p className="text-center">
        This is a simple example using Tailwind CSS.
      </p>
      <div className="flex flex-col items-center justify-center min-h-svh">
        <Button className="cursor-pointer">Click me</Button>
      </div>
    </div>
  );
}

export default App;
