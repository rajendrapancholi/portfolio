'use client';
import Link from 'next/link';
import React from 'react';
import { Bar, Doughnut, Line } from 'react-chartjs-2';
import useSWR from 'swr';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend,
  BarElement,
  ArcElement,
} from 'chart.js';
import { formatNumber } from '@/lib/utils';
import Loading from '@/components/Loading';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend,
  BarElement,
  ArcElement
);

export const options = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top',
    },
  },
};

const Dashboard = () => {
  const { data: summary, error } = useSWR(`/api/projects/summary`);

  if (error) return error.message;
  if (!summary) return <Loading />;

  const projectsData = {
    labels: summary.projectsData.map((x: { _id: string }) => x._id), // 2022/01 2022/03
    datasets: [
      {
        label: 'Category',
        data: summary.projectsData.map(
          (x: { totalProjects: number }) => x.totalProjects
        ),
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 206, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)',
          'rgba(153, 102, 255, 0.2)',
          'rgba(255, 159, 64, 0.2)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)',
        ],
      },
    ],
  };
  const usersData = {
    labels: summary.usersData.map((x: { _id: string }) => x._id), // 2022/01 2022/03
    datasets: [
      {
        label: 'Users',
        borderColor: 'rgb(53, 162, 235)',
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
        data: summary.usersData.map(
          (x: { totalUsers: number }) => x.totalUsers
        ),
      },
    ],
  };

  return (
    <div>
      <div className="my-4 stats inline-grid md:flex  shadow stats-vertical   md:stats-horizontal">
        <div className="stat">
          <div className="stat-title">Projects</div>
          <div className="stat-value text-primary">{summary.projectsCount}</div>
          <div className="stat-desc">
            <Link href="/admin/products">View Projects</Link>
          </div>
        </div>
        <div className="stat">
          <div className="stat-title">Users</div>
          <div className="stat-value text-primary">{summary.usersCount}</div>
          <div className="stat-desc">
            <Link href="/admin/users">View users</Link>
          </div>
        </div>
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <h2 className="text-xl py-2">Projects Report</h2>
          <div className="flex items-center justify-center h-80 w-96 ">
            {' '}
            <Doughnut data={projectsData} />
          </div>
        </div>
        <div>
          <h2 className="text-xl py-2">Users Report</h2>
          <Bar data={usersData} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
