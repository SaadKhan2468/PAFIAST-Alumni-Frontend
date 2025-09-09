-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Aug 25, 2025 at 09:22 AM
-- Server version: 10.4.28-MariaDB
-- PHP Version: 8.2.4

SET FOREIGN_KEY_CHECKS=0;
SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `profile_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `achievements`
--

CREATE TABLE `achievements` (
  `id` int(11) NOT NULL,
  `registration_number` varchar(20) NOT NULL,
  `title` varchar(255) NOT NULL,
  `details` text DEFAULT NULL,
  `file_path` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `achievements`
--

INSERT INTO `achievements` (`id`, `registration_number`, `title`, `details`, `file_path`, `created_at`, `updated_at`) VALUES
(1, 'B21F0327SE026', 'Certificate of Appreciation for Summit', 'AXAXAXA', '1743634239630-FYP E Scooty.pdf', '2025-04-02 22:50:39', '2025-08-20 18:47:38'),
(2, 'B21F0327SE026', 'Certificate of Appreciation ', 'as', '1744907834297-a846ac6398dd7d8b417c3964679336db.pdf', '2025-04-17 16:37:14', '2025-04-17 17:00:54');

-- --------------------------------------------------------

--
-- Table structure for table `edu_info`
--

CREATE TABLE `edu_info` (
  `id` int(11) NOT NULL,
  `registration_number` varchar(255) DEFAULT NULL,
  `matric_institute` varchar(255) DEFAULT NULL,
  `matric_degree` varchar(100) DEFAULT NULL,
  `matric_year` int(11) DEFAULT NULL,
  `matric_percentage` decimal(5,2) DEFAULT NULL,
  `fsc_institute` varchar(255) DEFAULT NULL,
  `fsc_degree` varchar(100) DEFAULT NULL,
  `fsc_year` int(11) DEFAULT NULL,
  `fsc_percentage` decimal(5,2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `edu_info`
--

INSERT INTO `edu_info` (`id`, `registration_number`, `matric_institute`, `matric_degree`, `matric_year`, `matric_percentage`, `fsc_institute`, `fsc_degree`, `fsc_year`, `fsc_percentage`) VALUES
(5, 'B21F0327SE026', 'POF MODEL High School', 'Pre-Medical', 2019, 86.00, 'FG Degree College For Men', 'Pre-Engineering', 2021, 86.00),
(6, 'B21F0327SE026', 'POF MODEL High School Wah Cantt', 'Pre-Medical', 2019, 86.00, 'FG Degree College For Men', 'Pre-Engineering', 2021, 86.00),
(7, 'B21F0327SE026', 'POF MODEL High School Wah Cantt', 'Pre-Medical', 2019, 86.00, 'FG Degree College For Men', 'Pre-Engineering', 2021, 86.00),
(8, 'B21F0327SE026', 'POF MODEL High School', 'Pre-Medical', 2019, 86.00, 'FG Degree College For Men', 'Pre-Engineering', 2021, 86.00);

-- --------------------------------------------------------

--
-- Table structure for table `e_cards`
--

CREATE TABLE `e_cards` (
  `id` int(11) NOT NULL,
  `registration_number` varchar(50) NOT NULL,
  `user_id` int(11) NOT NULL,
  `request_date` datetime NOT NULL DEFAULT current_timestamp(),
  `status` enum('pending','approved','rejected') NOT NULL DEFAULT 'pending',
  `card_image` varchar(255) DEFAULT NULL,
  `approved_date` datetime DEFAULT NULL,
  `rejection_reason` text DEFAULT NULL,
  `expiry_date` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `e_cards`
--

INSERT INTO `e_cards` (`id`, `registration_number`, `user_id`, `request_date`, `status`, `card_image`, `approved_date`, `rejection_reason`, `expiry_date`) VALUES
(1, 'B21F0353SE042', 9, '2025-05-07 12:55:05', 'approved', '1746604505530-ecard.png', NULL, NULL, '2030-05-07'),
(2, 'B21F0327SE026', 1, '2025-05-07 16:23:38', 'approved', '1746617018364-ecard.png', NULL, NULL, '2030-05-07'),
(3, 'B21F0353SE050', 14, '2025-07-08 23:40:18', 'approved', '1752000018873-ecard.png', NULL, NULL, '2030-07-08');

-- --------------------------------------------------------

--
-- Table structure for table `internships`
--

CREATE TABLE `internships` (
  `id` int(11) NOT NULL,
  `registration_number` varchar(255) NOT NULL,
  `title` varchar(255) NOT NULL,
  `company` varchar(255) NOT NULL,
  `duration` varchar(100) DEFAULT NULL,
  `start_date` date DEFAULT NULL,
  `end_date` date DEFAULT NULL,
  `description` text DEFAULT NULL,
  `paid` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `internships`
--

INSERT INTO `internships` (`id`, `registration_number`, `title`, `company`, `duration`, `start_date`, `end_date`, `description`, `paid`) VALUES
(2, 'B21F0327SE026', '1st Internshipsssss', 'PTCL Islamabad', '2 month', '2025-02-25', '2025-03-20', 'MY FIRST INTERNSHIP', 1),
(3, 'B21F0327SE026', '2nd Internship', 'MMBL', '1 month', '2024-11-04', '2024-12-04', 'FLUTTER DEVELOPMENT', 1);

-- --------------------------------------------------------

--
-- Table structure for table `jobs`
--

CREATE TABLE `jobs` (
  `id` int(11) NOT NULL,
  `registration_number` varchar(20) NOT NULL,
  `job_title` varchar(100) NOT NULL,
  `organization` varchar(100) NOT NULL,
  `joining_date` date DEFAULT NULL,
  `job_description` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `jobs`
--

INSERT INTO `jobs` (`id`, `registration_number`, `job_title`, `organization`, `joining_date`, `job_description`, `created_at`) VALUES
(1, 'B21F0327SE026', 'Flutter Mobile Application Developer', 'Mobilink Microfinance Bank', '2024-02-12', 'Maintainance of MMBL Apps', '2025-03-31 15:52:14'),
(2, 'B21F0353SE042', 'Faculty', 'PAFIAST', '2020-02-20', 'DiscreteMathematics', '2025-05-07 07:31:57');

-- --------------------------------------------------------

--
-- Table structure for table `projects`
--

CREATE TABLE `projects` (
  `id` int(11) NOT NULL,
  `registration_number` varchar(255) NOT NULL,
  `project_title` varchar(255) NOT NULL,
  `project_description` text NOT NULL,
  `completion_date` date NOT NULL,
  `months_taken` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `projects`
--

INSERT INTO `projects` (`id`, `registration_number`, `project_title`, `project_description`, `completion_date`, `months_taken`) VALUES
(1, 'B21F0327SE026', 'AI-Assisted Surveillance and Defence System', 'The aim of the project is to eliminate the dependency on human soldiers on border areas where their lives are at risk and replace on such areas with a system which detects the threat and eliminates the target.', '2025-04-20', 6);

-- --------------------------------------------------------

--
-- Table structure for table `users2`
--

CREATE TABLE `users2` (
  `id` int(11) NOT NULL,
  `email` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `whatsapp_number` varchar(15) DEFAULT NULL,
  `is_employed` tinyint(1) DEFAULT NULL,
  `looking_for_job` tinyint(1) DEFAULT NULL,
  `profile_picture` longblob DEFAULT NULL,
  `certificates` longblob DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `graduation_year` int(11) NOT NULL,
  `department` varchar(255) DEFAULT NULL,
  `registration_number` varchar(255) NOT NULL,
  `is_verified` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users2`
--

INSERT INTO `users2` (`id`, `email`, `password`, `whatsapp_number`, `is_employed`, `looking_for_job`, `profile_picture`, `certificates`, `name`, `graduation_year`, `department`, `registration_number`, `is_verified`) VALUES
(1, 'B21F0327SE026@fecid.paf-iast.edu.pk', '123456', '03155595902', 0, 0, 0x313734343931313830393233322d736161642e6a7067, 0x313733383935303833333635302d4d7568616d6d61642053616164204b68616e204356302e322e706466, 'Muhammad Saad Khan', 2025, 'Software Engineering', 'B21F0327SE026', 1),
(3, 'B21F0327SE007@fecid.paf-iast.edu.pk', '123456', '+92 3490093452', 0, 1, 0x313734323239333432303238372d616264756c6c61682e6a7067, NULL, 'Abdullah Bin Naveed', 2025, 'Business Administration', 'B21F0327SE007', 1),
(5, 'B21F0353SE040@fecid.paf-iast.edu.pk', 'moiz123', '03155595902', NULL, NULL, NULL, NULL, 'Abdul Moiz ', 2025, 'Civil Engineering', 'B21F0353SE040', 1),
(8, 'faisalkhan_98@hotmail.com', '123456', '03415615134', NULL, NULL, NULL, NULL, 'Faisal Khan', 2027, 'Software Engineering', 'B21F0327SE010', 1),
(9, 'rizwan.akhtar@paf-iast.edu.pk', 'rizwan123', '03459633391', 0, 0, 0x313734363630313638303937362d73756c656d616e6e6f622e706e67, NULL, 'Dr Rizwan Akhtar', 2023, 'Software Engineering', 'B21F0353SE042', 1),
(13, 'qaziobaid7897@gmail.com', 'qazi123', '03155595906', 0, 1, NULL, NULL, 'qazi', 2026, 'Bio Medical Sciences', 'B21F0327SE011', 1),
(14, 'summiyasajid@gmail.com', 'summiya123', '03155595906', 0, 0, NULL, NULL, 'Summiya Sajid', 2026, 'Software Engineering', 'B21F0353SE050', 1),
(15, 'hamzarauf@gmail.com', 'hamza123', '+03152391978', 0, 0, NULL, NULL, 'Hamza Rauf', 2025, 'Bio Medical Sciences', 'B21F0327AI500', 1);

-- --------------------------------------------------------

--
-- Table structure for table `user_skills_achievements`
--

CREATE TABLE `user_skills_achievements` (
  `id` int(11) NOT NULL,
  `registration_number` varchar(20) NOT NULL,
  `skills` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`skills`)),
  `achievements` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`achievements`)),
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `user_skills_achievements`
--

INSERT INTO `user_skills_achievements` (`id`, `registration_number`, `skills`, `achievements`, `created_at`, `updated_at`) VALUES
(7, 'B21F0327SE026', '[\"Python\",\"c++\",\"React\",\"Typescript\"]', NULL, '2025-04-02 22:43:03', '2025-08-20 18:47:25'),
(12, 'B21F0353SE042', '[\"teaching\",\"c++\",\"discrete mathematic\"]', NULL, '2025-05-07 07:08:32', '2025-05-07 07:08:39');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `achievements`
--
ALTER TABLE `achievements`
  ADD PRIMARY KEY (`id`),
  ADD KEY `registration_number` (`registration_number`);

--
-- Indexes for table `edu_info`
--
ALTER TABLE `edu_info`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_edu_users` (`registration_number`);

--
-- Indexes for table `e_cards`
--
ALTER TABLE `e_cards`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_user` (`registration_number`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `internships`
--
ALTER TABLE `internships`
  ADD PRIMARY KEY (`id`),
  ADD KEY `registration_number` (`registration_number`);

--
-- Indexes for table `jobs`
--
ALTER TABLE `jobs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `registration_number` (`registration_number`);

--
-- Indexes for table `projects`
--
ALTER TABLE `projects`
  ADD PRIMARY KEY (`id`),
  ADD KEY `registration_number` (`registration_number`);

--
-- Indexes for table `users2`
--
ALTER TABLE `users2`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `registration_number` (`registration_number`),
  ADD UNIQUE KEY `registration_number_2` (`registration_number`);

--
-- Indexes for table `user_skills_achievements`
--
ALTER TABLE `user_skills_achievements`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `registration_number` (`registration_number`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `achievements`
--
ALTER TABLE `achievements`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `edu_info`
--
ALTER TABLE `edu_info`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `e_cards`
--
ALTER TABLE `e_cards`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `internships`
--
ALTER TABLE `internships`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `jobs`
--
ALTER TABLE `jobs`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `projects`
--
ALTER TABLE `projects`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `users2`
--
ALTER TABLE `users2`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT for table `user_skills_achievements`
--
ALTER TABLE `user_skills_achievements`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `achievements`
--
ALTER TABLE `achievements`
  ADD CONSTRAINT `achievements_ibfk_1` FOREIGN KEY (`registration_number`) REFERENCES `users2` (`registration_number`);

--
-- Constraints for table `edu_info`
--
ALTER TABLE `edu_info`
  ADD CONSTRAINT `edu_info_ibfk_1` FOREIGN KEY (`registration_number`) REFERENCES `users2` (`registration_number`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_edu_users` FOREIGN KEY (`registration_number`) REFERENCES `users2` (`registration_number`) ON DELETE CASCADE;

--
-- Constraints for table `e_cards`
--
ALTER TABLE `e_cards`
  ADD CONSTRAINT `e_cards_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users2` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `internships`
--
ALTER TABLE `internships`
  ADD CONSTRAINT `internships_ibfk_1` FOREIGN KEY (`registration_number`) REFERENCES `users2` (`registration_number`);

--
-- Constraints for table `jobs`
--
ALTER TABLE `jobs`
  ADD CONSTRAINT `jobs_ibfk_1` FOREIGN KEY (`registration_number`) REFERENCES `users2` (`registration_number`);

--
-- Constraints for table `projects`
--
ALTER TABLE `projects`
  ADD CONSTRAINT `projects_ibfk_1` FOREIGN KEY (`registration_number`) REFERENCES `users2` (`registration_number`);

--
-- Constraints for table `user_skills_achievements`
--
ALTER TABLE `user_skills_achievements`
  ADD CONSTRAINT `user_skills_achievements_ibfk_1` FOREIGN KEY (`registration_number`) REFERENCES `users2` (`registration_number`);
SET FOREIGN_KEY_CHECKS=1;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
