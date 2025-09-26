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
        getProducts($pdo);
        break;
    case 'POST':
        createProduct($pdo);
        break;
    default:
        http_response_code(405);
        echo json_encode(['error' => 'Method not allowed']);
        break;
}

function getProducts($pdo) {
    try {
        $stmt = $pdo->query("
            SELECT p.*, c.name as category_name
            FROM products p
            LEFT JOIN categories c ON p.category_id = c.id
            ORDER BY p.created_at DESC
        ");
        $products = $stmt->fetchAll();
        echo json_encode($products);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Failed to fetch products']);
    }
}

function createProduct($pdo) {
    try {
        // Validate input
        if (!isset($_POST['name']) || empty(trim($_POST['name']))) {
            http_response_code(400);
            echo json_encode(['error' => 'Le nom du produit est requis']);
            return;
        }

        if (!isset($_POST['price']) || !is_numeric($_POST['price']) || $_POST['price'] < 0) {
            http_response_code(400);
            echo json_encode(['error' => 'Prix valide requis']);
            return;
        }

        if (!isset($_POST['category_id']) || !is_numeric($_POST['category_id'])) {
            http_response_code(400);
            echo json_encode(['error' => 'Catégorie valide requise']);
            return;
        }

        // Check if category exists
        $stmt = $pdo->prepare("SELECT id FROM categories WHERE id = ?");
        $stmt->execute([$_POST['category_id']]);
        if (!$stmt->fetch()) {
            http_response_code(400);
            echo json_encode(['error' => 'La catégorie n\'existe pas']);
            return;
        }

        $name = trim($_POST['name']);
        $description = isset($_POST['description']) ? trim($_POST['description']) : '';
        $price = (float) $_POST['price'];
        $categoryId = (int) $_POST['category_id'];

        // Handle image upload
        $imagePath = '';
        if (isset($_FILES['image']) && $_FILES['image']['error'] !== UPLOAD_ERR_NO_FILE) {
            $uploadResult = uploadImage($_FILES['image'], 'products');
            if (isset($uploadResult['error'])) {
                http_response_code(400);
                echo json_encode(['error' => $uploadResult['error']]);
                return;
            }
            $imagePath = $uploadResult['path'];
        }

        // Insert product
        $stmt = $pdo->prepare("INSERT INTO products (name, description, price, image, category_id) VALUES (?, ?, ?, ?, ?)");
        $stmt->execute([$name, $description, $price, $imagePath, $categoryId]);

        $productId = $pdo->lastInsertId();

        // Return the created product with category name
        $stmt = $pdo->prepare("
            SELECT p.*, c.name as category_name
            FROM products p
            LEFT JOIN categories c ON p.category_id = c.id
            WHERE p.id = ?
        ");
        $stmt->execute([$productId]);
        $product = $stmt->fetch();

        http_response_code(201);
        echo json_encode($product);

    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Échec de la création du produit']);
    }
}
?>