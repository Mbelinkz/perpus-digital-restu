/**
 * ============================================================================
 * GOOGLE APPS SCRIPT - BACKEND DATABASE GOOGLE DRIVE
 * Perpustakaan Digital Sumber Ilmu - SD Negeri 1 Rejoso
 * ============================================================================
 *
 * CARA PASANG DI GOOGLE DRIVE SEKOLAH (GRATIS SELAMANYA):
 * 1. Buka https://script.google.com menggunakan akun Google sekolah.
 * 2. Klik "Proyek Baru" (New Project) dan beri nama "DB Perpus Sumber Ilmu SDN 1 Rejoso".
 * 3. Hapus seluruh isi kode di dalamnya, lalu tempelkan (Paste) kode di file ini.
 * 4. Klik tombol "Terapkan" (Deploy) -> "Deployment baru" (New deployment).
 * 5. Pilih jenis "Aplikasi Web" (Web App):
 *    - Jalankan sebagai (Execute as): "Saya" (Me)
 *    - Siapa yang memiliki akses (Who has access): "Siapa saja" (Anyone)
 * 6. Klik "Terapkan" (Deploy), beri izin akses Google Drive, lalu salin URL Web App
 *    (contoh: https://script.google.com/macros/s/AKfycb.../exec).
 * 7. Tempelkan URL tersebut di menu Admin -> Pengaturan & Database -> Integrasi Cloud Google Drive.
 */

const DB_FILENAME = 'Database_Perpus_Sumber_Ilmu_SDN1_Rejoso.json';
const FOLDER_NAME = 'Perpustakaan_Sumber_Ilmu_SDN1_Rejoso';

function getOrCreateFolder() {
  const folders = DriveApp.getFoldersByName(FOLDER_NAME);
  if (folders.hasNext()) {
    return folders.next();
  }
  return DriveApp.createFolder(FOLDER_NAME);
}

function getDbFile() {
  const folder = getOrCreateFolder();
  const files = folder.getFilesByName(DB_FILENAME);
  if (files.hasNext()) {
    return files.next();
  }
  return null;
}

/**
 * Mengambil data database dari Google Drive (GET)
 */
function doGet(e) {
  try {
    const file = getDbFile();
    if (!file) {
      return ContentService.createTextOutput(
        JSON.stringify({ status: 'empty', message: 'File database belum dibuat di Google Drive.' })
      ).setMimeType(ContentService.MimeType.JSON);
    }

    const content = file.getBlob().getDataAsString('UTF-8');
    return ContentService.createTextOutput(content).setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(
      JSON.stringify({ status: 'error', message: err.toString() })
    ).setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Menyimpan atau memperbarui database di Google Drive (POST)
 */
function doPost(e) {
  try {
    const rawData = e.postData.contents;
    const parsed = JSON.parse(rawData);

    if (!parsed || !parsed.settings || !parsed.books) {
      throw new Error('Format JSON tidak sesuai dengan struktur Perpustakaan Sumber Ilmu.');
    }

    const folder = getOrCreateFolder();
    let file = getDbFile();
    const formattedJson = JSON.stringify(parsed, null, 2);

    if (file) {
      file.setContent(formattedJson);
    } else {
      file = folder.createFile(DB_FILENAME, formattedJson, MimeType.PLAIN_TEXT);
    }

    return ContentService.createTextOutput(
      JSON.stringify({
        status: 'success',
        message: 'Database berhasil disimpan di Google Drive!',
        fileId: file.getId(),
        updatedAt: new Date().toISOString()
      })
    ).setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(
      JSON.stringify({ status: 'error', message: err.toString() })
    ).setMimeType(ContentService.MimeType.JSON);
  }
}

