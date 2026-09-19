'use server';

import { PrismaClient } from '@prisma/client';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';

const prisma = new PrismaClient();

// Helper untuk mengecek apakah user sudah login
async function isAuthenticated() {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth_token');
  return token?.value === 'true'; // Dalam real-app, gunakan JWT. Ini cukup untuk single-tenant.
}

export async function login(password: string) {
  const adminPassword = process.env.ADMIN_PASSWORD;
  
  if (!adminPassword) {
    return { error: 'Sistem belum dikonfigurasi. Harap set ADMIN_PASSWORD di .env' };
  }

  if (password === adminPassword) {
    const cookieStore = await cookies();
    cookieStore.set('auth_token', 'true', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 30, // 30 hari
      path: '/',
    });
    revalidatePath('/');
    return { success: true };
  }

  return { error: 'Password Salah!' };
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete('auth_token');
  revalidatePath('/');
}

export async function addMonitor(formData: FormData) {
  // KEAMANAN UTAMA: Cek Autentikasi sebelum memproses
  if (!(await isAuthenticated())) {
    return { error: 'Akses Ditolak: Anda belum login sebagai Admin' };
  }

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

export async function deleteMonitor(id: string) {
  // KEAMANAN UTAMA: Cek Autentikasi sebelum memproses
  if (!(await isAuthenticated())) {
    return { error: 'Akses Ditolak: Anda belum login sebagai Admin' };
  }

  try {
    // Karena ada relasi cascade (jika diset) atau hapus manual pingnya dulu
    // Menghapus data ping terkait
    await prisma.ping.deleteMany({
      where: { monitorId: id },
    });
    
    // Menghapus data monitor
    await prisma.monitor.delete({
      where: { id },
    });

    revalidatePath('/');
    return { success: true };
  } catch (error) {
    console.error('Failed to delete monitor:', error);
    return { error: 'Gagal menghapus monitor' };
  }
}
