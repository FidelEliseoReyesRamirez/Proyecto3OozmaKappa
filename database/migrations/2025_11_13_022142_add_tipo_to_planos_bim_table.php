<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {
        Schema::table('planos_bim', function (Blueprint $table) {
            $table->string('tipo', 50)->default('PDF')->after('descripcion');
        });
    }

    public function down()
    {
        Schema::table('planos_bim', function (Blueprint $table) {
            $table->dropColumn('tipo');
        });
    }
};
