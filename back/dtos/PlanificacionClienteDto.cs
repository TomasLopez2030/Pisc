public class PlanificacionClienteDto
{
    public int Id { get; set; }
    public int ClienteId { get; set; }
    public string NombreCliente { get; set; } = "";
    public string DiaSemana { get; set; } = "";
    public int? SerieId { get; set; }
    public DateTime FechaInicio { get; set; }
    public string Frecuencia { get; set; } = "";
}