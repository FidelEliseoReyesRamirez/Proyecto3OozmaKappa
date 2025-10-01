<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use App\Mail\CuentaCreadaMail;
use Illuminate\Support\Facades\Auth;

class UserController extends Controller
{
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

        Mail::to($user->email)->send(new CuentaCreadaMail($user, $password));

        DB::table('auditoria_logs')->insert([
            'user_id' => Auth::id(),
            'accion' => "Creó al usuario {$user->email} con rol {$user->rol}",
            'tabla_afectada' => 'users',
            'id_registro_afectado' => $user->id,
            'ip_usuario' => $request->ip(),
            'created_at' => now(),
        ]);

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

        $user->update($request->only(['name','apellido','email','telefono','rol']));

        DB::table('auditoria_logs')->insert([
            'user_id' => Auth::id(),
            'accion' => "Editó al usuario {$user->email}",
            'tabla_afectada' => 'users',
            'id_registro_afectado' => $user->id,
            'ip_usuario' => $request->ip(),
            'created_at' => now(),
        ]);

        return redirect()->route('users.index')->with('success', 'Usuario actualizado correctamente.');
    }

    public function updateEstado(Request $request, User $user)
    {
        $user->estado = $user->estado === 'activo' ? 'inactivo' : 'activo';
        $user->save();

        DB::table('auditoria_logs')->insert([
            'user_id' => Auth::id(),
            'accion' => "Cambio de estado del usuario {$user->email} a {$user->estado}",
            'tabla_afectada' => 'users',
            'id_registro_afectado' => $user->id,
            'ip_usuario' => $request->ip(),
            'created_at' => now(),
        ]);

        return redirect()->back()->with('success', 'Estado actualizado.');
    }

    public function eliminar(Request $request, User $user)
    {
        $user->eliminado = 1;
        $user->save();

        DB::table('auditoria_logs')->insert([
            'user_id' => Auth::id(),
            'accion' => "Eliminó al usuario {$user->email}",
            'tabla_afectada' => 'users',
            'id_registro_afectado' => $user->id,
            'ip_usuario' => $request->ip(),
            'created_at' => now(),
        ]);

        return redirect()->back()->with('success', 'Usuario eliminado.');
    }

    public function restaurar(Request $request, User $user)
    {
        $user->eliminado = 0;
        $user->save();

        DB::table('auditoria_logs')->insert([
            'user_id' => Auth::id(),
            'accion' => "Restauró al usuario {$user->email}",
            'tabla_afectada' => 'users',
            'id_registro_afectado' => $user->id,
            'ip_usuario' => $request->ip(),
            'created_at' => now(),
        ]);

        return redirect()->back()->with('success', 'Usuario restaurado.');
    }
}
