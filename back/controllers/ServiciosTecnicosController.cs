using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Backend.Data;
using Backend.Models;
using Backend.DTOs;
using Microsoft.AspNetCore.Http;
using System.IO;
using back.Models;
using System.ComponentModel.DataAnnotations.Schema;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ServiciosTecnicosController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ServiciosTecnicosController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<ServicioTecnico>>> GetServicios()
        {
            return await _context.ServiciosTecnicos
                .OrderByDescending(s => s.Id)
                .Include(s => s.Fotos)
                .ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ServicioTecnico>> GetServicio(int id)
        {
            var servicio = await _context.ServiciosTecnicos
                .Include(s => s.Fotos)
                .FirstOrDefaultAsync(s => s.Id == id);

            if (servicio == null)
                return NotFound();

            return servicio;
        }

        [HttpPatch("{id}/estado-pago")]
        public async Task<IActionResult> CambiarEstadoPago(
    int id,
    EstadoPagoDto dto)
        {
            var servicio = await _context.ServiciosTecnicos.FindAsync(id);

            if (servicio == null)
                return NotFound();

            servicio.EstadoPago = dto.EstadoPago;

            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpPatch("{id}/archivado")]
        public async Task<IActionResult> CambiarArchivado(
            int id,
            ArchivadoDto dto)
        {
            var servicio = await _context.ServiciosTecnicos.FindAsync(id);

            if (servicio == null)
                return NotFound();

            servicio.Archivada = dto.Archivada;

            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpPost]
        public async Task<IActionResult> CrearServicio(
    [FromBody] ServicioTecnicoDto dto
)
        {
            var servicio = new ServicioTecnico
            {
                Fecha = DateTime.SpecifyKind(dto.Fecha, DateTimeKind.Utc),
                Titulo = dto.Titulo,
                Nombre = dto.Nombre,
                Telefono = dto.Telefono,
                Direccion = dto.Direccion,
                Barrio = dto.Barrio,
                Lote = dto.Lote,
                Manzana = dto.Manzana,
                Diagnostico = dto.Diagnostico,
                TrabajoRealizado = dto.TrabajoRealizado,
                Observaciones = dto.Observaciones,
                Estado = dto.Estado,
                Precio = dto.Precio,
                EstadoPago = dto.EstadoPago
            };

            _context.ServiciosTecnicos.Add(servicio);
            await _context.SaveChangesAsync();

            return Ok();
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> ActualizarServicio(
    int id,
    ServicioTecnico dto
)
        {
            var servicio = await _context.ServiciosTecnicos
                .FindAsync(id);

            if (servicio == null)
                return NotFound();

            servicio.Fecha = dto.Fecha;

            servicio.Titulo = dto.Titulo;

            servicio.Nombre = dto.Nombre;
            servicio.Telefono = dto.Telefono;

            servicio.Direccion = dto.Direccion;
            servicio.Barrio = dto.Barrio;
            servicio.Lote = dto.Lote;
            servicio.Manzana = dto.Manzana;

            servicio.DiagnosticoGeneral = dto.DiagnosticoGeneral;

            servicio.Diagnostico = dto.Diagnostico;

            servicio.TrabajoRealizado = dto.TrabajoRealizado;

            servicio.Observaciones = dto.Observaciones;

            servicio.Estado = dto.Estado;

            servicio.Precio = dto.Precio;

            servicio.EstadoPago = dto.EstadoPago;

            servicio.Archivada = dto.Archivada;

            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> EliminarServicioTecnico(int id)
        {
            var servicio = await _context.ServiciosTecnicos
                .FirstOrDefaultAsync(s => s.Id == id);

            if (servicio == null)
                return NotFound();

            _context.ServiciosTecnicos.Remove(servicio);

            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpDelete("cliente/{nombre}")]
        public async Task<IActionResult> EliminarCliente(string nombre)
        {
            var servicios = await _context.ServiciosTecnicos
                .Where(s => s.Nombre == nombre)
                .ToListAsync();

            if (!servicios.Any())
                return NotFound();

            _context.ServiciosTecnicos.RemoveRange(servicios);

            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpPost("{id}/foto")]
        public async Task<IActionResult> SubirFoto(int id, [FromForm] IFormFile archivo)
        {
            if (archivo == null || archivo.Length == 0)
                return BadRequest("No se recibió ningún archivo.");

            var carpeta = Path.Combine(
                Directory.GetCurrentDirectory(),
                "Uploads",
                "Servicios",
                id.ToString());

            if (!Directory.Exists(carpeta))
                Directory.CreateDirectory(carpeta);

            var nombreArchivo = Guid.NewGuid() + Path.GetExtension(archivo.FileName);

            var rutaCompleta = Path.Combine(carpeta, nombreArchivo);

Console.WriteLine("CARPETA UPLOADS: " + carpeta);
Console.WriteLine("RUTA COMPLETA: " + rutaCompleta);
            using (var stream = new FileStream(rutaCompleta, FileMode.Create))
            {
                await archivo.CopyToAsync(stream);
            }
            Console.WriteLine("¿EXISTE EL ARCHIVO?: " + System.IO.File.Exists(rutaCompleta));

            try
            {
                var nuevaFoto = new FotoServicio
                {
                    ServicioTecnicoId = id,
                    NombreArchivo = nombreArchivo
                };

                _context.FotosServicios.Add(nuevaFoto);

                Console.WriteLine(
                    $"Registros a guardar: {_context.ChangeTracker.Entries().Count()}"
                );

                await _context.SaveChangesAsync();

                Console.WriteLine($"Foto guardada correctamente. ID: {nuevaFoto.Id}");

                return Ok(new
                {
                    Id = nuevaFoto.Id,
                    Mensaje = "Foto subida correctamente",
                    Archivo = nombreArchivo
                });
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.ToString());
                throw;
            }
        }
        [HttpDelete("foto/{idFoto}")]
        public async Task<IActionResult> EliminarFoto(int idFoto)
        {
            var foto = await _context.FotosServicios.FindAsync(idFoto);

            if (foto == null)
                return NotFound();

            var rutaArchivo = Path.Combine(
                Directory.GetCurrentDirectory(),
                "Uploads",
                "Servicios",
                foto.ServicioTecnicoId.ToString(),
                foto.NombreArchivo);

            if (System.IO.File.Exists(rutaArchivo))
            {
                System.IO.File.Delete(rutaArchivo);
            }

            _context.FotosServicios.Remove(foto);

            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}