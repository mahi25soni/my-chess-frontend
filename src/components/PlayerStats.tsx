"use  client";
import React from "react";

type StatCardProps = {
  title: string;
  value: string | number;
};

function StatCard({ title, value }: StatCardProps) {
  return (
    <div className="flex flex-col items-center px-6 py-4 rounded-lg border border-border-basic  bg-white">
      <div className="text-off-white text-sm">{title}</div>
      <div className="text-2xl font-bold mt-1">{value}</div>
    </div>
  );
}

export default function PlayerStats({ stats }: { stats: any }) {
  return (
    <div className="grid grid-cols-4 gap-4 py-8">
      <StatCard title="Total Wins" value={stats.wins || 247} />
      <StatCard title="Current Rating" value={stats.rating || 1850} />
      <StatCard title="Win Rate" value={`${stats.winRate || 64}%`} />
      <StatCard title="Average Accuracy" value={`${stats.accuracy || 86}%`} />
    </div>
  );
}
