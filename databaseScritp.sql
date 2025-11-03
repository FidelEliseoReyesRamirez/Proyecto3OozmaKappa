-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1:3307
-- Tiempo de generación: 03-11-2025 a las 20:02:49
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `develarq`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `auditoria_logs`
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
-- Volcado de datos para la tabla `auditoria_logs`
--

INSERT INTO `auditoria_logs` (`id`, `user_id`, `accion`, `tabla_afectada`, `id_registro_afectado`, `fecha_accion`, `ip_usuario`, `eliminado`, `created_at`, `updated_at`) VALUES
(1, 1, 'Inicio de sesión', 'users', 1, '2025-10-20 23:24:35', '127.0.0.1', 0, '2025-10-21 03:24:35', NULL),
(2, 1, 'Inicio de sesión', 'users', 1, '2025-10-20 23:30:08', '127.0.0.1', 0, '2025-10-21 03:30:08', NULL),
(3, 1, 'Inicio de sesión', 'users', 1, '2025-10-20 23:58:09', '127.0.0.1', 0, '2025-10-21 03:58:09', NULL),
(4, 1, 'Inicio de sesión', 'users', 1, '2025-10-21 01:37:42', '127.0.0.1', 0, '2025-10-21 05:37:42', NULL),
(5, 1, 'Inicio de sesión', 'users', 1, '2025-10-21 02:36:24', '127.0.0.1', 0, '2025-10-21 06:36:24', NULL),
(6, 1, 'Inicio de sesión', 'users', 1, '2025-10-21 04:34:12', '127.0.0.1', 0, '2025-10-21 04:34:12', NULL),
(7, 1, 'Inicio de sesión', 'users', 1, '2025-10-23 00:50:02', '127.0.0.1', 0, '2025-10-23 00:50:02', NULL),
(8, 1, 'Inicio de sesión', 'users', 1, '2025-10-23 01:11:42', '127.0.0.1', 0, '2025-10-23 01:11:42', NULL),
(9, 1, 'Inicio de sesión', 'users', 1, '2025-10-23 02:07:14', '127.0.0.1', 0, '2025-10-23 02:07:14', NULL),
(10, 1, 'Inicio de sesión', 'users', 1, '2025-10-23 02:21:47', '127.0.0.1', 0, '2025-10-23 02:21:47', NULL),
(11, 1, 'Inicio de sesión', 'users', 1, '2025-10-23 03:57:59', '127.0.0.1', 0, '2025-10-23 03:57:59', NULL),
(12, 1, 'Inicio de sesión', 'users', 1, '2025-10-28 01:21:43', '127.0.0.1', 0, '2025-10-28 01:21:43', NULL),
(13, 1, 'Cambio de estado del usuario albarracinvictor251@gmail.com a inactivo', 'users', 2, '2025-10-28 01:46:01', '127.0.0.1', 0, '2025-10-28 01:46:01', NULL),
(14, 1, 'Cambio de estado del usuario albarracinvictor251@gmail.com a activo', 'users', 2, '2025-10-28 01:46:03', '127.0.0.1', 0, '2025-10-28 01:46:03', NULL),
(15, 1, 'Cambio de estado del usuario adrianoleandrodazacampero@gmail.com a inactivo', 'users', 3, '2025-10-28 01:46:26', '127.0.0.1', 0, '2025-10-28 01:46:26', NULL),
(16, 1, 'Cambio de estado del usuario adrianoleandrodazacampero@gmail.com a activo', 'users', 3, '2025-10-28 01:48:56', '127.0.0.1', 0, '2025-10-28 01:48:56', NULL),
(17, 1, 'Cambio de estado del usuario adrianoleandrodazacampero@gmail.com a inactivo', 'users', 3, '2025-10-28 01:49:01', '127.0.0.1', 0, '2025-10-28 01:49:01', NULL),
(18, 1, 'Cambio de estado del usuario adrianoleandrodazacampero@gmail.com a activo', 'users', 3, '2025-10-28 01:49:03', '127.0.0.1', 0, '2025-10-28 01:49:03', NULL),
(19, 1, 'Editó al usuario fideleliseoreyesramirez@gmail.com', 'users', 1, '2025-10-28 03:02:36', '127.0.0.1', 0, '2025-10-28 03:02:36', NULL),
(20, 1, 'Editó al usuario fideleliseoreyesramirez@gmail.com', 'users', 1, '2025-10-28 03:02:41', '127.0.0.1', 0, '2025-10-28 03:02:41', NULL),
(21, 1, 'Cambio de estado del usuario adrianoleandrodazacampero@gmail.com a inactivo', 'users', 3, '2025-10-28 03:33:26', '127.0.0.1', 0, '2025-10-28 03:33:26', NULL),
(22, 1, 'Cambio de estado del usuario adrianoleandrodazacampero@gmail.com a activo', 'users', 3, '2025-10-28 03:33:28', '127.0.0.1', 0, '2025-10-28 03:33:28', NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `cache`
--

CREATE TABLE `cache` (
  `key` varchar(255) NOT NULL,
  `value` mediumtext NOT NULL,
  `expiration` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `cache`
--

INSERT INTO `cache` (`key`, `value`, `expiration`) VALUES
('laravel-cache-356a192b7913b04c54574d18c28d46e6395428ab', 'i:1;', 1761615227),
('laravel-cache-356a192b7913b04c54574d18c28d46e6395428ab:timer', 'i:1761615226;', 1761615227);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `cache_locks`
--

CREATE TABLE `cache_locks` (
  `key` varchar(255) NOT NULL,
  `owner` varchar(255) NOT NULL,
  `expiration` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `descargas_historial`
--

CREATE TABLE `descargas_historial` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `documento_id` bigint(20) UNSIGNED NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `descargas_historial`
--

INSERT INTO `descargas_historial` (`id`, `user_id`, `documento_id`, `created_at`, `updated_at`) VALUES
(1, 1, 14, '2025-10-28 03:10:11', '2025-10-28 03:10:11'),
(2, 1, 14, '2025-10-28 03:17:50', '2025-10-28 03:17:50'),
(3, 1, 16, '2025-10-28 03:27:58', '2025-10-28 03:27:58');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `documentos`
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
-- Volcado de datos para la tabla `documentos`
--

INSERT INTO `documentos` (`id`, `proyecto_id`, `nombre`, `descripcion`, `archivo_url`, `enlace_externo`, `tipo`, `fecha_subida`, `subido_por`, `eliminado`, `fecha_eliminacion`, `created_at`, `updated_at`) VALUES
(14, 1, 'fd', NULL, '/storage/documentos/4qLXEZ8S1JR1rsMb0nRHj1ECvo4m4w9aJ2a5rS5h.pdf', NULL, 'PDF', '2025-10-28 01:38:20', 1, 1, '2025-10-28 03:18:16', '2025-10-28 01:38:20', '2025-10-28 03:18:16'),
(15, 2, 'WSAD', 'fsd', 'http://localhost/phpmyadmin/index.php?route=/sql&pos=0&db=develarq&table=users', NULL, 'URL', '2025-10-28 01:39:06', 1, 1, '2025-10-28 02:59:37', '2025-10-28 01:39:06', '2025-10-28 02:59:37'),
(16, 1, 'WSAD', NULL, '/storage/documentos/KJjYlhjTDBUKldMqf34BXTVmzx2iOFwZhb4r63uW.pdf', NULL, 'PDF', '2025-10-28 03:26:55', 1, 1, '2025-10-28 03:32:48', '2025-10-28 03:26:55', '2025-10-28 03:32:48');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `failed_jobs`
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
-- Estructura de tabla para la tabla `historial_permisos`
--

CREATE TABLE `historial_permisos` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `proyecto_id` bigint(20) UNSIGNED NOT NULL,
  `usuario_modificador_id` bigint(20) UNSIGNED NOT NULL,
  `usuario_afectado_id` bigint(20) UNSIGNED NOT NULL,
  `permiso_asignado` varchar(255) NOT NULL,
  `fecha_cambio` timestamp NOT NULL DEFAULT '2025-10-21 03:17:32',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `historial_permisos`
--

INSERT INTO `historial_permisos` (`id`, `proyecto_id`, `usuario_modificador_id`, `usuario_afectado_id`, `permiso_asignado`, `fecha_cambio`, `created_at`, `updated_at`) VALUES
(1, 1, 1, 2, 'editar', '2025-10-21 04:09:00', '2025-10-21 04:09:00', '2025-10-21 04:09:00'),
(2, 1, 1, 3, 'editar', '2025-10-21 04:41:35', '2025-10-21 04:41:35', '2025-10-21 04:41:35'),
(3, 3, 1, 2, 'editar', '2025-10-21 06:39:54', '2025-10-21 06:39:54', '2025-10-21 06:39:54'),
(4, 3, 1, 3, 'editar', '2025-10-21 06:39:54', '2025-10-21 06:39:54', '2025-10-21 06:39:54'),
(5, 1, 1, 2, 'ninguno', '2025-10-21 03:43:24', '2025-10-21 03:43:24', '2025-10-21 03:43:24'),
(6, 1, 1, 2, 'editar', '2025-10-21 03:51:25', '2025-10-21 03:51:25', '2025-10-21 03:51:25');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `hitos`
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
-- Estructura de tabla para la tabla `jobs`
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
-- Estructura de tabla para la tabla `job_batches`
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
-- Estructura de tabla para la tabla `migrations`
--

CREATE TABLE `migrations` (
  `id` int(10) UNSIGNED NOT NULL,
  `migration` varchar(255) NOT NULL,
  `batch` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `migrations`
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
(16, '2025_10_16_025951_create_notificacions_table', 1),
(17, '2025_10_16_192427_create_descarga_historials_table', 1),
(18, '2025_10_16_222701_create_hitos_table', 1),
(19, '2025_10_17_135840_create_tarea_historials_table', 1),
(20, '2025_10_18_233821_create_historial_permisos_table', 1),
(21, '2025_10_21_004918_add_fecha_hora_fin_to_reuniones_table', 2),
(22, '2025_10_21_023139_add_url_to_notificaciones_table', 3),
(23, '2025_10_20_234230_safe_fix_permiso_enum_in_proyectos_usuarios_table', 4),
(24, '2025_10_23_001459_add_enlace_externo_to_documentos_table', 5),
(25, '2025_10_23_011613_add_fecha_eliminacion_to_documentos_table', 6);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `notificaciones`
--

CREATE TABLE `notificaciones` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `mensaje` text NOT NULL,
  `tipo` enum('tarea','reunion','avance','documento','proyecto') NOT NULL DEFAULT 'tarea',
  `fecha_envio` timestamp NOT NULL DEFAULT current_timestamp(),
  `leida` tinyint(1) NOT NULL DEFAULT 0,
  `eliminado` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `url` varchar(255) DEFAULT NULL,
  `asunto` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `notificaciones`
--

INSERT INTO `notificaciones` (`id`, `user_id`, `mensaje`, `tipo`, `fecha_envio`, `leida`, `eliminado`, `created_at`, `updated_at`, `url`, `asunto`) VALUES
(1, 1, 'Se te ha asignado el proyecto: Fidel', 'tarea', '2025-10-21 00:01:53', 1, 0, '2025-10-21 04:01:53', '2025-10-23 05:30:40', NULL, NULL),
(2, 3, 'Tu proyecto \'Fidel\' ha sido creado.', 'tarea', '2025-10-21 00:01:53', 0, 0, '2025-10-21 04:01:53', '2025-10-21 04:01:53', NULL, NULL),
(3, 2, 'Se te ha asignado el proyecto: JIJIRI', 'tarea', '2025-10-21 00:08:53', 0, 0, '2025-10-21 04:08:53', '2025-10-21 04:08:53', NULL, NULL),
(4, 3, 'Tu proyecto \'JIJIRI\' ha sido creado.', 'tarea', '2025-10-21 00:08:53', 0, 0, '2025-10-21 04:08:53', '2025-10-21 04:08:53', NULL, NULL),
(5, 1, 'Se te ha asignado a una reunión: A', 'reunion', '2025-10-21 00:46:38', 1, 0, '2025-10-21 04:46:38', '2025-10-23 05:30:40', NULL, NULL),
(6, 3, 'Se te ha asignado a una reunión: A', 'reunion', '2025-10-21 00:46:38', 0, 0, '2025-10-21 04:46:38', '2025-10-21 04:46:38', NULL, NULL),
(7, 2, 'Se te ha asignado a una reunión: A', 'reunion', '2025-10-21 00:46:38', 0, 0, '2025-10-21 04:46:38', '2025-10-21 04:46:38', NULL, NULL),
(8, 1, 'La reunión \'A\' ha sido actualizada.', 'reunion', '2025-10-21 00:46:53', 1, 0, '2025-10-21 04:46:53', '2025-10-23 05:30:40', NULL, NULL),
(9, 2, 'La reunión \'A\' ha sido actualizada.', 'reunion', '2025-10-21 00:46:53', 0, 0, '2025-10-21 04:46:53', '2025-10-21 04:46:53', NULL, NULL),
(10, 3, 'La reunión \'A\' ha sido actualizada.', 'reunion', '2025-10-21 00:46:54', 0, 0, '2025-10-21 04:46:54', '2025-10-21 04:46:54', NULL, NULL),
(11, 1, 'La reunión \'A\' ha sido actualizada.', 'reunion', '2025-10-21 00:47:01', 1, 0, '2025-10-21 04:47:01', '2025-10-23 05:30:40', NULL, NULL),
(12, 2, 'La reunión \'A\' ha sido actualizada.', 'reunion', '2025-10-21 00:47:01', 0, 0, '2025-10-21 04:47:01', '2025-10-21 04:47:01', NULL, NULL),
(13, 3, 'La reunión \'A\' ha sido actualizada.', 'reunion', '2025-10-21 00:47:01', 0, 0, '2025-10-21 04:47:01', '2025-10-21 04:47:01', NULL, NULL),
(14, 1, 'La reunión \'A\' ha sido actualizada.', 'reunion', '2025-10-21 00:53:08', 1, 0, '2025-10-21 04:53:08', '2025-10-23 05:30:40', NULL, NULL),
(15, 2, 'La reunión \'A\' ha sido actualizada.', 'reunion', '2025-10-21 00:53:08', 0, 0, '2025-10-21 04:53:08', '2025-10-21 04:53:08', NULL, NULL),
(16, 3, 'La reunión \'A\' ha sido actualizada.', 'reunion', '2025-10-21 00:53:08', 0, 0, '2025-10-21 04:53:08', '2025-10-21 04:53:08', NULL, NULL),
(17, 1, 'La reunión \'A\' ha sido actualizada.', 'reunion', '2025-10-21 00:53:19', 1, 0, '2025-10-21 04:53:19', '2025-10-23 05:30:40', NULL, NULL),
(18, 2, 'La reunión \'A\' ha sido actualizada.', 'reunion', '2025-10-21 00:53:19', 0, 0, '2025-10-21 04:53:19', '2025-10-21 04:53:19', NULL, NULL),
(19, 3, 'La reunión \'A\' ha sido actualizada.', 'reunion', '2025-10-21 00:53:19', 0, 0, '2025-10-21 04:53:19', '2025-10-21 04:53:19', NULL, NULL),
(20, 1, 'Se te ha asignado a una reunión: sdf', 'reunion', '2025-10-21 00:55:40', 1, 0, '2025-10-21 04:55:40', '2025-10-23 05:30:40', NULL, NULL),
(21, 1, 'Se te ha asignado a una reunión: sdfsdf', 'reunion', '2025-10-21 01:38:26', 1, 0, '2025-10-21 05:38:26', '2025-10-23 05:30:40', NULL, NULL),
(22, 1, 'La reunión \'sdfsdf\' ha sido actualizada.', 'reunion', '2025-10-21 01:38:33', 1, 0, '2025-10-21 05:38:33', '2025-10-23 05:30:40', NULL, NULL),
(23, 1, 'Se te ha asignado a una reunión: sfsdfsdfsd', 'reunion', '2025-10-21 01:43:59', 1, 0, '2025-10-21 05:43:59', '2025-10-23 05:30:40', NULL, NULL),
(24, 3, 'Se ha subido un nuevo documento al proyecto.', 'documento', '2025-10-21 02:05:55', 0, 0, '2025-10-21 06:05:55', '2025-10-21 06:05:55', NULL, NULL),
(25, 1, 'Se ha subido un nuevo documento al proyecto.', 'documento', '2025-10-21 02:05:55', 1, 0, '2025-10-21 06:05:55', '2025-10-23 05:30:40', NULL, NULL),
(26, 2, 'Se ha subido un nuevo documento al proyecto.', 'documento', '2025-10-21 02:05:55', 0, 0, '2025-10-21 06:05:55', '2025-10-21 06:05:55', NULL, NULL),
(27, 1, 'El proyecto \'Fidel\' ha sido actualizado.', 'avance', '2025-10-21 02:06:36', 1, 0, '2025-10-21 06:06:36', '2025-10-23 05:30:40', NULL, NULL),
(28, 1, 'Se te ha asignado el proyecto: Torres', 'tarea', '2025-10-21 02:37:20', 1, 0, '2025-10-21 06:37:20', '2025-10-23 05:30:40', NULL, 'Tarea nueva'),
(29, 4, 'Tu proyecto \'Torres\' ha sido creado.', 'tarea', '2025-10-21 02:37:31', 0, 0, '2025-10-21 06:37:31', '2025-10-21 06:37:31', NULL, 'Tarea nueva'),
(30, 1, 'Se te ha asignado el proyecto: Elzapato', 'tarea', '2025-10-21 02:40:20', 1, 0, '2025-10-21 06:40:20', '2025-10-23 05:30:40', NULL, 'Tarea nueva'),
(31, 4, 'Tu proyecto \'Elzapato\' ha sido creado.', 'tarea', '2025-10-21 02:40:24', 0, 0, '2025-10-21 06:40:24', '2025-10-21 06:40:24', NULL, 'Tarea nueva'),
(32, 4, 'Se ha subido un nuevo documento al proyecto.', 'documento', '2025-10-21 02:46:27', 0, 0, '2025-10-21 06:46:27', '2025-10-21 06:46:27', NULL, 'Documento nueva'),
(33, 1, 'Se ha subido un nuevo documento al proyecto.', 'documento', '2025-10-21 02:46:30', 1, 0, '2025-10-21 06:46:30', '2025-10-23 05:30:40', NULL, 'Documento nueva'),
(34, 4, 'Se ha subido un nuevo documento al proyecto.', 'documento', '2025-10-21 02:46:35', 0, 0, '2025-10-21 06:46:35', '2025-10-21 06:46:35', NULL, 'Documento nueva'),
(35, 1, 'Se ha subido un nuevo documento al proyecto.', 'documento', '2025-10-21 02:46:39', 1, 0, '2025-10-21 06:46:39', '2025-10-23 05:30:40', NULL, 'Documento nueva'),
(36, 4, 'Se ha subido un nuevo documento al proyecto.', 'documento', '2025-10-21 02:48:31', 0, 0, '2025-10-21 06:48:31', '2025-10-21 06:48:31', NULL, 'Documento nueva'),
(37, 1, 'Se ha subido un nuevo documento al proyecto.', 'documento', '2025-10-21 02:48:35', 1, 0, '2025-10-21 06:48:35', '2025-10-23 05:30:40', NULL, 'Documento nueva'),
(38, 4, 'Se ha subido un nuevo documento al proyecto.', 'documento', '2025-10-21 02:49:00', 0, 0, '2025-10-21 06:49:00', '2025-10-21 06:49:00', NULL, 'Documento nueva'),
(39, 1, 'Se ha subido un nuevo documento al proyecto.', 'documento', '2025-10-21 02:49:03', 1, 0, '2025-10-21 06:49:03', '2025-10-23 05:30:40', NULL, 'Documento nueva'),
(40, 4, 'Se ha subido un nuevo documento al proyecto.', 'documento', '2025-10-21 02:55:43', 0, 0, '2025-10-21 06:55:43', '2025-10-21 06:55:43', NULL, 'Documento nueva'),
(41, 1, 'Se ha subido un nuevo documento al proyecto.', 'documento', '2025-10-21 02:55:47', 1, 0, '2025-10-21 06:55:47', '2025-10-23 05:30:40', NULL, 'Documento nueva'),
(42, 1, 'Notificación de prueba con URL', 'proyecto', '2025-10-21 02:57:05', 1, 0, '2025-10-21 06:57:05', '2025-10-23 05:30:40', 'http://localhost/proyectos', 'Proyecto demo'),
(43, 1, 'Test manual', 'proyecto', '2025-10-21 03:00:05', 1, 0, '2025-10-21 07:00:05', '2025-10-23 05:30:40', 'http://localhost/proyectos', 'Prueba directa'),
(44, 1, 'Se ha programado una nueva reunión: \'dfsfsd\' del proyecto \'Elzapato\'.', 'reunion', '2025-10-21 03:09:29', 1, 0, '2025-10-21 07:09:29', '2025-10-23 05:30:40', 'http://127.0.0.1:8000/proyectos/4', 'Nueva reunión programada'),
(45, 2, 'Se ha programado una nueva reunión: \'dfsfsd\' del proyecto \'Elzapato\'.', 'reunion', '2025-10-21 03:09:33', 0, 0, '2025-10-21 07:09:33', '2025-10-21 07:09:33', 'http://127.0.0.1:8000/proyectos/4', 'Nueva reunión programada'),
(46, 3, 'Se ha programado una nueva reunión: \'dfsfsd\' del proyecto \'Elzapato\'.', 'reunion', '2025-10-21 03:09:34', 0, 0, '2025-10-21 07:09:34', '2025-10-21 07:09:34', 'http://127.0.0.1:8000/proyectos/4', 'Nueva reunión programada'),
(47, 4, 'Se ha programado una nueva reunión: \'dfsfsd\' del proyecto \'Elzapato\'.', 'reunion', '2025-10-21 03:09:36', 0, 0, '2025-10-21 07:09:36', '2025-10-21 07:09:36', 'http://127.0.0.1:8000/proyectos/4', 'Nueva reunión programada'),
(48, 1, 'Se ha programado una nueva reunión: \'fgdfdg\' del proyecto \'Fidel\'.', 'reunion', '2025-10-21 03:12:43', 1, 0, '2025-10-21 07:12:43', '2025-10-23 05:30:40', 'http://127.0.0.1:8000/proyectos/1', 'Nueva reunión programada'),
(49, 3, 'Se ha programado una nueva reunión: \'fgdfdg\' del proyecto \'Fidel\'.', 'reunion', '2025-10-21 03:12:46', 0, 0, '2025-10-21 07:12:46', '2025-10-21 07:12:46', 'http://127.0.0.1:8000/proyectos/1', 'Nueva reunión programada'),
(50, 2, 'Se ha programado una nueva reunión: \'fgdfdg\' del proyecto \'Fidel\'.', 'reunion', '2025-10-21 03:12:47', 0, 0, '2025-10-21 07:12:47', '2025-10-21 07:12:47', 'http://127.0.0.1:8000/proyectos/1', 'Nueva reunión programada'),
(51, 4, 'Se ha subido un nuevo documento \'fsd\' al proyecto \'Elzapato\'.', 'documento', '2025-10-21 03:13:09', 0, 0, '2025-10-21 07:13:09', '2025-10-21 07:13:09', 'http://127.0.0.1:8000/proyectos/4', 'Nuevo documento agregado'),
(52, 1, 'Se ha subido un nuevo documento \'fsd\' al proyecto \'Elzapato\'.', 'documento', '2025-10-21 03:13:13', 1, 0, '2025-10-21 07:13:13', '2025-10-23 05:30:40', 'http://127.0.0.1:8000/proyectos/4', 'Nuevo documento agregado'),
(53, 3, 'Se ha subido un nuevo documento \'sdfsfdfsdfsdfsdqwwww\' al proyecto \'Fidel\'.', 'documento', '2025-10-21 03:21:07', 0, 0, '2025-10-21 03:21:07', '2025-10-21 03:21:07', 'http://127.0.0.1:8000/proyectos/1', 'Nuevo documento agregado'),
(54, 1, 'Se ha subido un nuevo documento \'sdfsfdfsdfsdfsdqwwww\' al proyecto \'Fidel\'.', 'documento', '2025-10-21 03:21:10', 1, 0, '2025-10-21 03:21:10', '2025-10-23 05:30:40', 'http://127.0.0.1:8000/proyectos/1', 'Nuevo documento agregado'),
(55, 2, 'Se ha subido un nuevo documento \'sdfsfdfsdfsdfsdqwwww\' al proyecto \'Fidel\'.', 'documento', '2025-10-21 03:21:11', 0, 0, '2025-10-21 03:21:11', '2025-10-21 03:21:11', 'http://127.0.0.1:8000/proyectos/1', 'Nuevo documento agregado'),
(56, 4, 'El documento \'fsd\' ha sido eliminado del proyecto \'Elzapato\'.', 'documento', '2025-10-21 03:36:23', 0, 0, '2025-10-21 03:36:23', '2025-10-21 03:36:23', 'http://127.0.0.1:8000/proyectos/4', 'Documento eliminado'),
(57, 1, 'El documento \'fsd\' ha sido eliminado del proyecto \'Elzapato\'.', 'documento', '2025-10-21 03:36:26', 1, 0, '2025-10-21 03:36:26', '2025-10-23 05:30:40', 'http://127.0.0.1:8000/proyectos/4', 'Documento eliminado'),
(58, 4, 'El documento \'Planos\' ha sido actualizado en el proyecto \'Elzapato\'.', 'documento', '2025-10-21 03:36:47', 0, 0, '2025-10-21 03:36:47', '2025-10-21 03:36:47', 'http://127.0.0.1:8000/proyectos/4', 'Documento actualizado'),
(59, 1, 'El documento \'Planos\' ha sido actualizado en el proyecto \'Elzapato\'.', 'documento', '2025-10-21 03:36:51', 1, 0, '2025-10-21 03:36:51', '2025-10-23 05:30:40', 'http://127.0.0.1:8000/proyectos/4', 'Documento actualizado'),
(60, 1, 'La reunión \'fgdfdg\' del proyecto \'Fidel\' ha sido eliminada.', 'reunion', '2025-10-21 03:37:08', 1, 0, '2025-10-21 03:37:08', '2025-10-23 05:30:40', 'http://127.0.0.1:8000/proyectos/1', 'Reunión cancelada'),
(61, 3, 'La reunión \'fgdfdg\' del proyecto \'Fidel\' ha sido eliminada.', 'reunion', '2025-10-21 03:37:11', 0, 0, '2025-10-21 03:37:11', '2025-10-21 03:37:11', 'http://127.0.0.1:8000/proyectos/1', 'Reunión cancelada'),
(62, 2, 'La reunión \'fgdfdg\' del proyecto \'Fidel\' ha sido eliminada.', 'reunion', '2025-10-21 03:37:13', 0, 0, '2025-10-21 03:37:13', '2025-10-21 03:37:13', 'http://127.0.0.1:8000/proyectos/1', 'Reunión cancelada'),
(63, 2, 'Se te ha asignado permiso \'ninguno\' en el proyecto \'Fidel\'.', 'proyecto', '2025-10-21 03:43:24', 0, 0, '2025-10-21 03:43:24', '2025-10-21 03:43:24', 'http://127.0.0.1:8000/proyectos/1', 'Permiso actualizado'),
(64, 2, 'Se te ha asignado permiso \'editar\' en el proyecto \'Fidel\'.', 'proyecto', '2025-10-21 03:51:25', 0, 0, '2025-10-21 03:51:25', '2025-10-21 03:51:25', 'http://127.0.0.1:8000/proyectos/1', 'Permiso actualizado'),
(65, 1, 'Se ha programado una nueva reunión: \'gfdgfdfdg\' del proyecto \'Fidel\'.', 'reunion', '2025-10-23 01:11:58', 1, 0, '2025-10-23 01:11:58', '2025-10-23 05:30:40', 'http://127.0.0.1:8000/proyectos/1', 'Nueva reunión programada'),
(66, 3, 'Se ha programado una nueva reunión: \'gfdgfdfdg\' del proyecto \'Fidel\'.', 'reunion', '2025-10-23 01:12:10', 0, 0, '2025-10-23 01:12:10', '2025-10-23 01:12:10', 'http://127.0.0.1:8000/proyectos/1', 'Nueva reunión programada'),
(67, 2, 'Se ha programado una nueva reunión: \'gfdgfdfdg\' del proyecto \'Fidel\'.', 'reunion', '2025-10-23 01:12:12', 0, 0, '2025-10-23 01:12:12', '2025-10-23 01:12:12', 'http://127.0.0.1:8000/proyectos/1', 'Nueva reunión programada'),
(68, 1, 'Se ha programado una nueva reunión: \'rgses\' del proyecto \'Fidel\'.', 'reunion', '2025-10-23 02:08:33', 1, 0, '2025-10-23 02:08:33', '2025-10-23 05:30:40', 'http://127.0.0.1:8000/proyectos/1', 'Nueva reunión programada'),
(69, 3, 'Se ha programado una nueva reunión: \'rgses\' del proyecto \'Fidel\'.', 'reunion', '2025-10-23 02:08:38', 0, 0, '2025-10-23 02:08:38', '2025-10-23 02:08:38', 'http://127.0.0.1:8000/proyectos/1', 'Nueva reunión programada'),
(70, 2, 'Se ha programado una nueva reunión: \'rgses\' del proyecto \'Fidel\'.', 'reunion', '2025-10-23 02:08:40', 0, 0, '2025-10-23 02:08:40', '2025-10-23 02:08:40', 'http://127.0.0.1:8000/proyectos/1', 'Nueva reunión programada'),
(71, 4, 'El documento \'Planos\' ha sido eliminado del proyecto \'Elzapato\'.', 'documento', '2025-10-23 02:09:43', 0, 0, '2025-10-23 02:09:43', '2025-10-23 02:09:43', 'http://127.0.0.1:8000/proyectos/4', 'Documento eliminado'),
(72, 1, 'El documento \'Planos\' ha sido eliminado del proyecto \'Elzapato\'.', 'documento', '2025-10-23 02:09:47', 1, 0, '2025-10-23 02:09:47', '2025-10-23 05:30:40', 'http://127.0.0.1:8000/proyectos/4', 'Documento eliminado'),
(73, 3, 'Se ha subido un nuevo documento \'wer\' al proyecto \'Fidel\'.', 'documento', '2025-10-23 02:23:26', 0, 0, '2025-10-23 02:23:26', '2025-10-23 02:23:26', 'http://127.0.0.1:8000/proyectos/1', 'Nuevo documento agregado'),
(74, 1, 'Se ha subido un nuevo documento \'wer\' al proyecto \'Fidel\'.', 'documento', '2025-10-23 02:23:30', 1, 0, '2025-10-23 02:23:30', '2025-10-23 05:30:40', 'http://127.0.0.1:8000/proyectos/1', 'Nuevo documento agregado'),
(75, 2, 'Se ha subido un nuevo documento \'wer\' al proyecto \'Fidel\'.', 'documento', '2025-10-23 02:23:31', 0, 0, '2025-10-23 02:23:31', '2025-10-23 02:23:31', 'http://127.0.0.1:8000/proyectos/1', 'Nuevo documento agregado'),
(76, 3, 'Se ha subido un nuevo documento \'wsad\' al proyecto \'Fidel\'.', 'documento', '2025-10-23 03:58:41', 0, 0, '2025-10-23 03:58:41', '2025-10-23 03:58:41', 'http://127.0.0.1:8000/proyectos/1', 'Nuevo documento agregado'),
(77, 1, 'Se ha subido un nuevo documento \'wsad\' al proyecto \'Fidel\'.', 'documento', '2025-10-23 03:58:56', 1, 0, '2025-10-23 03:58:56', '2025-10-23 05:30:40', 'http://127.0.0.1:8000/proyectos/1', 'Nuevo documento agregado'),
(78, 2, 'Se ha subido un nuevo documento \'wsad\' al proyecto \'Fidel\'.', 'documento', '2025-10-23 03:58:57', 0, 0, '2025-10-23 03:58:57', '2025-10-23 03:58:57', 'http://127.0.0.1:8000/proyectos/1', 'Nuevo documento agregado'),
(79, 3, 'Se ha subido un nuevo documento \'ASD\' al proyecto \'Fidel\'.', 'documento', '2025-10-23 04:22:12', 0, 0, '2025-10-23 04:22:12', '2025-10-23 04:22:12', 'http://127.0.0.1:8000/proyectos/1', 'Nuevo documento agregado'),
(80, 1, 'Se ha subido un nuevo documento \'ASD\' al proyecto \'Fidel\'.', 'documento', '2025-10-23 04:22:15', 1, 0, '2025-10-23 04:22:15', '2025-10-23 05:30:40', 'http://127.0.0.1:8000/proyectos/1', 'Nuevo documento agregado'),
(81, 2, 'Se ha subido un nuevo documento \'ASD\' al proyecto \'Fidel\'.', 'documento', '2025-10-23 04:22:17', 0, 0, '2025-10-23 04:22:17', '2025-10-23 04:22:17', 'http://127.0.0.1:8000/proyectos/1', 'Nuevo documento agregado'),
(82, 3, 'Se ha subido un nuevo documento \'asd\' al proyecto \'Fidel\'.', 'documento', '2025-10-23 04:27:59', 0, 0, '2025-10-23 04:27:59', '2025-10-23 04:27:59', 'http://127.0.0.1:8000/proyectos/1', 'Nuevo documento agregado'),
(83, 1, 'Se ha subido un nuevo documento \'asd\' al proyecto \'Fidel\'.', 'documento', '2025-10-23 04:28:03', 1, 0, '2025-10-23 04:28:03', '2025-10-23 05:30:40', 'http://127.0.0.1:8000/proyectos/1', 'Nuevo documento agregado'),
(84, 2, 'Se ha subido un nuevo documento \'asd\' al proyecto \'Fidel\'.', 'documento', '2025-10-23 04:28:05', 0, 0, '2025-10-23 04:28:05', '2025-10-23 04:28:05', 'http://127.0.0.1:8000/proyectos/1', 'Nuevo documento agregado'),
(85, 3, 'Se ha subido un nuevo documento \'CUIDADO\' al proyecto \'Fidel\'.', 'documento', '2025-10-23 04:43:17', 0, 0, '2025-10-23 04:43:17', '2025-10-23 04:43:17', 'http://127.0.0.1:8000/proyectos/1', 'Nuevo documento'),
(86, 1, 'Se ha subido un nuevo documento \'CUIDADO\' al proyecto \'Fidel\'.', 'documento', '2025-10-23 04:43:21', 1, 0, '2025-10-23 04:43:21', '2025-10-23 05:30:40', 'http://127.0.0.1:8000/proyectos/1', 'Nuevo documento'),
(87, 2, 'Se ha subido un nuevo documento \'CUIDADO\' al proyecto \'Fidel\'.', 'documento', '2025-10-23 04:43:23', 0, 0, '2025-10-23 04:43:23', '2025-10-23 04:43:23', 'http://127.0.0.1:8000/proyectos/1', 'Nuevo documento'),
(88, 3, 'El documento \'sdf\' ha sido enviado a la papelera del proyecto \'Fidel\'.', 'documento', '2025-10-23 05:18:06', 0, 0, '2025-10-23 05:18:06', '2025-10-23 05:18:06', 'http://127.0.0.1:8000/proyectos/1', 'Documento eliminado'),
(89, 1, 'El documento \'sdf\' ha sido enviado a la papelera del proyecto \'Fidel\'.', 'documento', '2025-10-23 05:18:11', 1, 0, '2025-10-23 05:18:11', '2025-10-23 05:30:40', 'http://127.0.0.1:8000/proyectos/1', 'Documento eliminado'),
(90, 2, 'El documento \'sdf\' ha sido enviado a la papelera del proyecto \'Fidel\'.', 'documento', '2025-10-23 05:18:12', 0, 0, '2025-10-23 05:18:12', '2025-10-23 05:18:12', 'http://127.0.0.1:8000/proyectos/1', 'Documento eliminado'),
(91, 4, 'El documento \'Planos\' ha sido enviado a la papelera del proyecto \'Elzapato\'.', 'documento', '2025-10-23 05:23:24', 0, 0, '2025-10-23 05:23:24', '2025-10-23 05:23:24', 'http://127.0.0.1:8000/proyectos/4', 'Documento eliminado'),
(92, 1, 'El documento \'Planos\' ha sido enviado a la papelera del proyecto \'Elzapato\'.', 'documento', '2025-10-23 05:23:30', 1, 0, '2025-10-23 05:23:30', '2025-10-23 05:30:40', 'http://127.0.0.1:8000/proyectos/4', 'Documento eliminado'),
(93, 4, 'El documento \'fsd\' ha sido enviado a la papelera del proyecto \'Elzapato\'.', 'documento', '2025-10-23 05:23:35', 0, 0, '2025-10-23 05:23:35', '2025-10-23 05:23:35', 'http://127.0.0.1:8000/proyectos/4', 'Documento eliminado'),
(94, 1, 'El documento \'fsd\' ha sido enviado a la papelera del proyecto \'Elzapato\'.', 'documento', '2025-10-23 05:23:39', 1, 0, '2025-10-23 05:23:39', '2025-10-23 05:30:40', 'http://127.0.0.1:8000/proyectos/4', 'Documento eliminado'),
(95, 4, 'El documento \'fsd\' ha sido enviado a la papelera del proyecto \'Elzapato\'.', 'documento', '2025-10-23 05:23:47', 0, 0, '2025-10-23 05:23:47', '2025-10-23 05:23:47', 'http://127.0.0.1:8000/proyectos/4', 'Documento eliminado'),
(96, 1, 'El documento \'fsd\' ha sido enviado a la papelera del proyecto \'Elzapato\'.', 'documento', '2025-10-23 05:23:50', 1, 0, '2025-10-23 05:23:50', '2025-10-28 01:22:54', 'http://127.0.0.1:8000/proyectos/4', 'Documento eliminado'),
(97, 3, 'Se ha subido un nuevo documento \'fd\' al proyecto \'Fidel\'.', 'documento', '2025-10-28 01:38:20', 0, 0, '2025-10-28 01:38:20', '2025-10-28 01:38:20', 'http://127.0.0.1:8000/proyectos/1', 'Nuevo documento'),
(98, 1, 'Se ha subido un nuevo documento \'fd\' al proyecto \'Fidel\'.', 'documento', '2025-10-28 01:38:33', 1, 0, '2025-10-28 01:38:33', '2025-10-28 01:41:42', 'http://127.0.0.1:8000/proyectos/1', 'Nuevo documento'),
(99, 2, 'Se ha subido un nuevo documento \'fd\' al proyecto \'Fidel\'.', 'documento', '2025-10-28 01:38:35', 0, 0, '2025-10-28 01:38:35', '2025-10-28 01:38:35', 'http://127.0.0.1:8000/proyectos/1', 'Nuevo documento'),
(100, 3, 'Se ha subido un nuevo documento \'WSAD\' al proyecto \'JIJIRI\'.', 'documento', '2025-10-28 01:39:07', 0, 0, '2025-10-28 01:39:07', '2025-10-28 01:39:07', 'http://127.0.0.1:8000/proyectos/2', 'Nuevo documento'),
(101, 2, 'Se ha subido un nuevo documento \'WSAD\' al proyecto \'JIJIRI\'.', 'documento', '2025-10-28 01:39:10', 0, 0, '2025-10-28 01:39:10', '2025-10-28 01:39:10', 'http://127.0.0.1:8000/proyectos/2', 'Nuevo documento'),
(102, 1, 'Se te ha asignado el proyecto: HOLA ES UN CASTILLO', 'proyecto', '2025-10-28 02:10:01', 0, 0, '2025-10-28 02:10:01', '2025-10-28 02:10:01', 'http://127.0.0.1:8000/proyectos/5', 'Asignación de proyecto'),
(103, 4, 'Tu proyecto \'HOLA ES UN CASTILLO\' ha sido creado correctamente.', 'proyecto', '2025-10-28 02:10:09', 0, 0, '2025-10-28 02:10:09', '2025-10-28 02:10:09', 'http://127.0.0.1:8000/proyectos/5', 'Proyecto creado'),
(104, 1, 'Se ha subido el primer archivo BIM del proyecto \'HOLA ES UN CASTILLO\'.', 'documento', '2025-10-28 02:10:12', 0, 0, '2025-10-28 02:10:12', '2025-10-28 02:10:12', 'http://127.0.0.1:8000/proyectos/5', 'Archivo BIM cargado'),
(105, 4, 'Se ha subido el primer archivo BIM del proyecto \'HOLA ES UN CASTILLO\'.', 'documento', '2025-10-28 02:10:13', 0, 0, '2025-10-28 02:10:13', '2025-10-28 02:10:13', 'http://127.0.0.1:8000/proyectos/5', 'Archivo BIM cargado'),
(106, 1, 'Se te ha asignado el proyecto: PRUEBA 27', 'proyecto', '2025-10-28 02:39:12', 0, 0, '2025-10-28 02:39:12', '2025-10-28 02:39:12', 'http://127.0.0.1:8000/proyectos/6', 'Asignación de proyecto'),
(107, 4, 'Tu proyecto \'PRUEBA 27\' ha sido creado correctamente.', 'proyecto', '2025-10-28 02:39:15', 0, 0, '2025-10-28 02:39:15', '2025-10-28 02:39:15', 'http://127.0.0.1:8000/proyectos/6', 'Proyecto creado'),
(108, 1, 'Se ha subido el primer archivo BIM del proyecto \'PRUEBA 27\'.', 'documento', '2025-10-28 02:39:18', 0, 0, '2025-10-28 02:39:18', '2025-10-28 02:39:18', 'http://127.0.0.1:8000/proyectos/6', 'Archivo BIM cargado'),
(109, 4, 'Se ha subido el primer archivo BIM del proyecto \'PRUEBA 27\'.', 'documento', '2025-10-28 02:39:20', 0, 0, '2025-10-28 02:39:20', '2025-10-28 02:39:20', 'http://127.0.0.1:8000/proyectos/6', 'Archivo BIM cargado'),
(110, 3, 'El documento \'WSAD\' ha sido enviado a la papelera del proyecto \'JIJIRI\'.', 'documento', '2025-10-28 02:58:36', 0, 0, '2025-10-28 02:58:36', '2025-10-28 02:58:36', 'http://127.0.0.1:8000/proyectos/2', 'Documento eliminado'),
(111, 2, 'El documento \'WSAD\' ha sido enviado a la papelera del proyecto \'JIJIRI\'.', 'documento', '2025-10-28 02:58:40', 0, 0, '2025-10-28 02:58:40', '2025-10-28 02:58:40', 'http://127.0.0.1:8000/proyectos/2', 'Documento eliminado'),
(112, 3, 'El documento \'WSAD\' ha sido enviado a la papelera del proyecto \'JIJIRI\'.', 'documento', '2025-10-28 02:59:25', 0, 0, '2025-10-28 02:59:25', '2025-10-28 02:59:25', 'http://127.0.0.1:8000/proyectos/2', 'Documento eliminado'),
(113, 2, 'El documento \'WSAD\' ha sido enviado a la papelera del proyecto \'JIJIRI\'.', 'documento', '2025-10-28 02:59:28', 0, 0, '2025-10-28 02:59:28', '2025-10-28 02:59:28', 'http://127.0.0.1:8000/proyectos/2', 'Documento eliminado'),
(114, 3, 'El documento \'WSAD\' ha sido enviado a la papelera del proyecto \'JIJIRI\'.', 'documento', '2025-10-28 02:59:37', 0, 0, '2025-10-28 02:59:37', '2025-10-28 02:59:37', 'http://127.0.0.1:8000/proyectos/2', 'Documento eliminado'),
(115, 2, 'El documento \'WSAD\' ha sido enviado a la papelera del proyecto \'JIJIRI\'.', 'documento', '2025-10-28 02:59:40', 0, 0, '2025-10-28 02:59:40', '2025-10-28 02:59:40', 'http://127.0.0.1:8000/proyectos/2', 'Documento eliminado'),
(116, 1, 'El usuario Fidel Eliseo ha descargado el documento \'fd\' del proyecto \'Fidel\'.', 'documento', '2025-10-28 03:10:11', 0, 0, '2025-10-28 03:10:11', '2025-10-28 03:10:11', 'http://127.0.0.1:8000/proyectos/1', 'Documento descargado'),
(117, 1, 'El usuario Fidel Eliseo ha descargado el documento \'fd\' del proyecto \'Fidel\'.', 'documento', '2025-10-28 03:17:50', 0, 0, '2025-10-28 03:17:50', '2025-10-28 03:17:50', 'http://127.0.0.1:8000/proyectos/1', 'Documento descargado'),
(118, 3, 'El documento \'fd\' ha sido enviado a la papelera del proyecto \'Fidel\'.', 'documento', '2025-10-28 03:18:16', 0, 0, '2025-10-28 03:18:16', '2025-10-28 03:18:16', 'http://127.0.0.1:8000/proyectos/1', 'Documento eliminado'),
(119, 1, 'El documento \'fd\' ha sido enviado a la papelera del proyecto \'Fidel\'.', 'documento', '2025-10-28 03:18:20', 0, 0, '2025-10-28 03:18:20', '2025-10-28 03:18:20', 'http://127.0.0.1:8000/proyectos/1', 'Documento eliminado'),
(120, 2, 'El documento \'fd\' ha sido enviado a la papelera del proyecto \'Fidel\'.', 'documento', '2025-10-28 03:18:21', 0, 0, '2025-10-28 03:18:21', '2025-10-28 03:18:21', 'http://127.0.0.1:8000/proyectos/1', 'Documento eliminado'),
(121, 3, 'Se ha subido un nuevo documento \'WSAD\' al proyecto \'Fidel\'.', 'documento', '2025-10-28 03:26:55', 0, 0, '2025-10-28 03:26:55', '2025-10-28 03:26:55', 'http://127.0.0.1:8000/proyectos/1', 'Nuevo documento'),
(122, 1, 'Se ha subido un nuevo documento \'WSAD\' al proyecto \'Fidel\'.', 'documento', '2025-10-28 03:27:00', 0, 0, '2025-10-28 03:27:00', '2025-10-28 03:27:00', 'http://127.0.0.1:8000/proyectos/1', 'Nuevo documento'),
(123, 2, 'Se ha subido un nuevo documento \'WSAD\' al proyecto \'Fidel\'.', 'documento', '2025-10-28 03:27:01', 0, 0, '2025-10-28 03:27:01', '2025-10-28 03:27:01', 'http://127.0.0.1:8000/proyectos/1', 'Nuevo documento'),
(124, 1, 'El usuario Fidel Eliseo ha descargado el documento \'WSAD\' del proyecto \'Fidel\'.', 'documento', '2025-10-28 03:27:58', 0, 0, '2025-10-28 03:27:58', '2025-10-28 03:27:58', 'http://127.0.0.1:8000/proyectos/1', 'Documento descargado'),
(125, 3, 'El documento \'WSAD\' ha sido enviado a la papelera del proyecto \'Fidel\'.', 'documento', '2025-10-28 03:32:49', 0, 0, '2025-10-28 03:32:49', '2025-10-28 03:32:49', 'http://127.0.0.1:8000/proyectos/1', 'Documento eliminado'),
(126, 1, 'El documento \'WSAD\' ha sido enviado a la papelera del proyecto \'Fidel\'.', 'documento', '2025-10-28 03:32:52', 1, 0, '2025-10-28 03:32:52', '2025-10-28 03:33:10', 'http://127.0.0.1:8000/proyectos/1', 'Documento eliminado'),
(127, 2, 'El documento \'WSAD\' ha sido enviado a la papelera del proyecto \'Fidel\'.', 'documento', '2025-10-28 03:32:54', 0, 0, '2025-10-28 03:32:54', '2025-10-28 03:32:54', 'http://127.0.0.1:8000/proyectos/1', 'Documento eliminado');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `notificacions`
--

CREATE TABLE `notificacions` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `password_reset_tokens`
--

CREATE TABLE `password_reset_tokens` (
  `email` varchar(255) NOT NULL,
  `token` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `personal_access_tokens`
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
-- Estructura de tabla para la tabla `planos_bim`
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

--
-- Volcado de datos para la tabla `planos_bim`
--

INSERT INTO `planos_bim` (`id`, `proyecto_id`, `nombre`, `descripcion`, `archivo_url`, `version`, `fecha_subida`, `subido_por`, `eliminado`, `created_at`, `updated_at`) VALUES
(1, 5, 'Ifc2x3_SampleCastle.ifc', NULL, 'planos_bim/V47fFRDeUaHZJaCxcancmHKxgZHdHc4SZnZJw2Dz.txt', 'v1.0', '2025-10-28 02:10:12', 1, 0, '2025-10-28 02:10:12', '2025-10-28 02:10:12'),
(2, 6, 'Ifc2x3_SampleCastle.ifc', NULL, 'planos_bim/QELN17Euq9WDWrsDna3odll8OdfC2sbVAF5DXDAy.txt', 'v1.0', '2025-10-28 02:39:18', 1, 0, '2025-10-28 02:39:18', '2025-10-28 02:39:18');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `proyectos`
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
-- Volcado de datos para la tabla `proyectos`
--

INSERT INTO `proyectos` (`id`, `nombre`, `descripcion`, `estado`, `fecha_inicio`, `fecha_fin`, `cliente_id`, `responsable_id`, `eliminado`, `created_at`, `updated_at`) VALUES
(1, 'Fidel', 'asdasdas', 'activo', '2025-10-02', NULL, 3, 1, 0, '2025-10-21 04:01:53', '2025-10-21 06:06:36'),
(2, 'JIJIRI', 'asd', 'activo', '2025-10-15', NULL, 3, 2, 0, '2025-10-21 04:08:53', '2025-10-21 04:08:53'),
(3, 'Torres', NULL, 'activo', '2025-10-21', NULL, 4, 1, 0, '2025-10-21 06:37:20', '2025-10-21 06:37:20'),
(4, 'Elzapato', NULL, 'activo', '2025-10-21', NULL, 4, 1, 0, '2025-10-21 06:40:20', '2025-10-21 06:40:20'),
(5, 'HOLA ES UN CASTILLO', NULL, 'activo', '2025-10-30', NULL, 4, 1, 0, '2025-10-28 02:10:01', '2025-10-28 02:10:01'),
(6, 'PRUEBA 27', 'asd', 'activo', '2025-10-29', NULL, 4, 1, 0, '2025-10-28 02:39:11', '2025-10-28 02:39:11');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `proyectos_usuarios`
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
-- Volcado de datos para la tabla `proyectos_usuarios`
--

INSERT INTO `proyectos_usuarios` (`id`, `proyecto_id`, `user_id`, `rol_en_proyecto`, `permiso`, `asignado_en`, `eliminado`, `created_at`, `updated_at`) VALUES
(1, 1, 3, 'cliente', 'editar', '2025-10-21 04:41:35', 0, NULL, NULL),
(2, 1, 1, 'responsable', 'ninguno', NULL, 0, NULL, NULL),
(3, 2, 3, 'cliente', 'ninguno', NULL, 0, NULL, NULL),
(4, 2, 2, 'responsable', 'ninguno', NULL, 0, NULL, NULL),
(5, 1, 2, NULL, 'editar', '2025-10-21 03:51:25', 0, NULL, NULL),
(6, 3, 4, 'cliente', 'ninguno', NULL, 0, NULL, NULL),
(7, 3, 1, 'responsable', 'ninguno', NULL, 0, NULL, NULL),
(8, 3, 2, NULL, 'editar', '2025-10-21 06:39:54', 0, NULL, NULL),
(9, 3, 3, NULL, 'editar', '2025-10-21 06:39:54', 0, NULL, NULL),
(10, 4, 4, 'cliente', 'ninguno', NULL, 0, NULL, NULL),
(11, 4, 1, 'responsable', 'ninguno', NULL, 0, NULL, NULL),
(12, 5, 4, 'cliente', 'ninguno', NULL, 0, NULL, NULL),
(13, 5, 1, 'responsable', 'ninguno', NULL, 0, NULL, NULL),
(14, 6, 4, 'cliente', 'ninguno', NULL, 0, NULL, NULL),
(15, 6, 1, 'responsable', 'ninguno', NULL, 0, NULL, NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `proyecto_versiones`
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

--
-- Volcado de datos para la tabla `proyecto_versiones`
--

INSERT INTO `proyecto_versiones` (`id`, `proyecto_id`, `descripcion_cambio`, `autor_id`, `version`, `datos_previos`, `created_at`, `updated_at`) VALUES
(1, 1, 'Actualización de información del proyecto por Fidel Eliseo', 1, 'v1.0', '\"{\\\"descripcion\\\":\\\"ads\\\",\\\"responsable_id\\\":1,\\\"fecha\\\":\\\"2025-10-21 02:06:36\\\"}\"', '2025-10-21 06:06:36', '2025-10-21 06:06:36');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `reuniones`
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

--
-- Volcado de datos para la tabla `reuniones`
--

INSERT INTO `reuniones` (`id`, `proyecto_id`, `titulo`, `descripcion`, `fecha_hora`, `fecha_hora_fin`, `creador_id`, `eliminado`, `created_at`, `updated_at`) VALUES
(1, 1, 'A', 'Epa', '2025-10-21 06:30:00', '2025-10-22 05:30:00', 1, 1, '2025-10-21 04:46:38', '2025-10-21 04:53:28'),
(2, 1, 'sdf', NULL, '2025-10-21 02:00:00', '2025-10-22 02:30:00', 1, 1, '2025-10-21 04:55:40', '2025-10-21 05:37:48'),
(3, 1, 'sdfsdf', 'sdfsd', '2025-10-21 03:30:00', '2025-10-21 09:00:00', 1, 1, '2025-10-21 05:38:26', '2025-10-21 05:38:37'),
(4, 1, 'sfsdfsdfsd', 'sfdfsd', '2025-10-21 04:30:00', '2025-10-21 05:00:00', 1, 0, '2025-10-21 05:43:59', '2025-10-21 05:43:59'),
(5, 4, 'dfsfsd', 'fsdfsd', '2025-10-22 04:00:00', '2025-10-22 04:30:00', 1, 0, '2025-10-21 07:09:29', '2025-10-21 07:09:29'),
(6, 1, 'fgdfdg', 'gdfgfdfdg', '2025-10-23 03:00:00', '2025-10-23 03:30:00', 1, 1, '2025-10-21 07:12:43', '2025-10-21 03:37:08'),
(7, 1, 'gfdgfdfdg', 'fdg', '2025-10-23 03:00:00', '2025-10-23 03:30:00', 1, 0, '2025-10-23 01:11:57', '2025-10-23 01:11:57'),
(8, 1, 'rgses', NULL, '2025-10-23 04:00:00', '2025-10-23 04:30:00', 1, 0, '2025-10-23 02:08:33', '2025-10-23 02:08:33');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `reuniones_usuarios`
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

--
-- Volcado de datos para la tabla `reuniones_usuarios`
--

INSERT INTO `reuniones_usuarios` (`id`, `reunion_id`, `user_id`, `asistio`, `eliminado`, `created_at`, `updated_at`) VALUES
(1, 1, 1, 0, 0, NULL, NULL),
(2, 1, 3, 0, 0, NULL, NULL),
(3, 1, 2, 0, 0, NULL, NULL),
(4, 2, 1, 0, 0, NULL, NULL),
(5, 3, 1, 0, 0, NULL, NULL),
(6, 4, 1, 0, 0, NULL, NULL),
(7, 5, 1, 0, 0, NULL, NULL),
(8, 5, 2, 0, 0, NULL, NULL),
(9, 5, 3, 0, 0, NULL, NULL),
(10, 6, 1, 0, 0, NULL, NULL),
(11, 7, 1, 0, 0, NULL, NULL),
(12, 7, 3, 0, 0, NULL, NULL),
(13, 8, 1, 0, 0, NULL, NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tareas`
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

--
-- Volcado de datos para la tabla `tareas`
--

INSERT INTO `tareas` (`id`, `proyecto_id`, `titulo`, `descripcion`, `estado`, `prioridad`, `fecha_limite`, `asignado_id`, `creador_id`, `eliminado`, `created_at`, `updated_at`) VALUES
(1, 1, 'WSAD', 'asdasd', 'pendiente', 'media', '2025-10-30', 2, NULL, 0, '2025-10-21 04:32:26', '2025-10-21 04:32:26');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tarea_historials`
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

--
-- Volcado de datos para la tabla `tarea_historials`
--

INSERT INTO `tarea_historials` (`id`, `proyecto_id`, `tarea_id`, `usuario_id`, `estado_anterior`, `estado_nuevo`, `cambio`, `fecha_cambio`, `created_at`, `updated_at`) VALUES
(1, 1, 1, 1, 'pendiente', NULL, 'Creación de la tarea (estado inicial pendiente)', '2025-10-21 04:32:26', '2025-10-21 04:32:26', '2025-10-21 04:32:26');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `users`
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
-- Volcado de datos para la tabla `users`
--

INSERT INTO `users` (`id`, `name`, `apellido`, `email`, `password`, `telefono`, `rol`, `estado`, `intentos_fallidos`, `eliminado`, `email_verified_at`, `remember_token`, `created_at`, `updated_at`) VALUES
(1, 'Fidel Eliseo', 'Reyes Ramirez', 'fideleliseoreyesramirez@gmail.com', '$2y$12$HTc89fEiYapIuUMzDh1J5O5QhwcUi582LSqr7byzoK8XeCUbgjD8.', '73223555', 'admin', 'activo', 0, 0, '2025-10-08 01:32:50', NULL, '2025-10-01 06:16:51', '2025-10-28 03:02:41'),
(2, 'Victor Santiago', 'Albarracin Miranda', 'albarracinvictor251@gmail.com', '$2y$12$K65t8D3vpNupwSO.4DZKguOE87p4CpqdFW5GT.V8SrU0Egli6.U5u', NULL, 'ingeniero', 'activo', 0, 0, NULL, NULL, '2025-10-21 03:17:34', '2025-10-28 01:46:03'),
(3, 'Adriano Leandro', 'Daza Campero', 'adrianoleandrodazacampero@gmail.com', '$2y$12$K65t8D3vpNupwSO.4DZKguOE87p4CpqdFW5GT.V8SrU0Egli6.U5u', NULL, 'admin', 'activo', 0, 0, NULL, NULL, '2025-10-21 03:17:34', '2025-10-28 03:33:28'),
(4, 'Erick Alan', 'Paniagua Berrios', 'epaniaguaberrios@gmail.com', '$2y$12$K65t8D3vpNupwSO.4DZKguOE87p4CpqdFW5GT.V8SrU0Egli6.U5u', '70430818', 'cliente', 'activo', 0, 0, NULL, NULL, '2025-10-21 03:17:34', '2025-10-21 03:17:34');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `auditoria_logs`
--
ALTER TABLE `auditoria_logs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `auditoria_logs_user_id_foreign` (`user_id`);

--
-- Indices de la tabla `cache`
--
ALTER TABLE `cache`
  ADD PRIMARY KEY (`key`);

--
-- Indices de la tabla `cache_locks`
--
ALTER TABLE `cache_locks`
  ADD PRIMARY KEY (`key`);

--
-- Indices de la tabla `descargas_historial`
--
ALTER TABLE `descargas_historial`
  ADD PRIMARY KEY (`id`),
  ADD KEY `descargas_historial_user_id_foreign` (`user_id`),
  ADD KEY `descargas_historial_documento_id_foreign` (`documento_id`);

--
-- Indices de la tabla `documentos`
--
ALTER TABLE `documentos`
  ADD PRIMARY KEY (`id`),
  ADD KEY `documentos_proyecto_id_foreign` (`proyecto_id`),
  ADD KEY `documentos_subido_por_foreign` (`subido_por`);

--
-- Indices de la tabla `failed_jobs`
--
ALTER TABLE `failed_jobs`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`);

--
-- Indices de la tabla `historial_permisos`
--
ALTER TABLE `historial_permisos`
  ADD PRIMARY KEY (`id`),
  ADD KEY `historial_permisos_proyecto_id_foreign` (`proyecto_id`),
  ADD KEY `historial_permisos_usuario_modificador_id_foreign` (`usuario_modificador_id`),
  ADD KEY `historial_permisos_usuario_afectado_id_foreign` (`usuario_afectado_id`);

--
-- Indices de la tabla `hitos`
--
ALTER TABLE `hitos`
  ADD PRIMARY KEY (`id`),
  ADD KEY `hitos_proyecto_id_foreign` (`proyecto_id`),
  ADD KEY `hitos_encargado_id_foreign` (`encargado_id`),
  ADD KEY `hitos_documento_id_foreign` (`documento_id`);

--
-- Indices de la tabla `jobs`
--
ALTER TABLE `jobs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `jobs_queue_index` (`queue`);

--
-- Indices de la tabla `job_batches`
--
ALTER TABLE `job_batches`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `migrations`
--
ALTER TABLE `migrations`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `notificaciones`
--
ALTER TABLE `notificaciones`
  ADD PRIMARY KEY (`id`),
  ADD KEY `notificaciones_user_id_foreign` (`user_id`);

--
-- Indices de la tabla `notificacions`
--
ALTER TABLE `notificacions`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `password_reset_tokens`
--
ALTER TABLE `password_reset_tokens`
  ADD PRIMARY KEY (`email`);

--
-- Indices de la tabla `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `personal_access_tokens_token_unique` (`token`),
  ADD KEY `personal_access_tokens_tokenable_type_tokenable_id_index` (`tokenable_type`,`tokenable_id`),
  ADD KEY `personal_access_tokens_expires_at_index` (`expires_at`);

--
-- Indices de la tabla `planos_bim`
--
ALTER TABLE `planos_bim`
  ADD PRIMARY KEY (`id`),
  ADD KEY `planos_bim_proyecto_id_foreign` (`proyecto_id`),
  ADD KEY `planos_bim_subido_por_foreign` (`subido_por`);

--
-- Indices de la tabla `proyectos`
--
ALTER TABLE `proyectos`
  ADD PRIMARY KEY (`id`),
  ADD KEY `proyectos_cliente_id_foreign` (`cliente_id`),
  ADD KEY `proyectos_responsable_id_foreign` (`responsable_id`);

--
-- Indices de la tabla `proyectos_usuarios`
--
ALTER TABLE `proyectos_usuarios`
  ADD PRIMARY KEY (`id`),
  ADD KEY `proyectos_usuarios_proyecto_id_foreign` (`proyecto_id`),
  ADD KEY `proyectos_usuarios_user_id_foreign` (`user_id`);

--
-- Indices de la tabla `proyecto_versiones`
--
ALTER TABLE `proyecto_versiones`
  ADD PRIMARY KEY (`id`),
  ADD KEY `proyecto_versiones_proyecto_id_foreign` (`proyecto_id`),
  ADD KEY `proyecto_versiones_autor_id_foreign` (`autor_id`);

--
-- Indices de la tabla `reuniones`
--
ALTER TABLE `reuniones`
  ADD PRIMARY KEY (`id`),
  ADD KEY `reuniones_proyecto_id_foreign` (`proyecto_id`),
  ADD KEY `reuniones_creador_id_foreign` (`creador_id`);

--
-- Indices de la tabla `reuniones_usuarios`
--
ALTER TABLE `reuniones_usuarios`
  ADD PRIMARY KEY (`id`),
  ADD KEY `reuniones_usuarios_reunion_id_foreign` (`reunion_id`),
  ADD KEY `reuniones_usuarios_user_id_foreign` (`user_id`);

--
-- Indices de la tabla `tareas`
--
ALTER TABLE `tareas`
  ADD PRIMARY KEY (`id`),
  ADD KEY `tareas_proyecto_id_foreign` (`proyecto_id`),
  ADD KEY `tareas_asignado_id_foreign` (`asignado_id`),
  ADD KEY `tareas_creador_id_foreign` (`creador_id`);

--
-- Indices de la tabla `tarea_historials`
--
ALTER TABLE `tarea_historials`
  ADD PRIMARY KEY (`id`),
  ADD KEY `tarea_historials_proyecto_id_foreign` (`proyecto_id`),
  ADD KEY `tarea_historials_tarea_id_foreign` (`tarea_id`),
  ADD KEY `tarea_historials_usuario_id_foreign` (`usuario_id`);

--
-- Indices de la tabla `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `users_email_unique` (`email`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `auditoria_logs`
--
ALTER TABLE `auditoria_logs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;

--
-- AUTO_INCREMENT de la tabla `descargas_historial`
--
ALTER TABLE `descargas_historial`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `documentos`
--
ALTER TABLE `documentos`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT de la tabla `failed_jobs`
--
ALTER TABLE `failed_jobs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `historial_permisos`
--
ALTER TABLE `historial_permisos`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT de la tabla `hitos`
--
ALTER TABLE `hitos`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `jobs`
--
ALTER TABLE `jobs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `migrations`
--
ALTER TABLE `migrations`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=26;

--
-- AUTO_INCREMENT de la tabla `notificaciones`
--
ALTER TABLE `notificaciones`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=128;

--
-- AUTO_INCREMENT de la tabla `notificacions`
--
ALTER TABLE `notificacions`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `planos_bim`
--
ALTER TABLE `planos_bim`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `proyectos`
--
ALTER TABLE `proyectos`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT de la tabla `proyectos_usuarios`
--
ALTER TABLE `proyectos_usuarios`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT de la tabla `proyecto_versiones`
--
ALTER TABLE `proyecto_versiones`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `reuniones`
--
ALTER TABLE `reuniones`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT de la tabla `reuniones_usuarios`
--
ALTER TABLE `reuniones_usuarios`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT de la tabla `tareas`
--
ALTER TABLE `tareas`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `tarea_historials`
--
ALTER TABLE `tarea_historials`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `auditoria_logs`
--
ALTER TABLE `auditoria_logs`
  ADD CONSTRAINT `auditoria_logs_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Filtros para la tabla `descargas_historial`
--
ALTER TABLE `descargas_historial`
  ADD CONSTRAINT `descargas_historial_documento_id_foreign` FOREIGN KEY (`documento_id`) REFERENCES `documentos` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `descargas_historial_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `documentos`
--
ALTER TABLE `documentos`
  ADD CONSTRAINT `documentos_proyecto_id_foreign` FOREIGN KEY (`proyecto_id`) REFERENCES `proyectos` (`id`),
  ADD CONSTRAINT `documentos_subido_por_foreign` FOREIGN KEY (`subido_por`) REFERENCES `users` (`id`);

--
-- Filtros para la tabla `historial_permisos`
--
ALTER TABLE `historial_permisos`
  ADD CONSTRAINT `historial_permisos_proyecto_id_foreign` FOREIGN KEY (`proyecto_id`) REFERENCES `proyectos` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `historial_permisos_usuario_afectado_id_foreign` FOREIGN KEY (`usuario_afectado_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `historial_permisos_usuario_modificador_id_foreign` FOREIGN KEY (`usuario_modificador_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `hitos`
--
ALTER TABLE `hitos`
  ADD CONSTRAINT `hitos_documento_id_foreign` FOREIGN KEY (`documento_id`) REFERENCES `documentos` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `hitos_encargado_id_foreign` FOREIGN KEY (`encargado_id`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `hitos_proyecto_id_foreign` FOREIGN KEY (`proyecto_id`) REFERENCES `proyectos` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `notificaciones`
--
ALTER TABLE `notificaciones`
  ADD CONSTRAINT `notificaciones_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Filtros para la tabla `planos_bim`
--
ALTER TABLE `planos_bim`
  ADD CONSTRAINT `planos_bim_proyecto_id_foreign` FOREIGN KEY (`proyecto_id`) REFERENCES `proyectos` (`id`),
  ADD CONSTRAINT `planos_bim_subido_por_foreign` FOREIGN KEY (`subido_por`) REFERENCES `users` (`id`);

--
-- Filtros para la tabla `proyectos`
--
ALTER TABLE `proyectos`
  ADD CONSTRAINT `proyectos_cliente_id_foreign` FOREIGN KEY (`cliente_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `proyectos_responsable_id_foreign` FOREIGN KEY (`responsable_id`) REFERENCES `users` (`id`);

--
-- Filtros para la tabla `proyectos_usuarios`
--
ALTER TABLE `proyectos_usuarios`
  ADD CONSTRAINT `proyectos_usuarios_proyecto_id_foreign` FOREIGN KEY (`proyecto_id`) REFERENCES `proyectos` (`id`),
  ADD CONSTRAINT `proyectos_usuarios_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Filtros para la tabla `proyecto_versiones`
--
ALTER TABLE `proyecto_versiones`
  ADD CONSTRAINT `proyecto_versiones_autor_id_foreign` FOREIGN KEY (`autor_id`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `proyecto_versiones_proyecto_id_foreign` FOREIGN KEY (`proyecto_id`) REFERENCES `proyectos` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `reuniones`
--
ALTER TABLE `reuniones`
  ADD CONSTRAINT `reuniones_creador_id_foreign` FOREIGN KEY (`creador_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `reuniones_proyecto_id_foreign` FOREIGN KEY (`proyecto_id`) REFERENCES `proyectos` (`id`);

--
-- Filtros para la tabla `reuniones_usuarios`
--
ALTER TABLE `reuniones_usuarios`
  ADD CONSTRAINT `reuniones_usuarios_reunion_id_foreign` FOREIGN KEY (`reunion_id`) REFERENCES `reuniones` (`id`),
  ADD CONSTRAINT `reuniones_usuarios_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Filtros para la tabla `tareas`
--
ALTER TABLE `tareas`
  ADD CONSTRAINT `tareas_asignado_id_foreign` FOREIGN KEY (`asignado_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `tareas_creador_id_foreign` FOREIGN KEY (`creador_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `tareas_proyecto_id_foreign` FOREIGN KEY (`proyecto_id`) REFERENCES `proyectos` (`id`);

--
-- Filtros para la tabla `tarea_historials`
--
ALTER TABLE `tarea_historials`
  ADD CONSTRAINT `tarea_historials_proyecto_id_foreign` FOREIGN KEY (`proyecto_id`) REFERENCES `proyectos` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `tarea_historials_tarea_id_foreign` FOREIGN KEY (`tarea_id`) REFERENCES `tareas` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `tarea_historials_usuario_id_foreign` FOREIGN KEY (`usuario_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
