<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

try {
    require_once '../config/database.php';
    require_once '../includes/upload.php';
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Erreur de base de données: ' . $e->getMessage()]);
    exit;
}

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        getCategories($pdo);
        break;
    case 'POST':
        createCategory($pdo);
        break;
    default:
        http_response_code(405);
        echo json_encode(['error' => 'Method not allowed']);
        break;
}

function getCategories($pdo) {
    try {
        $stmt = $pdo->query("SELECT * FROM categories ORDER BY created_at DESC");
        $categories = $stmt->fetchAll();
        echo json_encode($categories);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Failed to fetch categories']);
    }
}

function createCategory($pdo) {
    try {
        // Validate input
        if (!isset($_POST['name']) || empty(trim($_POST['name']))) {
            http_response_code(400);
            echo json_encode(['error' => 'Le nom de la catégorie est requis']);
            return;
        }

        $name = trim($_POST['name']);
        $description = isset($_POST['description']) ? trim($_POST['description']) : '';

        // Handle image upload
        $imagePath = '';
        if (isset($_FILES['image']) && $_FILES['image']['error'] !== UPLOAD_ERR_NO_FILE) {
            $uploadResult = uploadImage($_FILES['image'], 'categories');
            if (isset($uploadResult['error'])) {
                http_response_code(400);
                echo json_encode(['error' => $uploadResult['error']]);
                return;
            }
            $imagePath = $uploadResult['path'];
        }

        // Insert category
        $stmt = $pdo->prepare("INSERT INTO categories (name, description, image) VALUES (?, ?, ?)");
        $stmt->execute([$name, $description, $imagePath]);

        $categoryId = $pdo->lastInsertId();

        // Return the created category
        $stmt = $pdo->prepare("SELECT * FROM categories WHERE id = ?");
        $stmt->execute([$categoryId]);
        $category = $stmt->fetch();

        http_response_code(201);
        echo json_encode($category);

    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Échec de la création de la catégorie']);
    }
}
?>