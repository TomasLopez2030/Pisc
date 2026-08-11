using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Backend.Data;
using Backend.Models;
using back.Models;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class BombasController : ControllerBase
    {
        private readonly AppDbContext _context;

        public BombasController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Bomba>>> GetBombas()
        {
            return await _context.Bombas.OrderByDescending(s => s.Id).Include(b => b.Fotos).ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Bomba>> GetBomba(int id)
        {
            var bomba = await _context.Bombas
    .Include(b => b.Fotos)
    .FirstOrDefaultAsync(b => b.Id == id);

            if (bomba == null)
                return NotFound();

            return bomba;
        }

        [HttpPost]
        public async Task<ActionResult<Bomba>> CrearBomba(Bomba bomba)
        {
            bomba.Fecha = DateTime.SpecifyKind(
       bomba.Fecha,
       DateTimeKind.Utc
   );
            _context.Bombas.Add(bomba);
            await _context.SaveChangesAsync();

            return CreatedAtAction(
                nameof(GetBomba),
                new { id = bomba.Id },
                bomba
            );
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> ActualizarBomba(
    int id,
    Bomba dto
)
        {
            var bomba = await _context.Bombas.FindAsync(id);

            if (bomba == null)
                return NotFound();

            bomba.Fecha = dto.Fecha;
            bomba.Nombre = dto.Nombre;
            bomba.Telefono = dto.Telefono;
            bomba.Direccion = dto.Direccion;
            bomba.Barrio = dto.Barrio;
            bomba.Lote = dto.Lote;
            bomba.Manzana = dto.Manzana;

            bomba.Hp = dto.Hp;
            bomba.Marca = dto.Marca;

            bomba.Diagnostico = dto.Diagnostico;
            bomba.Realizar = dto.Realizar;

            bomba.Estado = dto.Estado;
            bomba.Precio = dto.Precio;
            bomba.EstadoPago = dto.EstadoPago;

            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> EliminarBomba(int id)
        {
            var bomba = await _context.Bombas.FindAsync(id);

            if (bomba == null)
                return NotFound();

            _context.Bombas.Remove(bomba);

            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpDelete("cliente/{nombre}")]
        public async Task<IActionResult> EliminarCliente(string nombre)
        {
            var bombas = await _context.Bombas
                .Where(b => b.Nombre == nombre)
                .ToListAsync();


            if (!bombas.Any())
            {
                return NotFound();
            }


            _context.Bombas.RemoveRange(bombas);


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
                "Bombas",
                id.ToString());

            if (!Directory.Exists(carpeta))
                Directory.CreateDirectory(carpeta);

            var nombreArchivo = Guid.NewGuid() + Path.GetExtension(archivo.FileName);

            var rutaCompleta = Path.Combine(carpeta, nombreArchivo);

            using (var stream = new FileStream(rutaCompleta, FileMode.Create))
            {
                await archivo.CopyToAsync(stream);
            }

            var nuevaFoto = new FotoBomba
            {
                BombaId = id,
                NombreArchivo = nombreArchivo
            };

            _context.FotosBombas.Add(nuevaFoto);

            await _context.SaveChangesAsync();

            return Ok(new
            {
                Id = nuevaFoto.Id,
                Mensaje = "Foto subida correctamente",
                Archivo = nombreArchivo
            });
        }

        [HttpDelete("foto/{idFoto}")]
        public async Task<IActionResult> EliminarFoto(int idFoto)
        {
            var foto = await _context.FotosBombas.FindAsync(idFoto);

            if (foto == null)
                return NotFound();

            var rutaArchivo = Path.Combine(
                Directory.GetCurrentDirectory(),
                "Uploads",
                "Bombas",
                foto.BombaId.ToString(),
                foto.NombreArchivo);

            if (System.IO.File.Exists(rutaArchivo))
            {
                System.IO.File.Delete(rutaArchivo);
            }

            _context.FotosBombas.Remove(foto);

            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpPatch("{id}/archivado")]
        public async Task<IActionResult> CambiarArchivado(int id, [FromBody] ArchivadoDto dto)
        {
            var bomba = await _context.Bombas.FindAsync(id);

            if (bomba == null)
                return NotFound();

            bomba.Archivada = dto.Archivada;

            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpPatch("{id}/estado-pago")]
        public async Task<IActionResult> CambiarEstadoPago(
    int id,
    EstadoPagoDto dto)
        {
            var bomba = await _context.Bombas.FindAsync(id);

            if (bomba == null)
                return NotFound();

            bomba.EstadoPago = dto.EstadoPago;

            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}