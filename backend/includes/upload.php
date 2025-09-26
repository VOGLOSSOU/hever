<?php
function uploadImage($file, $type) {
    // Define allowed types and max size
    $allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    $maxSize = 5 * 1024 * 1024; // 5MB

    // Check if file was uploaded
    if (!isset($file) || $file['error'] !== UPLOAD_ERR_OK) {
        return ['error' => 'Aucun fichier uploadé ou erreur lors de l\'upload'];
    }

    // Validate file type
    if (!in_array($file['type'], $allowedTypes)) {
        return ['error' => 'Type de fichier non autorisé. Seules les images JPEG, PNG, GIF et WebP sont acceptées'];
    }

    // Validate file size
    if ($file['size'] > $maxSize) {
        return ['error' => 'Fichier trop volumineux. Taille maximale : 5MB'];
    }

    // Generate unique filename
    $extension = pathinfo($file['name'], PATHINFO_EXTENSION);
    $filename = uniqid() . '_' . time() . '.' . $extension;

    // Define upload directory based on type
    $uploadDir = __DIR__ . '/../uploads/' . $type . '/';
    if (!is_dir($uploadDir)) {
        mkdir($uploadDir, 0755, true);
    }

    $filepath = $uploadDir . $filename;

    // Move uploaded file
    if (move_uploaded_file($file['tmp_name'], $filepath)) {
        // Return relative path for database storage
        return ['path' => 'backend/uploads/' . $type . '/' . $filename];
    } else {
        return ['error' => 'Erreur lors de la sauvegarde du fichier'];
    }
}
?>