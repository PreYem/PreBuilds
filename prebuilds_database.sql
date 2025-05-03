-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: May 03, 2025 at 02:42 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.3.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `prebuilds`
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
(2, 'PC Gamer', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit.\nLorlore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit.aaaaaaam ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit.aaaaaaam ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit.aaaaaaam ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit.aaaaaaam ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit.aaaaaaam ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit.aaaaaaam ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit.aaaaaaaazzzzzzzzzzzzzzzzzLorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim venia', 1),
(3, 'Laptops', 'LaptopLaptopLaptopLaptopLaptopLaptopLaptopLaptopeee', 2),
(4, 'Components', '', 3),
(5, 'Devices', '', 4),
(6, 'Chairs & Desks', '', 5),
(7, 'Network', '', 6),
(8, 'Image & Sound', 'aeaeaeae', 7),
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
  `new_product_duration` int(11) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `global_settings`
--

INSERT INTO `global_settings` (`new_product_duration`) VALUES
(1441);

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
(20, '2025_03_21_231859_create_personal_access_tokens_table', 10);

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
(81, 'App\\Models\\Users', 2, 'prebuilds_auth-token', '7826f41eed0fdabd2061eeff07d182125573af38d9e00a7d92a58ae79905239b', '[\"Admin\",2]', '2025-04-16 20:18:41', NULL, '2025-04-16 20:12:51', '2025-04-16 20:18:41');

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
(32, 'PC Gamer UltraPC Core i7 12700K/512zGB SSD/16GB/RX7600-', 2, 2, 'Voici le PC Gaming parfait : le PC Gamer UPC-I7-12700K-Rx7600. Configuré pour offrir les meilleurs performances dans les jeux les plus récents, il vous accompagnera quel que soit vos envies. Avec un processeur 8-Core Intel Core i7, 16 Go de mémoire vive DDR4 et un disque SSD NVMe haute capacité 512 Go pour le stockage, le PC Gamer UPC-I7-12700K-Rx7600 ne laisse rien au hasard et vous permettra de jouer à vos Hits PC favoris dans de très bonnes conditions de résolution et de frame rate.', 7000.00, 10000.00, 0, 'Visible', '2025-01-07 02:39:39', 'images/PC-Gamer-UltraPC-Core-i7-12700K-512zGB-SSD-16GB-RX7600_6787ba7008857.png', 0.00, 0),
(79, 'PC Gamer UltraPC Ryzen 5 5500 /16GB/512GB SSD/RX7600', 2, 2, 'PC Gamer UltraPC Ryzen 5 5500 /16GB/512GB SSD/RX7600', 5000.00, 7499.00, 2, 'Visible', '2025-01-18 22:26:01', 'images/PC-Gamer-UltraPC-Ryzen-5-5500--16GB-512GB-SSD-RX7600_678c2a7998e98.png', 6599.00, 0),
(81, 'MSI THIN B13VE-2473XMA i7 13620H/16GB DDR4/512GB/RTX4050 6GB 15.6\" 144Hz', 3, 3, 'Profitez d\'excellentes performances avec le PC portable Gamer MSI THIN B13VE ! Cet ordinateur portable MSI offre un parfait confort de jeu grâce à ses composants performants, son écran de 15.6\" Full HD 144 Hz, son clavier gamer rétroéclairé et son système audio performant. Le PC portable MSI THIN B13VE-2473XMA propose d\'excellentes performances grâce à son processeur Intel Core i7-13620H, ses 16 Go de mémoire DDR4, sa puce graphique NVIDIA GeForce RTX 4050 et son SSD M.2 PCIe de 512 Go.', 10000.00, 13999.00, 0, 'Visible', '2025-01-18 22:36:37', 'images/MSI-THIN-B13VE-2473XMA-i7-13620H-16GB-DDR4-512GB-RTX4050-6GB-15-6--144Hz_678c2cf53b5bc.jpg', 12999.00, 0),
(82, 'AMD Ryzen 5 5600 (3.5 GHz / 4.4 GHz) Tray', 4, 41, 'Le processeur AMD Ryzen 5 5600 est taillé pour le jeu vidéo : 6 Cores, 12 Threads et GameCache 35 Mo. Sans parler des fréquences natives et boost qui atteignent des sommets pour vous permettre de profiter de vos jeux préférés dans les meilleures conditions. Associez lui une carte graphique hautes performances et vous pourrez jouer de manière optimale. Tout simplement. \r\n\r\nAMD version Tray : Le processeur est livré dans neuf sans emballage et sans refroidisseur', 600.00, 1499.00, 10, 'Visible', '2025-01-18 22:43:04', 'images/AMD-Ryzen-5-5600--3-5-GHz---4-4-GHz--Tray_678c2e78eb4a5.jpg', 1199.00, 0),
(83, 'Gigabyte B760 DS3H AXe', 4, 25, 'La Gigabyte B760 DS3H AX est une carte mère fiable et performante, conçue pour les utilisateurs à la recherche d’une solution abordable pour les processeurs Intel de 12e et 13e génération sur socket LGA 1700. Elle dispose du chipset B760 et offre des performances solides pour les jeux et les applications multitâches. Son Wi-Fi 6 assure une connectivité sans fil rapide, tandis que ses ports USB 3.2 et Ethernet 2.5GbE garantissent des transferts de données rapides. Grâce à son système de refroidissement efficace et à son design compact, elle convient parfaitement aux configurations bureautiques et multimédia. Une solution économique, avec des caractéristiques modernes pour une utilisation polyvalente.', 1400.00, 1799.00, 10, 'Visible', '2025-01-18 22:45:06', 'images/Gigabyte-B760-DS3H-AX_678c2ef27d6bc.jpg', 0.00, 0),
(84, 'Cooler Master MasterLiquid 240L Core ARGB', 4, 26, 'Cooler Master s\'est appuyé sur la série classique MasterLiquid L pour présenter une version repensée et améliorée : Le Cooler Master MasterLiquid 240L Core ARGB. Doté de nouveaux éléments de conception qui apportent un style minimaliste classique à la série, le MasterLiquid 240L Core ARGB se dote d\'une base en cuivre repensée qui cible les points de chaleur avec précision, ainsi qu\'un débit et une pression d\'eau accrus pour des performances de refroidissement améliorées.', 400.00, 899.00, 10, 'Visible', '2025-01-18 22:47:27', 'images/Cooler-Master-MasterLiquid-240L-Core-ARGB_678c2f7f02b7d.jpg', 699.00, 0),
(85, 'INNO3D GeForce RTX 3060 TWIN X2 12GB GDDR6', 4, 27, 'Avec le modèle GeForce RTX 3060, NVIDIA rend encore plus accessibles les performances de haute volée proposées par les cartes graphiques Ampère. Des graphismes sublimés, une fluidité remarquable et un réalisme incroyable vous permettront de profiter au mieux des jeux PC les plus récents. Il ne vous reste plus qu\'à plonger au cœur de l\'action et à vous immerger totalement dans la partie. La carte graphique INNO3D GeForce RTX 3060 TWIN X2 12GB GDDR6 embarque 12 Go de mémoire vidéo de nouvelle génération GDDR6. Ce modèle bénéficie de fréquences de fonctionnement élevées et d\'un système de refroidissement amélioré, gage de fiabilité et de performances à long terme.', 1500.00, 3499.00, 10, 'Visible', '2025-01-18 22:50:25', 'images/INNO3D-GeForce-RTX-3060-TWIN-X2-12GB-GDDR6_678c303107cbc.jpg', 1799.00, 0),
(86, 'G.Skill Trident Z5 Neo RGB Series 32 Go (2x 16 Go) DDR5 6000 MHz CL32', 4, 28, 'Conçue pour la génération de processeurs AMD Ryzen AM5, la gamme de mémoires G.Skill Trident Z5 Neo RGB Series apportera performance et style à votre configuration ! Idéale pour les PC Gamer haut de gamme, cette gamme de mémoire est compatible AMD EXPO, pour un overclocking facile.\r\n\r\nAvec des éléments de design Hypercar et un radiateur en aluminium brossé, avec usinage CNC et coloris noir mat, la mémoire RAM Trident Z5 Neo RGB Series affiche un look Gamer élégant. Elle bénéficie aussi d\'une barre lumineuse RGB intégrée au radiateur. Le mode arc-en-ciel est par défaut, mais vous pourrez télécharger le logiciel dédié afin de découvrir les effets et les couleurs pour personnaliser vos barrettes. Aucune alimentation supplémentaire ne sera nécessaire.', 1200.00, 1599.00, 10, 'Visible', '2025-01-18 22:52:30', 'images/G-Skill-Trident-Z5-Neo-RGB-Series-32-Go--2x-16-Go--DDR5-6000-MHz-CL32_678c30ae40e5f.jpg', 0.00, 0),
(87, 'Samsung SSD 990 PRO M.2 PCIe NVMe 4TB', 4, 29, 'Le disque SSD 990 PRO 4 To de Samsung permet à votre machine de changer de dimension. Ce SSD bénéficie de vitesses stratosphériques et d\'une endurance très élevée. Le Samsung 990 PRO au format M.2 2280 s\'appuie sur l\'interface PCI-E 4.0 x4 et la technologie NVMe 2.0. Il embarque des puces mémoire Samsung V-NAND 3-bit MLC et 1 Go de mémoire cache LPDDR4.', 3000.00, 4490.00, 10, 'Visible', '2025-01-18 22:54:12', 'images/Samsung-SSD-990-PRO-M-2-PCIe-NVMe-4TB_678c311456739.jpg', 3490.00, 0),
(88, 'Cooler Master MWE Gold 1050 Full Modular V2 ATX 3.0 80PLUS GOLD 1050W', 4, 30, 'Disposez d\'une alimentation performante et silencieuse avec le modèle Cooler Master MWE Gold 1050 Full Modular V2 ATX 3.0. Dotée de la certification 80PLUS Gold, cette alimentation dispose d\'une efficacité pouvant aller jusqu\'à 92% et d\'un fonctionnement silencieux grâce à son ventilateur 140 mm. Très simple d\'utilisation, elle comblera tous vos besoins et apportera une puissance idéale à votre équipement. Profitez d\'une connectivité complète, d\'un MTBF dépassant les 100 000 heures et de ses multiples protections.\r\n\r\nLa MWE Gold 1050 V2 100% modulaire de Cooler Master propose une connectique complète pour les configurations gaming, elle prendra en charge les cartes graphiques les plus véloces véloces avec ses 3 connecteurs PCI-Express et  12VHPWR et vous permettra de multiplier les unités de stockage grâce à 12 prises SATA.', 1500.00, 2090.00, 10, 'Visible', '2025-01-18 22:56:46', 'images/Cooler-Master-MWE-Gold-1050-Full-Modular-V2-ATX-3-0-80PLUS-GOLD-1050W_678c31ae303be.jpg', 0.00, 0),
(89, 'MSI MAG FORGE 120A AIRFLOW', 4, 31, 'Le boitier moyen tour MSI MAG FORGE 120A AIRFLOW propose un design épuré avec une façade en mesh pour un flux d\'air optimisé et une paroi latérale en verre trempé pour une vue de choix sur votre configuration et les LEDs FRGB issues des 6 ventilateurs déjà intégrés au boitier. L\'espace intérieur généreux permet d\'installer les composants les plus imposants comme une carte graphique jusqu\'à 330 mm de longueur, un watercooling AiO 240 mm pour une configuration gaming de pointe.', 300.00, 699.00, 10, 'Visible', '2025-01-18 23:00:15', 'images/MSI-MAG-FORGE-120A-AIRFLOW_678c327f4bcdb.jpg', 599.00, 0),
(90, 'LG ULTRAGEAR 23.8″ 24GS60F-B IPS 180Hz 1ms', 5, 32, 'Gagnez en performance avec le moniteur LG UltraGear 24GS60F-B ! Avec sa dalle IPS de 23.8\" Full HD, entrez dans un univers gaming de haute volée ! Côté jeu, cet écran tient parfaitement la route avec un temps de réponse de 1 ms, une fréquence maximale de 180 Hz et les technologies FreeSync Premium et G-SYNC Compatible.', 900.00, 1749.00, 10, 'Visible', '2025-01-18 23:02:49', 'images/LG-ULTRAGEAR-23-8----24GS60F-B-IPS-180Hz-1ms_678c3319b3c49.jpg', 1499.00, 0),
(91, 'HyperX Alloy Core RGB', 5, 33, 'Prenez l\'avantage sur vos adversaires avec le clavier à membrane HyperX Alloy Core RGB et ressortez grand vainqueur de vos futurs affrontements. Ce modèle résistant et robuste intègre un rétro-éclairage RGB avec de nombreux effets pour accompagner idéalement vos sessions gaming. Prenez le contrôle de votre destinée et partez à la conquête des sommets !', 300.00, 699.00, 10, 'Visible', '2025-01-18 23:10:30', 'images/HyperX-Alloy-Core-RGB_678c34e6aa71a.jpg', 599.00, 0),
(94, 'Glorious Model O Regular RGB (Noir Mat)', 5, 34, 'Imaginée par une communauté de joueurs, la souris Glorious PC Gaming Race Model O vous offre performances et perfection. Conçue pour la vitesse, le contrôle et le confort, elle intègre un capteur optique Pixart PMW 3360 de 12000 dpi, 6 boutons, un design pour droitier et un rétroéclairage RGB personnalisable. Avec cette souris gamer, plongez au coeur de vos batailles.', 300.00, 599.00, 10, 'Visible', '2025-01-18 23:17:57', 'images/Glorious-Model-O-Regular-RGB--Noir-Mat-_678c36a55d84f.jpg', 0.00, 0),
(95, 'MSI Immerse GH20', 5, 37, 'Profitez de vos meilleurs jeux dans de bonnes conditions avec le casque-micro Immerse GH20 signé MSI. Derrière son look gaming assumé, vous entendrez vos ennemis avant qu\'ils ne vous voient grâce à un son limpide et détaillé via ses transducteurs néodyme 40 mm. De plus, grâce à son poids ultra léger de 245g, ce casque est confortable même durant les longues sessions.', 300.00, 449.00, 10, 'Visible', '2025-01-18 23:20:47', 'images/MSI-Immerse-GH20_678c374f3331d.jpg', 0.00, 0),
(96, 'SKILLDESK REDLINE', 6, NULL, 'Le bureau SKILLDESK REDLINE est pensé pour offrir une expérience optimale aux gamers et professionnels en quête de confort et de style. Son design moderne intègre des éléments pratiques qui facilitent l\'organisation et améliorent l\'expérience utilisateur. L\'éclairage RGB apporte une touche immersive, créant une ambiance personnalisable selon vos envies. Conçu pour maximiser l’espace et l’ergonomie, il s’adapte parfaitement à tout environnement de travail ou de jeu. SkillDesk, de la marque SkillChairs, allie fonctionnalité et élégance pour transformer votre setup au quotidien.\n\nCaractéristiques :\n\n    Accessoires pratiques : Porte-gobelet, crochet pour casque et boîte de gestion des câbles intégrés.\n    Tapis de souris pleine surface inclus : Dimensions 140 x 60 x 0,2 cm pour une couverture totale du bureau.\n    Éclairage RGB :\n        Mode 1 : Changement de 6 couleurs avec un mode lumineux éblouissant.\n        Mode 2 : Synchronisation spéciale avec le volume.\n    Dimensions du bureau : 140 x 60 x 75 cm, idéal pour un setup gaming ou professionnel spacieux.\n    Modèle de contrôle facile à utiliser pour ajuster l’éclairage et les fonctions du bureau.', 1500.00, 2490.00, 10, 'Visible', '2025-01-18 23:22:32', 'images/SKILLDESK-REDLINE_678c37b897757.jpg', 0.00, 0),
(97, 'SKILLCHAIRS SCV2 ECLIPSE', 6, NULL, 'Avec le SCV2 ECLIPSE, vous disposez d\'un confort toujours plus important. Le SCV2 ECLIPSE offre le meilleur confort de la gamme Core et est un mélange de design futuriste et de courbes douces. Et avec sa mousse durcie à froid, son design amélioré qui met l\'accent sur des couleurs vives et un réglage libre de l\'assise, le SCV2 ECLIPSE est idéal pour les personnes cherchant à passer énormément de temps devant un PC ou une console, le tout dans un confort indéniable.', 2000.00, 3290.00, 10, 'Visible', '2025-01-18 23:24:15', 'images/SKILLCHAIRS-SCV2-ECLIPSE_678c381fdc5bc.png', 0.00, 0),
(98, 'RUIJIE 1800M DUAL-BAND GIGABIT MESH WIFI-6 RG-EW1800GX PRO', 7, NULL, 'Le Ruijie 1800M Dual-Band Gigabit Mesh WiFi-6 RG-EW1800GX Pro est un routeur sans fil de nouvelle génération qui offre une connectivité WiFi ultra-rapide et fiable pour les entreprises et les particuliers. Avec une vitesse de transmission sans fil allant jusqu\'à 1800 Mbps et une technologie Mesh avancée, le RG-EW1800GX Pro est capable de fournir une couverture WiFi complète et uniforme dans toutes les pièces de la maison ou du bureau. Le routeur prend en charge les dernières normes WiFi-6 pour des performances optimales et une connectivité simultanée à de nombreux appareils. Avec une connectivité filaire supplémentaire via six ports Gigabit Ethernet, le RG-EW1800GX Pro est idéal pour les applications exigeantes telles que la diffusion en continu de vidéos 8K et la navigation sur le web à haut débit. Les avantages du RG-EW1800GX Pro incluent une sécurité accrue avec le support WPA3 et une gestion de réseau facile avec l\'application Ruijie Networks pour une configuration et une gestion simplifiées. Le routeur est compatible avec les fournisseurs d\'accès Internet les plus courants et est facile à installer pour une connectivité Internet rapide et fiable. En savoir plus sur le Ruijie 1800M Dual-Band Gigabit Mesh WiFi-6 RG-EW1800GX Pro pour une connectivité WiFi de nouvelle génération pour votre entreprise.', 500.00, 999.00, 10, 'Visible', '2025-01-18 23:26:38', 'images/RUIJIE-1800M-DUAL-BAND-GIGABIT-MESH-WIFI-6-RG-EW1800GX-PRO_678c38aed242a.png', 0.00, 0),
(99, 'Sony PlayStation 5 Slim', 45, NULL, 'La PlayStation 5 Slim révolutionne l\'expérience de jeu avec son disque SSD de 1 To, offrant des chargements ultrarapides et une immersion profonde grâce au retour haptique et aux gâchettes adaptatives. Avec un processeur AMD Ryzen Zen 2, un GPU AMD RDNA 2 de 10.3 TFLOPs et 16 Go de mémoire GDDR6, cette console offre des performances époustouflantes et des graphismes incroyables, notamment grâce à la technologie Ray Tracing pour des effets visuels ultra-réalistes. La manette DualSense offre une expérience de jeu tactile unique avec son retour tactile et ses effets de gâchette dynamiques, tandis que la console elle-même propose une rétrocompatibilité avec les jeux PlayStation 4, un support VR et la possibilité de mettre à niveau les jeux PS4 vers la version PS5. Avec des fonctionnalités avancées telles que la prise en charge du 8K, une résolution maximale de 8K et un framerate maximal de 4K/120fps, la PlayStation 5 Slim définit de nouveaux standards pour les consoles de jeu.', 4000.00, 11000.00, 2, 'Invisible', '2025-01-18 23:29:19', 'images/Sony-PlayStation-5-Slim_678c394fdde4e.jpg', 10000.00, 0);

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
(96, 'Couleur', 'Noir'),
(96, 'Dimensions (L x H x P)', '140*60*（72-117） cm'),
(96, 'Epaisseur plateau', '20 mm'),
(96, 'LED', 'Oui'),
(96, 'Marque', 'SKILLCHAIRS'),
(96, 'Matière du plateau', 'Plateau en fibre de carbone P2PB'),
(96, 'Passe câbles', 'Oui'),
(96, 'Tapis Surface', 'Oui'),
(96, 'Type de produit', 'Bureau'),
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
(99, 'Type de Processeur', 'AMD Ryzen de 3e génération (Zen 2, 8 cœurs/16 threads, 3,5 GHz, gravure en 7 nm)');

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
(22, 1, 79, 2),
(23, 1, 82, 1),
(24, 1, 90, 1),
(25, 1, 98, 2),
(26, 1, 99, 2),
(27, 1, 88, 1),
(28, 1, 97, 2),
(29, 1, 94, 1),
(30, 1, 32, 1);

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
(2, 'PC Gamer Standard', 'PC Gamer StandardPC Gamer StandardPC Gamer StandardPC Gamer StandardPC Gamer StandardPC Gamer StandardPC Gamer StandardPC Gamer Standard', 1, 2),
(3, 'Gamer Laptop', 'Gamer LaptopGamer LaptopGamer LaptopGamer Laptop', 2, 3),
(21, 'PC Gamer Advanced', '', 2, 2),
(24, 'PC Gamer Ultra', 'azsd', 3, 2),
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
(65, 'zaeae', '', 0, 3),
(66, 'aeee', 'ee', 0, 4);

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
(1, 'yem0417', 'Yem', 'EL MOUMEN', '0636523432', 'Morocco', 'BernoussiBernoussiBernoussiBernoussiBernoussiBernoussi', 'dinactiprefected@gmail.com', '$2y$12$RIL7Ghy6YUYwbvJ0esQ.FO6.O70eeGCiAJf/KQYngieLOcw4JWanK', 'Owner', 'Unlocked', '2024-12-26 00:20:34', '2025-04-16 20:12:21'),
(2, 'Admin', 'Admin', 'Aura', 'The G', 'Morocco', 'TestingTesting', 'ee@gmail.com', '$2y$12$mTo3vuX6SBvB0HZDVyrps.Og2JycZtOjR4RlXS87h6RB9U3AEFdDu', 'Admin', 'Unlocked', '2024-12-26 01:27:47', '2025-04-16 20:12:51'),
(3, 'Client', 'Client', 'yte', NULL, 'Antigua and Barbuda', NULL, 'dinacte@gmail.com', '$2y$12$ePrtVnoM4EJY6Tua3PgDB.IJgGLYQnovgyZelsZPsm2/uNlcaF93C', 'Client', 'Unlocked', '2025-01-18 22:52:21', '2025-03-22 15:09:30'),
(99, 'aeae', 'aeae', 'aeae', NULL, 'No Country Specified', 'aeae', 'dinactiprefeczzte@gmail.com', '$2y$12$WWJKy6QwDNuYdICKW4wGEeMCPfLTR6N.DnwjshcXZ77vSAIY9TNrC', 'Client', 'Unlocked', '2025-03-25 14:46:15', '2025-03-25 14:46:15'),
(100, 'aeaezz', 'aeaeae', 'aeaeae', NULL, 'No Country Specified', NULL, 'aeaeaeaeaeaeaea@gmail.com', '$2y$12$97wYXqx2jRZ8NRF9hid2PeunseYLT6sfAfD6bPHvVfF6FjpzHqYnm', 'Client', 'Unlocked', '2025-03-25 14:46:55', '2025-03-25 14:46:55'),
(101, 'aeaesz', 'aeaes', 'easdesss', NULL, 'Azerbaijan', NULL, 'aeaeaeaeaeazeaea@gmail.com', '$2y$12$cvspKiW.QZpQ8ra9yugfceeONQYAta0cVGgZOb6g/hJ.bPWHMRrBS', 'Client', 'Unlocked', '2025-03-25 14:56:55', '2025-03-25 14:56:55');

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
  ADD PRIMARY KEY (`new_product_duration`);

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
  MODIFY `category_id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=88;

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
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT for table `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=82;

--
-- AUTO_INCREMENT for table `products`
--
ALTER TABLE `products`
  MODIFY `product_id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=161;

--
-- AUTO_INCREMENT for table `sessions`
--
ALTER TABLE `sessions`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `shopping_cart`
--
ALTER TABLE `shopping_cart`
  MODIFY `cartItem_id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=31;

--
-- AUTO_INCREMENT for table `subcategories`
--
ALTER TABLE `subcategories`
  MODIFY `subcategory_id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=67;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `user_id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=102;

--
-- Constraints for dumped tables
--

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
