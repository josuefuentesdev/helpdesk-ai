"use client"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { LineChart as LineChartIcon, PieChart as PieChartIcon, TrendingUp } from "lucide-react"
import { Bar, BarChart, Line, LineChart as RechartsLineChart, Pie, XAxis, YAxis, PieChart as RechartsPieChart } from "recharts"
import { Icons } from "@/components/icons"
import type { DashboardStats } from "@/types"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart"
import { useTranslations } from 'next-intl';

const ChartCard = ({
  title,
  description,
  icon: Icon,
  children,
  footer,
  className = ""
}: {
  title: string;
  description?: string;
  icon: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
}) => (
  <Card className={`flex flex-col ${className}`}>
    <CardHeader className="items-center pb-0">
      <div className="flex items-center gap-2">
        <Icon className="h-4 w-4 text-muted-foreground" />
        <CardTitle className="text-lg">{title}</CardTitle>
      </div>
      {description && <CardDescription>{description}</CardDescription>}
    </CardHeader>
    <CardContent className="flex-1 pb-0">
      {children}
    </CardContent>
    {footer && <CardFooter className="flex-col gap-1 text-sm pt-0">
      {footer}
    </CardFooter>}
  </Card>
)

interface AnalyticsProps {
  dashboardStats: DashboardStats;
}

// Utility to generate color palette
const chartPalette = [
  'var(--chart-1)',
  'var(--chart-2)',
  'var(--chart-3)',
  'var(--chart-4)',
  'var(--chart-5)',
];

// Generic function to map data to chart config and color
function mapDataWithColors<T extends Record<string, unknown>>(data: T[], key = 'name', labelKey = 'label'): (T & { fill: string })[] {
  return data.map((item, idx) => ({
    ...item,
    fill: chartPalette[idx % chartPalette.length] ?? '', // always a string
  }));
}

function makeChartConfig<T extends Record<string, unknown>>(data: T[], key = 'name', labelKey = 'label'): Record<string, { [k: string]: unknown; color: string }> {
  return Object.fromEntries(
    data.map((item, idx) => [
      item[key] as string,
      { [labelKey]: item[key], color: (chartPalette[idx % chartPalette.length] ?? '#8884d8') + '' },
    ])
  );
}

export function Analytics({ dashboardStats }: AnalyticsProps) {
  const t = useTranslations('Analytics');
  // Asset types chart
  const assetTypesWithColor = mapDataWithColors(dashboardStats.assetTypes || [], 'type', 'label');
  const assetTypeConfig = makeChartConfig(assetTypesWithColor, 'type', 'label');
  assetTypeConfig.count = { label: t('assets'), color: chartPalette[0] ?? '' };

  const chartCards = [
    {
      title: t('ticketStatus.title'),
      description: t('ticketStatus.description'),
      icon: PieChartIcon,
      data: mapDataWithColors([
        { name: t('ticketStatus.open'), value: dashboardStats.open },
        { name: t('ticketStatus.inProgress'), value: dashboardStats.inProgress },
        { name: t('ticketStatus.resolved'), value: dashboardStats.resolved },
        { name: t('ticketStatus.closed'), value: dashboardStats.closed },
      ].filter(item => item.value > 0)),
      config: {
        value: { label: t('tickets') },
        ...makeChartConfig([
          { name: t('ticketStatus.open') },
          { name: t('ticketStatus.inProgress') },
          { name: t('ticketStatus.resolved') },
          { name: t('ticketStatus.closed') },
        ]),
      },
      Chart: (props: { data: Array<{ name: string; value: number; fill: string }> }) => (
        <RechartsPieChart>
          <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
          <Pie
            data={props.data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            paddingAngle={2}
          />
          <ChartLegend content={<ChartLegendContent nameKey="name" />} verticalAlign="bottom" />
        </RechartsPieChart>
      ),
      footer: (
        <div className="flex items-center gap-2 text-sm">
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
          <span className="text-muted-foreground">
            {dashboardStats.open + dashboardStats.inProgress + dashboardStats.resolved + dashboardStats.closed > 0
              ? t('ticketStatus.showingAll')
              : t('ticketStatus.noData')}
          </span>
        </div>
      ),
      className: '',
    },
    {
      title: t('assetStatus.title'),
      description: t('assetStatus.description'),
      icon: PieChartIcon,
      data: mapDataWithColors([
        { name: t('assetStatus.active'), value: dashboardStats.active },
        { name: t('assetStatus.inactive'), value: dashboardStats.inactive },
        { name: t('assetStatus.decommissioned'), value: dashboardStats.decommissioned },
      ].filter(item => item.value > 0)),
      config: {
        value: { label: t('assets') },
        ...makeChartConfig([
          { name: t('assetStatus.active') },
          { name: t('assetStatus.inactive') },
          { name: t('assetStatus.decommissioned') },
        ]),
      },
      Chart: (props: { data: Array<{ name: string; value: number; fill: string }> }) => (
        <RechartsPieChart>
          <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
          <Pie
            data={props.data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            paddingAngle={2}
          />
          <ChartLegend content={<ChartLegendContent nameKey="name" />} verticalAlign="bottom" />
        </RechartsPieChart>
      ),
      footer: (
        <div className="flex items-center gap-2 text-sm">
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
          <span className="text-muted-foreground">
            {dashboardStats.active + dashboardStats.inactive + dashboardStats.decommissioned > 0
              ? t('assetStatus.showingAll')
              : t('assetStatus.noData')}
          </span>
        </div>
      ),
      className: '',
    },
  ];

  return (
    <>
      <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-2">
        {chartCards.map((card, _) => (
          <ChartCard
            key={card.title}
            title={card.title}
            description={card.description}
            icon={card.icon}
            footer={card.footer}
            className={card.className}
          >
            <ChartContainer config={card.config} className="mx-auto aspect-square max-h-[250px]">
              {card.Chart({ data: card.data })}
            </ChartContainer>
          </ChartCard>
        ))}
      </div>

      <div className="grid gap-4 mt-4">
        <ChartCard
          title={t('ticketsOverTime.title')}
          description={t('ticketsOverTime.description')}
          icon={LineChartIcon}
          className="col-span-2"
        >
          <ChartContainer config={{ count: { label: t('tickets'), color: chartPalette[0] } }} className="w-full h-[300px]">
            <RechartsLineChart
              data={dashboardStats.ticketTrend}
              margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
            >
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={10}
                className="text-xs"
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={10}
                className="text-xs"
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Line
                type="monotone"
                dataKey="count"
                stroke={chartPalette[0]}
                strokeWidth={2}
                dot={false}
              />
              <ChartLegend content={<ChartLegendContent />} verticalAlign="bottom" />
            </RechartsLineChart>
          </ChartContainer>
        </ChartCard>

        <ChartCard
          title={t('assetsByType.title')}
          description={t('assetsByType.description')}
          icon={Icons.assets}
          className="col-span-2"
          footer={
            <div className="text-xs text-muted-foreground">
              {t('assetsByType.showingTypes', { count: dashboardStats.assetTypes?.length || 0 })}
            </div>
          }
        >
          <ChartContainer config={assetTypeConfig} className="w-full h-[300px]">
            <BarChart
              data={assetTypesWithColor}
              margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
              barSize={36}
            >
              <XAxis
                dataKey="type"
                tickLine={false}
                axisLine={false}
                className="text-xs"
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                className="text-xs"
              />
              <ChartTooltip content={<ChartTooltipContent nameKey="type" />} />
              <Bar
                dataKey="count"
                fill={undefined}
                radius={[4, 4, 0, 0]}
                isAnimationActive={false}
              />
              <ChartLegend content={<ChartLegendContent nameKey="type" />} verticalAlign="bottom" />
            </BarChart>
          </ChartContainer>
        </ChartCard>
      </div>
    </>
  );
}

export function AnalyticsSkeleton() {
  return (
    <div className="grid gap-4">
      <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-2"></div>
      <div className="grid gap-4">
        <Skeleton className="h-[300px] w-full" />
        <Skeleton className="h-[300px] w-full" />
      </div>
    </div>
  )
}