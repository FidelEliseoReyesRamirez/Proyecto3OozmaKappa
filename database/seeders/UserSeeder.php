<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('users')->insert([
            [
                'name' => 'Fidel Eliseo',
                'apellido' => 'Reyes Ramirez',
                'email' => 'fideleliseoreyesramirez@gmail.com',
                'password' => '$2y$12$HTc89fEiYapIuUMzDh1J5O5QhwcUi582LSqr7byzoK8XeCUbgjD8.',
                'telefono' => '73223555',
                'rol' => 'ingeniero',
                'estado' => 'activo',
                'intentos_fallidos' => 0,
                'eliminado' => 0,
                'email_verified_at' => null,
                'remember_token' => null,
                'created_at' => '2025-10-01 02:16:51',
                'updated_at' => now(),
            ],
            [
                'name' => 'Victor Santiago',
                'apellido' => 'Albarracin Miranda',
                'email' => 'albarracinvictor251@gmail.com',
                'password' => '$2y$12$K65t8D3vpNupwSO.4DZKguOE87p4CpqdFW5GT.V8SrU0Egli6.U5u',
                'telefono' => null,
                'rol' => 'ingeniero',
                'estado' => 'activo',
                'intentos_fallidos' => 0,
                'eliminado' => 0,
                'email_verified_at' => null,
                'remember_token' => null,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Adriano Leandro',
                'apellido' => 'Daza Campero',
                'email' => 'dazaadriano12@gmail.com',
                'password' => '$2y$12$K65t8D3vpNupwSO.4DZKguOE87p4CpqdFW5GT.V8SrU0Egli6.U5u',
                'telefono' => null,
                'rol' => 'ingeniero',
                'estado' => 'activo',
                'intentos_fallidos' => 0,
                'eliminado' => 0,
                'email_verified_at' => null,
                'remember_token' => null,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Erick Alan',
                'apellido' => 'Paniagua Berrios',
                'email' => 'erickalanpaniaguaberrios@gmail.com',
                'password' => '$2y$12$K65t8D3vpNupwSO.4DZKguOE87p4CpqdFW5GT.V8SrU0Egli6.U5u',
                'telefono' => null,
                'rol' => 'ingeniero',
                'estado' => 'activo',
                'intentos_fallidos' => 0,
                'eliminado' => 0,
                'email_verified_at' => null,
                'remember_token' => null,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}
