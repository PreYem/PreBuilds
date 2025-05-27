-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: May 27, 2025 at 01:58 AM
-- Server version: 10.11.10-MariaDB-log
-- PHP Version: 7.2.34

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `u824026742_prebuilds`
--

-- --------------------------------------------------------

--
-- Table structure for table `cache`
--

CREATE TABLE `cache` (
  `key` varchar(255) NOT NULL,
  `value` mediumtext NOT NULL,
  `expiration` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `cache_locks`
--

CREATE TABLE `cache_locks` (
  `key` varchar(255) NOT NULL,
  `owner` varchar(255) NOT NULL,
  `expiration` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `categories`
--

CREATE TABLE `categories` (
  `category_id` bigint(20) UNSIGNED NOT NULL,
  `category_name` varchar(255) NOT NULL,
  `category_description` text DEFAULT NULL,
  `category_display_order` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `categories`
--

INSERT INTO `categories` (`category_id`, `category_name`, `category_description`, `category_display_order`) VALUES
(0, 'Unspecified', 'Warning : This column must not be deleted or changed. ', 0),
(2, 'PC Gamer', 'Découvrez notre sélection de PC Gamer de dernière génération élaborés par notre équipe. Cette gamme de PC pour Gamersspécialement conçue pour le jeu répondra à vos besoins. Que vous souhaitiez jouer en 3D, à Minecraft, League Of Legends ou alors aux derniers opus comme Fallout 4 ou Battlefield Hardline vous trouverez un PC de bureau qui vous correspond. Envie de plus de possibilités ? Découvrez notre configurateur de PC Gamer en ligne.\nDes PC Gaming ultra-performants pour profiter des jeux de dernière génération\n\nNotre équipe a créé des Ordinateurs de jeu adaptés à ceux recherchant les performances maximales en poussant les réglages graphiques en ultra. Ces PC Gamers à base de carte graphique NVIDIA ou AMD exploitant la puissance des derniers processeurs INTEL vous permettront de vous immerger totalement dans vos jeux vidéo favoris.\nUn PC Gamer pas cher pour profiter des jeux au meilleur prix\n\nAcheter un PC Gamer pas cher n’implique pas forcément des performances réduites. Vous trouverez parmi nos config Gamer pas cher des PC pouvant vous accompagner plusieurs années en les faisant évoluer en fonction de vos besoins. Si vous avez besoin de conseils pour le choix de votre ordinateur de jeu, notre équipe se tient à votre disposition', 1),
(3, 'Laptops', 'LaptopLaptopLaptopLaptopLaptopLaptopLaptopLaptopeee', 2),
(4, 'Components', '', 3),
(5, 'Devices', '', 4),
(6, 'Chairs & Desks', '', 5),
(7, 'Network', '', 6),
(45, 'Consoles', '', 8);

-- --------------------------------------------------------

--
-- Table structure for table `failed_jobs`
--

CREATE TABLE `failed_jobs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `uuid` varchar(255) NOT NULL,
  `connection` text NOT NULL,
  `queue` text NOT NULL,
  `payload` longtext NOT NULL,
  `exception` longtext NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `global_settings`
--

CREATE TABLE `global_settings` (
  `key` varchar(255) DEFAULT NULL,
  `value` varchar(255) DEFAULT NULL,
  `setting_description` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `global_settings`
--

INSERT INTO `global_settings` (`key`, `value`, `setting_description`) VALUES
('new_product_duration', '5760', 'This parameter defines the maximum age (in minutes) for a product to be considered \'new.\' Products older than this duration will no longer appear in the \'NEW\' category or display the \'NEW\' sticker.'),
('max_order_limit', '5', 'This parameter sets the maximum number of active orders a user can have at any given time. Once this limit is reached, the user will be unable to place additional orders until one of their existing orders is concluded.');

-- --------------------------------------------------------

--
-- Table structure for table `jobs`
--

CREATE TABLE `jobs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `queue` varchar(255) NOT NULL,
  `payload` longtext NOT NULL,
  `attempts` tinyint(3) UNSIGNED NOT NULL,
  `reserved_at` int(10) UNSIGNED DEFAULT NULL,
  `available_at` int(10) UNSIGNED NOT NULL,
  `created_at` int(10) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `job_batches`
--

CREATE TABLE `job_batches` (
  `id` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `total_jobs` int(11) NOT NULL,
  `pending_jobs` int(11) NOT NULL,
  `failed_jobs` int(11) NOT NULL,
  `failed_job_ids` longtext NOT NULL,
  `options` mediumtext DEFAULT NULL,
  `cancelled_at` int(11) DEFAULT NULL,
  `created_at` int(11) NOT NULL,
  `finished_at` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `migrations`
--

CREATE TABLE `migrations` (
  `id` int(10) UNSIGNED NOT NULL,
  `migration` varchar(255) NOT NULL,
  `batch` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `migrations`
--

INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES
(4, '2024_12_07_235624_categories_table', 1),
(5, '2024_12_08_230224_create_users_table', 2),
(6, '0001_01_01_000001_create_cache_table', 3),
(7, '0001_01_01_000002_create_jobs_table', 3),
(9, '2024_12_10_212152_create_user_session', 4),
(10, '2024_12_27_000156_create_categories_table', 5),
(11, '2024_12_27_000402_create_subcategories_table', 6),
(12, '2025_01_05_011235_create_product_specs_table', 7),
(17, '2025_01_17_231433_create_shoppingcart_table', 8),
(19, '2025_01_19_013640_create_global_settings_table', 9),
(20, '2025_03_21_231859_create_personal_access_tokens_table', 10),
(21, '2025_05_09_200309_create_orders_table', 11),
(22, '2025_05_09_201432_create_order_items_table', 11),
(23, '2025_05_10_142823_add_order_last_updated_to_orders_table', 12),
(24, '2025_05_11_233935_update_global_settings_for_key_value_structure', 13),
(25, '2025_05_12_015817_add_setting_description_to_global_settings_table', 14),
(26, '2025_05_19_204245_create_password_resets_table', 15);

-- --------------------------------------------------------

--
-- Table structure for table `orders`
--

CREATE TABLE `orders` (
  `order_id` bigint(20) UNSIGNED NOT NULL,
  `order_date` timestamp NOT NULL DEFAULT current_timestamp(),
  `order_lastUpdated` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `order_totalAmount` decimal(10,2) NOT NULL,
  `order_shippingAddress` varchar(255) NOT NULL,
  `order_status` varchar(255) NOT NULL DEFAULT 'Pending',
  `order_paymentMethod` varchar(255) NOT NULL,
  `order_phoneNumber` varchar(255) NOT NULL,
  `order_notes` text DEFAULT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `orders`
--

INSERT INTO `orders` (`order_id`, `order_date`, `order_lastUpdated`, `order_totalAmount`, `order_shippingAddress`, `order_status`, `order_paymentMethod`, `order_phoneNumber`, `order_notes`, `user_id`) VALUES
(5, '2025-05-22 17:50:07', '2025-05-22 17:50:51', 40000.00, 'Casablanca, Bernoussi', 'Cancelled by User', 'Cash on Delivery', '012345678', NULL, 113),
(8, '2025-05-26 11:47:52', '2025-05-26 11:49:52', 6599.00, 'CENTRE VILLE', 'Processing', 'Cash on Delivery', '0702342612', NULL, 115);

-- --------------------------------------------------------

--
-- Table structure for table `order_items`
--

CREATE TABLE `order_items` (
  `orderItem_id` bigint(20) UNSIGNED NOT NULL,
  `order_id` bigint(20) UNSIGNED NOT NULL,
  `product_id` bigint(20) UNSIGNED NOT NULL,
  `orderItem_quantity` int(11) NOT NULL,
  `orderItem_unitPrice` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `order_items`
--

INSERT INTO `order_items` (`orderItem_id`, `order_id`, `product_id`, `orderItem_quantity`, `orderItem_unitPrice`) VALUES
(7, 5, 32, 4, 10000.00),
(11, 8, 99, 1, 6599.00);

-- --------------------------------------------------------

--
-- Table structure for table `password_resets`
--

CREATE TABLE `password_resets` (
  `email` varchar(255) NOT NULL,
  `token` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `password_resets`
--

INSERT INTO `password_resets` (`email`, `token`, `created_at`) VALUES
('souyousoyou4@gmail.com', 'lkTc1K8YTB', '2025-05-20 12:13:25'),
('souhail.izrhour@gmail.com', 'ufhjfnAQXm', '2025-05-20 17:07:50'),
('lioguatti@gmail.com', 'w6xqAQ6Tr4', '2025-05-21 21:49:31'),
('dinactiprefected@gmail.com', 'uum2u1Sq5c', '2025-05-21 23:55:18');

-- --------------------------------------------------------

--
-- Table structure for table `personal_access_tokens`
--

CREATE TABLE `personal_access_tokens` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `tokenable_type` varchar(255) NOT NULL,
  `tokenable_id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `token` varchar(64) NOT NULL,
  `abilities` text DEFAULT NULL,
  `last_used_at` timestamp NULL DEFAULT NULL,
  `expires_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `personal_access_tokens`
--

INSERT INTO `personal_access_tokens` (`id`, `tokenable_type`, `tokenable_id`, `name`, `token`, `abilities`, `last_used_at`, `expires_at`, `created_at`, `updated_at`) VALUES
(178, 'App\\Models\\Users', 106, 'prebuilds_auth-token', 'ccc1dc5e5632f64bf689ea90143cdb029ab953012019feb1ed122a1d67851995', '[\"Client\",106]', NULL, NULL, '2025-04-30 09:45:01', '2025-04-30 09:45:01'),
(228, 'App\\Models\\Users', 111, 'prebuilds_auth-token', '741e622490904b2953da7da65233bf1ebff1bdc8327264ee05f5047dc847dd56', '[\"Client\",111]', '2025-05-22 19:12:42', NULL, '2025-05-21 21:00:41', '2025-05-22 19:12:42'),
(234, 'App\\Models\\Users', 112, 'prebuilds_auth-token', '79651f933253597acf82f9c452df2bd024c252c062880697915609dee4ad740e', '[\"Client\",112]', '2025-05-22 10:11:35', NULL, '2025-05-22 09:52:29', '2025-05-22 10:11:35'),
(246, 'App\\Models\\Users', 115, 'prebuilds_auth-token', '7f2d3c1118ff509acfc11724b975b0a21e9c5f6a27614d2b10adb7439c7765aa', '[null,115]', '2025-05-26 16:59:03', NULL, '2025-05-26 11:46:16', '2025-05-26 16:59:03'),
(248, 'App\\Models\\Users', 1, 'prebuilds_auth-token', 'e4ad4abdfc8330ec30db601d630eb5d4c6eff9538991f6bed31d6cee15b8c99e', '[\"Owner\",1]', '2025-05-26 23:49:08', NULL, '2025-05-26 14:24:20', '2025-05-26 23:49:08');

-- --------------------------------------------------------

--
-- Table structure for table `products`
--

CREATE TABLE `products` (
  `product_id` bigint(20) UNSIGNED NOT NULL,
  `product_name` varchar(255) DEFAULT NULL,
  `category_id` bigint(20) UNSIGNED DEFAULT NULL,
  `subcategory_id` bigint(20) UNSIGNED DEFAULT NULL,
  `product_desc` text DEFAULT NULL,
  `buying_price` decimal(10,2) NOT NULL DEFAULT 0.00,
  `selling_price` decimal(10,2) NOT NULL DEFAULT 0.00,
  `product_quantity` int(11) NOT NULL DEFAULT 0,
  `product_visibility` enum('Visible','Invisible') NOT NULL DEFAULT 'Visible',
  `date_created` timestamp NOT NULL DEFAULT current_timestamp(),
  `product_picture` varchar(255) NOT NULL DEFAULT 'images/default_product_picture.jpg',
  `discount_price` decimal(10,2) NOT NULL DEFAULT 0.00,
  `views` int(11) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `products`
--

INSERT INTO `products` (`product_id`, `product_name`, `category_id`, `subcategory_id`, `product_desc`, `buying_price`, `selling_price`, `product_quantity`, `product_visibility`, `date_created`, `product_picture`, `discount_price`, `views`) VALUES
(32, 'PC Gamer UltraPC Core i7 12700K/512zGB SSD/16GB/RX7600-', 2, 2, 'Voici le PC Gaming parfait : le PC Gamer UPC-I7-12700K-Rx7600. Configuré pour offrir les meilleurs performances dans les jeux les plus récents, il vous accompagnera quel que soit vos envies. Avec un processeur 8-Core Intel Core i7, 16 Go de mémoire vive DDR4 et un disque SSD NVMe haute capacité 512 Go pour le stockage, le PC Gamer UPC-I7-12700K-Rx7600 ne laisse rien au hasard et vous permettra de jouer à vos Hits PC favoris dans de très bonnes conditions de résolution et de frame rate.', 7000.00, 10000.00, 10, 'Visible', '2025-01-07 02:39:39', 'images/PC-Gamer-UltraPC-Core-i7-12700K-512zGB-SSD-16GB-RX7600_6787ba7008857.png', 0.00, 3),
(79, 'PC Gamer UltraPC Ryzen 5 5500 /16GB/512GB SSD/RX7600', 2, 2, 'PC Gamer UltraPC Ryzen 5 5500 /16GB/512GB SSD/RX7600', 5000.00, 7499.00, 2, 'Visible', '2025-01-18 22:26:01', 'images/PC-Gamer-UltraPC-Ryzen-5-5500--16GB-512GB-SSD-RX7600_678c2a7998e98.png', 0.00, 1),
(81, 'MSI THIN B13VE-2473XMA i7 13620H/16GB DDR4/512GB/RTX4050 6GB 15.6\" 144Hz', 3, 3, 'Profitez d\'excellentes performances avec le PC portable Gamer MSI THIN B13VE ! Cet ordinateur portable MSI offre un parfait confort de jeu grâce à ses composants performants, son écran de 15.6\" Full HD 144 Hz, son clavier gamer rétroéclairé et son système audio performant. Le PC portable MSI THIN B13VE-2473XMA propose d\'excellentes performances grâce à son processeur Intel Core i7-13620H, ses 16 Go de mémoire DDR4, sa puce graphique NVIDIA GeForce RTX 4050 et son SSD M.2 PCIe de 512 Go.', 10000.00, 13999.00, 10, 'Visible', '2025-01-18 22:36:37', 'images/MSI-THIN-B13VE-2473XMA-i7-13620H-16GB-DDR4-512GB-RTX4050-6GB-15-6--144Hz_678c2cf53b5bc.jpg', 12999.00, 6),
(82, 'AMD Ryzen 5 5600 (3.5 GHz / 4.4 GHz) Tray', 4, 41, 'Le processeur AMD Ryzen 5 5600 est taillé pour le jeu vidéo : 6 Cores, 12 Threads et GameCache 35 Mo. Sans parler des fréquences natives et boost qui atteignent des sommets pour vous permettre de profiter de vos jeux préférés dans les meilleures conditions. Associez lui une carte graphique hautes performances et vous pourrez jouer de manière optimale. Tout simplement. \r\n\r\nAMD version Tray : Le processeur est livré dans neuf sans emballage et sans refroidisseur', 600.00, 1499.00, 10, 'Visible', '2025-01-18 22:43:04', 'images/AMD-Ryzen-5-5600--3-5-GHz---4-4-GHz--Tray_678c2e78eb4a5.jpg', 1199.00, 2),
(83, 'Gigabyte B760 DS3H AXe', 4, 25, 'La Gigabyte B760 DS3H AX est une carte mère fiable et performante, conçue pour les utilisateurs à la recherche d’une solution abordable pour les processeurs Intel de 12e et 13e génération sur socket LGA 1700. Elle dispose du chipset B760 et offre des performances solides pour les jeux et les applications multitâches. Son Wi-Fi 6 assure une connectivité sans fil rapide, tandis que ses ports USB 3.2 et Ethernet 2.5GbE garantissent des transferts de données rapides. Grâce à son système de refroidissement efficace et à son design compact, elle convient parfaitement aux configurations bureautiques et multimédia. Une solution économique, avec des caractéristiques modernes pour une utilisation polyvalente.', 1400.00, 1799.00, 10, 'Visible', '2025-01-18 22:45:06', 'images/Gigabyte-B760-DS3H-AX_678c2ef27d6bc.jpg', 0.00, 1),
(84, 'Cooler Master MasterLiquid 240L Core ARGB', 4, 26, 'Cooler Master s\'est appuyé sur la série classique MasterLiquid L pour présenter une version repensée et améliorée : Le Cooler Master MasterLiquid 240L Core ARGB. Doté de nouveaux éléments de conception qui apportent un style minimaliste classique à la série, le MasterLiquid 240L Core ARGB se dote d\'une base en cuivre repensée qui cible les points de chaleur avec précision, ainsi qu\'un débit et une pression d\'eau accrus pour des performances de refroidissement améliorées.', 400.00, 899.00, 10, 'Visible', '2025-01-18 22:47:27', 'images/Cooler-Master-MasterLiquid-240L-Core-ARGB_678c2f7f02b7d.jpg', 699.00, 0),
(85, 'INNO3D GeForce RTX 3060 TWIN X2 12GB GDDR6', 4, 27, 'Avec le modèle GeForce RTX 3060, NVIDIA rend encore plus accessibles les performances de haute volée proposées par les cartes graphiques Ampère. Des graphismes sublimés, une fluidité remarquable et un réalisme incroyable vous permettront de profiter au mieux des jeux PC les plus récents. Il ne vous reste plus qu\'à plonger au cœur de l\'action et à vous immerger totalement dans la partie. La carte graphique INNO3D GeForce RTX 3060 TWIN X2 12GB GDDR6 embarque 12 Go de mémoire vidéo de nouvelle génération GDDR6. Ce modèle bénéficie de fréquences de fonctionnement élevées et d\'un système de refroidissement amélioré, gage de fiabilité et de performances à long terme.', 1500.00, 3499.00, 10, 'Visible', '2025-01-18 22:50:25', 'images/INNO3D-GeForce-RTX-3060-TWIN-X2-12GB-GDDR6_678c303107cbc.jpg', 1799.00, 1),
(86, 'G.Skill Trident Z5 Neo RGB Series 32 Go (2x 16 Go) DDR5 6000 MHz CL32', 4, 28, 'Conçue pour la génération de processeurs AMD Ryzen AM5, la gamme de mémoires G.Skill Trident Z5 Neo RGB Series apportera performance et style à votre configuration ! Idéale pour les PC Gamer haut de gamme, cette gamme de mémoire est compatible AMD EXPO, pour un overclocking facile.\r\n\r\nAvec des éléments de design Hypercar et un radiateur en aluminium brossé, avec usinage CNC et coloris noir mat, la mémoire RAM Trident Z5 Neo RGB Series affiche un look Gamer élégant. Elle bénéficie aussi d\'une barre lumineuse RGB intégrée au radiateur. Le mode arc-en-ciel est par défaut, mais vous pourrez télécharger le logiciel dédié afin de découvrir les effets et les couleurs pour personnaliser vos barrettes. Aucune alimentation supplémentaire ne sera nécessaire.', 1200.00, 1599.00, 10, 'Visible', '2025-01-18 22:52:30', 'images/G-Skill-Trident-Z5-Neo-RGB-Series-32-Go--2x-16-Go--DDR5-6000-MHz-CL32_678c30ae40e5f.jpg', 0.00, 2),
(87, 'Samsung SSD 990 PRO M.2 PCIe NVMe 4TB', 4, 29, 'Le disque SSD 990 PRO 4 To de Samsung permet à votre machine de changer de dimension. Ce SSD bénéficie de vitesses stratosphériques et d\'une endurance très élevée. Le Samsung 990 PRO au format M.2 2280 s\'appuie sur l\'interface PCI-E 4.0 x4 et la technologie NVMe 2.0. Il embarque des puces mémoire Samsung V-NAND 3-bit MLC et 1 Go de mémoire cache LPDDR4.', 3000.00, 4490.00, 10, 'Visible', '2025-01-18 22:54:12', 'images/Samsung-SSD-990-PRO-M-2-PCIe-NVMe-4TB_678c311456739.jpg', 3490.00, 1),
(88, 'Cooler Master MWE Gold 1050 Full Modular V2 ATX 3.0 80PLUS GOLD 1050W', 4, 30, 'Disposez d\'une alimentation performante et silencieuse avec le modèle Cooler Master MWE Gold 1050 Full Modular V2 ATX 3.0. Dotée de la certification 80PLUS Gold, cette alimentation dispose d\'une efficacité pouvant aller jusqu\'à 92% et d\'un fonctionnement silencieux grâce à son ventilateur 140 mm. Très simple d\'utilisation, elle comblera tous vos besoins et apportera une puissance idéale à votre équipement. Profitez d\'une connectivité complète, d\'un MTBF dépassant les 100 000 heures et de ses multiples protections.\r\n\r\nLa MWE Gold 1050 V2 100% modulaire de Cooler Master propose une connectique complète pour les configurations gaming, elle prendra en charge les cartes graphiques les plus véloces véloces avec ses 3 connecteurs PCI-Express et  12VHPWR et vous permettra de multiplier les unités de stockage grâce à 12 prises SATA.', 1500.00, 2090.00, 10, 'Visible', '2025-01-18 22:56:46', 'images/Cooler-Master-MWE-Gold-1050-Full-Modular-V2-ATX-3-0-80PLUS-GOLD-1050W_678c31ae303be.jpg', 0.00, 1),
(89, 'MSI MAG FORGE 120A AIRFLOW', 4, 31, 'Le boitier moyen tour MSI MAG FORGE 120A AIRFLOW propose un design épuré avec une façade en mesh pour un flux d\'air optimisé et une paroi latérale en verre trempé pour une vue de choix sur votre configuration et les LEDs FRGB issues des 6 ventilateurs déjà intégrés au boitier. L\'espace intérieur généreux permet d\'installer les composants les plus imposants comme une carte graphique jusqu\'à 330 mm de longueur, un watercooling AiO 240 mm pour une configuration gaming de pointe.', 300.00, 699.00, 10, 'Visible', '2025-01-18 23:00:15', 'images/MSI-MAG-FORGE-120A-AIRFLOW_678c327f4bcdb.jpg', 599.00, 1),
(90, 'LG ULTRAGEAR 23.8″ 24GS60F-B IPS 180Hz 1ms', 5, 32, 'Gagnez en performance avec le moniteur LG UltraGear 24GS60F-B ! Avec sa dalle IPS de 23.8\" Full HD, entrez dans un univers gaming de haute volée ! Côté jeu, cet écran tient parfaitement la route avec un temps de réponse de 1 ms, une fréquence maximale de 180 Hz et les technologies FreeSync Premium et G-SYNC Compatible.', 900.00, 1749.00, 10, 'Visible', '2025-01-18 23:02:49', 'images/LG-ULTRAGEAR-23-8----24GS60F-B-IPS-180Hz-1ms_678c3319b3c49.jpg', 1499.00, 1),
(91, 'HyperX Alloy Core RGB', 5, 33, 'Prenez l\'avantage sur vos adversaires avec le clavier à membrane HyperX Alloy Core RGB et ressortez grand vainqueur de vos futurs affrontements. Ce modèle résistant et robuste intègre un rétro-éclairage RGB avec de nombreux effets pour accompagner idéalement vos sessions gaming. Prenez le contrôle de votre destinée et partez à la conquête des sommets !', 300.00, 699.00, 10, 'Visible', '2025-01-18 23:10:30', 'images/HyperX-Alloy-Core-RGB_678c34e6aa71a.jpg', 599.00, 2),
(94, 'Glorious Model O Regular RGB (Noir Mat)', 5, 34, 'Imaginée par une communauté de joueurs, la souris Glorious PC Gaming Race Model O vous offre performances et perfection. Conçue pour la vitesse, le contrôle et le confort, elle intègre un capteur optique Pixart PMW 3360 de 12000 dpi, 6 boutons, un design pour droitier et un rétroéclairage RGB personnalisable. Avec cette souris gamer, plongez au coeur de vos batailles.', 300.00, 599.00, 10, 'Visible', '2025-01-18 23:17:57', 'images/Glorious-Model-O-Regular-RGB--Noir-Mat-_678c36a55d84f.jpg', 0.00, 1),
(95, 'MSI Immerse GH20', 5, 37, 'Profitez de vos meilleurs jeux dans de bonnes conditions avec le casque-micro Immerse GH20 signé MSI. Derrière son look gaming assumé, vous entendrez vos ennemis avant qu\'ils ne vous voient grâce à un son limpide et détaillé via ses transducteurs néodyme 40 mm. De plus, grâce à son poids ultra léger de 245g, ce casque est confortable même durant les longues sessions.', 300.00, 449.00, 10, 'Visible', '2025-01-18 23:20:47', 'images/MSI-Immerse-GH20_678c374f3331d.jpg', 0.00, 2),
(97, 'SKILLCHAIRS SCV2 ECLIPSE', 6, 0, 'Avec le SCV2 ECLIPSE, vous disposez d\'un confort toujours plus important. Le SCV2 ECLIPSE offre le meilleur confort de la gamme Core et est un mélange de design futuriste et de courbes douces. Et avec sa mousse durcie à froid, son design amélioré qui met l\'accent sur des couleurs vives et un réglage libre de l\'assise, le SCV2 ECLIPSE est idéal pour les personnes cherchant à passer énormément de temps devant un PC ou une console, le tout dans un confort indéniable.', 2000.00, 3290.00, 9, 'Invisible', '2025-01-18 23:24:15', 'images/SKILLCHAIRS-SCV2-ECLIPSE_678c381fdc5bc.png', 0.00, 12),
(98, 'RUIJIE 1800M DUAL-BAND GIGABIT MESH WIFI-6 RG-EW1800GX PRO', 7, NULL, 'Le Ruijie 1800M Dual-Band Gigabit Mesh WiFi-6 RG-EW1800GX Pro est un routeur sans fil de nouvelle génération qui offre une connectivité WiFi ultra-rapide et fiable pour les entreprises et les particuliers. Avec une vitesse de transmission sans fil allant jusqu\'à 1800 Mbps et une technologie Mesh avancée, le RG-EW1800GX Pro est capable de fournir une couverture WiFi complète et uniforme dans toutes les pièces de la maison ou du bureau. Le routeur prend en charge les dernières normes WiFi-6 pour des performances optimales et une connectivité simultanée à de nombreux appareils. Avec une connectivité filaire supplémentaire via six ports Gigabit Ethernet, le RG-EW1800GX Pro est idéal pour les applications exigeantes telles que la diffusion en continu de vidéos 8K et la navigation sur le web à haut débit. Les avantages du RG-EW1800GX Pro incluent une sécurité accrue avec le support WPA3 et une gestion de réseau facile avec l\'application Ruijie Networks pour une configuration et une gestion simplifiées. Le routeur est compatible avec les fournisseurs d\'accès Internet les plus courants et est facile à installer pour une connectivité Internet rapide et fiable. En savoir plus sur le Ruijie 1800M Dual-Band Gigabit Mesh WiFi-6 RG-EW1800GX Pro pour une connectivité WiFi de nouvelle génération pour votre entreprise.', 500.00, 999.00, 0, 'Visible', '2025-01-18 23:26:38', 'images/RUIJIE-1800M-DUAL-BAND-GIGABIT-MESH-WIFI-6-RG-EW1800GX-PRO_678c38aed242a.png', 0.00, 7),
(99, 'Sony PlayStation 5 Slim', 45, NULL, 'La PlayStation 5 Slim révolutionne l\'expérience de jeu avec son disque SSD de 1 To, offrant des chargements ultrarapides et une immersion profonde grâce au retour haptique et aux gâchettes adaptatives. Avec un processeur AMD Ryzen Zen 2, un GPU AMD RDNA 2 de 10.3 TFLOPs et 16 Go de mémoire GDDR6, cette console offre des performances époustouflantes et des graphismes incroyables, notamment grâce à la technologie Ray Tracing pour des effets visuels ultra-réalistes. La manette DualSense offre une expérience de jeu tactile unique avec son retour tactile et ses effets de gâchette dynamiques, tandis que la console elle-même propose une rétrocompatibilité avec les jeux PlayStation 4, un support VR et la possibilité de mettre à niveau les jeux PS4 vers la version PS5. Avec des fonctionnalités avancées telles que la prise en charge du 8K, une résolution maximale de 8K et un framerate maximal de 4K/120fps, la PlayStation 5 Slim définit de nouveaux standards pour les consoles de jeu.', 4000.00, 6599.00, 0, 'Visible', '2025-01-18 23:29:19', 'images/Sony-PlayStation-5-Slim_678c394fdde4e.jpg', 0.00, 25),
(170, 'PC Gamer UltraPC Ryzen 5 3600 /16GB/512GB SSD/RTX4060', 2, 2, 'Faîtes confiance au PC Gamer UltraPC Ryzen 5 3600 /16GB/500GB SSD/RTX4060 pour vous guider dans vos premiers pas dans le monde du jeux vidéo. Simple et efficace, cet ordinateur vous permettra d’aller à l’essentiel tout en respectant un coût minimal. Il est composé d\'un processeur AMD Ryzen 5 3600 HEXA-Core, 16 Go de RAM DDR4, un disque SSD NVMe  512Go et la carte graphique NVIDIA GeForce RTX 4060 équipée de 8 Go de mémoire vidéo sont au coeur de ce système au rapport performances/prix exceptionnel.', 1000.00, 7749.00, 10, 'Visible', '2025-05-20 00:49:20', 'images/170_PC-Gamer-UltraPC-Ryzen-5-3600--16GB-512GB-SSD-RTX4060.jpeg', 6849.00, 0),
(171, 'PC Gamer Ryzen 5 5500/16GB/512GB SSD/RTX5060Ti 8GB', 2, 21, '🎮 PC Gamer – AMD Ryzen 5 5500 / 16 Go RAM / 512 Go SSD / GeForce RTX 5060 Ti 8 Go\r\n\r\nOffrez-vous une expérience de jeu fluide et réactive avec ce PC Gamer équipé du processeur AMD Ryzen 5 5500, une puce 6 cœurs / 12 threads qui garantit de bonnes performances pour le gaming, le multitâche et les tâches bureautiques ou créatives.\r\n\r\nLa carte graphique NVIDIA GeForce RTX 5060 Ti avec 8 Go de mémoire GDDR6 vous permet de jouer en Full HD et 1440p avec des détails élevés, tout en profitant des dernières technologies NVIDIA comme le ray tracing et le DLSS pour un rendu visuel spectaculaire et un gameplay fluide.\r\n\r\nAvec ses 16 Go de mémoire vive DDR4, le système reste rapide et réactif, même avec plusieurs applications ouvertes. Le SSD NVMe de 512 Go offre des temps de chargement réduits et un espace confortable pour vos jeux et fichiers.', 1000.00, 8799.00, 10, 'Visible', '2025-05-20 00:51:50', 'images/171_PC-Gamer-Ryzen-5-5500-16GB-512GB-SSD-RTX5060Ti-8GB.png', 7799.00, 1),
(172, 'PC Gamer Ryzen 5 3600/16GB/512GB SSD/RTX5060Ti 8GB', 2, 21, '🎮 PC Gamer – AMD Ryzen 5 3600 / 16 Go RAM / 512 Go SSD / GeForce RTX 5060 Ti 8 Go Découvrez un PC Gamer fiable et performant, conçu pour offrir une excellente expérience de jeu en Full HD et même en QHD. Le processeur AMD Ryzen 5 3600, avec ses 6 cœurs et 12 threads, offre une puissance polyvalente idéale pour le jeu, le multitâche et les applications créatives. La NVIDIA GeForce RTX 5060 Ti avec 8 Go de mémoire GDDR6 vous plonge dans l’univers du ray tracing et du DLSS, pour des graphismes ultra-détaillés et une fluidité remarquable dans les derniers titres AAA. Avec ses 16 Go de mémoire vive DDR4, vous profitez d’un système rapide et réactif. Le SSD NVMe de 512 Go permet des temps de chargement réduits, un démarrage rapide du système et un espace confortable pour vos jeux et logiciels. Caractéristiques techniques : 🧠 Processeur : AMD Ryzen 5 3600 – 6 cœurs / 12 threads (jusqu’à 4,2 GHz) 🎮 Carte graphique : NVIDIA GeForce RTX 5060 Ti – 8 Go GDDR6 ⚡ Mémoire RAM : 16 Go DDR4 (extensible) 💾 Stockage : SSD NVMe M.2 – 512 Go 💻 Système d’exploitation : à préciser (ex. : Windows 11 ou sans OS) 🔌 Connectique : USB 3.0/3.2, HDMI, DisplayPort, Ethernet, etc. (selon configuration)', 1000.00, 8699.00, 10, 'Visible', '2025-05-20 00:53:55', 'images/172_PC-Gamer-Ryzen-5-3600-16GB-512GB-SSD-RTX5060Ti-8GB.png', 7699.00, 0),
(173, 'PC Gamer Ryzen 5 5600/16GB/512GB SSD/RTX5060Ti 8GB', 2, 21, 'PC Gamer – Ryzen 5 5600 / 16 Go RAM / 512 Go SSD / GeForce RTX 5060 Ti 8 Go Découvrez un PC Gamer performant et équilibré, conçu pour offrir une excellente expérience de jeu en Full HD et QHD. Grâce à son processeur AMD Ryzen 5 5600, doté de 6 cœurs et 12 threads, ce PC assure une grande fluidité dans les jeux comme dans les tâches multitâches ou créatives. La carte graphique NVIDIA GeForce RTX 5060 Ti avec 8 Go de mémoire GDDR6 vous permet de profiter des dernières technologies graphiques, notamment le ray tracing et le DLSS, pour des images nettes et un gameplay fluide, même dans les jeux récents. Avec 16 Go de mémoire RAM DDR4, vous bénéficiez d\'une excellente réactivité, que ce soit pour le gaming, le streaming ou les applications lourdes. Le SSD NVMe de 512 Go garantit des chargements rapides et une bonne capacité de stockage pour vos jeux, logiciels et fichiers. Spécifications techniques : Processeur : AMD Ryzen 5 5600 (6 cœurs / 12 threads, fréquence jusqu’à 4,4 GHz) Carte graphique : NVIDIA GeForce RTX 5060 Ti – 8 Go GDDR6 Mémoire vive : 16 Go DDR4 (extensible selon la carte mère) Stockage : SSD NVMe M.2 – 512 Go Connectivité : selon la carte mère (USB 3.2, HDMI, DisplayPort, etc.) Système d’exploitation : à spécifier (ex. : Windows 11, sans OS, etc.)', 1000.00, 9299.00, 10, 'Visible', '2025-05-20 00:59:14', 'images/173_PC-Gamer-Ryzen-5-5600-16GB-512GB-SSD-RTX5060Ti-8GB.jpg', 8299.00, 0),
(174, 'PC Gamer UltraPC Ryzen 9 9950X3D/1TB SSD/64GB DDR5/RTX5090 32GB', 2, 24, '💻 PC Gamer UltraPC - Ryzen 9 9950X3D / 64 Go DDR5 / RTX 5090 32 Go / SSD 1 To\r\n\r\n    Plongez au cœur de la performance ultime avec ce PC Gamer UltraPC, conçu pour les passionnés de jeux vidéo et les créateurs exigeants. Grâce à un processeur AMD Ryzen 9 9950X3D de dernière génération, ce monstre de puissance vous offre des performances multitâches et gaming exceptionnelles.\r\n\r\n    🎮 Carte Graphique NVIDIA RTX 5090 32 Go\r\n    Profitez d’un rendu graphique ultra-réaliste, du ray tracing avancé, et d’un taux de rafraîchissement fluide même en 4K. Parfait pour les jeux AAA et la réalité virtuelle.\r\n\r\n    🚀 Mémoire vive 64 Go DDR5\r\n    Une RAM ultrarapide pour assurer la fluidité de tous vos logiciels, même les plus gourmands en ressources.\r\n\r\n    ⚡ Stockage SSD 1 To NVMe\r\n    Un démarrage fulgurant de Windows et des chargements instantanés de vos jeux et applications préférés.\r\n\r\n    🧊 Refroidissement avancé\r\n\r\n    Ce PC est équipé d’un système de refroidissement performant pour maintenir des températures optimales, même pendant vos sessions de jeu les plus intenses.Connectivité : Wi-Fi 6E, Bluetooth 5.2, ports USB-C / USB 3.2 / HDMI / DisplayPort.', 1000.00, 57599.00, 10, 'Visible', '2025-05-20 01:03:59', 'images/174_PC-Gamer-UltraPC-Ryzen-9-9950X3D-1TB-SSD-64GB-DDR5-RTX5090-32GB.png', 54599.00, 1),
(175, 'PC Gamer UltraPC Ryzen 9 9950X/1TB SSD/64GB DDR5/RTX5090 32GB', 2, 24, '🖥️ PC Gamer UltraPC Ryzen 9 9950X – L’excellence sans compromis Profitez d\'une puissance extrême pour le jeu, la création et les tâches professionnelles avec ce PC Gamer UltraPC équipé des composants les plus récents et les plus performants du marché. ⚙️ Caractéristiques techniques : Processeur : AMD Ryzen 9 9950X – 16 cœurs / 32 threads basés sur l\'architecture Zen 5, conçu pour les gamers, créateurs et utilisateurs intensifs recherchant des performances multitâches inégalées. Carte Graphique : NVIDIA GeForce RTX 5090 – 32 Go GDDR7 – La carte graphique la plus puissante du marché, parfaite pour le gaming en 4K/8K, la réalité virtuelle, l\'IA, le ray tracing et la création 3D avancée. Mémoire : 64 Go DDR5 – RAM ultra-rapide pour gérer sans effort les applications les plus exigeantes, les environnements professionnels lourds, et le multitâche extrême. Stockage : SSD NVMe 1 To – Vitesse de lecture/écriture ultra-élevée pour des démarrages rapides, des chargements instantanés et une excellente réactivité globale. Refroidissement : Système de refroidissement liquide performant pour maintenir des températures optimales même lors des sessions les plus intenses. Boîtier : Châssis haut de gamme avec éclairage RGB, panneaux en verre trempé, excellente circulation d’air et design futuriste. Connectivité : PCIe 5.0, USB 4, Wi-Fi 6E, Bluetooth 5.3 – Compatible avec les technologies les plus avancées. 🎯 Idéal pour : Jeux en 4K Ultra et réalité virtuelle Création de contenu professionnel', 1000.00, 55499.00, 1000, 'Visible', '2025-05-20 01:06:33', 'images/175_PC-Gamer-UltraPC-Ryzen-9-9950X-1TB-SSD-64GB-DDR5-RTX5090-32GB.png', 52499.00, 1),
(176, 'PC Gamer UltraPC Ryzen 7 9800X3D/1TB SSD/64GB DDR5/RTX5090 32GB', 2, 24, '⚡ PC Gamer UltraPC Ryzen 7 9800X3D – Puissance et Performance sans Compromis Vivez une expérience de jeu et de création de contenu à un niveau extrême avec ce PC Gamer UltraPC ultra-performant, taillé pour les passionnés de performances, de fluidité et de puissance brute. 🔧 Spécifications techniques : Processeur : AMD Ryzen 7 9800X3D – Architecture Zen 5 avec technologie 3D V-Cache, optimisée pour le gaming haut de gamme, les FPS élevés et les performances constantes en multitâche. Carte Graphique : NVIDIA GeForce RTX 5090 – 32 Go GDDR7 – Carte graphique ultime pour le jeu en 4K/8K, la réalité virtuelle, l’intelligence artificielle et le ray tracing en temps réel. Mémoire Vive (RAM) : 64 Go DDR5 – Idéale pour les jeux les plus lourds, le streaming, la création de contenu 3D, et les environnements de travail multitâches avancés. Stockage : SSD NVMe de 1 To – Vitesse fulgurante pour des démarrages instantanés, des temps de chargement réduits et une grande capacité de stockage. Refroidissement : Refroidissement liquide hautes performances pour maintenir des températures stables même en pleine charge. Boîtier : Châssis gaming premium avec éclairage RGB, ventilation optimisée et panneaux en verre trempé pour un look moderne et agressif. Connectivité : Wi-Fi 6E, Bluetooth 5.3, USB-C, PCIe 5.0 – Prêt pour les périphériques les plus récents. 🎮 Conçu pour : Jeux ultra fluides en 4K/8K avec tous les réglages au maximum Création de contenu professionnel (montage vidéo 8K, animation 3D', 1000.00, 54499.00, 10, 'Visible', '2025-05-20 01:08:54', 'images/176_PC-Gamer-UltraPC-Ryzen-7-9800X3D-1TB-SSD-64GB-DDR5-RTX5090-32GB.jpg', 51499.00, 2),
(178, 'HP EliteBook x360 830 G7 i5-10210U-16GB-256GB SSD 13.3″', 3, 67, 'Le HP EliteBook x360 830 G7 est un ordinateur portable convertible 2-en-1 haut de gamme, idéal pour les professionnels en quête de performances, de sécurité et de mobilité. Voici ses principales caractéristiques optimisées : Processeur : Intel Core i5-10210U (6 Mo de cache, jusqu\'à 4,20 GHz) – Puissant et efficace pour le multitâche et les applications professionnelles. Mémoire : 16 Go de RAM DDR4 – Assure une exécution fluide de plusieurs applications et un multitâche sans ralentissement. Stockage : SSD 256 Go – Accès rapide aux données, améliore la réactivité et les performances globales. Écran : Tactile Full HD de 13,3 pouces (1920 x 1080) – Affichage clair, lumineux et interactif avec la possibilité de pivoter à 360° pour s\'adapter à différents modes (ordinateur, tablette, etc.). Graphismes : Intel UHD Graphics – Suffisants pour la bureautique, la navigation et la consommation multimédia légère.', 1000.00, 4999.00, 10, 'Visible', '2025-05-20 14:52:14', 'images/178_HP-EliteBook-x360-830-G7-i5-10210U-16GB-256GB-SSD-13-3---.png', 3999.00, 7),
(179, 'HP EliteBook 830 G5 i5-8265U/8GB/256GB SSD (AZERTY)', 3, 67, 'Puissant et efficace, conçu pour la mobilité, le PC portable HP EliteBook 830 G5 est parfait pour un usage professionnel. Equipé d\'un processeur Intel Core i5-8265U, de 8Go de RAM, d\'un SSD M.2 PCIe de 256 Go et d\'un écran mat IPS Full HD de 13.3\", il donnera satisfaction aux professionnels exigeants.\r\n\r\nEn plus de ses composants performants, le PC portable professionnel HP EliteBook 830 G6 bénéficie d\'un superbe écran de 13.3 pouces avec résolution Full HD (1920 x 1080) 60 Hz. Pour votre confort, il dispose aussi d\'un clavier à touches rétroéclairées avec protection anti-éclaboussures. Son système audio Bang & Olufsen offre également une restitution sonore de haute qualité.\r\n\r\nBénéficiez d\'une protection efficace et d\'une gestion simplifiée sur les ordinateurs les plus sécurisés et administrables de HP. HP Sure Start (4e génération) vous protège contre les attaques du BIOS et gère aisément les appareils via Microsoft SCCM avec le kit d\'intégration HP Manageability (à télécharger). Le PC portable HP EliteBook 830 G6 offre aussi une sécurité avancée notamment grâce à sa puce TPM 2.0 et offre un accès sécurisé via son lecteur d\'empreinte digitale intégré.', 1000.00, 2799.00, 10, 'Visible', '2025-05-20 15:46:52', 'images/179_HP-EliteBook-830-G5-i5-8265U-8GB-256GB-SSD--AZERTY-.png', 0.00, 1),
(180, 'ASUS Zenbook 14 UM3406HA-DRQD032W OLED R7 8840HS/16GB DDR5/1TB SSD/‎AMD Radeon Graphics 14\'\'', 3, 67, 'Le PC portable Asus Zenbook 14 OLED est équipé d\'un puissant processeur AMD Ryzen 7 8840HS qui offre des performances rapides et fluides, jusqu\'à 5.1 GHz en mode turbo. Il est doté de 8 cœurs et 16 threads, ce qui en fait un choix idéal pour les tâches multitâches et les applications gourmandes en ressources. De plus, la carte graphique AMD Radeon Graphics garantit des performances visuelles exceptionnelles. Avec son SSD M.2 NVMe PCIe 4.0 de 1 To, vous disposez d\'un espace de stockage rapide et généreux pour vos fichiers, applications et jeux. Profitez d\'un accès rapide à vos données et d\'un chargement rapide des applications. L\'écran OLED de 14.0 pouces offre une résolution WUXGA de 1920 x 1200 pixels, pour des images nettes et détaillées. Grâce à son taux de rafraîchissement de 60Hz, vous bénéficiez d\'une fluidité d\'affichage optimale. De plus, la luminosité de 400nits et le pic de luminosité HDR de 600nits offrent des couleurs vives et un contraste élevé pour une expérience visuelle immersive. Conforme à la norme militaire US MIL-STD 810H, cet Asus Zenbook est conçu pour résister aux chocs, aux vibrations et aux conditions environnementales difficiles. Il est également doté d\'un système de refroidissement efficace qui permet de maintenir les performances du processeur tout en limitant la production de chaleur, ce qui contribue à sa durabilité et à sa longévité. La caméra FHD avec fonction IR intégrée prend en charge Windows Hello, le système de reconnaissance faciale sécur', 1000.00, 12599.00, 10, 'Visible', '2025-05-22 07:50:13', 'images/180_ASUS-Zenbook-14-UM3406HA-DRQD032W-OLED-R7-8840HS-16GB-DDR5-1TB-SSD----AMD-Radeon-Graphics-14--.png', 11599.00, 0),
(181, 'LENOVO LOQ 15IAX9E Intel i5-12450HX/16GB DDR5/512GB SSD/15.6″ 144Hz/RTX 2050 4GB', 3, 3, 'Le LENOVO LOQ 15IAX9E 83LK006SFE est un PC Portable conçu pour répondre aux exigences des utilisateurs dynamiques. Équipé d’un processeur Intel Core i5-12450HX, il offre d’excellentes performances multitâches, appuyées par une carte graphique RTX 2050 4GB idéale pour le gaming et les applications graphiques. Son écran de 15.6 pouces en dalle IPS affiche une résolution Full HD (1920 x 1080 pixels) avec un taux de rafraîchissement de 144 Hz, pour une fluidité visuelle exceptionnelle. Avec 16 Go de mémoire DDR5, vos applications s’exécutent rapidement, et le disque SSD M.2 de 512GB garantit un démarrage et des chargements ultra-rapides. Le tout est complété par un clavier AZERTY confortable et un système Windows 11 fluide et intuitif. Que ce soit pour travailler, jouer ou créer, ce PC est un excellent choix.', 1000.00, 8499.00, 10, 'Visible', '2025-05-22 07:53:35', 'images/181_LENOVO-LOQ-15IAX9E-Intel-i5-12450HX-16GB-DDR5-512GB-SSD-15-6----144Hz-RTX-2050-4GB.png', 0.00, 0),
(182, 'Aorus 15 BKG-13FR794CD Ultra7 155H/16GB DDR5/1TB SSD/RTX4060 8GB/15.6\" 165Hz', 3, 3, 'Aorus 15 BKG-13FR794CD est un ordinateur portable haut de gamme conçu pour offrir des performances exceptionnelles. Équipé du puissant Ultra7 155H, il est idéal pour les utilisateurs recherchant une machine performante pour les jeux ou les applications professionnelles. Avec 16GB DDR5 de mémoire vive, il assure une fluidité remarquable et une réactivité optimale même lors de l\'exécution de plusieurs tâches simultanément. Le 1TB SSD offre une capacité de stockage généreuse et des vitesses de lecture/écriture ultra-rapides pour un démarrage rapide et un chargement instantané des applications.\r\n\r\nSon processeur graphique RTX4060 6GB permet de profiter des jeux et des logiciels graphiques les plus exigeants avec des performances visuelles époustouflantes. L’écran 15.6\" 165Hz garantit une expérience visuelle fluide et agréable, avec des images nettes et des animations sans décalage. Le Aorus 15 BKG-13FR794CD combine puissance, rapidité et design élégant pour répondre aux besoins des utilisateurs exigeants.', 1000.00, 16999.00, 10, 'Visible', '2025-05-22 07:59:46', 'images/182_Aorus-15-BKG-13FR794CD-Ultra7-155H-16GB-DDR5-1TB-SSD-RTX4060-8GB-15-6--165Hz.png', 14999.00, 1),
(183, 'AMD Ryzen 7 7800X3D (4.2 GHz / 5.0 GHz) Tray', 4, 41, 'AMD Ryzen 7 7800X3D est un processeur haut de gamme conçu pour offrir des performances exceptionnelles dans les jeux et les applications intensives. Il possède 8 cœurs et 16 threads, avec une fréquence de base de 4,2 GHz et une fréquence de boost allant jusqu\'à 5,0 GHz, assurant une puissance de calcul optimale. Ce modèle intègre la technologie 3D V-Cache, augmentant la capacité de cache pour améliorer les performances en gaming et traitement des données. Il est compatible avec les cartes mères AM5, ce qui permet une mise à niveau facile pour les utilisateurs souhaitant maximiser leur configuration. Livré en version Tray, le Ryzen 7 7800X3D est un choix idéal pour les passionnés d\'overclocking et les utilisateurs exigeants en termes de puissance de calcul.', 1000.00, 4899.00, 10, 'Visible', '2025-05-22 08:22:46', 'images/183_AMD-Ryzen-7-7800X3D--4-2-GHz---5-0-GHz--Tray.jpg', 0.00, 0),
(184, 'AMD Ryzen 7 9800X3D (4.7 GHz / 5.2 GHz)', 4, 41, 'Conçu pour le gaming, le processeur AMD Ryzen 7 9800X3D basé sur l\'architecture Zen 5 et doté de la technologie AMD 3D V-Cache vous permet d\'atteindre de nouveaux sommets. Avec des fréquences d\'images plus fluides et des performances spectaculaires, ce processeur haut de gamme vous garantit d\'enchainer les parties sans efforts.', 1000.00, 8899.00, 10, 'Visible', '2025-05-22 08:24:30', 'images/184_AMD-Ryzen-7-9800X3D--4-7-GHz---5-2-GHz-.jpg', 6899.00, 0),
(187, 'MSI PRO B650M-B', 4, 25, 'La MSI PRO B650M-B est une carte mère polyvalente conçue pour les processeurs AMD Ryzen compatibles avec le socket AM5, idéale pour les utilisateurs au Maroc à la recherche d\'une performance optimale. Avec cette carte mère, vous pourrez assembler un PC gamer performant en utilisant les composants les plus puissants disponibles sur le marché, notamment les processeurs AMD Ryzen 7000 et 8000, les cartes graphiques PCI-Express 4.0 16x, les disques M.2 NVMe PCIe 4.0 et la RAM DDR5.', 1000.00, 1249.00, 10, 'Visible', '2025-05-22 08:37:52', 'images/187_MSI-PRO-B650M-B.jpg', 0.00, 2),
(188, 'Gigabyte Z790 EAGLE', 4, 25, 'Gigabyte Z790 EAGLE est conçue pour offrir des performances exceptionnelles aux gamers et créateurs exigeants. Compatible avec les processeurs Intel Core de 12ᵉ et 13ᵉ génération, elle intègre le chipset Z790, assurant une stabilité et une puissance accrues. Profitez d’une connectivité ultra-rapide grâce au support PCIe 5.0, DDR5, USB 3.2 Gen 2x2, et au Wi-Fi 6E. Son design thermique avancé garantit un refroidissement optimal, même en pleine charge. Avec son format ATX, elle s’adapte parfaitement aux configurations modernes. Idéale pour assembler une machine performante, fiable et évolutive.', 1000.00, 2749.00, 10, 'Visible', '2025-05-22 08:57:54', 'images/188_Gigabyte-Z790-EAGLE.jpg', 0.00, 1),
(189, 'XTRMLAB XT120 ARGB', 4, 26, 'Les ventilateurs de boîtiers XTRMLAB ont toujours démontrés leur efficacité. Pour ce qui est des modèles XT120, la tradition est préservée. Ces ventilateurs affichent de très bonnes performances pour assurer un refroidissement performant qui préservera l\'ensemble des composants de votre configuration. Designés de manière simple, précis, carrés, sans fioritures, les XT120 apportent tout de même du style à votre configuration grâce à leur rétroéclairage ARGB compatible avec les cartes mères munies d\'un connecteur RGB 3 broches.', 20.00, 99.00, 20, 'Visible', '2025-05-22 09:11:04', 'images/189_XTRMLAB-XT120-ARGB.jpg', 0.00, 0),
(190, 'NZXT Kraken Elite 360 V2 RGB Black', 4, 26, 'Le watercooling AiO NZXT Kraken Elite 360 V2 RGB vous apporte des performances de refroidissement optimales grâce à ses ventilateurs PWM F120P Core RGB à haute pression statique et une personnalisation poussée grâce au logiciel NZXT CAM. La gamme Kraken Elite propose une installation simplifiée grâce à un câble de raccordement unique de la pompe à la carte mère et un écran LCD grand angle pour afficher les caractéristiques du système ou des images personnalisées.', 1000.00, 3799.00, 10, 'Visible', '2025-05-22 09:15:32', 'images/190_NZXT-Kraken-Elite-360-V2-RGB-Black.png', 0.00, 0),
(191, 'MSI GeForce RTX 5080 VENTUS 3X OC 16Gb GDDR7', 4, 27, 'MSI GeForce RTX 5080 16G VENTUS 3X OC (référence 4711377309219) est une carte graphique haut de gamme, conçue pour offrir des performances exceptionnelles. Dotée de 16 Go de mémoire GDDR6X ultra-rapide, elle intègre l\'architecture Ada Lovelace de NVIDIA, garantissant des rendus visuels époustouflants et des performances optimisées. Grâce à ses trois ventilateurs TORX FAN 5.0, elle assure un refroidissement silencieux et efficace, même lors de sessions de jeu intenses. L\'overclocking d\'usine vous permet de bénéficier de fréquences plus élevées pour des performances accrues. Compatible avec Ray Tracing et DLSS 3, cette carte graphique offre des graphismes réalistes et une fluidité optimale, idéale pour les gamers et les créateurs de contenu. C\'est l\'outil parfait pour les applications les plus exigeantes.', 1000.00, 18499.00, 10, 'Visible', '2025-05-22 09:42:01', 'images/191_MSI-GeForce-RTX-5080-VENTUS-3X-OC-16Gb-GDDR7.jpg', 1699.00, 0),
(192, 'MSI GeForce RTX 5060 Ti 8G VENTUS 2X OC PLUS', 4, 27, 'MSI GeForce RTX 5060 Ti 8G VENTUS 2X OC PLUS offre des performances puissantes dans un design épuré et compact. Équipée de 8 Go de mémoire GDDR6 et basée sur l’architecture NVIDIA Ada Lovelace, elle est parfaite pour le gaming en 1080p/1440p. Son overclocking d’usine améliore les performances pour une expérience plus fluide. Le système VENTUS 2X à double ventilateur assure un refroidissement efficace tout en restant silencieux. Compatible avec Ray Tracing et DLSS 3, cette carte garantit des graphismes réalistes et une haute fluidité. Idéale pour les joueurs à la recherche de fiabilité, de puissance et d’un excellent rapport qualité/prix.', 1000.00, 5699.00, 10, 'Visible', '2025-05-22 09:46:17', 'images/192_MSI-GeForce-RTX-5060-Ti-8G-VENTUS-2X-OC-PLUS.jpg', 0.00, 0);

--
-- Triggers `products`
--
DELIMITER $$
CREATE TRIGGER `resetCartQuantity` BEFORE UPDATE ON `products` FOR EACH ROW BEGIN
    IF NEW.product_quantity < OLD.product_quantity THEN
        UPDATE shopping_cart 
        SET quantity = NEW.product_quantity 
        WHERE product_id = NEW.product_id 
          AND quantity > NEW.product_quantity ;
    END IF;
END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `unspecifiedToInvis` BEFORE UPDATE ON `products` FOR EACH ROW BEGIN
	Declare categoryName varchar(255);
    Declare subcategoryName varchar(255);
    
	Select category_name into categoryName from categories where category_id = new.category_id;
	Select subcategory_name into subcategoryName from subcategories where subcategory_id = new.subcategory_id;
    
    if categoryName = "Unspecified" OR subcategoryName = "Unspecified" THEN
		SET NEW.product_visibility = 'Invisible';
    end if;
    


END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `product_specs`
--

CREATE TABLE `product_specs` (
  `product_id` bigint(20) UNSIGNED NOT NULL,
  `spec_name` varchar(255) NOT NULL,
  `spec_value` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `product_specs`
--

INSERT INTO `product_specs` (`product_id`, `spec_name`, `spec_value`) VALUES
(32, 'Alimentation', 'Cooler Master MWE Bronze 550W V3'),
(32, 'Barrette de RAM', 'TeamGroup VULCAN Z GRIS 16Go (2x 8Go) DDR4 3200MHz CL16'),
(32, 'Boîtier PC', 'XTRMLAB VISION (Black)'),
(32, 'Carte Graphique', 'AMD Radeon RX 7600'),
(32, 'Carte mère', 'Gigabyte H610M K DDR4'),
(32, 'Garantie', '12 Mois'),
(32, 'Processeur', 'Intel Core i7 12700K (3.6 GHz / 5.0 GHz)'),
(32, 'Refroidisseur', 'DeepCool AG500 Black ARGB'),
(32, 'SSD', 'Lexar NM620 M.2 PCIe NVMe 512GB'),
(79, 'Alimentation', 'MSI MAG A550BN 8'),
(79, 'Barrette de RAM', 'TeamGroup VULCAN'),
(79, 'Boîtier PC', 'XTRMLAB HUNTER +'),
(79, 'Carte Graphique', 'AMD Radeon RX 76'),
(79, 'Carte mère', 'MSI A520M-A PRO'),
(79, 'Garantie', '12 Mois'),
(79, 'Processeur', 'AMD Ryzen 5 5500'),
(79, 'Refroidisseur', 'Refroidisseur AM'),
(79, 'SSD', 'Lexar NM620 M.2'),
(81, 'Capacité RAM', '16 Go DDR4'),
(81, 'Chipset graphique', 'NVIDIA GeForce RTX 4050 6GB GDDR6'),
(81, 'Clavier', 'AZERTY'),
(81, 'Ecran', '15.6\" FHD (1920x1080)'),
(81, 'Gamme processeur', 'Intel Core i7'),
(81, 'Garantie', '24 Mois'),
(81, 'Marque', 'MSI'),
(81, 'SSD', '512GB NVMe PCIe'),
(81, 'Système d\'exploitation', 'FreeDOS'),
(81, 'Type de Processeur', 'Intel Core i7-13620H (6 Performance-Cores + 4 Efficient-Cores 3.9 GHz Turbo - 16 Threads - Cache 24'),
(82, 'Cache total', '3MB L2 + 32MB L3'),
(82, 'Fréquence CPU', '3.5 Ghz'),
(82, 'Fréquence en mode Turbo', '4.4 Ghz'),
(82, 'Gamme processeur', 'AMD Ryzen 5'),
(82, 'Garantie', '12 Mois'),
(82, 'Marque', 'AMD'),
(82, 'Nombre de coeurs', '6'),
(82, 'Nombre de threads', '12'),
(82, 'Socket', 'AMD AM4'),
(83, 'Bluetooth', 'Oui'),
(83, 'Chipset', 'Intel B760 Express'),
(83, 'Format', 'ATX'),
(83, 'Garantie', '12 Mois'),
(83, 'Nombre de slots RAM', '4'),
(83, 'Socket', 'Intel 1700'),
(83, 'TEST', 'TEST'),
(83, 'Type de mémoire', 'DDR5'),
(84, 'Dimensions du radiateur', '277 x 119.6 x 27.2 mm'),
(84, 'Garantie', '12 Mois'),
(84, 'Marque', 'Cooler Master'),
(84, 'Matériau', 'Cuivre et aluminium'),
(84, 'Support du processeur', 'Intel 1151, Intel 1155, Intel 1156 ,Intel 1200 ,AMD AM2 ,AMD AM2+ ,AMD AM3 ,AMD AM3+ ,AMD AM4, AMD FM2 ,AMD FM2+ ,Intel 1700 ,AMD FM1'),
(84, 'Ventilateur(s)', '2 x 120 mm'),
(85, 'Fréquence mémoire', '15000 Mhz'),
(85, 'Garantie', '12 Mois'),
(85, 'Marque', 'INNO3D'),
(85, 'Marque du chipset', 'Nvidia'),
(85, 'Puce graphique', 'NVIDIA GeForce RTX 3060 12GB GDDR6'),
(85, 'Quantité mémoire', '12 Go GDDR6'),
(85, 'Unités de calcul', '3584 CUDA Cores'),
(86, 'Capacité totale', '32 Go'),
(86, 'CAS Latency', 'CL32'),
(86, 'Fréquence(s) Mémoire', '6000 Mhz'),
(86, 'Garantie', '12 Mois'),
(86, 'Marque', 'G.Skill'),
(86, 'Nombre de barrette(s)', '2'),
(86, 'Tension (certification)', '1.35 Volts'),
(86, 'Type de mémoire', 'DDR5'),
(87, 'Capacité de disque', '4 To'),
(87, 'Format de Disque', 'Carte M.2'),
(87, 'Garantie', '12 Mois'),
(87, 'Interface', 'PCI-E 4.0 4x'),
(87, 'Vitesse en écriture', '6900 Mo/s'),
(87, 'Vitesse en lecture', '7450 Mo/s'),
(88, 'Certification', '80 PLUS GOLD'),
(88, 'Garantie', '12 Mois'),
(88, 'Maque', 'Cooler Master'),
(88, 'Modulaire', 'Oui'),
(88, 'Puissance', '1050 Watts'),
(89, 'Dimensions (L x H x P)', '330 x 160x 200mm'),
(89, 'Fenêtre', 'Oui'),
(89, 'Format de carte mère', 'ATX/EPS'),
(89, 'Format du boitier', 'Moyen Tour'),
(89, 'Garantie', '12 Mois'),
(89, 'Marque', 'MSI'),
(89, 'Matériau boitier', 'Steel, Tempered glass'),
(89, 'Nombre de ventilateurs fournis', '6 x 120mm'),
(90, 'Entrées vidéo', '1 x DisplayPort Femelle, 1 x HDMI Femelle'),
(90, 'Fréquence verticale maxi', '180 Hz'),
(90, 'Garantie', '12 Mois'),
(90, 'Marque', 'LG Group'),
(90, 'Résolution', '1920 x 1080 pixels (FHD)'),
(90, 'Taille', '24 pouces'),
(90, 'Technologie de dalle', 'IPS'),
(90, 'Temps de réponse', '1 ms'),
(91, 'Clavier mécanique', 'Non'),
(91, 'Garantie', '12 Mois'),
(91, 'Localisation', 'Francais'),
(91, 'Norme du clavier', 'AZERTY'),
(91, 'Rétro-éclairage', 'Oui (RGB)'),
(91, 'Type de connexion', 'Filaire'),
(91, 'Type de touches', 'À membrane'),
(94, 'Dimensions', '128 x 66 x 37.5 mm'),
(94, 'Garantie', '12 Mois'),
(94, 'Nombre de boutons', '6'),
(94, 'Poids', '67 g'),
(94, 'Résolution maximale (dpi)', '12000'),
(94, 'Rétro-éclairage', 'Oui (RGB)'),
(94, 'Type de capteur', 'Optique'),
(95, 'Connecteur(s)', '1 x Jack 3,5mm Mâle Stéréo'),
(95, 'Couplage auriculaire', 'Circum-aural (englobe les oreilles)'),
(95, 'Garantie', '12 Mois'),
(95, 'Longueur du câble', '1,5 m'),
(95, 'Marque', 'MSI'),
(95, 'Sans-fil', 'Non'),
(95, 'Type', 'Stéréo'),
(97, 'Accoudoirs réglables', 'Oui'),
(97, 'Coussins fournis', '2'),
(97, 'Hauteur du dossier', '82 cm'),
(97, 'Largeur assise', '55 cm'),
(97, 'Largeur dossier maxi', '52 cm'),
(97, 'Marque', 'SKILLCHAIRS'),
(97, 'Poids maximum supporté', '150 kg'),
(97, 'Profondeur assise', '52 cm'),
(97, 'Revêtement', 'Tissu'),
(97, 'Type d\'accoudoirs', '4D'),
(98, 'Alimentation', '12 V CC /1,5 A'),
(98, 'Antennes', '4'),
(98, 'Débit Wi-Fi Max.', '2,4 GHz : 574 Mbps 5 GHz: 1201 Mbps'),
(98, 'Dimensions (L x H x P)', '180 mm x 180 mm x 30 mm'),
(98, 'Gain d\'antenne', '2,4 GHz : 5 dBi 5 GHz: 6 dBi'),
(98, 'Garantie', '12 Mois'),
(98, 'Interface', '1 Port WAN de 10/100/1000 Base-T, 4 Ports LAN de 10/100/1000 Base-T'),
(98, 'Marque', 'RUIJIE'),
(98, 'MIMO', '2,4 GHz : 2×2 5 GHz: 2×2'),
(98, 'Nombre recommandé d\'utilisateurs', '48'),
(98, 'Norme Wifi', 'Wi-Fi 6 (802.11ax)'),
(98, 'Poids', '0,55 kg (emballages exclus)'),
(98, 'Technologie avancée', 'VPN, Beamforming, OFDMA, IPv6'),
(99, 'Capacité de stockage', 'Disque SSD amovible de 1 To'),
(99, 'Chipset graphique', 'AMD RDNA 2 Custom'),
(99, 'Connecteur(s) Réseau', 'Ethernet (10BASE-T, 100BASE-TX, 1000BASE-T), IEEE 802.11 a/b/g/n/ac/ax, Bluetooth 5.1'),
(99, 'Connectique', 'port USB Type-A (Hi-Speed USB), port USB Type-A (Super-Speed USB 10Gbps) x2, port USB Type-C (Super-Speed USB 10Gbps)'),
(99, 'Dimensions (L x H x P)', '358 x 96 x 216 mm'),
(99, 'Poids', '3,2 kg'),
(99, 'Taille de la mémoire', '16 Go GDDR6'),
(99, 'Type de Processeur', 'AMD Ryzen de 3e génération (Zen 2, 8 cœurs/16 threads, 3,5 GHz, gravure en 7 nm)'),
(170, 'Alimentation', 'XTRMLAB XP-650B 80+ BRONZE 650W'),
(170, 'Barrette de RAM', 'TeamGroup 16Go (2x8Go) DDR4 3200MHz CL16'),
(170, 'Boîtier PC', 'XTRMLAB MATRIX'),
(170, 'Carte Graphique', 'NVIDIA GeForce RTX 4060 8GB GDDR6'),
(170, 'Carte mère', 'MSI A520M-A PRO'),
(170, 'Garantie', '12 Mois'),
(170, 'Processeur', 'AMD Ryzen 5 3600 (Hexa-Core 3.6 GHz / 4.2 GHz Turbo - 12 Threads - 32 Mo Cache L3)'),
(170, 'Refroidisseur', 'Refroidisseur AMD'),
(170, 'SSD', 'Mushkin Element M.2 PCIe NVMe 512GB'),
(171, 'Alimentation', 'XTRMLAB XP-650B 80+ BRONZE 650W ( 2 ANS GARANTIE )'),
(171, 'Barrette de RAM', 'TeamGroup VULCAN Z Gray 16Go (2x8Go) DDR4 3200MHz CL16'),
(171, 'Boîtier PC', 'XTRMLAB GHOST (Black)'),
(171, 'Carte Graphique', 'NVIDIA GeForce RTX 5060 Ti 8GB GDDR7'),
(171, 'Carte mère', 'MSI A520M-A PRO'),
(171, 'Garantie', '12 Mois'),
(171, 'Processeur', 'AMD Ryzen 5 5500 (3.6 GHz / 4.2 GHz)'),
(171, 'Refroidisseur', 'Refroidisseur AMD'),
(171, 'SSD', 'Lexar NM620 M.2 PCIe NVMe 512GB'),
(172, 'Alimentation', 'XTRMLAB XP-650B 80+ BRONZE 650W ( 2 ANS GARANTIE )'),
(172, 'Barrette de RAM', 'TeamGroup VULCAN Z Gray 16Go (2x8Go) DDR4 3200MHz CL16'),
(172, 'Boîtier PC', 'XTRMLAB GHOST (Black)'),
(172, 'Carte Graphique', 'NVIDIA GeForce RTX 5060 Ti 8GB GDDR7'),
(172, 'Carte mère', 'MSI A520M-A PRO'),
(172, 'Garantie', '12 Mois'),
(172, 'Processeur', 'AMD Ryzen 5 3600 (Hexa-Core 3.6 GHz / 4.2 GHz Turbo - 12 Threads - 32 Mo Cache L3)'),
(172, 'Refroidisseur', 'Refroidisseur AMD'),
(172, 'SSD', 'Lexar NM620 M.2 PCIe NVMe 512GB'),
(173, 'Alimentation', 'XTRMLAB XP-750B 80+ BRONZE 750W'),
(173, 'Barrette de RAM', 'TeamGroup VULCAN Z Gray 16Go (2x8Go) DDR4 3200MHz CL16'),
(173, 'Boîtier PC', 'XTRMLAB GHOST (Black)'),
(173, 'Carte Graphique', 'NVIDIA GeForce RTX 5060 Ti 8GB GDDR7'),
(173, 'Carte mère', 'MSI B550M PRO-VDH'),
(173, 'Garantie', '12 Mois'),
(173, 'Processeur', 'AMD Ryzen 5 5600 (3.5 GHz / 4.4 GHz)'),
(173, 'Refroidisseur', 'Refroidisseur AMD'),
(173, 'SSD', 'Lexar NM620 M.2 PCIe NVMe 512GB'),
(174, 'Alimentation', 'Corsair RM1000e (2025)'),
(174, 'Barrette de RAM', 'Kingston FURY Beast 64 Go (2 x 32 Go) DDR5 6000 MHz CL36'),
(174, 'Boîtier PC', 'NZXT H7 Flow RGB Black (2024)'),
(174, 'Carte Graphique', 'NVIDIA GeForce RTX 5090 32GB GDDR7'),
(174, 'Carte mère', 'ASUS PRIME X870-P'),
(174, 'Garantie', '12 Mois'),
(174, 'Processeur', 'AMD Ryzen 9 9950X3D (4.3 GHz / 5.7 GHz)'),
(174, 'Refroidisseur', 'NZXT Kraken Elite 360 V2 RGB Black'),
(174, 'SSD', 'Lexar NM620 M.2 PCIe NVMe 1TB'),
(175, 'Alimentation', 'Corsair RM1000e (2025)'),
(175, 'Barrette de RAM', 'Kingston FURY Beast 64 Go (2 x 32 Go) DDR5 6000 MHz CL36'),
(175, 'Boîtier PC', 'NZXT H7 Flow RGB Black (2024)'),
(175, 'Carte Graphique', 'NVIDIA GeForce RTX 5090 32GB GDDR7'),
(175, 'Carte mère', 'ASUS PRIME X870-P'),
(175, 'Garantie', '12 Mois'),
(175, 'Processeur', 'AMD Ryzen 9 9950X (4.3 GHz / 5.7 GHz) Tray'),
(175, 'Refroidisseur', 'NZXT Kraken Elite 360 V2 RGB Black'),
(175, 'SSD', 'Lexar NM620 M.2 PCIe NVMe 1TB'),
(176, 'Alimentation', 'Corsair RM1000e (2025)'),
(176, 'Barrette de RAM', 'Kingston FURY Beast 64 Go (2 x 32 Go) DDR5 6000 MHz CL36'),
(176, 'Boîtier PC', 'NZXT H7 Flow RGB Black (2024)'),
(176, 'Carte Graphique', 'NVIDIA GeForce RTX 5090 32GB GDDR7'),
(176, 'Carte mère', 'ASUS PRIME X870-P'),
(176, 'Garantie', '12 Mois'),
(176, 'Processeur', 'AMD Ryzen 7 9800X3D (4.7 GHz / 5.2 GHz)'),
(176, 'Refroidisseur', 'NZXT Kraken Elite 360 V2 RGB Black'),
(176, 'SSD', 'Lexar NM620 M.2 PCIe NVMe 1TB'),
(178, 'Capacité RAM', '16 Go DDR4'),
(178, 'Ecran', '13,3\" (1920x1080)'),
(178, 'Marque', 'Hewlett-Packard'),
(178, 'Norme du clavier', 'QWERTY'),
(178, 'SSD', '256 Go'),
(178, 'Système d\'exploitation', 'Windows 10 Pro 64Bits'),
(178, 'Type de processeur', 'Intel Core i5-10310U'),
(179, 'Capacité RAM', '8Go DDR4'),
(179, 'Clavier', 'AZERTY'),
(179, 'Ecran', '13,3\"pouces FHD (1920*1080)'),
(179, 'Garantie', '3 Mois'),
(179, 'Marque', 'Hewlett-Packard'),
(179, 'SSD', '256 Go'),
(179, 'Système d\'exploitation', 'Windows 10 pro'),
(179, 'Type de Processeur', 'Intel Core i5-8265U'),
(180, 'Capacité de disque', '1 To'),
(180, 'Capacité RAM', '16 Go DDR5'),
(180, 'Ecran', '14 pouces OLED WUXGA (1920 x 1200), 400 nits de luminosité, HDR 600 nits'),
(180, 'Garantie', '12 Mois'),
(180, 'Système d\'exploitation', 'Windows 11 64 Bits'),
(180, 'Type de Processeur', 'AMD Ryzen 7 8840HS (3,3 GHz, Turbo jusqu\'à 5,1 GHz, 8 cœurs, 16 threads)'),
(181, 'Capacité RAM', '16 Go DDR5'),
(181, 'Chipset graphique', 'NVIDIA GeForce RTX 2050 4GB'),
(181, 'Clavier', 'AZERTY'),
(181, 'Ecran', '15,6 \" FHD (1920x1080)'),
(181, 'Garantie', '12 Mois'),
(181, 'Marque', 'Lenovo'),
(181, 'SSD', '512GB NVMe PCIe'),
(181, 'Système d\'exploitation', 'FreeDOS'),
(181, 'Type de Processeur', 'Type de Processeur'),
(183, 'Cache total', '8MB L2 + 96MB L3'),
(183, 'Fréquence CPU', '4.2 Ghz'),
(183, 'Fréquence en mode Turbo', '5.0 Ghz'),
(183, 'Gamme processeur', 'AMD Ryzen 7'),
(183, 'Garantie', '12 Mois'),
(183, 'Marque', 'AMD'),
(183, 'Nombre de coeurs', '8'),
(183, 'Nombre de threads', '16'),
(183, 'Socket', 'AMD AM5'),
(184, 'Cache total', '8MB L2 + 96MB L3'),
(184, 'Fréquence CPU', '4.7 Ghz'),
(184, 'Fréquence en mode Turbo', '5.2'),
(184, 'Gamme processeur', 'AMD Ryzen 7'),
(184, 'Garantie', '12 Mois'),
(184, 'Marque', 'AMD'),
(184, 'Nombre de coeurs', '8'),
(184, 'Nombre de threads', '16'),
(184, 'Socket', 'AMD AM5'),
(187, 'Chipset', 'AMD B650'),
(187, 'Format', 'Micro ATX'),
(187, 'Garantie', '12 Mois'),
(187, 'Marque', 'MSI'),
(187, 'Nombre de slots RAM', '2'),
(187, 'Socket', 'AMD AM5'),
(187, 'Type de mémoire', 'DDR5'),
(188, 'Chipset', 'Intel Z790 Express'),
(188, 'Format', 'ATX'),
(188, 'Garantie', '12 Mois'),
(188, 'Marque', 'Gigabyte'),
(188, 'Nombre de slots RAM', '4'),
(188, 'Socket', 'Intel 1700'),
(188, 'Type de mémoire', 'DDR5'),
(189, 'Bruit max.', '21 dB'),
(189, 'Débit max.', '49.5 CFM'),
(189, 'Diamètre', '120 mm'),
(189, 'Garantie', '12 Mois'),
(189, 'Vitesse max.', '1100 RPM'),
(190, 'Dimensions du radiateur', '401 x 27 x 120 mm'),
(190, 'Garantie', '12 Mois'),
(190, 'Marque', 'NZXT'),
(190, 'Matériau', 'Aluminium / Cuivre / Plastique'),
(190, 'Support du processeur', 'LGA 1851/1700 /1200/115X/AM5/AM4'),
(190, 'Ventilateur(s)', '3 x 120 mm'),
(191, 'Fréquence mémoire', '30000 Mhz'),
(191, 'Garantie', '12 Mois'),
(191, 'Marque', 'MSI'),
(191, 'Marque du chipset', 'Nvidia'),
(191, 'Puce graphique', 'NVIDIA GeForce RTX 5080 16GB GDDR7'),
(192, 'Fréquence mémoire', '28000 MHz'),
(192, 'Garantie', '12 Mois'),
(192, 'Marque', 'MSI'),
(192, 'Marque du chipset', 'Nvidia'),
(192, 'Puce graphique', 'NVIDIA GeForce RTX 5060 Ti 8GB GDDR7'),
(192, 'Sorties vidéo', '1 X HDMI Femelle / 3 X DisplayPort Femelle');

-- --------------------------------------------------------

--
-- Table structure for table `sessions`
--

CREATE TABLE `sessions` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED DEFAULT NULL,
  `payload` text NOT NULL,
  `last_activity` int(11) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `shopping_cart`
--

CREATE TABLE `shopping_cart` (
  `cartItem_id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `product_id` bigint(20) UNSIGNED NOT NULL,
  `quantity` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `shopping_cart`
--

INSERT INTO `shopping_cart` (`cartItem_id`, `user_id`, `product_id`, `quantity`) VALUES
(67, 1, 32, 5);

-- --------------------------------------------------------

--
-- Table structure for table `subcategories`
--

CREATE TABLE `subcategories` (
  `subcategory_id` bigint(20) UNSIGNED NOT NULL,
  `subcategory_name` varchar(255) NOT NULL,
  `subcategory_description` text DEFAULT NULL,
  `subcategory_display_order` int(11) DEFAULT NULL,
  `category_id` bigint(20) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `subcategories`
--

INSERT INTO `subcategories` (`subcategory_id`, `subcategory_name`, `subcategory_description`, `subcategory_display_order`, `category_id`) VALUES
(0, 'Unspecified', 'Warning : This column must not be deleted or changed. ', 0, 0),
(2, 'PC Gamer Standard', 'Bienvenue chez UltraPC.ma, votre destination ultime pour les passionnés de PC gamer au Maroc. Nous sommes fiers d\'être votre partenaire de confiance pour des expériences de jeu inégalées, avec notre gamme exclusive de produits et services conçus pour répondre à tous vos besoins de gaming.\n\nChez UltraPC.ma, nous comprenons que chaque joueur est unique, c\'est pourquoi nous proposons une large sélection de PC gamer haut de gamme, entièrement personnalisables pour vous offrir le setupgame parfaitement adapté à vos préférences et à votre style de jeu. Que vous soyez un joueur occasionnel ou un professionnel exigeant, notre équipe dévouée est là pour vous aider à trouver le PC gamer idéal qui vous permettra de repousser les limites du possible.\n\nAvec notre engagement envers l\'excellence et l\'innovation, UltraPC.ma se distingue comme le leader du marché du PC gamer au Maroc. Grâce à notre partenariat exclusif avec NextLevelPC, nous vous offrons une expérience de gaming de niveau supérieur, avec des performances de pointe et une qualité inégalée. Avec notre service NextLevelPC, vous pouvez transformer votre passion pour le gaming en une expérience immersive et captivante, en bénéficiant de configurations sur mesure, de conseils d\'experts et d\'un support client exceptionnel.', 1, 2),
(3, 'Gamer Laptop', 'Gamer LaptopGamer LaptopGamer LaptopGamer Laptop', 2, 3),
(21, 'PC Gamer Advanced', 'Bienvenue sur UltraPC.ma, votre destination de référence pour les amateurs de PC gamer au Maroc. Notre mission est de vous fournir une expérience de jeu incomparable grâce à notre vaste gamme de produits et services haut de gamme, adaptés à tous les besoins et budgets.\n\nChez UltraPC.ma, nous comprenons que chaque joueur est unique. C\'est pourquoi nous offrons une variété de PC gamer entièrement personnalisables, conçus pour créer le setupgame parfaitement adapté à votre style de jeu et à vos préférences individuelles. Que vous soyez un joueur occasionnel ou un professionnel chevronné, notre équipe experte est là pour vous guider dans le choix du PC gamer idéal pour vous.\n\nGrâce à notre partenariat exclusif avec NextLevelPC, nous vous garantissons une expérience de gaming de premier ordre. Avec notre service NextLevelPC, bénéficiez de configurations sur mesure, de conseils d\'experts et d\'un support client exceptionnel pour vous propulser vers de nouveaux sommets dans le monde du gaming.', 2, 2),
(24, 'PC Gamer Ultra', 'PC Gamer puissant, PC Gamer extrême, PC Gamer Hardcore… Voilà 3 termes qui définissent parfaitement ces ordinateurs ultra-performants et dédiés aux jeux vidéo. Les plus exigeants trouveront ordinateur à leur pied grâce à des configurations conçues avec minutie pour donner ce qui se fait de meilleur actuellement. Un design soigné, des fonctionnalités à la pelle (tri-écran, 3D, Hautes résolutions, graphismes Ultra...), et surtout des performances du tonnerre permettront à ces PC Gamers extrêmes de vous éblouir en toutes circonstances. Bref, les plus accros du Gaming, les amoureux de belles images et les amateurs de FPS élevés seront ravis !\nRepoussez vos limites avec nos PC Gamer extrême\n\nDominez vos parties multi-joueurs et explorez les moindres recoins de vos univers vidéoludiques grâce aux performances hors du commun de nos PC Gamer extrême. Aucuns ralentissements, une fluidité de jeu sans pareille, nos PC Gamer Extrême vous permettront de surpasser vos adversaires en analysant plus rapidement votre environnement grâce à des graphismes gonflés au maximum. Equipés des composants à la pointe de la technologie (cartes graphiques, processeurs, cartes mères,…), nos PC Gamer extrêmes de dernière génération vous garantissent une exploitation totale du potentiel de n’importe quel jeu vidéo. Oubliez les configurations recommandées ou classiques, et découvrez un tout nouveau monde du jeu vidéo !', 3, 2),
(25, 'Motherboards', '', 1, 4),
(26, 'Coolers', '', 2, 4),
(27, 'Graphics Cards', '', 3, 4),
(28, 'Memory', '', 4, 4),
(29, 'HDDs & SSDs', '', 5, 4),
(30, 'Power Supply Units', '', 6, 4),
(31, 'Cases', '', 7, 4),
(32, 'Monitors', '', 1, 5),
(33, 'Keybords', '', 2, 5),
(34, 'Mouses', '', 3, 5),
(37, 'Headphones', '', 4, 5),
(41, 'CPU', '', 1, 4),
(67, 'Multi-Use Laptop', '', 0, 3);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `user_username` varchar(255) NOT NULL,
  `user_firstname` varchar(255) NOT NULL,
  `user_lastname` varchar(255) NOT NULL,
  `user_phone` varchar(255) DEFAULT NULL,
  `user_country` varchar(255) DEFAULT NULL,
  `user_address` text DEFAULT NULL,
  `user_email` varchar(255) NOT NULL,
  `user_password` varchar(255) NOT NULL,
  `user_role` enum('Owner','Admin','Client') NOT NULL DEFAULT 'Client',
  `user_account_status` enum('Locked','Unlocked') NOT NULL DEFAULT 'Unlocked',
  `user_registration_date` timestamp NOT NULL DEFAULT current_timestamp(),
  `user_last_logged_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`user_id`, `user_username`, `user_firstname`, `user_lastname`, `user_phone`, `user_country`, `user_address`, `user_email`, `user_password`, `user_role`, `user_account_status`, `user_registration_date`, `user_last_logged_at`) VALUES
(1, 'yem0417', 'Youssef', 'EL MOUMEN', '06365234321', 'Morocco', 'Casa', 'dinactiprefected@gmail.com', '$2y$12$mEY6uLErTE5HKs1OWBh7A.KheOURrBC5m3L9q/3/P8X2QbykPmN0m', 'Owner', 'Unlocked', '2024-12-26 00:20:34', '2025-05-26 14:24:20'),
(2, 'Admin', 'Admin', 'Aura', 'The G', 'Morocco', 'TestingTestingTestingTesting', 'ee@gmail.com', '$2y$12$mTo3vuX6SBvB0HZDVyrps.Og2JycZtOjR4RlXS87h6RB9U3AEFdDu', 'Admin', 'Unlocked', '2024-12-26 01:27:47', '2025-05-23 00:11:15'),
(111, 'alfred', 'Alfred', 'Cezar', NULL, 'Bangladesh', NULL, 'lioguatti@gmail.com', '$2y$12$lW8tbQbsw6YVduxUvCf7tucO69f2hwjNQ9xZd528/b/9uXxZ7P9B.', 'Client', 'Unlocked', '2025-05-21 20:49:05', '2025-05-21 21:00:41'),
(113, 'Sabbour', 'Rabia', 'Sabbour', NULL, 'Morocco', NULL, 'rabia.sabour@gmail.com', '$2y$12$PBFlk/mYig66ZgCkrcj6U.49x5diRjgOkNINjmogmG0r0F5d8np/y', 'Client', 'Unlocked', '2025-05-22 17:48:04', '2025-05-22 17:48:04'),
(115, 'soumaya', 'soumaya', 'ELBRINE', '0702342612', 'Morocco', 'CENTRE VILLE', 'soumiaelbrine@gmail.com', '$2y$12$T.Mw2pIflX8N6XL0kEfcdu3NzaClEuWO4KX74ZO0OsYKICMCr0pEq', 'Client', 'Unlocked', '2025-05-26 11:46:16', '2025-05-26 11:46:16');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `cache`
--
ALTER TABLE `cache`
  ADD PRIMARY KEY (`key`);

--
-- Indexes for table `cache_locks`
--
ALTER TABLE `cache_locks`
  ADD PRIMARY KEY (`key`);

--
-- Indexes for table `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`category_id`),
  ADD UNIQUE KEY `name` (`category_name`);

--
-- Indexes for table `failed_jobs`
--
ALTER TABLE `failed_jobs`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`);

--
-- Indexes for table `global_settings`
--
ALTER TABLE `global_settings`
  ADD UNIQUE KEY `key` (`key`);

--
-- Indexes for table `jobs`
--
ALTER TABLE `jobs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `jobs_queue_index` (`queue`);

--
-- Indexes for table `job_batches`
--
ALTER TABLE `job_batches`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `migrations`
--
ALTER TABLE `migrations`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`order_id`),
  ADD KEY `orders_user_id_foreign` (`user_id`);

--
-- Indexes for table `order_items`
--
ALTER TABLE `order_items`
  ADD PRIMARY KEY (`orderItem_id`),
  ADD KEY `order_items_order_id_foreign` (`order_id`),
  ADD KEY `order_items_product_id_foreign` (`product_id`);

--
-- Indexes for table `password_resets`
--
ALTER TABLE `password_resets`
  ADD KEY `password_resets_email_index` (`email`);

--
-- Indexes for table `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `personal_access_tokens_token_unique` (`token`),
  ADD KEY `personal_access_tokens_tokenable_type_tokenable_id_index` (`tokenable_type`,`tokenable_id`);

--
-- Indexes for table `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`product_id`),
  ADD KEY `fk_subcategory_id` (`subcategory_id`),
  ADD KEY `fk_category_id` (`category_id`);

--
-- Indexes for table `product_specs`
--
ALTER TABLE `product_specs`
  ADD PRIMARY KEY (`product_id`,`spec_name`);

--
-- Indexes for table `sessions`
--
ALTER TABLE `sessions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `sessions_user_id_foreign` (`user_id`);

--
-- Indexes for table `shopping_cart`
--
ALTER TABLE `shopping_cart`
  ADD PRIMARY KEY (`cartItem_id`),
  ADD KEY `shopping_cart_user_id_foreign` (`user_id`),
  ADD KEY `shopping_cart_product_id_foreign` (`product_id`);

--
-- Indexes for table `subcategories`
--
ALTER TABLE `subcategories`
  ADD PRIMARY KEY (`subcategory_id`),
  ADD UNIQUE KEY `name` (`subcategory_name`),
  ADD KEY `subcategories_category_id_foreign` (`category_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`user_id`),
  ADD UNIQUE KEY `users_user_username_unique` (`user_username`),
  ADD UNIQUE KEY `users_user_email_unique` (`user_email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `categories`
--
ALTER TABLE `categories`
  MODIFY `category_id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=89;

--
-- AUTO_INCREMENT for table `failed_jobs`
--
ALTER TABLE `failed_jobs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `jobs`
--
ALTER TABLE `jobs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `migrations`
--
ALTER TABLE `migrations`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=27;

--
-- AUTO_INCREMENT for table `orders`
--
ALTER TABLE `orders`
  MODIFY `order_id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `order_items`
--
ALTER TABLE `order_items`
  MODIFY `orderItem_id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=249;

--
-- AUTO_INCREMENT for table `products`
--
ALTER TABLE `products`
  MODIFY `product_id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=194;

--
-- AUTO_INCREMENT for table `sessions`
--
ALTER TABLE `sessions`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `shopping_cart`
--
ALTER TABLE `shopping_cart`
  MODIFY `cartItem_id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=75;

--
-- AUTO_INCREMENT for table `subcategories`
--
ALTER TABLE `subcategories`
  MODIFY `subcategory_id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=70;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `user_id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=116;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `orders`
--
ALTER TABLE `orders`
  ADD CONSTRAINT `orders_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE;

--
-- Constraints for table `order_items`
--
ALTER TABLE `order_items`
  ADD CONSTRAINT `order_items_order_id_foreign` FOREIGN KEY (`order_id`) REFERENCES `orders` (`order_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `order_items_product_id_foreign` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`);

--
-- Constraints for table `products`
--
ALTER TABLE `products`
  ADD CONSTRAINT `fk_category_id` FOREIGN KEY (`category_id`) REFERENCES `categories` (`category_id`),
  ADD CONSTRAINT `fk_subcategory_id` FOREIGN KEY (`subcategory_id`) REFERENCES `subcategories` (`subcategory_id`);

--
-- Constraints for table `product_specs`
--
ALTER TABLE `product_specs`
  ADD CONSTRAINT `product_specs_product_id_foreign` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`) ON DELETE CASCADE;

--
-- Constraints for table `sessions`
--
ALTER TABLE `sessions`
  ADD CONSTRAINT `sessions_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE SET NULL;

--
-- Constraints for table `shopping_cart`
--
ALTER TABLE `shopping_cart`
  ADD CONSTRAINT `shopping_cart_product_id_foreign` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `shopping_cart_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE;

--
-- Constraints for table `subcategories`
--
ALTER TABLE `subcategories`
  ADD CONSTRAINT `subcategories_category_id_foreign` FOREIGN KEY (`category_id`) REFERENCES `categories` (`category_id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
