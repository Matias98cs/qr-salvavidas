import { Loader2 } from "lucide-react";

export default function FullscreenLoading() {
  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
      <div className="flex flex-col items-center text-white">
        <Loader2 className="w-10 h-10 animate-spin" />
      </div>
    </div>
  );
}
