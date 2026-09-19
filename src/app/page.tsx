import { PrismaClient } from '@prisma/client';
import { cookies } from 'next/headers';
import AddMonitorForm from './components/AddMonitorForm';
import RefreshButton from './components/RefreshButton';
import LoginModal from './components/LoginModal';
import LogoutButton from './components/LogoutButton';
import DeleteMonitorButton from './components/DeleteMonitorButton';
import { Activity, CheckCircle2, XCircle, HelpCircle, ArrowRight, ServerCrash, EyeOff } from 'lucide-react';

const prisma = new PrismaClient();

// Revalidate halaman setiap 30 detik (optional)
export const revalidate = 30;

export default async function Home() {
  // Cek Auth di level Server
  const cookieStore = await cookies();
  const isAdmin = cookieStore.get('auth_token')?.value === 'true';

  const monitors = await prisma.monitor.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      pings: {
        orderBy: { timestamp: 'desc' },
        take: 40,
      },
    },
  });

  // Menghitung Uptime berdasarkan riwayat PING
  const pingStats = await prisma.ping.groupBy({
    by: ['monitorId', 'status'],
    _count: {
      id: true
    }
  });

  const getUptimePercentage = (monitorId: string) => {
    const monitorStats = pingStats.filter(p => p.monitorId === monitorId);
    const upCount = monitorStats.find(p => p.status === 'UP')?._count.id || 0;
    const downCount = monitorStats.find(p => p.status === 'DOWN')?._count.id || 0;
    const total = upCount + downCount;

    // Jika belum ada data ping, tampilkan 100% atau 0% (kita pakai 100% sebagai awalan yang baik)
    if (total === 0) return 100;

    // Format ke 2 angka desimal, tapi hilangkan .00 jika pas 100%
    const percent = (upCount / total) * 100;
    return parseFloat(percent.toFixed(2));
  };

  const upCount = monitors.filter((m) => m.status === 'UP').length;
  const downCount = monitors.filter((m) => m.status === 'DOWN').length;
  const unknownCount = monitors.filter((m) => m.status === 'UNKNOWN').length;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans selection:bg-blue-500/30 transition-colors">
      {/* Premium Header Glow */}
      <div className="absolute inset-x-0 top-0 h-96 bg-gradient-to-b from-blue-600/10 via-indigo-600/5 to-transparent pointer-events-none" />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-24 relative z-10 space-y-12">

        {/* Header & Stats Section */}
        <section className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100/50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 text-sm font-medium border border-blue-200/50 dark:border-blue-800/50">
              <Activity size={16} />
              <span>Status Sistem Real-time</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-400">
              Uptime Monitor
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-2">
              Platform pemantauan Server, Memastikan aplikasi dan layanan Anda tetap menyala tanpa henti.
            </p>
          </div>

          {/* Stat Cards */}
          <div className="flex gap-4 overflow-x-auto pb-4 lg:pb-0 hide-scrollbar">
            <div className="flex-shrink-0 bg-white dark:bg-slate-900 p-5 rounded-2xl shadow-sm border border-slate-200/50 dark:border-slate-800 flex items-center gap-4 min-w-[160px] relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-xl text-green-600 dark:text-green-400">
                <CheckCircle2 size={24} />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Operational</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">{upCount}</p>
              </div>
            </div>

            <div className="flex-shrink-0 bg-white dark:bg-slate-900 p-5 rounded-2xl shadow-sm border border-slate-200/50 dark:border-slate-800 flex items-center gap-4 min-w-[160px] relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-xl text-red-600 dark:text-red-400">
                <XCircle size={24} />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Down / Mati</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">{downCount}</p>
              </div>
            </div>

            <div className="flex-shrink-0 bg-white dark:bg-slate-900 p-5 rounded-2xl shadow-sm border border-slate-200/50 dark:border-slate-800 flex items-center gap-4 min-w-[160px] relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-r from-slate-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-xl text-slate-600 dark:text-slate-400">
                <HelpCircle size={24} />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Menunggu</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">{unknownCount}</p>
              </div>
            </div>
          </div>
        </section>

        {/* List Section */}
        <section className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl shadow-slate-200/20 dark:shadow-none border border-slate-200/60 dark:border-slate-800 overflow-hidden">
          <div className="p-6 sm:px-8 border-b border-slate-200/60 dark:border-slate-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-50/50 dark:bg-slate-900/50">
            <div>
              <h2 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
                <ServerCrash className="text-indigo-500" size={20} />
                Daftar Pemantauan
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Mengawasi endpoint dan website yang Anda tambahkan.</p>
            </div>

            <div className="flex items-center gap-3">
              <RefreshButton />
              {isAdmin ? (
                <>
                  <AddMonitorForm />
                  <LogoutButton />
                </>
              ) : (
                <LoginModal />
              )}
            </div>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800/60">
            {monitors.length === 0 ? (
              <div className="p-16 text-center flex flex-col items-center justify-center">
                <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
                  <Activity size={32} className="text-slate-400 dark:text-slate-500" />
                </div>
                <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-2">Belum Ada Target</h3>
                <p className="text-slate-500 dark:text-slate-400 max-w-md">Mulai memantau website atau API server Anda dengan menambahkan URL baru di pojok kanan atas.</p>
              </div>
            ) : (
              monitors.map((monitor) => (
                <div key={monitor.id} className="p-6 sm:px-8 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors group">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="text-lg font-semibold text-slate-900 dark:text-white truncate">{monitor.name}</h3>
                      {monitor.status === 'UP' && (
                        <span className="inline-flex items-center gap-1.5 py-0.5 px-2.5 rounded-full text-xs font-semibold bg-green-100 dark:bg-green-500/10 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-500/20">
                          <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span> Operational
                        </span>
                      )}
                      {monitor.status === 'DOWN' && (
                        <span className="inline-flex items-center gap-1.5 py-0.5 px-2.5 rounded-full text-xs font-semibold bg-red-100 dark:bg-red-500/10 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-500/20">
                          <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span> Down
                        </span>
                      )}
                      {monitor.status === 'UNKNOWN' && (
                        <span className="inline-flex items-center gap-1.5 py-0.5 px-2.5 rounded-full text-xs font-semibold bg-slate-100 dark:bg-slate-500/10 text-slate-700 dark:text-slate-400 border border-slate-200 dark:border-slate-500/20">
                          <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span> Pending
                        </span>
                      )}
                    </div>

                    {monitor.isHidden && !isAdmin ? (
                      <span className="text-slate-400 dark:text-slate-500 text-sm font-medium inline-flex items-center gap-1.5 cursor-not-allowed select-none">
                        <EyeOff size={14} /> https://********.***
                      </span>
                    ) : (
                      <a href={monitor.url} target="_blank" rel="noreferrer" className="text-blue-600 dark:text-blue-400 text-sm font-medium hover:underline inline-flex items-center gap-1.5">
                        {monitor.url} 
                        {monitor.isHidden && <span className="text-[10px] uppercase bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-1.5 py-0.5 rounded ml-1 font-bold">Privat</span>}
                        <ArrowRight size={14} className="opacity-0 -ml-2 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300" />
                      </a>
                    )}

                    {/* Uptime Robot Style Bars */}
                    <div className="mt-5 flex items-end h-8 gap-[2px] w-full max-w-md">
                      {Array.from({ length: 40 }).map((_, i) => {
                        // Karena pings diurutkan DESC (terbaru di index 0), 
                        // kita membalikkan urutannya agar terbaru ada di paling kanan
                        const pingIndex = 39 - i;
                        const ping = monitor.pings[pingIndex];

                        let bgColor = 'bg-slate-200 dark:bg-slate-700/50'; // Tidak ada data
                        let tooltipText = 'Tidak ada data';

                        if (ping) {
                          bgColor = ping.status === 'UP' ? 'bg-green-500' : 'bg-red-500';
                          tooltipText = `${ping.status} • Latency: ${ping.latency}ms • Pukul: ${new Date(ping.timestamp).toLocaleTimeString('id-ID', {hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Jakarta'})}`;
                        }

                        return (
                          <div
                            key={i}
                            title={tooltipText}
                            className={`flex-1 h-full rounded-sm ${bgColor} hover:opacity-80 transition-opacity cursor-crosshair`}
                          />
                        );
                      })}
                    </div>
                  </div>

                  <div className="flex items-center gap-8 md:pl-6 md:border-l border-slate-200 dark:border-slate-700">
                    <div className="flex flex-col">
                      <span className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Uptime</span>
                      <span className="font-mono text-lg font-medium text-slate-700 dark:text-slate-300">
                        {getUptimePercentage(monitor.id)}<span className="text-sm text-slate-400">%</span>
                      </span>
                    </div>

                    <div className="flex flex-col">
                      <span className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Latency</span>
                      {monitor.pings[0] ? (
                        <span className="font-mono text-lg font-medium text-slate-700 dark:text-slate-300">
                          {monitor.pings[0].latency} <span className="text-sm text-slate-400">ms</span>
                        </span>
                      ) : (
                        <span className="text-slate-400 text-sm italic">-</span>
                      )}
                    </div>

                    <div className="flex flex-col">
                      <span className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Cek Terakhir</span>
                      <span className="text-sm text-slate-700 dark:text-slate-300">
                        {monitor.lastChecked ? new Date(monitor.lastChecked).toLocaleTimeString('id-ID', {hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Jakarta'}) : 'Menunggu cron...'}
                      </span>
                    </div>

                    {isAdmin && (
                      <div className="flex items-center justify-center ml-2 border-l border-slate-200 dark:border-slate-700 pl-6">
                        <DeleteMonitorButton id={monitor.id} name={monitor.name} />
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
