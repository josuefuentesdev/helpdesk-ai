import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Icons } from "@/components/icons"
import { getTranslations } from "next-intl/server"
import { PreviousPageButton } from "@/components/previous-page-button"
import { LanguageToggle } from "@/components/language-toggle"

export const metadata = {
  title: "Page not found | Helpdesk AI",
  description: "The page you are looking for does not exist or has been moved.",
  robots: "noindex, nofollow"
}

export default async function NotFoundPage() {
  const t = await getTranslations("NotFoundPage")

  return (
    <main className="flex flex-col min-h-[100dvh] items-center justify-center p-4">
     <div className="absolute top-4 right-4">
        <LanguageToggle />
      </div>        
      <div className="w-full max-w-3xl text-center space-y-6">
        <div className="space-y-2">
          <div className="flex justify-center">
            <Icons.alert className="h-16 w-16 text-destructive" />
          </div>
          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl lg:text-6xl">
            {t("title")}
          </h1>
          <p className="mx-auto max-w-[600px] text-muted-foreground text-lg md:text-xl">
            {t("description")}
          </p>
        </div>
        
        <p className="text-muted-foreground">
          {t("errorCode")}
        </p>
        
        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
          <Button asChild variant="outline" className="w-full sm:w-auto">
            <PreviousPageButton/>
          </Button>
          <Button asChild className="w-full sm:w-auto">
            <Link href="/" className="flex items-center gap-2">
              <Icons.home className="h-4 w-4" />
              {t("homeButton")}
            </Link>
          </Button>
        </div>
      </div>
    </main>
  )
}