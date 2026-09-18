import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Agar route ini bisa dipanggil kapan saja tanpa caching oleh Next.js
export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

export async function GET(req: Request) {
  try {
    // 1. Ambil semua URL yang akan dimonitor
    const monitors = await prisma.monitor.findMany();

    if (monitors.length === 0) {
      return NextResponse.json({ message: 'Tidak ada URL yang dimonitor.' });
    }

    const results: Array<{ name: string; url: string; status: string; latency: number }> = [];

    // 2. Lakukan PING (fetch) ke setiap URL secara paralel
    const checkPromises = monitors.map(async (monitor) => {
      const startTime = Date.now();
      let status = 'DOWN';
      let latency = 0;

      try {
        // Fetch target dengan timeout 10 detik agar tidak gantung
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000);

        const response = await fetch(monitor.url, {
          method: 'GET',
          signal: controller.signal,
          headers: {
            'User-Agent': 'UptimeMonitor-Bot/1.0',
          },
        });
        
        clearTimeout(timeoutId);

        // Anggap UP jika status HTTP 2xx atau 3xx
        if (response.ok || (response.status >= 300 && response.status < 400)) {
          status = 'UP';
        }
      } catch (error) {
        status = 'DOWN';
      }

      latency = Date.now() - startTime;

      // 3. Simpan riwayat PING ke database
      await prisma.ping.create({
        data: {
          monitorId: monitor.id,
          status,
          latency,
        },
      });

      // 4. Perbarui status terakhir pada Monitor
      await prisma.monitor.update({
        where: { id: monitor.id },
        data: {
          status,
          lastChecked: new Date(),
        },
      });

      results.push({ name: monitor.name, url: monitor.url, status, latency });
    });

    await Promise.all(checkPromises);

    return NextResponse.json({
      message: 'Pengecekan Uptime selesai!',
      data: results,
    });
  } catch (error: any) {
    console.error('Error saat cron job berjalan:', error);
    return NextResponse.json(
      { message: 'Gagal mengeksekusi cron job', error: error.message },
      { status: 500 }
    );
  }
}
