<!DOCTYPE html>
<html>
<head>
    <title>Cuenta creada</title>
</head>
<body>
    <h1>Hola {{ $user->name }} {{ $user->apellido }}</h1>
    <p>Tu cuenta en DevelArq ha sido creada.</p>
    <p><strong>Email:</strong> {{ $user->email }}</p>
    <p><strong>Contraseña temporal:</strong> {{ $password }}</p>
    <p>⚠️ Esta contraseña se muestra solo una vez. Debes cambiarla al iniciar sesión.</p>
</body>
</html>
