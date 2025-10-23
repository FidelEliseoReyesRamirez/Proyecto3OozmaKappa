-- phpMyAdmin SQL Dump
-- version 5.2.3
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3308
-- Generation Time: Oct 23, 2025 at 12:30 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.3.26

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `develarq`
--

-- --------------------------------------------------------

--
-- Table structure for table `auditoria_logs`
--

CREATE TABLE `auditoria_logs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED DEFAULT NULL,
  `accion` varchar(255) NOT NULL,
  `tabla_afectada` varchar(100) DEFAULT NULL,
  `id_registro_afectado` bigint(20) UNSIGNED DEFAULT NULL,
  `fecha_accion` timestamp NOT NULL DEFAULT current_timestamp(),
  `ip_usuario` varchar(45) DEFAULT NULL,
  `eliminado` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `auditoria_logs`
--

INSERT INTO `auditoria_logs` (`id`, `user_id`, `accion`, `tabla_afectada`, `id_registro_afectado`, `fecha_accion`, `ip_usuario`, `eliminado`, `created_at`, `updated_at`) VALUES
(1, 3, 'Inicio de sesión', 'users', 3, '2025-10-23 12:15:28', '127.0.0.1', 0, '2025-10-23 12:15:28', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `cache`
--

CREATE TABLE `cache` (
  `key` varchar(255) NOT NULL,
  `value` mediumtext NOT NULL,
  `expiration` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `cache`
--

INSERT INTO `cache` (`key`, `value`, `expiration`) VALUES
('laravel-cache-77de68daecd823babbb58edb1c8e14d7106e83bb', 'i:1;', 1761221845),
('laravel-cache-77de68daecd823babbb58edb1c8e14d7106e83bb:timer', 'i:1761221845;', 1761221845);

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
-- Table structure for table `descargas_historial`
--

CREATE TABLE `descargas_historial` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `documento_id` bigint(20) UNSIGNED NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `documentos`
--

CREATE TABLE `documentos` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `proyecto_id` bigint(20) UNSIGNED NOT NULL,
  `nombre` varchar(150) NOT NULL,
  `descripcion` text DEFAULT NULL,
  `archivo_url` varchar(255) NOT NULL,
  `enlace_externo` varchar(255) DEFAULT NULL,
  `tipo` enum('PDF','Excel','Word','URL') NOT NULL,
  `fecha_subida` timestamp NOT NULL DEFAULT current_timestamp(),
  `subido_por` bigint(20) UNSIGNED DEFAULT NULL,
  `eliminado` tinyint(1) NOT NULL DEFAULT 0,
  `fecha_eliminacion` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `documentos`
--

INSERT INTO `documentos` (`id`, `proyecto_id`, `nombre`, `descripcion`, `archivo_url`, `enlace_externo`, `tipo`, `fecha_subida`, `subido_por`, `eliminado`, `fecha_eliminacion`, `created_at`, `updated_at`) VALUES
(1, 1, 'Pdf de prueba', NULL, '/storage/documentos/72V5aflZGlUUDoqgN9U3UuN7Gy97a66SkVNxCZ0K.pdf', NULL, 'PDF', '2025-10-23 12:27:10', 3, 0, NULL, '2025-10-23 12:27:10', '2025-10-23 12:27:10');

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
-- Table structure for table `historial_permisos`
--

CREATE TABLE `historial_permisos` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `proyecto_id` bigint(20) UNSIGNED NOT NULL,
  `usuario_modificador_id` bigint(20) UNSIGNED NOT NULL,
  `usuario_afectado_id` bigint(20) UNSIGNED NOT NULL,
  `permiso_asignado` varchar(255) NOT NULL,
  `fecha_cambio` timestamp NOT NULL DEFAULT '2025-10-23 12:10:57',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `hitos`
--

CREATE TABLE `hitos` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `proyecto_id` bigint(20) UNSIGNED NOT NULL,
  `nombre` varchar(150) NOT NULL,
  `fecha_hito` date NOT NULL,
  `descripcion` text DEFAULT NULL,
  `estado` enum('Pendiente','En Progreso','Completado','Bloqueado') NOT NULL DEFAULT 'Pendiente',
  `encargado_id` bigint(20) UNSIGNED DEFAULT NULL,
  `documento_id` bigint(20) UNSIGNED DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

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
(1, '0001_01_01_000001_create_cache_table', 1),
(2, '0001_01_01_000002_create_jobs_table', 1),
(3, '2025_10_01_004131_create_users_table', 1),
(4, '2025_10_01_004132_create_proyectos_table', 1),
(5, '2025_10_01_004133_create_proyectos_usuarios_table', 1),
(6, '2025_10_01_004134_create_planos_bim_table', 1),
(7, '2025_10_01_004135_create_documentos_table', 1),
(8, '2025_10_01_004136_create_tareas_table', 1),
(9, '2025_10_01_004137_create_reuniones_table', 1),
(10, '2025_10_01_004138_create_notificaciones_table', 1),
(11, '2025_10_01_004138_create_reuniones_usuarios_table', 1),
(12, '2025_10_01_004139_create_auditoria_logs_table', 1),
(13, '2025_10_01_023858_create_password_reset_tokens_table', 1),
(14, '2025_10_01_030337_create_personal_access_tokens_table', 1),
(15, '2025_10_15_024652_create_proyecto_versiones_table', 1),
(16, '2025_10_16_192427_create_descarga_historials_table', 1),
(17, '2025_10_16_222701_create_hitos_table', 1),
(18, '2025_10_17_135840_create_tarea_historials_table', 1),
(19, '2025_10_18_233821_create_historial_permisos_table', 1),
(20, '2025_10_20_234230_safe_fix_permiso_enum_in_proyectos_usuarios_table', 1),
(21, '2025_10_21_004918_add_fecha_hora_fin_to_reuniones_table', 1),
(22, '2025_10_21_023139_add_url_to_notificaciones_table', 1),
(23, '2025_10_23_001459_add_enlace_externo_to_documentos_table', 1),
(24, '2025_10_23_011613_add_fecha_eliminacion_to_documentos_table', 1);

-- --------------------------------------------------------

--
-- Table structure for table `notificaciones`
--

CREATE TABLE `notificaciones` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `mensaje` text NOT NULL,
  `tipo` enum('tarea','reunion','avance','documento','proyecto') NOT NULL,
  `fecha_envio` timestamp NOT NULL DEFAULT current_timestamp(),
  `leida` tinyint(1) NOT NULL DEFAULT 0,
  `eliminado` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `url` varchar(255) DEFAULT NULL,
  `asunto` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `notificaciones`
--

INSERT INTO `notificaciones` (`id`, `user_id`, `mensaje`, `tipo`, `fecha_envio`, `leida`, `eliminado`, `created_at`, `updated_at`, `url`, `asunto`) VALUES
(1, 1, 'Se te ha asignado el proyecto: Prensa Francesa', 'proyecto', '2025-10-23 12:18:06', 0, 0, '2025-10-23 12:18:06', '2025-10-23 12:18:06', 'http://127.0.0.1:8000/proyectos/1', 'Asignación de proyecto'),
(2, 4, 'Tu proyecto \'Prensa Francesa\' ha sido creado correctamente.', 'proyecto', '2025-10-23 12:18:19', 0, 0, '2025-10-23 12:18:19', '2025-10-23 12:18:19', 'http://127.0.0.1:8000/proyectos/1', 'Proyecto creado'),
(3, 4, 'Se ha subido un nuevo documento \'Pdf de prueba\' al proyecto \'Prensa Francesa\'.', 'documento', '2025-10-23 12:27:10', 0, 0, '2025-10-23 12:27:10', '2025-10-23 12:27:10', 'http://127.0.0.1:8000/proyectos/1', 'Nuevo documento'),
(4, 1, 'Se ha subido un nuevo documento \'Pdf de prueba\' al proyecto \'Prensa Francesa\'.', 'documento', '2025-10-23 12:27:14', 0, 0, '2025-10-23 12:27:14', '2025-10-23 12:27:14', 'http://127.0.0.1:8000/proyectos/1', 'Nuevo documento');

-- --------------------------------------------------------

--
-- Table structure for table `password_reset_tokens`
--

CREATE TABLE `password_reset_tokens` (
  `email` varchar(255) NOT NULL,
  `token` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `personal_access_tokens`
--

CREATE TABLE `personal_access_tokens` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `tokenable_type` varchar(255) NOT NULL,
  `tokenable_id` bigint(20) UNSIGNED NOT NULL,
  `name` text NOT NULL,
  `token` varchar(64) NOT NULL,
  `abilities` text DEFAULT NULL,
  `last_used_at` timestamp NULL DEFAULT NULL,
  `expires_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `planos_bim`
--

CREATE TABLE `planos_bim` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `proyecto_id` bigint(20) UNSIGNED NOT NULL,
  `nombre` varchar(150) NOT NULL,
  `descripcion` text DEFAULT NULL,
  `archivo_url` varchar(255) NOT NULL,
  `version` varchar(50) DEFAULT NULL,
  `fecha_subida` timestamp NOT NULL DEFAULT current_timestamp(),
  `subido_por` bigint(20) UNSIGNED DEFAULT NULL,
  `eliminado` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `proyectos`
--

CREATE TABLE `proyectos` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `nombre` varchar(150) NOT NULL,
  `descripcion` text DEFAULT NULL,
  `estado` enum('activo','en progreso','finalizado') NOT NULL DEFAULT 'activo',
  `fecha_inicio` date DEFAULT NULL,
  `fecha_fin` date DEFAULT NULL,
  `cliente_id` bigint(20) UNSIGNED DEFAULT NULL,
  `responsable_id` bigint(20) UNSIGNED DEFAULT NULL,
  `eliminado` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `proyectos`
--

INSERT INTO `proyectos` (`id`, `nombre`, `descripcion`, `estado`, `fecha_inicio`, `fecha_fin`, `cliente_id`, `responsable_id`, `eliminado`, `created_at`, `updated_at`) VALUES
(1, 'Prensa Francesa', NULL, 'activo', '2008-12-15', NULL, 4, 1, 0, '2025-10-23 12:18:06', '2025-10-23 12:18:06');

-- --------------------------------------------------------

--
-- Table structure for table `proyectos_usuarios`
--

CREATE TABLE `proyectos_usuarios` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `proyecto_id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `rol_en_proyecto` varchar(50) DEFAULT NULL,
  `permiso` enum('editar','ninguno') NOT NULL DEFAULT 'ninguno',
  `asignado_en` timestamp NULL DEFAULT NULL,
  `eliminado` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `proyectos_usuarios`
--

INSERT INTO `proyectos_usuarios` (`id`, `proyecto_id`, `user_id`, `rol_en_proyecto`, `permiso`, `asignado_en`, `eliminado`, `created_at`, `updated_at`) VALUES
(1, 1, 4, 'cliente', 'ninguno', NULL, 0, NULL, NULL),
(2, 1, 1, 'responsable', 'ninguno', NULL, 0, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `proyecto_versiones`
--

CREATE TABLE `proyecto_versiones` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `proyecto_id` bigint(20) UNSIGNED NOT NULL,
  `descripcion_cambio` text DEFAULT NULL,
  `autor_id` bigint(20) UNSIGNED DEFAULT NULL,
  `version` varchar(20) DEFAULT NULL,
  `datos_previos` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`datos_previos`)),
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `reuniones`
--

CREATE TABLE `reuniones` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `proyecto_id` bigint(20) UNSIGNED NOT NULL,
  `titulo` varchar(150) NOT NULL,
  `descripcion` text DEFAULT NULL,
  `fecha_hora` datetime NOT NULL,
  `fecha_hora_fin` datetime DEFAULT NULL,
  `creador_id` bigint(20) UNSIGNED DEFAULT NULL,
  `eliminado` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `reuniones_usuarios`
--

CREATE TABLE `reuniones_usuarios` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `reunion_id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `asistio` tinyint(1) NOT NULL DEFAULT 0,
  `eliminado` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `tareas`
--

CREATE TABLE `tareas` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `proyecto_id` bigint(20) UNSIGNED NOT NULL,
  `titulo` varchar(150) NOT NULL,
  `descripcion` text DEFAULT NULL,
  `estado` enum('pendiente','en progreso','completado') NOT NULL DEFAULT 'pendiente',
  `prioridad` enum('baja','media','alta') NOT NULL DEFAULT 'media',
  `fecha_limite` date DEFAULT NULL,
  `asignado_id` bigint(20) UNSIGNED DEFAULT NULL,
  `creador_id` bigint(20) UNSIGNED DEFAULT NULL,
  `eliminado` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `tarea_historials`
--

CREATE TABLE `tarea_historials` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `proyecto_id` bigint(20) UNSIGNED NOT NULL,
  `tarea_id` bigint(20) UNSIGNED NOT NULL,
  `usuario_id` bigint(20) UNSIGNED NOT NULL,
  `estado_anterior` varchar(255) DEFAULT NULL,
  `estado_nuevo` varchar(255) DEFAULT NULL,
  `cambio` varchar(255) DEFAULT NULL,
  `fecha_cambio` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(100) NOT NULL,
  `apellido` varchar(100) NOT NULL,
  `email` varchar(150) NOT NULL,
  `password` varchar(255) NOT NULL,
  `telefono` varchar(20) DEFAULT NULL,
  `rol` enum('admin','arquitecto','ingeniero','cliente') NOT NULL,
  `estado` enum('activo','inactivo') NOT NULL DEFAULT 'activo',
  `intentos_fallidos` tinyint(3) UNSIGNED NOT NULL DEFAULT 0,
  `eliminado` tinyint(1) NOT NULL DEFAULT 0,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `remember_token` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `apellido`, `email`, `password`, `telefono`, `rol`, `estado`, `intentos_fallidos`, `eliminado`, `email_verified_at`, `remember_token`, `created_at`, `updated_at`) VALUES
(1, 'Fidel Eliseo', 'Reyes Ramirez', 'fideleliseoreyesramirez@gmail.com', '$2y$12$HTc89fEiYapIuUMzDh1J5O5QhwcUi582LSqr7byzoK8XeCUbgjD8.', '73223555', 'admin', 'activo', 0, 0, '2025-10-01 06:16:51', NULL, '2025-10-01 06:16:51', '2025-10-23 12:10:58'),
(2, 'Victor Santiago', 'Albarracin Miranda', 'albarracinvictor251@gmail.com', '$2y$12$K65t8D3vpNupwSO.4DZKguOE87p4CpqdFW5GT.V8SrU0Egli6.U5u', NULL, 'ingeniero', 'activo', 0, 0, NULL, NULL, '2025-10-23 12:10:58', '2025-10-23 12:10:58'),
(3, 'Adriano Leandro', 'Daza Campero', 'dazaadriano12@gmail.com', '$2y$12$K65t8D3vpNupwSO.4DZKguOE87p4CpqdFW5GT.V8SrU0Egli6.U5u', NULL, 'admin', 'activo', 0, 0, '2025-10-08 12:16:15', NULL, '2025-10-23 12:10:58', '2025-10-23 12:10:58'),
(4, 'Erick Alan', 'Paniagua Berrios', 'epaniaguaberrios@gmail.com', '$2y$12$K65t8D3vpNupwSO.4DZKguOE87p4CpqdFW5GT.V8SrU0Egli6.U5u', '70430818', 'cliente', 'activo', 0, 0, NULL, NULL, '2025-10-23 12:10:58', '2025-10-23 12:10:58');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `auditoria_logs`
--
ALTER TABLE `auditoria_logs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `auditoria_logs_user_id_foreign` (`user_id`);

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
-- Indexes for table `descargas_historial`
--
ALTER TABLE `descargas_historial`
  ADD PRIMARY KEY (`id`),
  ADD KEY `descargas_historial_user_id_foreign` (`user_id`),
  ADD KEY `descargas_historial_documento_id_foreign` (`documento_id`);

--
-- Indexes for table `documentos`
--
ALTER TABLE `documentos`
  ADD PRIMARY KEY (`id`),
  ADD KEY `documentos_proyecto_id_foreign` (`proyecto_id`),
  ADD KEY `documentos_subido_por_foreign` (`subido_por`);

--
-- Indexes for table `failed_jobs`
--
ALTER TABLE `failed_jobs`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`);

--
-- Indexes for table `historial_permisos`
--
ALTER TABLE `historial_permisos`
  ADD PRIMARY KEY (`id`),
  ADD KEY `historial_permisos_proyecto_id_foreign` (`proyecto_id`),
  ADD KEY `historial_permisos_usuario_modificador_id_foreign` (`usuario_modificador_id`),
  ADD KEY `historial_permisos_usuario_afectado_id_foreign` (`usuario_afectado_id`);

--
-- Indexes for table `hitos`
--
ALTER TABLE `hitos`
  ADD PRIMARY KEY (`id`),
  ADD KEY `hitos_proyecto_id_foreign` (`proyecto_id`),
  ADD KEY `hitos_encargado_id_foreign` (`encargado_id`),
  ADD KEY `hitos_documento_id_foreign` (`documento_id`);

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
-- Indexes for table `notificaciones`
--
ALTER TABLE `notificaciones`
  ADD PRIMARY KEY (`id`),
  ADD KEY `notificaciones_user_id_foreign` (`user_id`);

--
-- Indexes for table `password_reset_tokens`
--
ALTER TABLE `password_reset_tokens`
  ADD PRIMARY KEY (`email`);

--
-- Indexes for table `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `personal_access_tokens_token_unique` (`token`),
  ADD KEY `personal_access_tokens_tokenable_type_tokenable_id_index` (`tokenable_type`,`tokenable_id`),
  ADD KEY `personal_access_tokens_expires_at_index` (`expires_at`);

--
-- Indexes for table `planos_bim`
--
ALTER TABLE `planos_bim`
  ADD PRIMARY KEY (`id`),
  ADD KEY `planos_bim_proyecto_id_foreign` (`proyecto_id`),
  ADD KEY `planos_bim_subido_por_foreign` (`subido_por`);

--
-- Indexes for table `proyectos`
--
ALTER TABLE `proyectos`
  ADD PRIMARY KEY (`id`),
  ADD KEY `proyectos_cliente_id_foreign` (`cliente_id`),
  ADD KEY `proyectos_responsable_id_foreign` (`responsable_id`);

--
-- Indexes for table `proyectos_usuarios`
--
ALTER TABLE `proyectos_usuarios`
  ADD PRIMARY KEY (`id`),
  ADD KEY `proyectos_usuarios_proyecto_id_foreign` (`proyecto_id`),
  ADD KEY `proyectos_usuarios_user_id_foreign` (`user_id`);

--
-- Indexes for table `proyecto_versiones`
--
ALTER TABLE `proyecto_versiones`
  ADD PRIMARY KEY (`id`),
  ADD KEY `proyecto_versiones_proyecto_id_foreign` (`proyecto_id`),
  ADD KEY `proyecto_versiones_autor_id_foreign` (`autor_id`);

--
-- Indexes for table `reuniones`
--
ALTER TABLE `reuniones`
  ADD PRIMARY KEY (`id`),
  ADD KEY `reuniones_proyecto_id_foreign` (`proyecto_id`),
  ADD KEY `reuniones_creador_id_foreign` (`creador_id`);

--
-- Indexes for table `reuniones_usuarios`
--
ALTER TABLE `reuniones_usuarios`
  ADD PRIMARY KEY (`id`),
  ADD KEY `reuniones_usuarios_reunion_id_foreign` (`reunion_id`),
  ADD KEY `reuniones_usuarios_user_id_foreign` (`user_id`);

--
-- Indexes for table `tareas`
--
ALTER TABLE `tareas`
  ADD PRIMARY KEY (`id`),
  ADD KEY `tareas_proyecto_id_foreign` (`proyecto_id`),
  ADD KEY `tareas_asignado_id_foreign` (`asignado_id`),
  ADD KEY `tareas_creador_id_foreign` (`creador_id`);

--
-- Indexes for table `tarea_historials`
--
ALTER TABLE `tarea_historials`
  ADD PRIMARY KEY (`id`),
  ADD KEY `tarea_historials_proyecto_id_foreign` (`proyecto_id`),
  ADD KEY `tarea_historials_tarea_id_foreign` (`tarea_id`),
  ADD KEY `tarea_historials_usuario_id_foreign` (`usuario_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `users_email_unique` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `auditoria_logs`
--
ALTER TABLE `auditoria_logs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `descargas_historial`
--
ALTER TABLE `descargas_historial`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `documentos`
--
ALTER TABLE `documentos`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `failed_jobs`
--
ALTER TABLE `failed_jobs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `historial_permisos`
--
ALTER TABLE `historial_permisos`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `hitos`
--
ALTER TABLE `hitos`
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
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;

--
-- AUTO_INCREMENT for table `notificaciones`
--
ALTER TABLE `notificaciones`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `planos_bim`
--
ALTER TABLE `planos_bim`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `proyectos`
--
ALTER TABLE `proyectos`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `proyectos_usuarios`
--
ALTER TABLE `proyectos_usuarios`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `proyecto_versiones`
--
ALTER TABLE `proyecto_versiones`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `reuniones`
--
ALTER TABLE `reuniones`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `reuniones_usuarios`
--
ALTER TABLE `reuniones_usuarios`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tareas`
--
ALTER TABLE `tareas`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tarea_historials`
--
ALTER TABLE `tarea_historials`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `auditoria_logs`
--
ALTER TABLE `auditoria_logs`
  ADD CONSTRAINT `auditoria_logs_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `descargas_historial`
--
ALTER TABLE `descargas_historial`
  ADD CONSTRAINT `descargas_historial_documento_id_foreign` FOREIGN KEY (`documento_id`) REFERENCES `documentos` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `descargas_historial_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `documentos`
--
ALTER TABLE `documentos`
  ADD CONSTRAINT `documentos_proyecto_id_foreign` FOREIGN KEY (`proyecto_id`) REFERENCES `proyectos` (`id`),
  ADD CONSTRAINT `documentos_subido_por_foreign` FOREIGN KEY (`subido_por`) REFERENCES `users` (`id`);

--
-- Constraints for table `historial_permisos`
--
ALTER TABLE `historial_permisos`
  ADD CONSTRAINT `historial_permisos_proyecto_id_foreign` FOREIGN KEY (`proyecto_id`) REFERENCES `proyectos` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `historial_permisos_usuario_afectado_id_foreign` FOREIGN KEY (`usuario_afectado_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `historial_permisos_usuario_modificador_id_foreign` FOREIGN KEY (`usuario_modificador_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `hitos`
--
ALTER TABLE `hitos`
  ADD CONSTRAINT `hitos_documento_id_foreign` FOREIGN KEY (`documento_id`) REFERENCES `documentos` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `hitos_encargado_id_foreign` FOREIGN KEY (`encargado_id`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `hitos_proyecto_id_foreign` FOREIGN KEY (`proyecto_id`) REFERENCES `proyectos` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `notificaciones`
--
ALTER TABLE `notificaciones`
  ADD CONSTRAINT `notificaciones_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `planos_bim`
--
ALTER TABLE `planos_bim`
  ADD CONSTRAINT `planos_bim_proyecto_id_foreign` FOREIGN KEY (`proyecto_id`) REFERENCES `proyectos` (`id`),
  ADD CONSTRAINT `planos_bim_subido_por_foreign` FOREIGN KEY (`subido_por`) REFERENCES `users` (`id`);

--
-- Constraints for table `proyectos`
--
ALTER TABLE `proyectos`
  ADD CONSTRAINT `proyectos_cliente_id_foreign` FOREIGN KEY (`cliente_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `proyectos_responsable_id_foreign` FOREIGN KEY (`responsable_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `proyectos_usuarios`
--
ALTER TABLE `proyectos_usuarios`
  ADD CONSTRAINT `proyectos_usuarios_proyecto_id_foreign` FOREIGN KEY (`proyecto_id`) REFERENCES `proyectos` (`id`),
  ADD CONSTRAINT `proyectos_usuarios_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `proyecto_versiones`
--
ALTER TABLE `proyecto_versiones`
  ADD CONSTRAINT `proyecto_versiones_autor_id_foreign` FOREIGN KEY (`autor_id`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `proyecto_versiones_proyecto_id_foreign` FOREIGN KEY (`proyecto_id`) REFERENCES `proyectos` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `reuniones`
--
ALTER TABLE `reuniones`
  ADD CONSTRAINT `reuniones_creador_id_foreign` FOREIGN KEY (`creador_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `reuniones_proyecto_id_foreign` FOREIGN KEY (`proyecto_id`) REFERENCES `proyectos` (`id`);

--
-- Constraints for table `reuniones_usuarios`
--
ALTER TABLE `reuniones_usuarios`
  ADD CONSTRAINT `reuniones_usuarios_reunion_id_foreign` FOREIGN KEY (`reunion_id`) REFERENCES `reuniones` (`id`),
  ADD CONSTRAINT `reuniones_usuarios_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `tareas`
--
ALTER TABLE `tareas`
  ADD CONSTRAINT `tareas_asignado_id_foreign` FOREIGN KEY (`asignado_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `tareas_creador_id_foreign` FOREIGN KEY (`creador_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `tareas_proyecto_id_foreign` FOREIGN KEY (`proyecto_id`) REFERENCES `proyectos` (`id`);

--
-- Constraints for table `tarea_historials`
--
ALTER TABLE `tarea_historials`
  ADD CONSTRAINT `tarea_historials_proyecto_id_foreign` FOREIGN KEY (`proyecto_id`) REFERENCES `proyectos` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `tarea_historials_tarea_id_foreign` FOREIGN KEY (`tarea_id`) REFERENCES `tareas` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `tarea_historials_usuario_id_foreign` FOREIGN KEY (`usuario_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
