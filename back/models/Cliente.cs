using back.Models;

namespace Backend.Models
{
    public class Cliente
    {
        public int Id { get; set; }
        public string Nombre { get; set; } = string.Empty;
        public string Direccion { get; set; } = string.Empty;
        public string Telefono { get; set; } = string.Empty;
        public string Lote { get; set; } = "";
        public string Manzana { get; set; } = "";
        public string Barrio { get; set; } = "";
        public List<Limpieza> Limpiezas { get; set; } = new();
        public ICollection<PlanificacionCliente> Planificaciones { get; set; }
       = new List<PlanificacionCliente>();
    }
}