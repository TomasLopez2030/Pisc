using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using back.Models;
using Backend.Data;
using back.Models.DTOs;
using back.DTOs;

namespace back.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class LimpiezasController : ControllerBase
    {
        private readonly AppDbContext _context;

        public LimpiezasController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<LimpiezaDto>>> GetLimpiezas([FromQuery] DateTime fechaSemana)
        {
            await GenerarLimpiezasPendientes(fechaSemana);

            var inicioSemana = fechaSemana.Date;
            var finSemana = inicioSemana.AddDays(6);

            var limpiezas = await _context.Limpiezas
    .Include(l => l.Cliente)
    .Include(l => l.LimpiezaProductos)
        .ThenInclude(lp => lp.Producto)
    .Where(l =>
        !l.Cancelada &&
        l.Fecha.Date >= inicioSemana &&
        l.Fecha.Date <= finSemana)
    .Select(l => new LimpiezaDto
    {
        Id = l.Id,
        ClienteId = l.ClienteId,
        NombreCliente = l.Cliente.Nombre,
        Fecha = l.Fecha,
        Estado = l.Estado,
        Precio = l.Precio,
        Observaciones = l.Observaciones,
        EsFija = l.EsFija,
        Frecuencia = l.Frecuencia,
        EstadoPago = l.EstadoPago,
        Archivada = l.Archivada,
        SerieId = l.SerieId,
        Cancelada = l.Cancelada,
        Productos = l.LimpiezaProductos.Select(lp => new ProductoDto
        {
            Id = lp.Producto.Id,
            Nombre = lp.Producto.Nombre,
            Precio = lp.Producto.Precio,
            Cantidad = lp.Cantidad
        }).ToList()
    })
    .ToListAsync();

            return Ok(limpiezas);
        }

        [HttpPost("generar-semana")]
        public async Task<IActionResult> GenerarSemana(DateTime fechaSemana)
        {
            await GenerarLimpiezasPendientes(fechaSemana);
            return Ok();
        }

        [HttpPost]
        public async Task<ActionResult> CrearLimpieza(CreateLimpiezaDto dto)
        {
            var limpieza = new Limpieza
            {
                ClienteId = dto.ClienteId,
                Fecha = dto.Fecha,
                Estado = dto.Estado,
                Precio = dto.Precio,
                Observaciones = dto.Observaciones,
                EsFija = dto.EsFija,
                Frecuencia = dto.Frecuencia
            };

            if (limpieza.EsFija)
            {
                var dias = new[]
                {
            "",
            "Lunes",
            "Martes",
            "Miércoles",
            "Jueves",
            "Viernes",
            "Sábado"
        };

                // Buscar planificación activa
                var planificacion = await _context.PlanificacionesClientes
                    .FirstOrDefaultAsync(p =>
                        p.ClienteId == limpieza.ClienteId &&
                        p.DiaSemana == dias[(int)limpieza.Fecha.DayOfWeek] &&
                        p.Frecuencia == limpieza.Frecuencia &&
                        p.Activa);

                // Si no existe, crear una nueva serie
                if (planificacion == null)
                {
                    planificacion = new PlanificacionCliente
                    {
                        ClienteId = limpieza.ClienteId,
                        DiaSemana = dias[(int)limpieza.Fecha.DayOfWeek],
                        Frecuencia = limpieza.Frecuencia,
                        FechaInicio = limpieza.Fecha,
                        Activa = true
                    };

                    _context.PlanificacionesClientes.Add(planificacion);
                    await _context.SaveChangesAsync();

                    // La serie es el Id de la planificación
                    planificacion.SerieId = planificacion.Id;

                    await _context.SaveChangesAsync();
                }

                limpieza.SerieId = planificacion.SerieId;

                // 🔒 Verificar si ya existe una limpieza para esa serie y fecha
                var limpiezaExistente = await _context.Limpiezas
                    .FirstOrDefaultAsync(l =>
                        l.SerieId == limpieza.SerieId &&
                        l.Fecha.Date == limpieza.Fecha.Date);

                if (limpiezaExistente != null)
                {
                    // Si ya existe, devolvemos la existente
                    return Ok(limpiezaExistente);
                }
            }

            _context.Limpiezas.Add(limpieza);
            await _context.SaveChangesAsync();

            Console.WriteLine($"CREANDO LIMPIEZA: {DateTime.Now:HH:mm:ss.fff}");

            return Ok(limpieza);
        }

        [HttpPut("actualizar-cantidad")]
        public async Task<IActionResult> ActualizarCantidad(
    [FromBody] ActualizarCantidadDto dto)
        {
            var limpiezaProducto = await _context.LimpiezaProductos
                .FirstOrDefaultAsync(lp =>
                    lp.LimpiezaId == dto.LimpiezaId &&
                    lp.ProductoId == dto.ProductoId);

            if (limpiezaProducto == null)
            {
                return NotFound("El producto no está asociado a esta limpieza");
            }

            limpiezaProducto.Cantidad = dto.Cantidad;

            await _context.SaveChangesAsync();

            return Ok(limpiezaProducto);
        }


        [HttpPut("{id}")]
        public async Task<IActionResult> ActualizarLimpieza(int id, UpdateLimpiezaDto dto)
        {
            var limpieza = await _context.Limpiezas
                .Include(l => l.LimpiezaProductos)
                .FirstOrDefaultAsync(l => l.Id == id);

            if (limpieza == null)
                return NotFound();

            var estadoAnterior = limpieza.Estado;

            limpieza.Fecha = dto.Fecha;
            limpieza.Estado = dto.Estado;
            limpieza.Precio = dto.Precio;
            limpieza.Observaciones = dto.Observaciones;
            limpieza.EstadoPago = dto.EstadoPago;
            limpieza.Archivada = dto.Archivada;
            limpieza.Frecuencia = dto.Frecuencia;

            _context.LimpiezaProductos.RemoveRange(limpieza.LimpiezaProductos);

            limpieza.LimpiezaProductos = dto.Productos.Select(p => new LimpiezaProducto
            {
                LimpiezaId = limpieza.Id,
                ProductoId = p.Id,
                Cantidad = p.Cantidad
            }).ToList();

            await _context.SaveChangesAsync();

            if (estadoAnterior.ToLower() != "hecho" &&
                dto.Estado.ToLower() == "hecho")
            {
                await CrearProximaLimpiezaSiEsFija(limpieza);
            }

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteIndividual(int id)
        {
            Console.WriteLine($"Eliminando limpieza {id}");
            var limpieza = await _context.Limpiezas.FindAsync(id);

            if (limpieza == null)
                return NotFound();

            limpieza.Cancelada = true;
            await _context.SaveChangesAsync();
            Console.WriteLine("Eliminada");
            return NoContent();
        }

        [HttpDelete("futuras/{serieId}/{fecha}")]
        public async Task<IActionResult> DeleteFuturas(int serieId, DateTime fecha)
        {
            var fechaBase = fecha.Date;

            // Cancela las limpiezas futuras
            var limpiezas = await _context.Limpiezas
                .Where(l =>
                    l.SerieId == serieId &&
                    l.Fecha.Date >= fechaBase)
                .ToListAsync();

            foreach (var l in limpiezas)
            {
                if (l.Estado.ToLower() == "hecho")
                    continue;

                if (l.Archivada)
                    continue;

                l.Cancelada = true;
            }

            // Desactiva la planificación
            var planificacion = await _context.PlanificacionesClientes
                .FirstOrDefaultAsync(p => p.SerieId == serieId);

            if (planificacion != null)
            {
                planificacion.Activa = false;
            }

            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpDelete("serie/{serieId}")]
        public async Task<IActionResult> DeleteSerie(int serieId)
        {
            var limpiezas = await _context.Limpiezas
                .Where(l => l.SerieId == serieId)
                .ToListAsync();

            if (!limpiezas.Any())
                return NotFound();

            foreach (var limpieza in limpiezas)
            {
                // NO cancelar limpiezas hechas
                if (limpieza.Estado.ToLower() == "hecho")
                    continue;

                // NO cancelar limpiezas archivadas
                if (limpieza.Archivada)
                    continue;

                // Cancelar solamente las pendientes
                limpieza.Cancelada = true;
            }

            var planificacion = await _context.PlanificacionesClientes
                .FirstOrDefaultAsync(p => p.SerieId == serieId);

            if (planificacion != null)
            {
                planificacion.Activa = false;
            }

            await _context.SaveChangesAsync();

            return NoContent();
        }

        private async Task CrearProximaLimpiezaSiEsFija(Limpieza limpieza)
        {
            if (!limpieza.EsFija)
                return;

            var diasASumar = limpieza.Frecuencia.ToLower() == "quincenal"
                ? 14
                : 7;

            var proximaFecha = limpieza.Fecha.AddDays(diasASumar);

            // Comprobar si ya existe una limpieza para esa serie y fecha
            var yaExiste = await _context.Limpiezas
                .AnyAsync(l =>
                    l.SerieId == limpieza.SerieId &&
                    l.Fecha.Date == proximaFecha.Date);

            if (yaExiste)
                return;

            var nuevaLimpieza = new Limpieza
            {
                ClienteId = limpieza.ClienteId,
                Fecha = proximaFecha,
                Estado = "pendiente",
                Precio = 0,
                Observaciones = "",
                EsFija = true,
                Frecuencia = limpieza.Frecuencia,
                EstadoPago = "pendiente",
                Archivada = false,
                SerieId = limpieza.SerieId
            };

            _context.Limpiezas.Add(nuevaLimpieza);

            await _context.SaveChangesAsync();
        }
        private async Task GenerarLimpiezasPendientes(DateTime fechaSemana)
        {
            Console.WriteLine("===== GenerarLimpiezasPendientes =====");
            Console.WriteLine($"Fecha semana: {fechaSemana:dd/MM/yyyy}");
            var inicioSemana = fechaSemana.Date;
            var finSemana = inicioSemana.AddDays(6);

            var planificaciones = await _context.PlanificacionesClientes
                .Where(p => p.Activa)
                .ToListAsync();

            foreach (var planificacion in planificaciones)
            {
                Console.WriteLine($"Cliente {planificacion.ClienteId} - Frecuencia: {planificacion.Frecuencia}");
                DateTime fechaLimpieza = inicioSemana;

                while (fechaLimpieza <= finSemana)
                {
                    if (ObtenerNombreDia(fechaLimpieza) == planificacion.DiaSemana)
                        break;

                    fechaLimpieza = fechaLimpieza.AddDays(1);
                }

                if (fechaLimpieza > finSemana)
                    continue;

                if (fechaLimpieza.Date < planificacion.FechaInicio.Date)
                {
                    Console.WriteLine(
                        $"No se genera: {fechaLimpieza:dd/MM/yyyy} es anterior a la fecha de inicio {planificacion.FechaInicio:dd/MM/yyyy}"
                    );

                    continue;
                }

                Console.WriteLine("-------------------------------------");
                Console.WriteLine($"Cliente: {planificacion.ClienteId}");
                Console.WriteLine($"Frecuencia: {planificacion.Frecuencia}");
                Console.WriteLine($"FechaInicio: {planificacion.FechaInicio:dd/MM/yyyy}");
                Console.WriteLine($"FechaLimpieza: {fechaLimpieza:dd/MM/yyyy}");

                var diferenciaDeDias = (fechaLimpieza.Date - planificacion.FechaInicio.Date).Days;
                Console.WriteLine($"DiferenciaDias: {diferenciaDeDias}");

                var semanas = diferenciaDeDias / 7;
                Console.WriteLine($"Semanas: {semanas}");
                Console.WriteLine($"Semanas % 2 = {semanas % 2}");


                if (planificacion.Frecuencia.ToLower() == "quincenal")
                {
                    var diferenciaDias = (fechaLimpieza.Date - planificacion.FechaInicio.Date).Days;

                    if ((diferenciaDias / 7) % 2 != 0)
                        continue;
                }

                var existe = await _context.Limpiezas.AnyAsync(l =>
                    l.SerieId == planificacion.SerieId &&
                    l.Fecha.Date == fechaLimpieza.Date);

                if (existe)
                    continue;
                Console.WriteLine($"Generando limpieza para serie {planificacion.SerieId} - {fechaLimpieza:dd/MM/yyyy}");

                _context.Limpiezas.Add(new Limpieza
                {
                    ClienteId = planificacion.ClienteId,
                    Fecha = fechaLimpieza,
                    Estado = "pendiente",
                    Precio = 0,
                    Observaciones = "",
                    EsFija = true,
                    Frecuencia = planificacion.Frecuencia,
                    EstadoPago = "pendiente",
                    Archivada = false,
                    SerieId = planificacion.SerieId
                });
            }

            await _context.SaveChangesAsync();
        }

        private string ObtenerNombreDia(DateTime fecha)
        {
            return fecha.DayOfWeek switch
            {
                DayOfWeek.Monday => "Lunes",
                DayOfWeek.Tuesday => "Martes",
                DayOfWeek.Wednesday => "Miércoles",
                DayOfWeek.Thursday => "Jueves",
                DayOfWeek.Friday => "Viernes",
                DayOfWeek.Saturday => "Sábado",
                DayOfWeek.Sunday => "Domingo",
                _ => ""
            };
        }

        [HttpGet("registro")]
        public async Task<ActionResult<IEnumerable<LimpiezaDto>>> GetRegistroLimpiezas()
        {
            var limpiezas = await _context.Limpiezas
                .Include(l => l.Cliente)
                .Include(l => l.LimpiezaProductos)
                    .ThenInclude(lp => lp.Producto)
                .Where(l =>
                    !l.Cancelada &&
                    l.Estado.ToLower() == "hecho")
                .OrderByDescending(l => l.Fecha)
                .Select(l => new LimpiezaDto
                {
                    Id = l.Id,
                    ClienteId = l.ClienteId,
                    NombreCliente = l.Cliente.Nombre,
                    Fecha = l.Fecha,
                    Estado = l.Estado,
                    Precio = l.Precio,
                    Observaciones = l.Observaciones,
                    EstadoPago = l.EstadoPago,
                    EsFija = l.EsFija,
                    Frecuencia = l.Frecuencia,
                    SerieId = l.SerieId,
                    Archivada = l.Archivada,
                    Productos = l.LimpiezaProductos.Select(lp => new ProductoDto
                    {
                        Id = lp.Producto.Id,
                        Nombre = lp.Producto.Nombre,
                        Precio = lp.Producto.Precio,
                        Cantidad = lp.Cantidad
                    }).ToList()
                })
                .ToListAsync();

            return Ok(limpiezas);
        }

        [HttpPatch("{id}/estado-pago")]
        public async Task<IActionResult> CambiarEstadoPago(
    int id,
    EstadoPagoDto dto)
        {
            var limpieza = await _context.Limpiezas.FindAsync(id);

            if (limpieza == null)
                return NotFound();

            limpieza.EstadoPago = dto.EstadoPago;

            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpPatch("{id}/archivado")]
        public async Task<IActionResult> CambiarArchivado(
            int id,
            ArchivadoDto dto)
        {
            Console.WriteLine($"ID: {id} - Archivada: {dto.Archivada}");
            var limpieza = await _context.Limpiezas.FindAsync(id);

            if (limpieza == null)
                return NotFound();

            limpieza.Archivada = dto.Archivada;

            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpPost("agregar-producto")]
        public async Task<IActionResult> AgregarProducto(AgregarProductoLimpiezaDto dto)
        {
            var limpieza = await _context.Limpiezas
                .Include(l => l.LimpiezaProductos)
                .FirstOrDefaultAsync(l => l.Id == dto.LimpiezaId);

            if (limpieza == null)
                return NotFound("Limpieza no encontrada.");

            var producto = await _context.Productos
                .FindAsync(dto.ProductoId);

            if (producto == null)
                return NotFound("Producto no encontrado.");

            var existente = limpieza.LimpiezaProductos
                .FirstOrDefault(lp => lp.ProductoId == dto.ProductoId);

            if (existente != null)
                return BadRequest("El producto ya fue agregado a la limpieza.");

            limpieza.LimpiezaProductos.Add(new LimpiezaProducto
            {
                LimpiezaId = dto.LimpiezaId,
                ProductoId = dto.ProductoId,
                Cantidad = dto.Cantidad

            });

            await _context.SaveChangesAsync();

            return Ok();
        }

        [HttpDelete("quitar-producto")]
        public async Task<IActionResult> QuitarProducto([FromBody] AgregarProductoLimpiezaDto dto)
        {
            var limpiezaProducto = await _context.LimpiezaProductos
                .FirstOrDefaultAsync(lp =>
                    lp.LimpiezaId == dto.LimpiezaId &&
                    lp.ProductoId == dto.ProductoId);

            if (limpiezaProducto == null)
                return NotFound("El producto no está asociado a la limpieza.");

            _context.LimpiezaProductos.Remove(limpiezaProducto);

            await _context.SaveChangesAsync();

            return Ok();
        }

        [HttpGet("planificaciones")]
        public async Task<ActionResult<IEnumerable<PlanificacionDto>>> GetPlanificaciones()
        {
            var planificaciones = await _context.PlanificacionesClientes
                .Where(p => p.Activa)
                .Include(p => p.Cliente)
                .OrderBy(p => p.DiaSemana)
                .Select(p => new PlanificacionDto
                {
                    Cliente = p.Cliente.Nombre,
                    DiaSemana = p.DiaSemana,
                    Frecuencia = p.Frecuencia
                })
                .ToListAsync();

            return Ok(planificaciones);
        }
    }
}