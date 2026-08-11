namespace back.Models.DTOs
{
    public class CreateLimpiezaDto
    {
        public int ClienteId { get; set; }
        public DateTime Fecha { get; set; }
        public string Estado { get; set; } = "Pendiente";
        public decimal Precio { get; set; }
        public string? Observaciones { get; set; }
        public bool EsFija { get; set; }
        public string Frecuencia { get; set; } = "";
        
    }
}