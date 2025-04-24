"use  client";
import React from "react";

type StatCardProps = {
  title: string;
  value: string | number;
};

function StatCard({ title, value }: StatCardProps) {
  return (
    <div className="flex flex-col items-center md:px-6 md:py-4 px-3 py-2 rounded-lg border border-border-basic bg-white">
      <div className="text-off-white text-sm text-center">{title}</div>
      <div className="md:text-2xl text-md font-bold mt-1">{value}</div>
    </div>
  );
}

export default function PlayerStats({ stats }: { stats: any }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:py-8 py:2">
      <StatCard title="Total Games" value={stats.totalGames || 387} />
      <StatCard title="Total Wins" value={stats.wins || 247} />
      <StatCard title="Total Losses" value={stats.losses || 140} />
      <StatCard title="Win Rate" value={`${stats.winRate || 64}%`} />
    </div>
  );
}
