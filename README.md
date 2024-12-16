# Folder Synchronization System

## **Deskripsi**
Proyek ini adalah sistem sinkronisasi folder antara server dan klien yang dirancang untuk memastikan bahwa struktur dan konten file dalam folder pada klien selalu sama dengan yang ada di server. Sistem ini berjalan secara rekursif, mendeteksi perbedaan berdasarkan waktu modifikasi (lastModified) dan ukuran file, sehingga hanya file yang berubah atau baru yang diunduh. Selain itu, file atau folder yang tidak ada di server tetapi ada di klien akan dihapus secara otomatis.

### **Fitur Utama**
1. **Sinkronisasi Rekursif**: Mendukung sinkronisasi folder bersarang (nested folders).
2. **Efisiensi**: Hanya file yang berbeda atau baru yang diunduh untuk menghemat waktu dan bandwidth.
3. **Pembaruan Otomatis**: File atau folder di klien diperbarui jika server memiliki versi yang lebih baru.
4. **Penghapusan Otomatis**: File atau folder di klien yang tidak ada di server akan dihapus.
5. **Dukungan File Besar**: Sistem dirancang untuk menangani file besar dengan stabil.

---

## **Teknologi yang Digunakan**
- **Node.js**: Digunakan untuk membangun server dan klien.
- **Express.js**: Framework untuk menangani API server.
- **Axios**: Library HTTP untuk komunikasi antara klien dan server.
- **fs (File System)**: Modul bawaan Node.js untuk manipulasi file dan folder.

---

## **Struktur Proyek**
```
project-folder/
├── server.js         # Server untuk menyediakan folder dan file
├── client.js         # Klien untuk sinkronisasi folder
├── server-folder/    # Folder yang disediakan oleh server
└── client-folder/    # Folder lokal di klien yang akan disinkronkan
```
