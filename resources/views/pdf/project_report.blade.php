{{-- resources/views/pdf/project_report.blade.php --}}
<!DOCTYPE html>
<html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <title>Reporte de Avance del Proyecto - {{ $project->nombre }}</title>
    <style>
        /* ... (Estilos CSS se mantienen igual) ... */
        body { font-family: 'Arial', sans-serif; font-size: 10px; }
        h1 { font-size: 16px; color: #1D3557; border-bottom: 2px solid #B3E10F; padding-bottom: 5px; }
        h2 { font-size: 14px; color: #333; margin-top: 15px; }
        table { width: 100%; border-collapse: collapse; margin-top: 10px; }
        th, td { border: 1px solid #ccc; padding: 6px 8px; text-align: left; vertical-align: top; }
        th { background-color: #f2f2f2; font-weight: bold; }
        .header { margin-bottom: 20px; }
        
        .status-{{ strtolower($project->estado) }} { 
            color: {{ strtolower($project->estado) == 'finalizado' ? 'green' : (strtolower($project->estado) == 'en progreso' ? 'orange' : 'red') }};
            font-weight: bold;
        }

        .status-cell {
            font-weight: bold;
            text-transform: capitalize;
        }
        .status-completado, .status-finalizado { color: green; }
        .status-pendiente, .status-enprogreso { color: orange; }
        .status-bloqueado, .status-cancelado { color: red; }
    </style>
</head>
<body>
    <div class="header">
        <h1>Reporte de Historial de Estados del Proyecto</h1>
        <p><strong>Proyecto:</strong> {{ $project->nombre }}</p>
        <p><strong>Cliente:</strong> {{ $project->cliente->name ?? 'N/A' }}</p>
        <p><strong>Estado Actual:</strong> <span class="status-{{ strtolower($project->estado) }}">{{ $project->estado }}</span></p>
        <p><strong>Generado el:</strong> {{ $reporte_fecha }}</p>
    </div>

    <h2>Historial de Hitos y Avances</h2>

    @if($historial->isEmpty())
        <p>No se encontraron hitos o avances para este proyecto.</p>
    @else
        <table>
            <thead>
                <tr>
                    <th style="width: 15%;">Fecha</th>
                    <th style="width: 25%;">Hito/Evento</th>
                    <th style="width: 40%;">Descripción</th>
                    <th style="width: 10%;">Estado</th>
                    <th style="width: 10%;">Encargado</th>
                </tr>
            </thead>
            <tbody>
                @foreach($historial as $item)
                <tr>
                    {{-- ✅ CORRECCIÓN: Usar la fecha ya formateada --}}
                    <td>{{ $item['fecha'] }}</td> 
                    <td>{{ $item['evento'] }}</td>
                    <td>{{ $item['descripcion'] }}</td>
                    <td class="status-cell status-{{ strtolower(str_replace(' ', '', $item['estado'])) }}">
                        {{ $item['estado'] }}
                    </td>
                    <td>{{ $item['encargado'] }}</td>
                </tr>
                @endforeach
            </tbody>
        </table>
    @endif
</body>
</html>