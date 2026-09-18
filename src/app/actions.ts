'use server';

import { PrismaClient } from '@prisma/client';
import { revalidatePath } from 'next/cache';

const prisma = new PrismaClient();

export async function addMonitor(formData: FormData) {
  const name = formData.get('name') as string;
  let url = formData.get('url') as string;
  const interval = Number(formData.get('interval') || 5);

  if (!name || !url) {
    return { error: 'Nama dan URL tidak boleh kosong' };
  }

  // Basic URL Validation
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    url = 'https://' + url;
  }

  try {
    await prisma.monitor.create({
      data: {
        name,
        url,
        interval,
        status: 'UNKNOWN', // Belum dicek
      },
    });

    // Refresh halaman agar data terbaru langsung muncul
    revalidatePath('/');
    
    return { success: true };
  } catch (error) {
    console.error('Failed to add monitor:', error);
    return { error: 'Gagal menyimpan URL ke database' };
  }
}
