import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface HeroPillProps {
  href: string
  label: string
  announcement?: string
  className?: string
  isExternal?: boolean
  onClick?: () => void
}

export function HeroPill({
  href,
  label,
  announcement = "📣 Announcement",
  className,
  isExternal = false,
  onClick,
}: HeroPillProps) {
  const handleClick = (e: React.MouseEvent) => {
    if (onClick) {
      e.preventDefault();
      onClick();
    }
  };

  return (
    <motion.a
      href={href}
      target={isExternal ? "_blank" : undefined}
      onClick={handleClick}
      className={cn(
        "flex w-auto items-center space-x-2 rounded-full",
        "bg-primary/20 ring-1 ring-accent",
        "px-2 py-1 whitespace-pre cursor-pointer transition-all duration-300",
        "hover:bg-primary/30 hover:scale-105 hover:shadow-lg",
        className
      )}
      initial={{ opacity: 0, y: -20, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        duration: 0.8,
        ease: [0.25, 0.46, 0.45, 0.94],
        type: "spring",
        stiffness: 100,
        damping: 15
      }}
      whileHover={{
        scale: 1.05,
        transition: { duration: 0.2 }
      }}
      whileTap={{
        scale: 0.98,
        transition: { duration: 0.1 }
      }}
    >
      <div className={cn(
        "w-fit rounded-full bg-accent px-2 py-0.5",
        "text-xs font-medium text-primary sm:text-sm",
        "text-center"
      )}>
        {announcement}
      </div>
      <p className="text-xs font-medium text-primary sm:text-sm">
        {label}
      </p>
      <svg
        width="12"
        height="12"
        className="ml-1"
        viewBox="0 0 12 12"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M8.78141 5.33312L5.20541 1.75712L6.14808 0.814453L11.3334 5.99979L6.14808 11.1851L5.20541 10.2425L8.78141 6.66645H0.666748V5.33312H8.78141Z"
          fill="currentColor"
          className="text-primary"
        />
      </svg>
    </motion.a>
  )
}
