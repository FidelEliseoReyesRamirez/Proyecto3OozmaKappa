<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Password;
use Inertia\Inertia;
use Inertia\Response;
use App\Mail\CuentaBloqueadaMail;

class AuthenticatedSessionController extends Controller
{
    public function create(): Response
    {
        return Inertia::render('Auth/Login', [
            'canResetPassword' => Route::has('password.request'),
            'status' => session('status'),
        ]);
    }

    public function store(LoginRequest $request): RedirectResponse
    {
        $user = \App\Models\User::where('email', $request->email)->first();

        // Caso: cuenta ya está inactiva
        if ($user && $user->estado === 'inactivo') {
            return back()->withErrors([
                'email' => 'Tu cuenta está inactiva. Revisa tu correo para desbloquearla.',
            ]);
        }

        // Intento de login fallido
        if (!Auth::attempt($request->only('email', 'password'))) {
            if ($user) {
                $user->intentos_fallidos += 1;

                if ($user->intentos_fallidos >= 5) {
                    $user->estado = 'inactivo';
                    $user->save();

                    // Generar token y URL de reseteo
                    $token = Password::createToken($user);
                    $resetUrl = url(route('password.reset', [
                        'token' => $token,
                        'email' => $user->email,
                    ], false));

                    // Enviar correo
                    Mail::to($user->email)->send(new CuentaBloqueadaMail($user, $resetUrl));

                    return back()->withErrors([
                        'email' => 'Tu cuenta ha sido desactivada tras múltiples intentos fallidos. Revisa tu correo.',
                    ]);
                }

                $user->save();
            }

            return back()->withErrors([
                'email' => 'Las credenciales no son válidas.',
            ]);
        }

        //  Login exitoso
        $request->session()->regenerate();
        $user = \App\Models\User::find(Auth::id());

        if ($user) {
            $user->intentos_fallidos = 0;
            $user->save();

            //  Registrar inicio de sesión en auditoría
            DB::table('auditoria_logs')->insert([
                'user_id' => $user->id,
                'accion' => 'Inicio de sesión',
                'tabla_afectada' => 'users',
                'id_registro_afectado' => $user->id,
                'ip_usuario' => $request->ip(),
                'created_at' => now(),
            ]);
        }

        return redirect()->route('dashboard');
    }


    public function destroy(Request $request): RedirectResponse
    {
        $user = Auth::user();

        if ($user) {
            DB::table('auditoria_logs')->insert([
                'user_id' => $user->id,
                'accion' => 'Cierre de sesión',
                'tabla_afectada' => 'users',
                'id_registro_afectado' => $user->id,
                'ip_usuario' => $request->ip(),
                'created_at' => now(),
            ]);
        }

        Auth::guard('web')->logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/');
    }
}
