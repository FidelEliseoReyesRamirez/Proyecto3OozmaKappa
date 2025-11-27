<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('auditoria_logs', function (Blueprint $table) {
            $table->string('ip_address', 50)->nullable()->after('id_registro_afectado');
        });
    }

    public function down()
    {
        Schema::table('auditoria_logs', function (Blueprint $table) {
            $table->dropColumn('ip_address');
        });
    }
};
