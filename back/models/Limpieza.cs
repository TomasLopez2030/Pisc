using System.ComponentModel.DataAnnotations.Schema;
using Backend.Models;

namespace back.Models
{
    public class Limpieza
    {
        public int Id { get; set; }

        public int ClienteId { get; set; }


        [ForeignKey("ClienteId")]
        public Cliente Cliente { get; set; }

        [Column(TypeName = "timestamp without time zone")]
        public DateTime Fecha { get; set; }

        public bool Reprogramada { get; set; } = false;

        [Column(TypeName = "timestamp without time zone")]
        public DateTime? FechaOriginal { get; set; }

        public string Estado { get; set; } = "Pendiente";

        public decimal Precio { get; set; }

        public string? Observaciones { get; set; }

        public bool EsFija { get; set; }

        public bool SoloProductos { get; set; } = false;

        public string Frecuencia { get; set; } = "";

        public string EstadoPago { get; set; } = "pendiente";

        public bool Archivada { get; set; } = false;

        public int? SerieId { get; set; }

        public bool Cancelada { get; set; } = false;

        public ICollection<LimpiezaProducto> LimpiezaProductos { get; set; }

    }
}