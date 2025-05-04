import { Pie, PieChart } from "recharts"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

const roleChartConfig = {
  count: { label: "Users" },
  Student: { label: "Student", color: "#b2f0e8" },
  Doctor: { label: "Doctor", color: "#8de5db" },
  Nurse: { label: "Nurse", color: "#2fc4b2" },
  "Medical Records Officer": {
    label: "Medical Records Officer",
    color: "#289c8e",
  },
  "Medicine Inventory Handler": {
    label: "Medicine Inventory Handler",
    color: "#117c6f",
  },
}

export function UserRoleDistributionChart({ roleData }: { roleData: any[] }) {
  return (
    <ChartContainer
      config={roleChartConfig}
      className="mx-auto aspect-square max-h-[250px]"
    >
      <PieChart>
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent hideLabel />}
        />
        <Pie data={roleData} dataKey="count" nameKey="role" />
      </PieChart>
    </ChartContainer>
  )
}
