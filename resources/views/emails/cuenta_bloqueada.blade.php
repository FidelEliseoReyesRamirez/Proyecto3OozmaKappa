<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Recuperación de cuenta</title>
</head>
<body>
    <h2>Hola {{ $name }},</h2>
    <p>Tu cuenta ha sido desactivada temporalmente debido a múltiples intentos fallidos de inicio de sesión.</p>
    <p>Para recuperar el acceso, debes cambiar tu contraseña. Haz clic en el botón a continuación:</p>

    <p style="text-align: center;">
        <a href="{{ $resetUrl }}" 
           style="background-color: #2563eb; color: #fff; padding: 12px 20px; text-decoration: none; border-radius: 5px;">
            Cambiar contraseña
        </a>
    </p>

    <p>Después de restablecer tu contraseña, tu cuenta será reactivada automáticamente.</p>
    <br>
    <p>Gracias,</p>
    <p><strong>El equipo de DevelArq</strong></p>
</body>
</html>
