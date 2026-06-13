-- Fix: migration sebelumnya melakukan REVOKE has_role dari semua user
-- sehingga admin policies gagal dan upload gambar tidak bisa dilakukan.
-- Migration ini memperbaiki permission yang rusak.

-- Re-grant execute on has_role to authenticated users
-- (dibutuhkan oleh semua admin policies di docs dan storage)
grant execute on function public.has_role(uuid, public.app_role) to authenticated;

-- Buat ulang public read policy untuk storage yang terhapus
-- Bucket doc-images bersifat publik, tapi Supabase tetap butuh policy
-- untuk anonymous read via RLS
create policy "public read doc-images"
  on storage.objects
  for select
  to anon, authenticated
  using (bucket_id = 'doc-images');
