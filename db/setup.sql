CREATE DATABASE `chatapp_db`;
USE chatapp_db;
CREATE TABLE `chats` (
  `id` int NOT NULL AUTO_INCREMENT,
  `creation_date` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
CREATE TABLE `messages` (
  `id` int NOT NULL AUTO_INCREMENT,
  `chat_id` int NOT NULL,
  `sender_id` int NOT NULL,
  `creation_time` datetime DEFAULT CURRENT_TIMESTAMP,
  `text` varchar(400) NOT NULL,
  `read` tinyint NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
CREATE TABLE `participations` (
  `id` int NOT NULL AUTO_INCREMENT,
  `chat_id` int NOT NULL,
  `user_id` int NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nickname` varchar(25) NOT NULL,
  `name` varchar(50) NOT NULL,
  `password` varchar(45) NOT NULL,
  `profile_picture` varchar(100) NOT NULL,
  `status` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `nickname_UNIQUE` (`nickname`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- fake users to test the ChatApp
USE chatapp_db;
INSERT INTO users
  (nickname, name, password, profile_picture, status)
VALUES
  ('dadoo555', ' Eduardo', 'admin', 'IMG-20230323-WA0001 - Kopie.jpg', 'Disponivel'),
  ('renan', ' Renan', 'admin', 'IMG-20230323-WA0001.jpg', 'Free to chat'),
  ('daniel', ' Daniel', 'admin', 'IMG-20230323-daniel.jpg', 'Frei');

INSERT INTO chats (id) VALUES (1), (2);

INSERT INTO participations
  (chat_id, user_id)
VALUES
  ('1', '1'),
  ('1', '2'),
  ('2', '1'),
  ('2', '3');

INSERT INTO messages
  (chat_id, sender_id, text)
VALUES
  ('1', '1', 'Eai Renan'),
  ('1', '2', 'Fala Eduardo'),
  ('1', '1', 'Queria saber...'),
  ('2', '3', 'Hi Eduardo'),
  ('2', '1', 'Hi Daniel');