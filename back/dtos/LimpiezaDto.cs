using back.DTOs;

public class LimpiezaDto
{ 
    public int Id { get; set; }
    public int ClienteId { get; set; }
    public string NombreCliente { get; set; } = "";
    public DateTime Fecha { get; set; }
    public string Estado { get; set; } = "";
    public decimal Precio { get; set; }
    public string? Observaciones { get; set; }
    public bool EsFija { get; set; }
    public string Frecuencia { get; set; } = "";
    public string EstadoPago { get; set; } = "";
    public bool Archivada { get; set; }
    public int? SerieId { get; set; }
    public bool Cancelada { get; set; }
    public List<ProductoDto> Productos { get; set; } = new();
}