using back.DTOs;
using back.Models;

namespace Backend.Models
{
    public class ServicioTecnico
    {
        public int Id { get; set; }

        public DateTime Fecha { get; set; }
        public string Titulo { get; set; } = "";
        public string Nombre { get; set; } = "";
        public string Telefono { get; set; } = "";
        public string Direccion { get; set; } = "";
        public string Barrio { get; set; } = "";
        public string Lote { get; set; } = "";
        public string Manzana { get; set; } = "";
        public string DiagnosticoGeneral { get; set; } = "";
        public string Diagnostico { get; set; } = "";
        public string TrabajoRealizado { get; set; } = "";
        public string Observaciones { get; set; } = "";
        public string Estado { get; set; } = "pendiente";
        public decimal Precio { get; set; } = 0;
        public string EstadoPago { get; set; } = "pendiente";
        public bool Archivada { get; set; } = false;
        public ICollection<FotoServicio> Fotos { get; set; } = new List<FotoServicio>();

        
    }
}