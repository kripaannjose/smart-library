-- Smart Library Management System SQL
-- Database: smart_library_db

CREATE DATABASE IF NOT EXISTS `smart_library_db`;
USE `smart_library_db`;

-- Students Table
CREATE TABLE IF NOT EXISTS `student` (
  `student_id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `department` varchar(50) NOT NULL,
  `phone` varchar(15) NOT NULL,
  `join_date` date NOT NULL,
  PRIMARY KEY (`student_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Books Table
CREATE TABLE IF NOT EXISTS `book` (
  `book_id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `author` varchar(255) NOT NULL,
  `category` varchar(100) NOT NULL,
  `total_copies` int(11) NOT NULL,
  `available_copies` int(11) NOT NULL,
  `added_date` datetime NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`book_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Book Issued Table
CREATE TABLE IF NOT EXISTS `book_issue` (
  `issue_id` int(11) NOT NULL AUTO_INCREMENT,
  `student_id` int(11) NOT NULL,
  `book_id` int(11) NOT NULL,
  `issue_date` date NOT NULL,
  `return_date` date DEFAULT NULL,
  PRIMARY KEY (`issue_id`),
  KEY `student_id` (`student_id`),
  KEY `book_id` (`book_id`),
  CONSTRAINT `book_issue_ibfk_1` FOREIGN KEY (`student_id`) REFERENCES `student` (`student_id`) ON DELETE CASCADE,
  CONSTRAINT `book_issue_ibfk_2` FOREIGN KEY (`book_id`) REFERENCES `book` (`book_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Sample Data
INSERT INTO `student` (`name`, `department`, `phone`, `join_date`) VALUES
('Alex Johnson', 'Computer Science', '9876543210', '2026-03-01'),
('Emma Wilson', 'Mathematics', '1234567890', '2026-03-05'),
('Chris Brown', 'Physics', '1122334455', '2026-03-10');

INSERT INTO `book` (`title`, `author`, `category`, `total_copies`, `available_copies`) VALUES
('Clean Code', 'Robert C. Martin', 'Programming', 5, 5),
('Thinking, Fast and Slow', 'Daniel Kahneman', 'Psychology', 3, 3),
('A Brief History of Time', 'Stephen Hawking', 'Science', 2, 2);
