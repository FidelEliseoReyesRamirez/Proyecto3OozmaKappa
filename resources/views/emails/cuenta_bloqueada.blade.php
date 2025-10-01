<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Recuperación de cuenta</title>
</head>
{{-- Aplicamos fondo y color de texto a todo el cuerpo del correo --}}
<body style="background-color: #000000; color: #ffffff; font-family: Arial, sans-serif; padding: 20px;">
    
    {{-- Contenedor principal para dar un margen visual, usando un gris oscuro como fondo --}}
    <div style="max-width: 600px; margin: 0 auto; padding: 30px; background-color: #1a1a1a; border-radius: 8px; border: 1px solid #2970E8;">
        
        {{-- Título --}}
        <h2 style="color: #ffffff; margin-top: 0;">Hola {{ $name }},</h2>
        
        {{-- Párrafos de mensaje --}}
        <p style="color: #a0aec0; line-height: 1.6;">Tu cuenta ha sido desactivada temporalmente debido a múltiples intentos fallidos de inicio de sesión.</p>
        <p style="color: #a0aec0; line-height: 1.6;">Para recuperar el acceso, debes cambiar tu contraseña. Haz clic en el botón a continuación:</p>

        {{-- Botón (Azul Primario: #2970E8) --}}
        <p style="text-align: center; margin: 30px 0;">
            <a href="{{ $resetUrl }}" 
                style="
                    background-color: #2970E8; 
                    color: #fff; 
                    padding: 12px 25px; 
                    text-decoration: none; 
                    border-radius: 6px;
                    font-weight: bold;
                    display: inline-block;
                ">
                Cambiar contraseña
            </a>
        </p>

        {{-- Mensaje de confirmación y cierre --}}
        <p style="color: #a0aec0; line-height: 1.6;">Después de restablecer tu contraseña, tu cuenta será reactivada automáticamente.</p>
        <br>
        <p style="color: #a0aec0; line-height: 1.6;">Gracias,</p>
        <p style="color: #ffffff; margin: 0;"><strong>El equipo de DevelArq</strong></p>
    </div>
</body>
</html>