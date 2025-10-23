<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{

    public function up()
    {
        Schema::table('documentos', function (Blueprint $table) {
            $table->string('enlace_externo')->nullable()->after('archivo_url');
        });
    }

    public function down()
    {
        Schema::table('documentos', function (Blueprint $table) {
            $table->dropColumn('enlace_externo');
        });
    }
};
