import { createFileRoute } from "@tanstack/react-router";
import { PortfolioPage } from "@/portfolio";

export const Route = createFileRoute("/portfolio")({
  component: PortfolioPage,
});
