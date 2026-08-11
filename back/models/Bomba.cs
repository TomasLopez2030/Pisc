using back.Models;
namespace Backend.Models

{
    public class Bomba
    {
        public int Id { get; set; }

        public DateTime Fecha { get; set; }

        public string Nombre { get; set; } = "";
        public string Telefono { get; set; } = "";
        public string Direccion { get; set; } = "";
        public string Barrio { get; set; } = "";
        public string Lote { get; set; } = "";
        public string Manzana { get; set; } = "";
        public string Hp { get; set; } = "";
        public string Marca { get; set; } = "";
        public string Diagnostico { get; set; } = "";
        public string Realizar { get; set; } = "";
        public string Estado { get; set; } = "pendiente";
        public decimal Precio { get; set; } = 0;
        public string EstadoPago { get; set; } = "pendiente";
        public bool Archivada { get; set; } = false;
        public ICollection<FotoBomba> Fotos { get; set; } = new List<FotoBomba>();
    }
}