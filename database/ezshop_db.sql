-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Apr 29, 2026 at 08:40 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `ezshop_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `cart_items`
--

CREATE TABLE `cart_items` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `product_id` int(11) DEFAULT NULL,
  `size` varchar(10) DEFAULT NULL,
  `quantity` int(11) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- --------------------------------------------------------

--
-- Table structure for table `orders`
--

CREATE TABLE `orders` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `total_amount` decimal(10,2) NOT NULL,
  `status` enum('Pending','Confirmed','Shipped','Delivered','Cancelled') DEFAULT 'Pending',
  `payment_method` varchar(50) DEFAULT NULL,
  `shipping_address` text DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `orders`
--

INSERT INTO `orders` (`id`, `user_id`, `total_amount`, `status`, `payment_method`, `shipping_address`, `created_at`) VALUES
(1, 1, 1440.00, 'Confirmed', 'cod', 'Muhammad Talha, 7-8, Satmasjid Housing, Mohammadpur, Dhaka, Dhaka, s 1207, Bangladesh. Phone: 01863118395', '2026-04-24 17:44:58'),
(2, 1, 720.00, 'Delivered', 'stripe', 'Muhammad Talha, 7-8, Satmasjid Housing, Mohammadpur, Dhaka, Dhaka, - 1207, Bangladesh. Phone: 01863118395', '2026-04-24 17:54:22'),
(3, 2, 1540.00, 'Cancelled', 'cod', 'Muhammad Talha s, s, Dhaka, s 1207, Bangladesh. Phone: 01863118395', '2026-04-24 18:05:26'),
(4, 2, 340.00, 'Confirmed', 'cod', 'Muhammad Talha, 7-8, Satmasjid Housing, Mohammadpur, Dhaka, Dhaka, Dhaka 1207, Bangladesh. Phone: 01863118395', '2026-04-25 15:52:08'),
(6, 2, 920.00, 'Pending', 'cod', 'Muhammad Talha, 7-8, Satmasjid Housing, Dhaka, Mohammadpur 1207, Bangladesh. Phone: 01863118395', '2026-04-28 08:22:28'),
(7, 2, 620.00, 'Pending', 'cod', 'Muhammad Talha, 7-8, Satmasjid Housing, Mohammadpur, Dhaka, Dhaka, aa 1207, Bangladesh. Phone: 01863118395', '2026-04-28 13:03:12'),
(12, 2, 310.00, 'Pending', 'cod', 'Muhammad Talha, 7-8, Satmasjid Housing, Mohammadpur, Dhaka, Dhaka, sfsef 1207, Bangladesh. Phone: 01863118395', '2026-04-28 13:50:16'),
(13, 2, 210.00, 'Pending', 'cod', 'sadsad Talha, 7-8, Satmasjid Housing, Mohammadpur, Dhaka, Dhaka, sfsef 1207, Bangladesh. Phone: 01863118395', '2026-04-28 13:50:38'),
(15, 2, 120.00, 'Delivered', 'cod', 'Muhammad Talha, 7-8, Satmasjid Housing, Mohammadpur, Dhaka, Dhaka, xczs 1207, Bangladesh. Phone: 01863118395', '2026-04-28 14:42:05'),
(16, 2, 230.00, 'Pending', 'cod', 'Muhammad Talha, 7-8, Satmasjid Housing, Mohammadpur, Dhaka, Dhaka, dasdasd 1207, Bangladesh. Phone: 01863118395', '2026-04-28 14:49:07'),
(17, 2, 490.00, 'Pending', 'cod', 'Muhammad Talha, 7-8, Satmasjid Housing, Mohammadpur, Dhaka, Dhaka, s 1207, Bangladesh. Phone: 01863118395', '2026-04-28 16:53:02'),
(18, 1, 670.00, 'Pending', 'cod', 'Muhammad Talha, 7-8, Satmasjid Housing, Mohammadpur, Dhaka, Dhaka, dasdasd 1207, Bangladesh. Phone: 01863118395', '2026-04-28 19:13:09');

-- --------------------------------------------------------

--
-- Table structure for table `order_items`
--

CREATE TABLE `order_items` (
  `id` int(11) NOT NULL,
  `order_id` int(11) DEFAULT NULL,
  `product_id` int(11) DEFAULT NULL,
  `size` varchar(10) DEFAULT NULL,
  `quantity` int(11) NOT NULL,
  `price` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `order_items`
--

INSERT INTO `order_items` (`id`, `order_id`, `product_id`, `size`, `quantity`, `price`) VALUES
(1, 1, 3, 'L', 5, 220.00),
(2, 1, 4, 'S', 3, 110.00),
(3, 2, 7, 'XL', 2, 190.00),
(4, 2, 7, 'L', 1, 190.00),
(5, 2, 8, 'XL', 1, 140.00),
(6, 3, 2, 'M', 2, 200.00),
(7, 3, 2, 'XL', 3, 200.00),
(8, 3, 2, 'L', 1, 200.00),
(9, 3, 4, 'XXL', 2, 110.00),
(10, 3, 4, 'M', 1, 110.00),
(11, 4, 3, 'S', 1, 220.00),
(12, 4, 10, 'XL', 1, 110.00),
(15, 6, 2, 'M', 4, 200.00),
(16, 6, 10, 'S', 1, 110.00),
(17, 7, 55, 'S', 2, 200.00),
(18, 7, 55, 'M', 1, 200.00),
(19, 12, 12, 'S', 2, 150.00),
(20, 13, 2, 'M', 1, 200.00),
(21, 15, 4, 'S', 1, 110.00),
(22, 16, 31, 'S', 1, 220.00),
(23, 17, 38, 'S', 1, 280.00),
(24, 17, 2, 'L', 1, 200.00),
(25, 18, 3, 'S', 3, 220.00);

-- --------------------------------------------------------

--
-- Table structure for table `products`
--

CREATE TABLE `products` (
  `id` int(11) NOT NULL,
  `original_id` varchar(50) DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `price` decimal(10,2) NOT NULL,
  `category` varchar(100) DEFAULT NULL,
  `sub_category` varchar(100) DEFAULT NULL,
  `bestseller` tinyint(1) DEFAULT 0,
  `product_status` enum('active','inactive','out_of_stock') NOT NULL DEFAULT 'active',
  `created_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `products`
--

INSERT INTO `products` (`id`, `original_id`, `name`, `description`, `price`, `category`, `sub_category`, `bestseller`, `product_status`, `created_at`) VALUES
(1, 'aaaaa', 'Women Round Neck Cotton Top', 'A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.', 100.00, 'Women', 'Topwear', 0, 'active', '2024-05-25 10:52:25'),
(2, 'aaaab', 'Men Round Neck Pure Cotton T-shirt', 'A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.', 200.00, 'Men', 'Topwear', 1, 'active', '2024-05-25 07:15:45'),
(3, 'aaaac', 'Girls Round Neck Cotton Top', 'A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.', 220.00, 'Kids', 'Topwear', 1, 'active', '2024-05-20 19:49:05'),
(4, 'aaaad', 'Men Round Neck Pure Cotton T-shirt', 'A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.', 110.00, 'Men', 'Topwear', 1, 'active', '2024-05-25 07:15:45'),
(5, 'aaaae', 'Women Round Neck Cotton Top', 'A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.', 130.00, 'Women', 'Topwear', 1, 'active', '2024-05-25 07:32:25'),
(6, 'aaaaf', 'Girls Round Neck Cotton Top', 'A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.', 140.00, 'Kids', 'Topwear', 1, 'active', '2024-05-25 07:50:23'),
(7, 'aaaag', 'Men Tapered Fit Flat-Front Trousers', 'A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.', 190.00, 'Men', 'Bottomwear', 0, 'active', '2024-05-25 07:19:02'),
(8, 'aaaah', 'Men Round Neck Pure Cotton T-shirt', 'A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.', 140.00, 'Men', 'Topwear', 0, 'active', '2024-05-25 07:32:25'),
(9, 'aaaai', 'Girls Round Neck Cotton Top', 'A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.', 100.00, 'Kids', 'Topwear', 0, 'active', '2024-05-25 07:13:55'),
(10, 'aaaaj', 'Men Tapered Fit Flat-Front Trousers', 'A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.', 110.00, 'Men', 'Bottomwear', 0, 'active', '2024-05-25 07:30:35'),
(11, 'aaaak', 'Men Round Neck Pure Cotton T-shirt', 'A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.', 120.00, 'Men', 'Topwear', 0, 'active', '2024-05-25 07:49:05'),
(12, 'aaaal', 'Men Round Neck Pure Cotton T-shirt', 'A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.', 150.00, 'Men', 'Topwear', 0, 'active', '2024-05-25 08:07:25'),
(13, 'aaaam', 'Women Round Neck Cotton Top', 'A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.', 130.00, 'Women', 'Topwear', 0, 'active', '2024-05-25 08:25:45'),
(14, 'aaaan', 'Boy Round Neck Pure Cotton T-shirt', 'A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.', 160.00, 'Kids', 'Topwear', 0, 'active', '2024-05-25 08:44:05'),
(15, 'aaaao', 'Men Tapered Fit Flat-Front Trousers', 'A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.', 140.00, 'Men', 'Bottomwear', 0, 'active', '2024-05-25 09:02:25'),
(16, 'aaaap', 'Girls Round Neck Cotton Top', 'A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.', 170.00, 'Kids', 'Topwear', 0, 'active', '2024-05-25 09:20:45'),
(17, 'aaaaq', 'Men Tapered Fit Flat-Front Trousers', 'A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.', 150.00, 'Men', 'Bottomwear', 0, 'active', '2024-05-25 09:39:05'),
(18, 'aaaar', 'Boy Round Neck Pure Cotton T-shirt', 'A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.', 180.00, 'Kids', 'Topwear', 0, 'active', '2024-05-25 09:57:25'),
(19, 'aaaas', 'Boy Round Neck Pure Cotton T-shirt', 'A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.', 160.00, 'Kids', 'Topwear', 0, 'active', '2024-05-25 10:15:45'),
(20, 'aaaat', 'Women Palazzo Pants with Waist Belt', 'A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.', 190.00, 'Women', 'Bottomwear', 0, 'active', '2024-05-25 10:34:05'),
(21, 'aaaau', 'Women Zip-Front Relaxed Fit Jacket', 'A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.', 170.00, 'Women', 'Winterwear', 0, 'active', '2024-05-25 10:52:25'),
(22, 'aaaav', 'Women Palazzo Pants with Waist Belt', 'A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.', 200.00, 'Women', 'Bottomwear', 0, 'active', '2024-05-25 11:10:45'),
(23, 'aaaaw', 'Boy Round Neck Pure Cotton T-shirt', 'A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.', 180.00, 'Kids', 'Topwear', 0, 'active', '2024-05-25 11:29:05'),
(24, 'aaaax', 'Boy Round Neck Pure Cotton T-shirt', 'A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.', 210.00, 'Kids', 'Topwear', 0, 'active', '2024-05-25 11:47:25'),
(25, 'aaaay', 'Girls Round Neck Cotton Top', 'A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.', 190.00, 'Kids', 'Topwear', 0, 'active', '2024-05-25 12:05:45'),
(26, 'aaaaz', 'Women Zip-Front Relaxed Fit Jacket', 'A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.', 220.00, 'Women', 'Winterwear', 0, 'active', '2024-05-25 12:24:05'),
(27, 'aaaba', 'Girls Round Neck Cotton Top', 'A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.', 200.00, 'Kids', 'Topwear', 0, 'active', '2024-05-25 12:42:25'),
(28, 'aaabb', 'Men Slim Fit Relaxed Denim Jacket', 'A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.', 230.00, 'Men', 'Winterwear', 0, 'active', '2024-05-25 13:00:45'),
(29, 'aaabc', 'Women Round Neck Cotton Top', 'A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.', 210.00, 'Women', 'Topwear', 0, 'active', '2024-05-25 13:19:05'),
(30, 'aaabd', 'Girls Round Neck Cotton Top', 'A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.', 240.00, 'Kids', 'Topwear', 0, 'active', '2024-05-25 13:37:25'),
(31, 'aaabe', 'Men Round Neck Pure Cotton T-shirt', 'A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.', 220.00, 'Men', 'Topwear', 0, 'active', '2024-05-25 13:55:45'),
(32, 'aaabf', 'Men Round Neck Pure Cotton T-shirt', 'A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.', 250.00, 'Men', 'Topwear', 0, 'active', '2024-05-25 14:14:05'),
(33, 'aaabg', 'Girls Round Neck Cotton Top', 'A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.', 230.00, 'Kids', 'Topwear', 0, 'active', '2024-05-25 14:32:25'),
(34, 'aaabh', 'Women Round Neck Cotton Top', 'A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.', 260.00, 'Women', 'Topwear', 0, 'active', '2024-05-25 14:50:45'),
(35, 'aaabi', 'Women Zip-Front Relaxed Fit Jacket', 'A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.', 240.00, 'Women', 'Winterwear', 0, 'active', '2024-05-25 15:09:05'),
(36, 'aaabj', 'Women Zip-Front Relaxed Fit Jacket', 'A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.', 270.00, 'Women', 'Winterwear', 0, 'active', '2024-05-25 15:27:25'),
(37, 'aaabk', 'Women Round Neck Cotton Top', 'A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.', 250.00, 'Women', 'Topwear', 0, 'active', '2024-05-25 15:45:45'),
(38, 'aaabl', 'Men Round Neck Pure Cotton T-shirt', 'A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.', 280.00, 'Men', 'Topwear', 0, 'active', '2024-05-25 16:04:05'),
(39, 'aaabm', 'Men Printed Plain Cotton Shirt', 'A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.', 260.00, 'Men', 'Topwear', 0, 'active', '2024-05-25 16:22:25'),
(40, 'aaabn', 'Men Slim Fit Relaxed Denim Jacket', 'A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.', 290.00, 'Men', 'Winterwear', 0, 'active', '2024-05-25 16:40:45'),
(41, 'aaabo', 'Men Round Neck Pure Cotton T-shirt', 'A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.', 270.00, 'Men', 'Topwear', 0, 'active', '2024-05-25 16:59:05'),
(42, 'aaabp', 'Boy Round Neck Pure Cotton T-shirt', 'A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.', 300.00, 'Kids', 'Topwear', 0, 'active', '2024-05-25 17:17:25'),
(43, 'aaabq', 'Kid Tapered Slim Fit Trouser', 'A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.', 280.00, 'Kids', 'Bottomwear', 0, 'active', '2024-05-25 17:35:45'),
(44, 'aaabr', 'Women Zip-Front Relaxed Fit Jacket', 'A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.', 310.00, 'Women', 'Winterwear', 0, 'active', '2024-05-25 17:54:05'),
(45, 'aaabs', 'Men Slim Fit Relaxed Denim Jacket', 'A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.', 290.00, 'Men', 'Winterwear', 0, 'active', '2024-05-25 18:12:25'),
(46, 'aaabt', 'Men Slim Fit Relaxed Denim Jacket', 'A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.', 320.00, 'Men', 'Winterwear', 0, 'active', '2024-05-25 18:30:45'),
(47, 'aaabu', 'Kid Tapered Slim Fit Trouser', 'A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.', 300.00, 'Kids', 'Bottomwear', 0, 'active', '2024-05-25 18:49:05'),
(48, 'aaabv', 'Men Slim Fit Relaxed Denim Jacket', 'A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.', 330.00, 'Men', 'Winterwear', 0, 'active', '2024-05-25 19:07:25'),
(49, 'aaabw', 'Kid Tapered Slim Fit Trouser', 'A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.', 310.00, 'Kids', 'Bottomwear', 0, 'active', '2024-05-25 19:25:45'),
(50, 'aaabx', 'Kid Tapered Slim Fit Trouser', 'A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.', 340.00, 'Kids', 'Bottomwear', 0, 'active', '2024-05-25 19:44:05'),
(51, 'aaaby', 'Women Zip-Front Relaxed Fit Jacket', 'A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.', 320.00, 'Women', 'Winterwear', 0, 'active', '2024-05-25 20:02:25'),
(52, 'aaabz', 'Men Slim Fit Relaxed Denim Jacket', 'A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.', 350.00, 'Men', 'Winterwear', 0, 'active', '2024-05-25 20:20:45'),
(54, NULL, 'PORDUCT__TEST-1', 'HYE', 10.00, 'Men', 'Bottomwear', 0, 'inactive', '2026-04-28 12:16:18'),
(55, NULL, 'PRODUCT__TEST-2', 'NIE', 200.00, 'Men', 'Topwear', 0, 'inactive', '2026-04-28 12:17:02');

-- --------------------------------------------------------

--
-- Table structure for table `product_images`
--

CREATE TABLE `product_images` (
  `id` int(11) NOT NULL,
  `product_id` int(11) DEFAULT NULL,
  `image_url` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `product_images`
--

INSERT INTO `product_images` (`id`, `product_id`, `image_url`) VALUES
(2, 2, '/assets/p_img2_1.png'),
(3, 2, '/assets/p_img2_2.png'),
(4, 2, '/assets/p_img2_3.png'),
(5, 2, '/assets/p_img2_4.png'),
(6, 3, '/assets/p_img3.png'),
(7, 4, '/assets/p_img4.png'),
(8, 5, '/assets/p_img5.png'),
(9, 6, '/assets/p_img6.png'),
(10, 7, '/assets/p_img7.png'),
(11, 8, '/assets/p_img8.png'),
(12, 9, '/assets/p_img9.png'),
(13, 10, '/assets/p_img10.png'),
(14, 11, '/assets/p_img11.png'),
(15, 12, '/assets/p_img12.png'),
(16, 13, '/assets/p_img13.png'),
(17, 14, '/assets/p_img14.png'),
(18, 15, '/assets/p_img15.png'),
(19, 16, '/assets/p_img16.png'),
(20, 17, '/assets/p_img17.png'),
(21, 18, '/assets/p_img18.png'),
(22, 19, '/assets/p_img19.png'),
(23, 20, '/assets/p_img20.png'),
(24, 21, '/assets/p_img21.png'),
(25, 22, '/assets/p_img22.png'),
(26, 23, '/assets/p_img23.png'),
(27, 24, '/assets/p_img24.png'),
(28, 25, '/assets/p_img25.png'),
(29, 26, '/assets/p_img26.png'),
(30, 27, '/assets/p_img27.png'),
(31, 28, '/assets/p_img28.png'),
(32, 29, '/assets/p_img29.png'),
(33, 30, '/assets/p_img30.png'),
(34, 31, '/assets/p_img31.png'),
(35, 32, '/assets/p_img32.png'),
(36, 33, '/assets/p_img33.png'),
(37, 34, '/assets/p_img34.png'),
(38, 35, '/assets/p_img35.png'),
(39, 36, '/assets/p_img36.png'),
(40, 37, '/assets/p_img37.png'),
(41, 38, '/assets/p_img38.png'),
(42, 39, '/assets/p_img39.png'),
(43, 40, '/assets/p_img40.png'),
(44, 41, '/assets/p_img41.png'),
(45, 42, '/assets/p_img42.png'),
(46, 43, '/assets/p_img43.png'),
(47, 44, '/assets/p_img44.png'),
(48, 45, '/assets/p_img45.png'),
(49, 46, '/assets/p_img46.png'),
(50, 47, '/assets/p_img47.png'),
(51, 48, '/assets/p_img48.png'),
(52, 49, '/assets/p_img49.png'),
(53, 50, '/assets/p_img50.png'),
(54, 51, '/assets/p_img51.png'),
(55, 52, '/assets/p_img52.png'),
(57, 1, '/assets/p_img1.png'),
(58, 54, '/assets/logo.png'),
(59, 55, '/assets/menu_icon.png');

-- --------------------------------------------------------

--
-- Table structure for table `product_sizes`
--

CREATE TABLE `product_sizes` (
  `id` int(11) NOT NULL,
  `product_id` int(11) DEFAULT NULL,
  `size` varchar(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `product_sizes`
--

INSERT INTO `product_sizes` (`id`, `product_id`, `size`) VALUES
(4, 2, 'M'),
(5, 2, 'L'),
(6, 2, 'XL'),
(7, 3, 'S'),
(8, 3, 'L'),
(9, 3, 'XL'),
(10, 4, 'S'),
(11, 4, 'M'),
(12, 4, 'XXL'),
(13, 5, 'M'),
(14, 5, 'L'),
(15, 5, 'XL'),
(16, 6, 'S'),
(17, 6, 'L'),
(18, 6, 'XL'),
(19, 7, 'S'),
(20, 7, 'L'),
(21, 7, 'XL'),
(22, 8, 'S'),
(23, 8, 'M'),
(24, 8, 'L'),
(25, 8, 'XL'),
(26, 9, 'M'),
(27, 9, 'L'),
(28, 9, 'XL'),
(29, 10, 'S'),
(30, 10, 'L'),
(31, 10, 'XL'),
(32, 11, 'S'),
(33, 11, 'M'),
(34, 11, 'L'),
(35, 12, 'S'),
(36, 12, 'M'),
(37, 12, 'L'),
(38, 12, 'XL'),
(39, 13, 'S'),
(40, 13, 'M'),
(41, 13, 'L'),
(42, 13, 'XL'),
(43, 14, 'S'),
(44, 14, 'M'),
(45, 14, 'L'),
(46, 14, 'XL'),
(47, 15, 'S'),
(48, 15, 'M'),
(49, 15, 'L'),
(50, 15, 'XL'),
(51, 16, 'S'),
(52, 16, 'M'),
(53, 16, 'L'),
(54, 16, 'XL'),
(55, 17, 'S'),
(56, 17, 'M'),
(57, 17, 'L'),
(58, 17, 'XL'),
(59, 18, 'S'),
(60, 18, 'M'),
(61, 18, 'L'),
(62, 18, 'XL'),
(63, 19, 'S'),
(64, 19, 'M'),
(65, 19, 'L'),
(66, 19, 'XL'),
(67, 20, 'S'),
(68, 20, 'M'),
(69, 20, 'L'),
(70, 20, 'XL'),
(71, 21, 'S'),
(72, 21, 'M'),
(73, 21, 'L'),
(74, 21, 'XL'),
(75, 22, 'S'),
(76, 22, 'M'),
(77, 22, 'L'),
(78, 22, 'XL'),
(79, 23, 'S'),
(80, 23, 'M'),
(81, 23, 'L'),
(82, 23, 'XL'),
(83, 24, 'S'),
(84, 24, 'M'),
(85, 24, 'L'),
(86, 24, 'XL'),
(87, 25, 'S'),
(88, 25, 'M'),
(89, 25, 'L'),
(90, 25, 'XL'),
(91, 26, 'S'),
(92, 26, 'M'),
(93, 26, 'L'),
(94, 26, 'XL'),
(95, 27, 'S'),
(96, 27, 'M'),
(97, 27, 'L'),
(98, 27, 'XL'),
(99, 28, 'S'),
(100, 28, 'M'),
(101, 28, 'L'),
(102, 28, 'XL'),
(103, 29, 'S'),
(104, 29, 'M'),
(105, 29, 'L'),
(106, 29, 'XL'),
(107, 30, 'S'),
(108, 30, 'M'),
(109, 30, 'L'),
(110, 30, 'XL'),
(111, 31, 'S'),
(112, 31, 'M'),
(113, 31, 'L'),
(114, 31, 'XL'),
(115, 32, 'S'),
(116, 32, 'M'),
(117, 32, 'L'),
(118, 32, 'XL'),
(119, 33, 'S'),
(120, 33, 'M'),
(121, 33, 'L'),
(122, 33, 'XL'),
(123, 34, 'S'),
(124, 34, 'M'),
(125, 34, 'L'),
(126, 34, 'XL'),
(127, 35, 'S'),
(128, 35, 'M'),
(129, 35, 'L'),
(130, 35, 'XL'),
(131, 36, 'S'),
(132, 36, 'M'),
(133, 36, 'L'),
(134, 36, 'XL'),
(135, 37, 'S'),
(136, 37, 'M'),
(137, 37, 'L'),
(138, 37, 'XL'),
(139, 38, 'S'),
(140, 38, 'M'),
(141, 38, 'L'),
(142, 38, 'XL'),
(143, 39, 'S'),
(144, 39, 'M'),
(145, 39, 'L'),
(146, 39, 'XL'),
(147, 40, 'S'),
(148, 40, 'M'),
(149, 40, 'L'),
(150, 40, 'XL'),
(151, 41, 'S'),
(152, 41, 'M'),
(153, 41, 'L'),
(154, 41, 'XL'),
(155, 42, 'S'),
(156, 42, 'M'),
(157, 42, 'L'),
(158, 42, 'XL'),
(159, 43, 'S'),
(160, 43, 'M'),
(161, 43, 'L'),
(162, 43, 'XL'),
(163, 44, 'S'),
(164, 44, 'M'),
(165, 44, 'L'),
(166, 44, 'XL'),
(167, 45, 'S'),
(168, 45, 'M'),
(169, 45, 'L'),
(170, 45, 'XL'),
(171, 46, 'S'),
(172, 46, 'M'),
(173, 46, 'L'),
(174, 46, 'XL'),
(175, 47, 'S'),
(176, 47, 'M'),
(177, 47, 'L'),
(178, 47, 'XL'),
(179, 48, 'S'),
(180, 48, 'M'),
(181, 48, 'L'),
(182, 48, 'XL'),
(183, 49, 'S'),
(184, 49, 'M'),
(185, 49, 'L'),
(186, 49, 'XL'),
(187, 50, 'S'),
(188, 50, 'M'),
(189, 50, 'L'),
(190, 50, 'XL'),
(191, 51, 'S'),
(192, 51, 'M'),
(193, 51, 'L'),
(194, 51, 'XL'),
(195, 52, 'S'),
(196, 52, 'M'),
(197, 52, 'L'),
(198, 52, 'XL'),
(204, 1, 'S'),
(205, 1, 'M'),
(206, 1, 'L'),
(207, 54, 'S'),
(208, 54, 'M'),
(209, 54, 'L'),
(210, 54, 'XL'),
(211, 54, 'XXL'),
(212, 55, 'S'),
(213, 55, 'M'),
(214, 55, 'L'),
(215, 55, 'XL'),
(216, 55, 'XXL');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('user','admin') DEFAULT 'user',
  `account_status` enum('active','banned') DEFAULT 'active',
  `phone` varchar(20) DEFAULT NULL,
  `address` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `password`, `role`, `account_status`, `phone`, `address`, `created_at`) VALUES
(1, 'Admin User', 'admin@ezshop.com', '$2b$10$06cmbapkKqz/Mn8BjdF0Muhfs/uBPX38R7JUb583Z9AcyYupRJf.S', 'admin', 'active', NULL, NULL, '2026-04-21 12:18:11'),
(2, 'Muhammad Talha', 'talha15-4302@diu.edu.bd', '$2b$10$pfGzNiyM/uLtGQUu731k..CWOGu3Eh9OJRXHdhvqvyzos9sXRXLp6', 'user', 'active', NULL, NULL, '2026-04-24 09:43:24');

-- --------------------------------------------------------

--
-- Table structure for table `wishlist_items`
--

CREATE TABLE `wishlist_items` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `product_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `wishlist_items`
--

INSERT INTO `wishlist_items` (`id`, `user_id`, `product_id`) VALUES
(24, 1, 3),
(9, 2, 4),
(10, 2, 6),
(13, 2, 9),
(23, 2, 10),
(12, 2, 11),
(14, 2, 12),
(21, 2, 17),
(22, 2, 32),
(20, 2, 38),
(16, 2, 49),
(17, 2, 50),
(15, 2, 51),
(19, 2, 54);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `cart_items`
--
ALTER TABLE `cart_items`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_cart_entry` (`user_id`,`product_id`,`size`),
  ADD KEY `product_id` (`product_id`);

--
-- Indexes for table `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `order_items`
--
ALTER TABLE `order_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `order_id` (`order_id`),
  ADD KEY `product_id` (`product_id`);

--
-- Indexes for table `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `product_images`
--
ALTER TABLE `product_images`
  ADD PRIMARY KEY (`id`),
  ADD KEY `product_id` (`product_id`);

--
-- Indexes for table `product_sizes`
--
ALTER TABLE `product_sizes`
  ADD PRIMARY KEY (`id`),
  ADD KEY `product_id` (`product_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `wishlist_items`
--
ALTER TABLE `wishlist_items`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_wishlist_entry` (`user_id`,`product_id`),
  ADD KEY `product_id` (`product_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `cart_items`
--
ALTER TABLE `cart_items`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=71;

--
-- AUTO_INCREMENT for table `orders`
--
ALTER TABLE `orders`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT for table `order_items`
--
ALTER TABLE `order_items`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=26;

--
-- AUTO_INCREMENT for table `products`
--
ALTER TABLE `products`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=56;

--
-- AUTO_INCREMENT for table `product_images`
--
ALTER TABLE `product_images`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=60;

--
-- AUTO_INCREMENT for table `product_sizes`
--
ALTER TABLE `product_sizes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=217;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `wishlist_items`
--
ALTER TABLE `wishlist_items`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `cart_items`
--
ALTER TABLE `cart_items`
  ADD CONSTRAINT `cart_items_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `cart_items_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `orders`
--
ALTER TABLE `orders`
  ADD CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `order_items`
--
ALTER TABLE `order_items`
  ADD CONSTRAINT `order_items_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `order_items_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `product_images`
--
ALTER TABLE `product_images`
  ADD CONSTRAINT `product_images_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `product_sizes`
--
ALTER TABLE `product_sizes`
  ADD CONSTRAINT `product_sizes_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `wishlist_items`
--
ALTER TABLE `wishlist_items`
  ADD CONSTRAINT `wishlist_items_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `wishlist_items_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
