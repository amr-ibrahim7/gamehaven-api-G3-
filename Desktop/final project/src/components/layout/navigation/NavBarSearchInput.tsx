import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils"
export function NavBarSearchInput() {
  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      console.log("Searching for:", e.currentTarget.value);
      // Add  search logic here
    }
  }
  
  return (
<div className="relative">
  <Input
    type="text"
    placeholder="Search"
    onKeyDown={handleKeyDown}
    className={cn(
      "transition-all duration-300 ease-in-out",
      "hidden sm:block w-[160px] focus:w-[240px]",
      "h-[30px] text-sm text-gray-700 dark:text-gray-200",
      "bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700",
      "rounded-4xl px-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
    )}
  />
</div>

  );
}
