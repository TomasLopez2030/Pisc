public class UpdateLimpiezaDto
{
    public string Estado { get; set; } = string.Empty;
    public decimal Precio { get; set; }
    public string Observaciones { get; set; } = string.Empty;
    public DateTime Fecha { get; set; }
    public string EstadoPago { get; set; } = "";
    public bool Archivada { get; set; }
    public string Frecuencia { get; set; } = "";

    public List<UpdateLimpiezaProductoDto> Productos { get; set; } = new();
}