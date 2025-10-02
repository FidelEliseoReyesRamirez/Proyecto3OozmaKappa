<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Cuenta creada en DEVELARQ</title>
</head>
<body style="background-color: #000000; color: #ffffff; font-family: Arial, sans-serif; padding: 20px;">
    
    <div style="max-width: 600px; margin: 0 auto; padding: 30px; background-color: #1a1a1a; border-radius: 8px; border: 1px solid #2970E8;">
        
        <h1 style="color: #ffffff; margin-top: 0; font-size: 24px;">Hola {{ $user->name }} {{ $user->apellido }}</h1>
        
        <p style="color: #a0aec0; line-height: 1.6;">Tu cuenta en DevelArq ha sido creada exitosamente. Estos son tus detalles de acceso inicial:</p>

        <div style="background-color: #0d0d0d; padding: 15px; border-radius: 4px; margin: 20px 0; border-left: 4px solid #2970E8;">
            <p style="color: #ffffff; margin: 0 0 10px 0;"><strong>Email:</strong> <span style="font-weight: normal; word-break: break-all;">{{ $user->email }}</span></p>
            <p style="color: #ffffff; margin: 0;"><strong>Contraseña temporal:</strong> <span style="font-size: 1.1em; font-weight: bold; color: #B3E10F;">{{ $password }}</span></p>
        </div>

        <p style="color: #B3E10F; font-weight: bold; margin-top: 20px; line-height: 1.6;">
            ⚠️ IMPORTANTE: Esta contraseña se muestra solo una vez. Debes cambiarla de inmediato al iniciar sesión por primera vez.
        </p>

        <br>
        <p style="color: #a0aec0; line-height: 1.6;">Puedes iniciar sesión en nuestra plataforma <a href="{{ config('app.url') }}" style="color: #2970E8; text-decoration: none;">haciendo clic aquí</a>.</p>
        
        <p style="color: #a0aec0; margin-bottom: 0;">Saludos,</p>
        <p style="color: #ffffff; margin-top: 5px;"><strong>El equipo de DevelArq</strong></p>
    </div>
</body>
</html>