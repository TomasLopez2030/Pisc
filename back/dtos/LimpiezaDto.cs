using back.DTOs;

public class LimpiezaDto
{
    public int Id { get; set; }
    public int ClienteId { get; set; }
    public string? Barrio { get; set; }
    public string? Lote { get; set; }
    public string? Manzana { get; set; }
    public string? Direccion { get; set; }
    public string? Telefono { get; set; }
    public string NombreCliente { get; set; } = "";
    public DateTime Fecha { get; set; }
    public bool Reprogramada { get; set; }
    public DateTime? FechaOriginal { get; set; }
    public string Estado { get; set; } = "";
    public decimal Precio { get; set; }
    public string? Observaciones { get; set; }
    public bool EsFija { get; set; }
    public bool SoloProductos { get; set; }
    public string Frecuencia { get; set; } = "";
    public string EstadoPago { get; set; } = "";
    public bool Archivada { get; set; }
    public int? SerieId { get; set; }
    public bool Cancelada { get; set; }
    public List<ProductoDto> Productos { get; set; } = new();
}