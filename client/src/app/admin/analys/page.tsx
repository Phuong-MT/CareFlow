"use client"

import React, { useEffect, useState } from "react";
import data from "@/utils/data.json"
import { SectionCards } from "@/components/admin/section-cards";
import { ChartAreaInteractive } from "@/components/admin/chart-area-interactive";
import { DataTable } from "@/components/admin/data-tables";
import { useAppDispatch, useAppSelector } from "@/hooks/config";
import { postAnalyticsDaily } from "@/store/analyticsSlide";
export default function AnalyticsPage(){
  const [startDate, setStartDate] = useState<string>('')
  const dispatch = useAppDispatch()
  const {dataAnalytics} = useAppSelector((state)=>state.analytics)
  useEffect(()=>{
      dispatch(postAnalyticsDaily(startDate))
  },[startDate])
  
    return (
        <>
        {/* <SiteHeader /> */}
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <SectionCards />
              <div className="px-4 lg:px-6">
                <ChartAreaInteractive  chartData={dataAnalytics}
                onDateChange={(date) => setStartDate(date)}
                />
              </div>
              <DataTable data={data} />
            </div>
          </div>
        </div>
        </>
    )
}
