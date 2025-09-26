<?php
// Database configuration
$host = 'srv1580.hstgr.io'; // Replace with your database host
$dbname = 'u433704782_pourhever'; // Replace with your database name
$username = 'u433704782_heverUser'; // Replace with your database username
$password = 'pourHerver2609@sUcCC'; // Replace with your database password

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
} catch (PDOException $e) {
    throw new Exception("Database connection failed: " . $e->getMessage());
}
?>