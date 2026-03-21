import { buttonVariants } from "@/components/ui/button"
import { Link } from "@tanstack/react-router"

export default function Header() {
  return (
    <div className="flex flex-row gap-2 items-center justify-between w-full px-8 py-8 md:px-16 lg:px-16 md:py-8 lg:py-8">
      <img src="/unitmetal-symbol.svg" alt="UnitMetal" className="h-8 w-8 dark:invert" />
      <div className="flex flex-row gap-2 items-center">
        <Link
          to="/login"
          className={buttonVariants({ variant: "secondary" })}
        >
          Log in
        </Link>
        <Link
          to="/signup"
          className={buttonVariants({ variant: "default" })}
        >
          Sign up
        </Link>
      </div>
    </div>
  )
}