<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;
use App\Mail\CuentaCreadaMail;
use Illuminate\Support\Facades\Auth;
use App\Traits\RegistraAuditoria;

class UserController extends Controller
{
    use RegistraAuditoria;

    public function index()
    {
        $usuarios = User::where('eliminado', 0)->get();
        return inertia('Admin/Users/Index', ['usuarios' => $usuarios]);
    }

    public function eliminados()
    {
        $usuarios = User::where('eliminado', 1)->get();
        return inertia('Admin/Users/Eliminados', ['usuarios' => $usuarios]);
    }

    public function create()
    {
        return inertia('Admin/Users/Form', ['isEdit' => false]);
    }

    public function edit(User $user)
    {
        return inertia('Admin/Users/Form', [
            'isEdit' => true,
            'user' => $user,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:100',
            'apellido' => 'required|string|max:100',
            'email' => 'required|email|unique:users,email',
            'telefono' => 'nullable|string|max:20',
            'rol' => 'required|in:admin,arquitecto,ingeniero,cliente',
        ]);

        $password = Str::random(10);

        $user = User::create([
            'name' => $request->name,
            'apellido' => $request->apellido,
            'email' => $request->email,
            'telefono' => $request->telefono,
            'rol' => $request->rol,
            'estado' => 'activo',
            'eliminado' => 0,
            'password' => Hash::make($password),
        ]);

        // Enviar correo de bienvenida
        Mail::to($user->email)->send(new CuentaCreadaMail($user, $password));

        // Registrar auditoría
        self::registrarAccionManual(
            "Creó al usuario '{$user->name} {$user->apellido}' con rol '{$user->rol}'",
            'users',
            $user->id
        );

        return redirect()->route('users.index')->with('success', 'Usuario creado correctamente.');
    }

    public function update(Request $request, User $user)
    {
        $request->validate([
            'name' => 'required|string|max:100',
            'apellido' => 'required|string|max:100',
            'email' => 'required|email|unique:users,email,' . $user->id,
            'telefono' => 'nullable|string|max:20',
            'rol' => 'required|in:admin,arquitecto,ingeniero,cliente',
        ]);

        $user->update($request->only(['name', 'apellido', 'email', 'telefono', 'rol']));

        self::registrarAccionManual(
            "Actualizó los datos del usuario '{$user->name} {$user->apellido}'",
            'users',
            $user->id
        );

        return redirect()->route('users.index')->with('success', 'Usuario actualizado correctamente.');
    }

    public function updateEstado(User $user)
    {
        $user->estado = $user->estado === 'activo' ? 'inactivo' : 'activo';
        $user->save();

        self::registrarAccionManual(
            "Cambió el estado del usuario '{$user->name} {$user->apellido}' a '{$user->estado}'",
            'users',
            $user->id
        );

        return redirect()->back()->with('success', 'Estado actualizado correctamente.');
    }

    public function eliminar(User $user)
    {
        $user->eliminado = 1;
        $user->save();

        self::registrarAccionManual(
            "Eliminó (movió a papelera) al usuario '{$user->name} {$user->apellido}'",
            'users',
            $user->id,
            true
        );

        return redirect()->back()->with('success', 'Usuario eliminado correctamente.');
    }

    public function restaurar(User $user)
    {
        $user->eliminado = 0;
        $user->save();

        self::registrarAccionManual(
            "Restauró al usuario '{$user->name} {$user->apellido}'",
            'users',
            $user->id
        );

        return redirect()->back()->with('success', 'Usuario restaurado correctamente.');
    }
    public function verificarDuplicado(Request $request)
    {
        $email = $request->input('email');
        $telefono = $request->input('telefono');

        $emailExiste = User::where('email', $email)->exists();
        $telefonoExiste = User::where('telefono', $telefono)
            ->whereNotNull('telefono')
            ->exists();

        return response()->json([
            'emailExiste' => $emailExiste,
            'telefonoExiste' => $telefonoExiste,
        ]);
    }
}
