<?php
/**
 * REST API Endpoint untuk Shared Hosting / cPanel / Apache / XAMPP
 * Perpustakaan Digital Sumber Ilmu - SD Negeri 1 Rejoso
 * Menyimpan seluruh transaksi ke dalam 1 file database terpadu (database.json)
 */

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

$dbFile = __DIR__ . '/database.json';

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    if (file_exists($dbFile)) {
        readfile($dbFile);
    } else {
        http_response_code(404);
        echo json_encode(['status' => 'error', 'message' => 'Database file belum tersedia.']);
    }
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $rawInput = file_get_contents('php://input');
    $decoded = json_decode($rawInput, true);

    if ($decoded && isset($decoded['settings']) && isset($decoded['books']) && isset($decoded['students'])) {
        $written = file_put_contents($dbFile, json_encode($decoded, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE), LOCK_EX);
        if ($written !== false) {
            echo json_encode([
                'status' => 'success',
                'message' => 'Database server berhasil diperbarui.',
                'timestamp' => date('Y-m-d H:i:s')
            ]);
        } else {
            http_response_code(500);
            echo json_encode(['status' => 'error', 'message' => 'Gagal menulis ke database.json. Pastikan permission file 664/666.']);
        }
    } else {
        http_response_code(400);
        echo json_encode(['status' => 'error', 'message' => 'Payload JSON tidak valid.']);
    }
    exit;
}

http_response_code(405);
echo json_encode(['status' => 'error', 'message' => 'Method tidak diizinkan.']);

