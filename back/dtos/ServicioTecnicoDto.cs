namespace Backend.DTOs
{
    public class ServicioTecnicoDto
    {
        public DateTime Fecha { get; set; }
        public string Titulo { get; set; } = "";
        public string Nombre { get; set; } = "";
        public string Telefono { get; set; } = "";

        public string Direccion { get; set; } = "";
        public string Barrio { get; set; } = "";
        public string Lote { get; set; } = "";
        public string Manzana { get; set; } = "";

        public string Diagnostico { get; set; } = "";
        public string TrabajoRealizado { get; set; } = "";
        public string Observaciones { get; set; } = "";

        public string Estado { get; set; } = "pendiente";
        public decimal Precio { get; set; } = 0;
        public string EstadoPago { get; set; } = "pendiente";

        public bool IncluirBomba { get; set; } = false;

        public string? Hp { get; set; }
        public string? Marca { get; set; }
        public string? Realizar { get; set; }
        
    }
}