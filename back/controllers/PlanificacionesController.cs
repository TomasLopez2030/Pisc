using Backend.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

[ApiController]
[Route("api/[controller]")]
public class PlanificacionesController : ControllerBase
{
    private readonly AppDbContext _context;

    public PlanificacionesController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> Get()
    {
        
        var planificaciones = await _context.PlanificacionesClientes
            .Include(p => p.Cliente)
            .Select(p => new PlanificacionClienteDto
            {
                Id = p.Id,
                ClienteId = p.ClienteId,
                NombreCliente = p.Cliente.Nombre,
                DiaSemana = p.DiaSemana,
                FechaInicio = p.FechaInicio,
                Frecuencia = p.Frecuencia,
                SerieId = p.SerieId
            })
    .ToListAsync();
    Console.WriteLine($"Planificaciones encontradas: {planificaciones.Count}");

        return Ok(planificaciones);
    }
}