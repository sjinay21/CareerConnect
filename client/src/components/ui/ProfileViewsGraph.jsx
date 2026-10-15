"use client";
import { useState, useEffect } from "react";
import { LineChart } from "@mui/x-charts/LineChart";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { getProfileViewsGraph } from "@/utils/api";

export default function ProfileViewsGraph({ period = 30 }) {
  const [graphData, setGraphData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

useEffect(() => {
  async function fetchGraph() {
    try {
      setLoading(true);
      setError(null);

      const res = await getProfileViewsGraph(period);

      if (!res.ok) {
        setError("Unable to load profile views graph.");
        return;
      }

      const data = await res.json();
      const rawViews = data.views || [];
      const timeline = [];

      for (let i = period - 1; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);

        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        const dateStr = `${year}-${month}-${day}`;

        const view = rawViews.find(
          (item) => String(item.view_date).slice(0, 10) === dateStr
        );

        timeline.push({
          view_date: dateStr,
          total_views: Number(view?.total_views) || 0,
        });
      }

      setGraphData(timeline);
    } catch (err) {
      console.error("Error loading graph data:", err);
      setError("Failed to load profile views graph.");
    } finally {
      setLoading(false);
    }
  }

  fetchGraph();
}, [period]);

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-5 mb-5 shadow-sm">
      <div className="flex items-center justify-between mb-2">
        <div>
          <h5 className="text-sm font-semibold text-gray-800">
            Profile Views Trend
          </h5>
          <p className="text-xs text-gray-500">
            Daily view counts for the past {period} days
          </p>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center h-[260px] bg-gray-50/50 rounded-lg">
          <div className="w-7 h-7 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mb-2" />
          <span className="text-xs text-gray-500 font-medium">Loading profile views graph...</span>
        </div>
      ) : error ? (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
          {error}
        </div>
      ) : graphData.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-10 px-4 text-center bg-gray-50/50 rounded-lg border border-dashed border-gray-200">
          <VisibilityIcon className="w-8 h-8 text-gray-300 mb-1" />
          <p className="text-sm font-semibold text-gray-700">No view data available</p>
          <p className="text-xs text-gray-500 mt-0.5">Views will plot here as members visit your profile</p>
        </div>
      ) : (
        <div className="w-full h-[270px]">
          <LineChart
            dataset={graphData}
            xAxis={[
              {
                dataKey: "view_date",
                scaleType: "point",
                valueFormatter: (value) => {
                  if (!value) return "";
                  try {
                    const [y, m, d] = String(value).split("-");
                    const date = new Date(Number(y), Number(m) - 1, Number(d));
                    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
                  } catch {
                    return String(value);
                  }
                },
                tickLabelInterval: (value, index) => {
                  if (period === 7) return true;
                  if (period === 30) return index % 5 === 0 || index === graphData.length - 1;
                  if (period === 90) return index % 14 === 0 || index === graphData.length - 1;
                  return index % 5 === 0;
                },
              },
            ]}
            yAxis={[
              {
                min: 0,
                tickMinStep: 1,
                valueFormatter: (value) => `${Math.round(value)}`,
              },
            ]}
            series={[
              {
                dataKey: "total_views",
                label: "Profile Views",
                color: "#0a66c2",
                showMark: period <= 30,
                valueFormatter: (value) => `${value ?? 0} view${value === 1 ? "" : "s"}`,
              },
            ]}
            height={260}
            margin={{ top: 20, right: 25, bottom: 35, left: 40 }}
            grid={{ horizontal: true }}
          />
        </div>
      )}
    </div>
  );
}
