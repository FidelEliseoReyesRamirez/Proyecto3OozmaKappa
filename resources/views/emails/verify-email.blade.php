<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Verifica tu correo | DEVELARQ</title>
</head>
<body style="margin:0; padding:0; background-color:#121212; font-family:Arial, sans-serif; color:#fff;">
    <table align="center" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px; margin:auto;">
        <tr>
            <td style="padding:20px; text-align:center; background:#121212;">
                <h1 style="color:#2970E8; margin-bottom:10px;">DEVELARQ</h1>
                <p style="color:#aaa;">BIM Management Office</p>
            </td>
        </tr>

        <tr>
            <td style="background:#1e1e1e; padding:30px; border-radius:8px;">
                <h2 style="margin-top:0; color:#fff;">Hola 👋</h2>
                <p style="color:#ccc;">Haz clic en el botón de abajo para verificar tu correo electrónico:</p>
                <p style="text-align:center; margin:30px 0;">
                    <a href="{{ $url }}" 
                       style="background:#2970E8; color:#fff; padding:12px 24px; border-radius:6px; text-decoration:none; font-weight:bold;">
                        Verificar Correo
                    </a>
                </p>
                <p style="color:#aaa; font-size:14px;">Si no creaste esta cuenta, puedes ignorar este correo.</p>
            </td>
        </tr>

        <tr>
            <td style="padding:20px; text-align:center; color:#666; font-size:12px;">
                © {{ date('Y') }} DEVELARQ | Todos los derechos reservados.
            </td>
        </tr>
    </table>
</body>
</html>
